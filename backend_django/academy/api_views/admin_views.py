"""
Deutsche Welt — Admin API Views
================================
Production admin endpoints for managing:
- Course levels (CRUD)
- Level access (grant/revoke/list)
- Bunny video cache refresh
- Books (CRUD + access)
- Users management
- Course/Book enrollment requests
"""

import datetime
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.cache import cache

import requests as http_requests

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import BasePermission, IsAuthenticated

from academy.models import (
    CourseLevel,
    LevelAccess,
    DigitalBook,
    BookAccess,
    LevelEnrollmentRequest,
    BookOrder,
)

User = get_user_model()


def _to_bool(value, default=True):
    """multipart/form-data sends booleans as strings ("false" would otherwise be truthy)."""
    if value is None or value == '':
        return default
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in ('1', 'true', 'yes', 'on')


ADMIN_GROUP = 'Admin'


def _is_admin(user):
    """Staff, superuser, or a member of the "Admin" group (roles are managed with groups)."""
    if not (user and user.is_authenticated):
        return False
    return bool(user.is_staff or user.is_superuser or user.groups.filter(name=ADMIN_GROUP).exists())


class IsStaffUser(BasePermission):
    """Admins only (staff / superuser / "Admin" group). Runs after DRF authentication, so JWT users are recognised."""
    message = 'هذا الإجراء يتطلب صلاحيات المسؤول.'

    def has_permission(self, request, view):
        return _is_admin(request.user)


class AdminRequiredMixin:
    """Every admin endpoint: authenticated AND staff, else 401/403 (checked for every HTTP method)."""
    permission_classes = [IsAuthenticated, IsStaffUser]


# ---------------------------------------------------------------------------
# Admin: Course Levels
# ---------------------------------------------------------------------------

class AdminCourseLevelsAPIView(AdminRequiredMixin, APIView):
    def get(self, request):
        levels = CourseLevel.objects.all().order_by('order')
        data = []
        for lvl in levels:
            access_count = LevelAccess.objects.filter(level=lvl, is_active=True).count()
            data.append({
                'id': lvl.id,
                'name': lvl.name,
                'title': lvl.title,
                'description': lvl.description,
                'price': str(lvl.price),
                'old_price': str(lvl.old_price) if lvl.old_price else None,
                'bunny_collection_id': lvl.bunny_collection_id,
                'order': lvl.order,
                'is_active': lvl.is_active,
                'access_count': access_count,
            })
        return Response(data)


# ---------------------------------------------------------------------------
# Admin: Grant Level Access
# ---------------------------------------------------------------------------

class AdminGrantLevelAccessAPIView(AdminRequiredMixin, APIView):
    def post(self, request, level_id):
        user_id = request.data.get('user_id')
        notes = request.data.get('notes', '')

        if not user_id:
            return Response({'detail': 'user_id مطلوب.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            level = CourseLevel.objects.get(pk=level_id)
        except CourseLevel.DoesNotExist:
            return Response({'detail': 'المستوى غير موجود.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            target_user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'detail': 'المستخدم غير موجود.'}, status=status.HTTP_404_NOT_FOUND)

        access, created = LevelAccess.objects.get_or_create(
            user=target_user,
            level=level,
            defaults={
                'granted_by': request.user,
                'notes': notes,
                'is_active': True,
            },
        )
        if not created:
            access.is_active = True
            access.notes = notes
            access.granted_by = request.user
            access.save(update_fields=['is_active', 'notes', 'granted_by'])

        return Response({
            'detail': f'تم منح الوصول لـ {target_user.email} في مستوى {level.name}.',
            'access': {
                'id': access.id,
                'user': target_user.id,
                'user_email': target_user.email,
                'user_first_name': target_user.first_name,
                'user_last_name': target_user.last_name,
                'level': level.id,
                'level_name': level.name,
                'granted_at': access.granted_at.isoformat(),
                'granted_by_email': request.user.email,
                'is_active': access.is_active,
                'notes': access.notes,
            },
        }, status=status.HTTP_201_CREATED)


# ---------------------------------------------------------------------------
# Admin: Revoke Level Access
# ---------------------------------------------------------------------------

class AdminRevokeLevelAccessAPIView(AdminRequiredMixin, APIView):
    def post(self, request, level_id):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'detail': 'user_id مطلوب.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            level = CourseLevel.objects.get(pk=level_id)
            target_user = User.objects.get(pk=user_id)
        except (CourseLevel.DoesNotExist, User.DoesNotExist):
            return Response({'detail': 'المستوى أو المستخدم غير موجود.'}, status=status.HTTP_404_NOT_FOUND)

        updated = LevelAccess.objects.filter(user=target_user, level=level).update(is_active=False)
        if updated == 0:
            return Response({'detail': 'هذا المستخدم لا يملك صلاحية لهذا المستوى أصلاً.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            'detail': f'تم إلغاء الوصول لـ {target_user.email} من مستوى {level.name}.'
        })


# ---------------------------------------------------------------------------
# Admin: List Users with Access to a Level
# ---------------------------------------------------------------------------

class AdminLevelUsersAPIView(AdminRequiredMixin, APIView):
    def get(self, request, level_id):
        try:
            level = CourseLevel.objects.get(pk=level_id)
        except CourseLevel.DoesNotExist:
            return Response({'detail': 'المستوى غير موجود.'}, status=status.HTTP_404_NOT_FOUND)

        accesses = LevelAccess.objects.filter(level=level).select_related('user', 'granted_by').order_by('-granted_at')
        data = []
        for a in accesses:
            data.append({
                'id': a.id,
                'user': a.user.id,
                'user_email': a.user.email,
                'user_first_name': a.user.first_name,
                'user_last_name': a.user.last_name,
                'level': level.id,
                'level_name': level.name,
                'granted_at': a.granted_at.isoformat(),
                'granted_by_email': a.granted_by.email if a.granted_by else None,
                'is_active': a.is_active,
                'notes': a.notes,
            })
        return Response(data)


# ---------------------------------------------------------------------------
# Admin: Refresh Bunny Video Cache
# ---------------------------------------------------------------------------

class AdminRefreshVideoCacheAPIView(AdminRequiredMixin, APIView):
    def post(self, request, level_id):
        try:
            level = CourseLevel.objects.get(pk=level_id)
        except CourseLevel.DoesNotExist:
            return Response({'detail': 'المستوى غير موجود.'}, status=status.HTTP_404_NOT_FOUND)

        # Clear cache for this collection
        if level.bunny_collection_id:
            cache_key = f"bunny_collection_{level.bunny_collection_id}"
            cache.delete(cache_key)

        return Response({'detail': f'تم تحديث الكاش للمستوى {level.name}.'})


# ---------------------------------------------------------------------------
# Admin: Books
# ---------------------------------------------------------------------------

class AdminBooksAPIView(AdminRequiredMixin, APIView):
    def get(self, request):
        books = DigitalBook.objects.all().order_by('level', 'name')
        # No file URLs — even for admins. Files are only served by the access-checked /view/ endpoint.
        data = [{
            'id': b.id,
            'name': b.name,
            'level': b.level,
            'price': str(b.price),
            'is_active': b.is_active,
            'has_file': bool(b.file),
            'file_name': b.file.name.rsplit('/', 1)[-1] if b.file else None,
            'created_at': b.created_at.isoformat(),
        } for b in books]
        return Response(data)

    def post(self, request):
        name = request.data.get('name', '').strip()
        level = request.data.get('level', '').strip()
        price = request.data.get('price', '0')
        is_active = _to_bool(request.data.get('is_active'), default=True)
        file_obj = request.FILES.get('file')

        if not name or not level or not file_obj:
            return Response({'detail': 'name و level و file مطلوبة.'}, status=status.HTTP_400_BAD_REQUEST)

        book = DigitalBook.objects.create(
            name=name,
            level=level,
            price=price,
            is_active=is_active,
            file=file_obj,
        )
        return Response({
            'detail': 'تم إنشاء الكتاب بنجاح.',
            'id': book.id,
            'name': book.name,
            'level': book.level,
            'price': str(book.price),
        }, status=status.HTTP_201_CREATED)


class AdminBookDetailAPIView(AdminRequiredMixin, APIView):
    def patch(self, request, book_id):
        try:
            book = DigitalBook.objects.get(pk=book_id)
        except DigitalBook.DoesNotExist:
            return Response({'detail': 'الكتاب غير موجود.'}, status=status.HTTP_404_NOT_FOUND)

        update_fields = []
        if 'name' in request.data:
            book.name = request.data['name']
            update_fields.append('name')
        if 'level' in request.data:
            book.level = request.data['level']
            update_fields.append('level')
        if 'price' in request.data:
            book.price = request.data['price']
            update_fields.append('price')
        if 'is_active' in request.data:
            book.is_active = _to_bool(request.data['is_active'])
            update_fields.append('is_active')
        if 'file' in request.FILES:
            book.file = request.FILES['file']
            update_fields.append('file')

        if update_fields:
            book.save(update_fields=update_fields)

        return Response({'detail': 'تم تحديث الكتاب بنجاح.'})

    def delete(self, request, book_id):
        try:
            book = DigitalBook.objects.get(pk=book_id)
        except DigitalBook.DoesNotExist:
            return Response({'detail': 'الكتاب غير موجود.'}, status=status.HTTP_404_NOT_FOUND)
        book.delete()
        return Response({'detail': 'تم حذف الكتاب.'}, status=status.HTTP_200_OK)


class AdminBookUsersAPIView(AdminRequiredMixin, APIView):
    def get(self, request, book_id):
        try:
            book = DigitalBook.objects.get(pk=book_id)
        except DigitalBook.DoesNotExist:
            return Response({'detail': 'الكتاب غير موجود.'}, status=status.HTTP_404_NOT_FOUND)

        accesses = BookAccess.objects.filter(book=book).select_related('user')
        data = [{
            'id': a.id,
            'user': a.user.id,
            'user_id': a.user.id,
            'user_email': a.user.email,
            'user_first_name': a.user.first_name,
            'user_last_name': a.user.last_name,
            'user_name': f"{a.user.first_name} {a.user.last_name}".strip(),
            'granted_at': a.granted_at.isoformat(),
            'is_active': a.is_active,
        } for a in accesses]
        return Response(data)


class AdminGrantBookAccessAPIView(AdminRequiredMixin, APIView):
    def post(self, request, book_id):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'detail': 'user_id مطلوب.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            book = DigitalBook.objects.get(pk=book_id)
            target_user = User.objects.get(pk=user_id)
        except (DigitalBook.DoesNotExist, User.DoesNotExist):
            return Response({'detail': 'الكتاب أو المستخدم غير موجود.'}, status=status.HTTP_404_NOT_FOUND)

        access, _ = BookAccess.objects.get_or_create(
            user=target_user,
            book=book,
            defaults={'granted_by': request.user, 'is_active': True},
        )
        access.is_active = True
        access.save(update_fields=['is_active'])

        return Response({'detail': f'تم منح صلاحية الكتاب لـ {target_user.email}.'}, status=status.HTTP_201_CREATED)


class AdminRevokeBookAccessAPIView(AdminRequiredMixin, APIView):
    def post(self, request, book_id):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'detail': 'user_id مطلوب.'}, status=status.HTTP_400_BAD_REQUEST)

        updated = BookAccess.objects.filter(user_id=user_id, book_id=book_id).update(is_active=False)
        if updated == 0:
            return Response({'detail': 'لا توجد صلاحية لهذا المستخدم على هذا الكتاب.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'detail': 'تم إلغاء الصلاحية بنجاح.'})


# ---------------------------------------------------------------------------
# Admin: User Management
# ---------------------------------------------------------------------------

class AdminUserManageAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not _is_admin(request.user):
            return Response({'detail': 'غير مصرح.'}, status=status.HTTP_403_FORBIDDEN)

        search = request.query_params.get('search', '').strip()
        users_qs = User.objects.all().order_by('-date_joined')
        if search:
            users_qs = users_qs.filter(
                email__icontains=search
            ) | users_qs.filter(
                first_name__icontains=search
            ) | users_qs.filter(
                last_name__icontains=search
            )
        users_qs = users_qs[:100]  # Limit to 100 results

        data = [{
            'id': u.id,
            'email': u.email or u.username,
            'first_name': u.first_name,
            'last_name': u.last_name,
            'is_active': u.is_active,
            'is_staff': u.is_staff or u.is_superuser,
            'date_joined': u.date_joined.isoformat() if u.date_joined else None,
            'phone_number': getattr(u, 'phone_number', None),
            'profile_photo': None,
        } for u in users_qs]

        return Response({'count': len(data), 'results': data})


# ---------------------------------------------------------------------------
# Admin: Course & Book Enrollment Requests
# ---------------------------------------------------------------------------

class AdminCourseRequestsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not _is_admin(request.user):
            return Response({'detail': 'غير مصرح.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            qs = LevelEnrollmentRequest.objects.all().order_by('-created_at')
            data = [{
                'id': req.id,
                'student_name': req.student_name,
                'phone': req.phone,
                'level': req.level,
                'status': req.status,
                'amount': req.amount,
                'payment_method': req.payment_method,
                'created_at': req.created_at.isoformat() if req.created_at else None,
            } for req in qs]
            return Response({'count': len(data), 'results': data})
        except Exception:
            return Response({'count': 0, 'results': []})


class AdminBookRequestsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not _is_admin(request.user):
            return Response({'detail': 'غير مصرح.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            qs = BookOrder.objects.all().order_by('-created_at')
            data = [{
                'id': order.id,
                'order_code': order.order_code,
                'buyer_name': order.buyer_name,
                'phone': order.phone,
                'address': order.address,
                'book_name': str(order.book) if order.book else order.book_name_cache,
                'quantity': order.quantity,
                'status': order.status,
                'total_price': str(order.total_price),
                'created_at': order.created_at.isoformat() if order.created_at else None,
            } for order in qs]
            return Response({'count': len(data), 'results': data})
        except Exception:
            return Response({'count': 0, 'results': []})
