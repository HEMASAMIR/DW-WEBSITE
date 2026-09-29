"""
Deutsche Welt — Admin Dashboard API
===================================
Everything the admin dashboard on the website needs, under /api/admin/:

- overview/                         KPIs, pending counts per level, recent activity
- requests/                         course & book access requests (filter by kind / status / level)
- requests/<id>/approve|reject/     approving grants the level / book immediately
- users/, users/<id>/               students & admins (list, create, edit, delete)
- users/<id>/access/                grant / revoke a level or a book directly
- levels/, levels/<id>/             course levels CRUD
- levels/<id>/content/              videos + files of a level
- videos/<id>/, files/<id>/         edit / delete one video or file
- branches/, branches/<id>/         branches CRUD

Privacy: every endpoint here is admin-only. Lists never include full e-mail addresses
(only the user detail does), and nothing here is reachable by students.
"""

from datetime import timedelta

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db import transaction
from django.db.models import Count, Max, Q, Sum
from django.utils import timezone

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from academy.models import (
    AccessRequest, BookAccess, Branch, CourseFile, CourseLevel, DigitalBook, LevelAccess, Video,
)
from academy.storage import protected_file_response
from .admin_views import ADMIN_GROUP, AdminRequiredMixin, _is_admin, _to_bool

User = get_user_model()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _display_name(user):
    return f"{user.first_name} {user.last_name}".strip() or (user.email or user.username).split('@')[0]


def _mask_email(email):
    """ah***@gmail.com — enough for the admin to recognise an account without exposing it in lists."""
    if not email or '@' not in email:
        return ''
    local, domain = email.split('@', 1)
    return f"{local[:2]}***@{domain}"


def _decimal_or_none(value):
    if value in (None, '', 'null'):
        return None
    return value


def _not_found(what):
    return Response({'detail': f'{what} غير موجود.'}, status=status.HTTP_404_NOT_FOUND)


def serialize_request(req):
    return {
        'id': req.id,
        'kind': req.kind,
        'item_id': req.level_id if req.kind == AccessRequest.KIND_LEVEL else req.book_id,
        'item_name': req.item_name,
        'level_code': req.level_code,
        'full_name': req.full_name,
        'phone': req.phone,
        'payment_method': req.payment_method,
        'amount': str(req.amount),
        'note': req.note,
        'has_receipt': bool(req.receipt),
        'status': req.status,
        'admin_note': req.admin_note,
        'created_at': req.created_at.isoformat(),
        'reviewed_at': req.reviewed_at.isoformat() if req.reviewed_at else None,
        'reviewed_by': _display_name(req.reviewed_by) if req.reviewed_by else None,
        'user': {'id': req.user_id, 'name': _display_name(req.user)},
    }


def _grant(kind, user, item, by, notes=''):
    if kind == AccessRequest.KIND_LEVEL:
        access, created = LevelAccess.objects.get_or_create(
            user=user, level=item, defaults={'granted_by': by, 'notes': notes, 'is_active': True})
        if not created:
            access.is_active = True
            access.granted_by = by
            if notes:
                access.notes = notes
            access.save(update_fields=['is_active', 'granted_by', 'notes'])
    else:
        access, created = BookAccess.objects.get_or_create(
            user=user, book=item, defaults={'granted_by': by, 'is_active': True})
        if not created:
            access.is_active = True
            access.granted_by = by
            access.save(update_fields=['is_active', 'granted_by'])


def _set_admin(user, make_admin):
    group, _ = Group.objects.get_or_create(name=ADMIN_GROUP)
    if make_admin:
        user.groups.add(group)
    else:
        user.groups.remove(group)
        if user.is_staff and not user.is_superuser:
            user.is_staff = False
            user.save(update_fields=['is_staff'])


# ---------------------------------------------------------------------------
# Overview
# ---------------------------------------------------------------------------

class AdminOverviewAPIView(AdminRequiredMixin, APIView):
    def get(self, request):
        now = timezone.now()
        students = User.objects.filter(is_superuser=False, is_staff=False).exclude(groups__name=ADMIN_GROUP)
        pending = AccessRequest.objects.filter(status='pending')
        approved = AccessRequest.objects.filter(status='approved')

        pending_by_level = {'level': {}, 'book': {}}
        for row in pending.values('kind', 'level_code').annotate(n=Count('id')):
            pending_by_level[row['kind']][row['level_code']] = row['n']

        # Sign-ups per day for the last 14 days (for the chart)
        start = (now - timedelta(days=13)).date()
        joined = {}
        for d in User.objects.filter(date_joined__date__gte=start).values_list('date_joined', flat=True):
            key = timezone.localtime(d).date().isoformat()
            joined[key] = joined.get(key, 0) + 1
        signups = [{'date': (start + timedelta(days=i)).isoformat(),
                    'count': joined.get((start + timedelta(days=i)).isoformat(), 0)} for i in range(14)]

        levels = CourseLevel.objects.annotate(
            subscribers=Count('user_accesses', filter=Q(user_accesses__is_active=True), distinct=True),
            pending=Count('requests', filter=Q(requests__status='pending'), distinct=True),
        ).order_by('order')

        return Response({
            'stats': {
                'students': students.count(),
                'new_students_7d': students.filter(date_joined__gte=now - timedelta(days=7)).count(),
                'pending_level_requests': pending.filter(kind='level').count(),
                'pending_book_requests': pending.filter(kind='book').count(),
                'active_level_subscriptions': LevelAccess.objects.filter(is_active=True).count(),
                'active_book_accesses': BookAccess.objects.filter(is_active=True).count(),
                'levels': CourseLevel.objects.count(),
                'books': DigitalBook.objects.count(),
                'branches': Branch.objects.count(),
                'revenue_total': str(approved.aggregate(s=Sum('amount'))['s'] or 0),
                'revenue_30d': str(approved.filter(reviewed_at__gte=now - timedelta(days=30)).aggregate(s=Sum('amount'))['s'] or 0),
            },
            'pending_by_level': pending_by_level,
            'levels': [{'id': l.id, 'name': l.name, 'title': l.title, 'subscribers': l.subscribers,
                        'pending': l.pending, 'is_active': l.is_active} for l in levels],
            'signups_14d': signups,
            'recent_requests': [serialize_request(r) for r in AccessRequest.objects.select_related(
                'user', 'level', 'book', 'reviewed_by')[:8]],
            'recent_users': [{'id': u.id, 'name': _display_name(u), 'date_joined': u.date_joined.isoformat()}
                             for u in User.objects.order_by('-date_joined')[:6]],
        })


class AdminPendingCountAPIView(AdminRequiredMixin, APIView):
    """Tiny endpoint for the badge on the dashboard button."""
    def get(self, request):
        pending = AccessRequest.objects.filter(status='pending')
        by_kind = dict(pending.values_list('kind').annotate(n=Count('id')))
        return Response({'pending': sum(by_kind.values()), 'level': by_kind.get('level', 0), 'book': by_kind.get('book', 0)})


# ---------------------------------------------------------------------------
# Requests
# ---------------------------------------------------------------------------

class AdminRequestsAPIView(AdminRequiredMixin, APIView):
    def get(self, request):
        qs = AccessRequest.objects.select_related('user', 'level', 'book', 'reviewed_by')
        kind = request.query_params.get('kind')
        req_status = request.query_params.get('status')
        level = request.query_params.get('level')
        search = request.query_params.get('search', '').strip()
        if kind in (AccessRequest.KIND_LEVEL, AccessRequest.KIND_BOOK):
            qs = qs.filter(kind=kind)
        if req_status in ('pending', 'approved', 'rejected'):
            qs = qs.filter(status=req_status)
        if level:
            qs = qs.filter(level_code=level)
        if search:
            qs = qs.filter(Q(full_name__icontains=search) | Q(phone__icontains=search)
                           | Q(user__first_name__icontains=search) | Q(user__last_name__icontains=search))

        # Counts per level & status for the tabs (same kind filter, ignoring level/status filters)
        base = AccessRequest.objects.all()
        if kind in (AccessRequest.KIND_LEVEL, AccessRequest.KIND_BOOK):
            base = base.filter(kind=kind)
        counts = {'by_status': {}, 'pending_by_level': {}}
        for row in base.values('status').annotate(n=Count('id')):
            counts['by_status'][row['status']] = row['n']
        for row in base.filter(status='pending').values('level_code').annotate(n=Count('id')):
            counts['pending_by_level'][row['level_code']] = row['n']

        return Response({'counts': counts, 'results': [serialize_request(r) for r in qs[:300]]})


class AdminRequestActionAPIView(AdminRequiredMixin, APIView):
    def post(self, request, request_id, action):
        try:
            req = AccessRequest.objects.select_related('user', 'level', 'book').get(pk=request_id)
        except AccessRequest.DoesNotExist:
            return _not_found('الطلب')
        if action not in ('approve', 'reject'):
            return _not_found('الإجراء')

        note = str(request.data.get('admin_note', '')).strip()
        with transaction.atomic():
            if action == 'approve':
                item = req.level if req.kind == AccessRequest.KIND_LEVEL else req.book
                if item is None:
                    return Response({'detail': 'العنصر المطلوب اتحذف، مينفعش يتفعّل.'}, status=status.HTTP_400_BAD_REQUEST)
                notes = f"طلب #{req.id} — {req.payment_method} — {req.amount} ج.م"
                _grant(req.kind, req.user, item, request.user, notes)
                req.status = 'approved'
                message = f'تم قبول الطلب وتفعيل «{req.item_name}» لـ {req.full_name} فوراً.'
            else:
                req.status = 'rejected'
                message = 'تم رفض الطلب.'
            req.admin_note = note
            req.reviewed_by = request.user
            req.reviewed_at = timezone.now()
            req.save(update_fields=['status', 'admin_note', 'reviewed_by', 'reviewed_at'])

        return Response({'detail': message, 'request': serialize_request(req)})


class AdminRequestDetailAPIView(AdminRequiredMixin, APIView):
    def delete(self, request, request_id):
        deleted, _ = AccessRequest.objects.filter(pk=request_id).delete()
        if not deleted:
            return _not_found('الطلب')
        return Response({'detail': 'تم حذف الطلب.'})


class AdminRequestReceiptAPIView(AdminRequiredMixin, APIView):
    def get(self, request, request_id):
        try:
            req = AccessRequest.objects.get(pk=request_id)
        except AccessRequest.DoesNotExist:
            return _not_found('الطلب')
        if not req.receipt or not req.receipt.storage.exists(req.receipt.name):
            return _not_found('إيصال التحويل')
        return protected_file_response(req.receipt, f'receipt-{req.id}', inline=True)


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------

def _user_row(u):
    return {
        'id': u.id,
        'name': _display_name(u),
        'email_masked': _mask_email(u.email or u.username),
        'phone': u.last_phone or '',
        'is_active': u.is_active,
        'is_admin': _is_admin(u),
        'is_superuser': u.is_superuser,
        'date_joined': u.date_joined.isoformat() if u.date_joined else None,
        'last_login': u.last_login.isoformat() if u.last_login else None,
        'levels': sorted({a.level.name for a in u.level_accesses.all() if a.is_active}),
        'books_count': sum(1 for a in u.book_accesses.all() if a.is_active),
        'pending_count': u.pending_count,
    }


def _users_qs():
    from django.db.models import OuterRef, Subquery
    last_phone = AccessRequest.objects.filter(user=OuterRef('pk')).order_by('-created_at').values('phone')[:1]
    return (User.objects
            .annotate(last_phone=Subquery(last_phone),
                      pending_count=Count('access_requests', filter=Q(access_requests__status='pending'), distinct=True))
            .prefetch_related('level_accesses__level', 'book_accesses', 'groups'))


class AdminUsersAPIView(AdminRequiredMixin, APIView):
    PAGE_SIZE = 20

    def get(self, request):
        qs = _users_qs().order_by('-date_joined')
        search = request.query_params.get('search', '').strip()
        role = request.query_params.get('role')
        state = request.query_params.get('status')
        level = request.query_params.get('level')
        if search:
            qs = qs.filter(Q(first_name__icontains=search) | Q(last_name__icontains=search)
                           | Q(email__icontains=search) | Q(username__icontains=search)
                           | Q(access_requests__phone__icontains=search)).distinct()
        admin_q = Q(is_staff=True) | Q(is_superuser=True) | Q(groups__name=ADMIN_GROUP)
        if role == 'admin':
            qs = qs.filter(admin_q).distinct()
        elif role == 'student':
            qs = qs.exclude(admin_q)
        if state == 'active':
            qs = qs.filter(is_active=True)
        elif state == 'inactive':
            qs = qs.filter(is_active=False)
        if level:
            qs = qs.filter(level_accesses__level__name=level, level_accesses__is_active=True).distinct()

        try:
            page = max(1, int(request.query_params.get('page', 1)))
        except ValueError:
            page = 1
        total = qs.count()
        rows = qs[(page - 1) * self.PAGE_SIZE: page * self.PAGE_SIZE]
        return Response({
            'count': total,
            'page': page,
            'pages': max(1, -(-total // self.PAGE_SIZE)),
            'results': [_user_row(u) for u in rows],
        })

    def post(self, request):
        email = str(request.data.get('email', '')).strip().lower()
        password = str(request.data.get('password', ''))
        if not email or '@' not in email:
            return Response({'email': ['البريد الإلكتروني غير صحيح.']}, status=status.HTTP_400_BAD_REQUEST)
        if len(password) < 8:
            return Response({'password': ['كلمة المرور 8 حروف على الأقل.']}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(Q(email__iexact=email) | Q(username__iexact=email)).exists():
            return Response({'email': ['البريد ده مسجل بالفعل.']}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=email, email=email, password=password,
            first_name=str(request.data.get('first_name', '')).strip()[:150],
            last_name=str(request.data.get('last_name', '')).strip()[:150],
        )
        if _to_bool(request.data.get('is_admin'), default=False):
            _set_admin(user, True)
        return Response({'detail': 'تم إنشاء الحساب.', 'id': user.id}, status=status.HTTP_201_CREATED)


class AdminUserDetailAPIView(AdminRequiredMixin, APIView):
    def _get(self, user_id):
        return _users_qs().filter(pk=user_id).first()

    def get(self, request, user_id):
        u = self._get(user_id)
        if not u:
            return _not_found('المستخدم')
        data = _user_row(u)
        data.update({
            'email': u.email or u.username,
            'first_name': u.first_name,
            'last_name': u.last_name,
            'level_access': [{
                'level_id': a.level_id, 'code': a.level.name, 'title': a.level.title,
                'granted_at': a.granted_at.isoformat(), 'notes': a.notes,
            } for a in u.level_accesses.all() if a.is_active],
            'book_access': [{
                'book_id': a.book_id, 'name': a.book.name, 'level': a.book.level,
                'granted_at': a.granted_at.isoformat(),
            } for a in u.book_accesses.select_related('book') if a.is_active],
            'requests': [serialize_request(r) for r in
                         AccessRequest.objects.filter(user=u).select_related('user', 'level', 'book', 'reviewed_by')[:30]],
        })
        return Response(data)

    def patch(self, request, user_id):
        u = User.objects.filter(pk=user_id).first()
        if not u:
            return _not_found('المستخدم')
        data = request.data
        is_self = u.pk == request.user.pk

        if 'email' in data:
            email = str(data['email']).strip().lower()
            if not email or '@' not in email:
                return Response({'email': ['البريد الإلكتروني غير صحيح.']}, status=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(Q(email__iexact=email) | Q(username__iexact=email)).exclude(pk=u.pk).exists():
                return Response({'email': ['البريد ده مستخدم في حساب تاني.']}, status=status.HTTP_400_BAD_REQUEST)
            u.email = email
            if '@' in (u.username or ''):
                u.username = email
        for field in ('first_name', 'last_name'):
            if field in data:
                setattr(u, field, str(data[field]).strip()[:150])
        if 'is_active' in data:
            active = _to_bool(data['is_active'])
            if is_self and not active:
                return Response({'detail': 'مينفعش توقف حسابك انت.'}, status=status.HTTP_400_BAD_REQUEST)
            u.is_active = active
        if data.get('password'):
            if len(str(data['password'])) < 8:
                return Response({'password': ['كلمة المرور 8 حروف على الأقل.']}, status=status.HTTP_400_BAD_REQUEST)
            u.set_password(str(data['password']))
        u.save()

        if 'is_admin' in data:
            make_admin = _to_bool(data['is_admin'])
            if is_self and not make_admin:
                return Response({'detail': 'مينفعش تشيل صلاحية الأدمن من حسابك انت.'}, status=status.HTTP_400_BAD_REQUEST)
            if u.is_superuser and not make_admin:
                return Response({'detail': 'ده حساب المالك (superuser) ومينفعش تشيل صلاحياته من هنا.'},
                                status=status.HTTP_400_BAD_REQUEST)
            _set_admin(u, make_admin)

        return Response({'detail': 'تم حفظ التعديلات.'})

    def delete(self, request, user_id):
        u = User.objects.filter(pk=user_id).first()
        if not u:
            return _not_found('المستخدم')
        if u.pk == request.user.pk:
            return Response({'detail': 'مينفعش تمسح حسابك انت.'}, status=status.HTTP_400_BAD_REQUEST)
        if u.is_superuser:
            return Response({'detail': 'مينفعش تمسح حساب المالك (superuser).'}, status=status.HTTP_400_BAD_REQUEST)
        u.delete()
        return Response({'detail': 'تم حذف الحساب وكل صلاحياته.'})


class AdminUserAccessAPIView(AdminRequiredMixin, APIView):
    """POST {kind: level|book, item_id, grant: true|false}"""
    def post(self, request, user_id):
        u = User.objects.filter(pk=user_id).first()
        if not u:
            return _not_found('المستخدم')
        kind = request.data.get('kind')
        item_id = request.data.get('item_id')
        grant = _to_bool(request.data.get('grant'), default=True)
        model = CourseLevel if kind == AccessRequest.KIND_LEVEL else DigitalBook if kind == AccessRequest.KIND_BOOK else None
        if model is None:
            return Response({'detail': 'نوع غير صحيح.'}, status=status.HTTP_400_BAD_REQUEST)
        item = model.objects.filter(pk=item_id).first()
        if not item:
            return _not_found('العنصر')

        if grant:
            _grant(kind, u, item, request.user, 'تفعيل يدوي من لوحة التحكم')
            # Any pending request for the same item is now settled.
            AccessRequest.objects.filter(user=u, kind=kind, status='pending', **{kind: item}).update(
                status='approved', reviewed_by=request.user, reviewed_at=timezone.now())
            return Response({'detail': 'تم التفعيل.'})

        if kind == AccessRequest.KIND_LEVEL:
            LevelAccess.objects.filter(user=u, level=item).update(is_active=False)
        else:
            BookAccess.objects.filter(user=u, book=item).update(is_active=False)
        return Response({'detail': 'تم إلغاء التفعيل.'})


# ---------------------------------------------------------------------------
# Levels, videos, files
# ---------------------------------------------------------------------------

LEVEL_FIELDS = ('name', 'title', 'description', 'price', 'old_price', 'order', 'is_active', 'bunny_collection_id')


def _serialize_level(l):
    return {
        'id': l.id, 'name': l.name, 'title': l.title, 'description': l.description,
        'price': str(l.price), 'old_price': str(l.old_price) if l.old_price is not None else None,
        'order': l.order, 'is_active': l.is_active, 'bunny_collection_id': l.bunny_collection_id,
        'subscribers': getattr(l, 'subscribers', None), 'videos_count': getattr(l, 'videos_count', None),
        'files_count': getattr(l, 'files_count', None), 'pending': getattr(l, 'pending', None),
    }


def _apply_level(level, data):
    for f in LEVEL_FIELDS:
        if f not in data:
            continue
        value = data[f]
        if f == 'is_active':
            value = _to_bool(value)
        elif f == 'old_price':
            value = _decimal_or_none(value)
        elif f == 'name':
            value = str(value).strip().upper()[:10]
        elif f == 'order':
            value = int(value or 1)
        setattr(level, f, value)


class AdminLevelsCrudAPIView(AdminRequiredMixin, APIView):
    def get(self, request):
        levels = CourseLevel.objects.annotate(
            subscribers=Count('user_accesses', filter=Q(user_accesses__is_active=True), distinct=True),
            videos_count=Count('videos', distinct=True),
            files_count=Count('files', distinct=True),
            pending=Count('requests', filter=Q(requests__status='pending'), distinct=True),
        ).order_by('order')
        return Response([_serialize_level(l) for l in levels])

    def post(self, request):
        data = request.data
        if not str(data.get('name', '')).strip() or not str(data.get('title', '')).strip():
            return Response({'detail': 'كود المستوى والعنوان مطلوبين.'}, status=status.HTTP_400_BAD_REQUEST)
        if CourseLevel.objects.filter(name__iexact=str(data['name']).strip()).exists():
            return Response({'name': ['كود المستوى ده موجود بالفعل.']}, status=status.HTTP_400_BAD_REQUEST)
        level = CourseLevel(description='', price=0,
                            order=(CourseLevel.objects.aggregate(m=Max('order'))['m'] or 0) + 1)
        try:
            _apply_level(level, data)
            level.save()
        except Exception:
            return Response({'detail': 'تأكد من البيانات (السعر لازم يكون رقم).'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(_serialize_level(level), status=status.HTTP_201_CREATED)


class AdminLevelCrudDetailAPIView(AdminRequiredMixin, APIView):
    def patch(self, request, level_id):
        level = CourseLevel.objects.filter(pk=level_id).first()
        if not level:
            return _not_found('المستوى')
        if 'name' in request.data and CourseLevel.objects.filter(
                name__iexact=str(request.data['name']).strip()).exclude(pk=level.pk).exists():
            return Response({'name': ['كود المستوى ده موجود بالفعل.']}, status=status.HTTP_400_BAD_REQUEST)
        try:
            _apply_level(level, request.data)
            level.save()
        except Exception:
            return Response({'detail': 'تأكد من البيانات (السعر لازم يكون رقم).'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(_serialize_level(level))

    def delete(self, request, level_id):
        deleted, _ = CourseLevel.objects.filter(pk=level_id).delete()
        if not deleted:
            return _not_found('المستوى')
        return Response({'detail': 'تم حذف المستوى وكل محتواه واشتراكاته.'})


def _serialize_video(v):
    return {'id': v.id, 'title': v.title, 'bunny_video_id': v.bunny_video_id, 'length': v.length,
            'order': v.order, 'is_active': v.is_active}


def _serialize_file(f):
    return {'id': f.id, 'name': f.name, 'is_active': f.is_active, 'created_at': f.created_at.isoformat(),
            'file_name': f.file.name.rsplit('/', 1)[-1] if f.file else None}


class AdminLevelContentAPIView(AdminRequiredMixin, APIView):
    """GET videos + files; POST {type: video, ...} or multipart {type: file, name, file}."""
    def get(self, request, level_id):
        level = CourseLevel.objects.filter(pk=level_id).first()
        if not level:
            return _not_found('المستوى')
        return Response({
            'videos': [_serialize_video(v) for v in level.videos.order_by('order')],
            'files': [_serialize_file(f) for f in level.files.order_by('created_at')],
        })

    def post(self, request, level_id):
        level = CourseLevel.objects.filter(pk=level_id).first()
        if not level:
            return _not_found('المستوى')
        data = request.data
        if data.get('type') == 'file':
            file_obj = request.FILES.get('file')
            name = str(data.get('name', '')).strip() or (file_obj.name if file_obj else '')
            if not file_obj:
                return Response({'detail': 'اختار الملف.'}, status=status.HTTP_400_BAD_REQUEST)
            f = CourseFile.objects.create(level=level, name=name[:300], file=file_obj,
                                          is_active=_to_bool(data.get('is_active'), default=True))
            return Response(_serialize_file(f), status=status.HTTP_201_CREATED)

        title = str(data.get('title', '')).strip()
        bunny_id = str(data.get('bunny_video_id', '')).strip()
        if not title or not bunny_id:
            return Response({'detail': 'عنوان المحاضرة ومعرّف الفيديو على Bunny مطلوبين.'}, status=status.HTTP_400_BAD_REQUEST)
        if Video.objects.filter(bunny_video_id=bunny_id).exists():
            return Response({'bunny_video_id': ['الفيديو ده مضاف بالفعل.']}, status=status.HTTP_400_BAD_REQUEST)
        next_order = (level.videos.aggregate(m=Max('order'))['m'] or 0) + 1
        v = Video.objects.create(level=level, title=title[:500], bunny_video_id=bunny_id,
                                 length=int(data.get('length') or 0), order=next_order,
                                 is_active=_to_bool(data.get('is_active'), default=True))
        return Response(_serialize_video(v), status=status.HTTP_201_CREATED)


class AdminVideoDetailAPIView(AdminRequiredMixin, APIView):
    def patch(self, request, video_id):
        v = Video.objects.filter(pk=video_id).first()
        if not v:
            return _not_found('الفيديو')
        data = request.data
        if 'title' in data:
            v.title = str(data['title']).strip()[:500]
        if 'bunny_video_id' in data:
            bunny_id = str(data['bunny_video_id']).strip()
            if Video.objects.filter(bunny_video_id=bunny_id).exclude(pk=v.pk).exists():
                return Response({'bunny_video_id': ['الفيديو ده مضاف بالفعل.']}, status=status.HTTP_400_BAD_REQUEST)
            v.bunny_video_id = bunny_id
        if 'length' in data:
            v.length = int(data['length'] or 0)
        if 'is_active' in data:
            v.is_active = _to_bool(data['is_active'])
        if 'order' in data:
            # Swap with the video currently holding that position (order is unique per level).
            new_order = int(data['order'])
            other = Video.objects.filter(level=v.level, order=new_order).exclude(pk=v.pk).first()
            with transaction.atomic():
                if other:
                    old = v.order
                    temp = (Video.objects.filter(level=v.level).aggregate(m=Max('order'))['m'] or 0) + 1
                    other.order = temp
                    other.save(update_fields=['order'])
                    v.order = new_order
                    v.save()
                    other.order = old
                    other.save(update_fields=['order'])
                    return Response(_serialize_video(v))
                v.order = new_order
        v.save()
        return Response(_serialize_video(v))

    def delete(self, request, video_id):
        deleted, _ = Video.objects.filter(pk=video_id).delete()
        if not deleted:
            return _not_found('الفيديو')
        return Response({'detail': 'تم حذف المحاضرة.'})


class AdminFileDetailAPIView(AdminRequiredMixin, APIView):
    def patch(self, request, file_id):
        f = CourseFile.objects.filter(pk=file_id).first()
        if not f:
            return _not_found('الملف')
        if 'name' in request.data:
            f.name = str(request.data['name']).strip()[:300] or f.name
        if 'is_active' in request.data:
            f.is_active = _to_bool(request.data['is_active'])
        if 'file' in request.FILES:
            f.file = request.FILES['file']
        f.save()
        return Response(_serialize_file(f))

    def delete(self, request, file_id):
        f = CourseFile.objects.filter(pk=file_id).first()
        if not f:
            return _not_found('الملف')
        if f.file:
            f.file.delete(save=False)
        f.delete()
        return Response({'detail': 'تم حذف الملف.'})


# ---------------------------------------------------------------------------
# Branches
# ---------------------------------------------------------------------------

BRANCH_FIELDS = ('name', 'city', 'branch_type', 'address', 'map_url', 'badge', 'phone', 'order', 'is_active')


def serialize_branch(b):
    return {'id': b.id, 'name': b.name, 'city': b.city, 'branch_type': b.branch_type, 'address': b.address,
            'map_url': b.map_url, 'badge': b.badge, 'phone': b.phone, 'order': b.order, 'is_active': b.is_active}


def _apply_branch(branch, data):
    for f in BRANCH_FIELDS:
        if f in data:
            value = data[f]
            if f == 'is_active':
                value = _to_bool(value)
            elif f == 'order':
                value = int(value or 1)
            else:
                value = str(value).strip()
            setattr(branch, f, value)


class AdminBranchesAPIView(AdminRequiredMixin, APIView):
    def get(self, request):
        return Response([serialize_branch(b) for b in Branch.objects.order_by('order', 'id')])

    def post(self, request):
        data = request.data
        if not str(data.get('name', '')).strip() or not str(data.get('address', '')).strip():
            return Response({'detail': 'اسم الفرع والعنوان مطلوبين.'}, status=status.HTTP_400_BAD_REQUEST)
        branch = Branch(order=(Branch.objects.aggregate(m=Max('order'))['m'] or 0) + 1, map_url='')
        _apply_branch(branch, data)
        branch.save()
        return Response(serialize_branch(branch), status=status.HTTP_201_CREATED)


class AdminBranchDetailAPIView(AdminRequiredMixin, APIView):
    def patch(self, request, branch_id):
        branch = Branch.objects.filter(pk=branch_id).first()
        if not branch:
            return _not_found('الفرع')
        _apply_branch(branch, request.data)
        branch.save()
        return Response(serialize_branch(branch))

    def delete(self, request, branch_id):
        deleted, _ = Branch.objects.filter(pk=branch_id).delete()
        if not deleted:
            return _not_found('الفرع')
        return Response({'detail': 'تم حذف الفرع.'})
