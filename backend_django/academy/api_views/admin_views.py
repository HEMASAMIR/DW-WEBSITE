import datetime
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model

User = get_user_model()

class AdminCourseLevelsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response([
            {
                "id": 1,
                "name": "A1",
                "title": "A1 - Beginner German",
                "price": "1200.00",
                "old_price": "1600.00",
                "order": 1,
                "is_active": True,
                "access_count": 28
            }
        ])


class AdminGrantLevelAccessAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, level_id):
        user_id = request.data.get('user_id')
        notes = request.data.get('notes', '')
        return Response({
            "detail": f"Access granted to student #{user_id} for level {level_id}.",
            "access": {
                "id": 1,
                "user": user_id,
                "level": level_id,
                "granted_at": datetime.datetime.now().isoformat(),
                "is_active": True,
                "notes": notes
            }
        }, status=status.HTTP_201_CREATED)


class AdminRevokeLevelAccessAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, level_id):
        user_id = request.data.get('user_id')
        return Response({"detail": f"Access revoked for user #{user_id} from level {level_id}."})


class AdminLevelUsersAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, level_id):
        return Response([
            {
                "id": 1,
                "user": 5,
                "user_email": "student@example.com",
                "user_first_name": "أحمد",
                "user_last_name": "محمد",
                "level": level_id,
                "granted_at": "2026-07-14T10:30:00Z",
                "notes": "تم الدفع وتفعيل المستوى"
            }
        ])


class AdminRefreshVideoCacheAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, level_id):
        return Response({"detail": f"Cache refreshed for level {level_id}."})


class AdminBooksAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response([
            {"id": 1, "name": "كتاب A1", "level": "A1", "price": "500.00", "is_active": True}
        ])

    def post(self, request):
        return Response({"detail": "Book created successfully."}, status=status.HTTP_201_CREATED)


class AdminBookDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, book_id):
        return Response({"detail": "Book updated."})

    def delete(self, request, book_id):
        return Response({"detail": "Book deleted."})


class AdminBookUsersAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, book_id):
        return Response([])


class AdminGrantBookAccessAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, book_id):
        return Response({"detail": "Book access granted."}, status=status.HTTP_201_CREATED)


class AdminRevokeBookAccessAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, book_id):
        return Response({"detail": "Book access revoked."})


class AdminUserManageAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.all().order_by('-date_joined')[:50]
        data = []
        for u in users:
            data.append({
                'id': u.id,
                'email': u.email or u.username,
                'first_name': u.first_name or 'طالب',
                'last_name': u.last_name or '',
                'is_active': u.is_active,
                'is_staff': u.is_staff or u.is_superuser,
                'date_joined': u.date_joined.isoformat() if u.date_joined else None,
                'phone_number': getattr(u, 'phone_number', None),
                'profile_photo': None,
            })
        return Response({
            'count': len(data),
            'results': data
        }, status=status.HTTP_200_OK)


class AdminCourseRequestsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            from ..models import LevelEnrollmentRequest
            qs = LevelEnrollmentRequest.objects.all().order_by('-created_at')
            data = []
            for req in qs:
                data.append({
                    'id': req.id,
                    'student_name': req.student_name,
                    'phone': req.phone,
                    'level': req.level,
                    'status': req.status,
                    'amount': req.amount,
                    'payment_method': req.payment_method,
                    'created_at': req.created_at.isoformat() if req.created_at else None,
                })
            return Response({'count': len(data), 'results': data})
        except Exception:
            return Response({'count': 0, 'results': []})


class AdminBookRequestsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            from ..models import BookOrder
            qs = BookOrder.objects.all().order_by('-created_at')
            data = []
            for order in qs:
                data.append({
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
                })
            return Response({'count': len(data), 'results': data})
        except Exception:
            return Response({'count': 0, 'results': []})
