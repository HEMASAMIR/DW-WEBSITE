from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import Group
from django.http import HttpResponse
from .models import Course, StudentRegistration, Book, BookOrder
import uuid
import datetime

User = get_user_model()

# =========================================================================
# 1. AUTHENTICATION & USER PROFILE
# =========================================================================

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '').strip()
        first_name = request.data.get('first_name', '').strip()
        last_name = request.data.get('last_name', '').strip()
        phone_number = request.data.get('phone_number', '').strip()

        if not email or not password or not first_name:
            return Response({'detail': 'يرجى إدخال كافة البيانات الأساسية المطلوبة.'}, status=status.HTTP_400_BAD_REQUEST)

        if phone_number and len(phone_number) != 11:
            return Response({'phone_number': ['phone_number must be exactly 11 digits.']}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists() or User.objects.filter(username=email).exists():
            return Response({'email': ['هذا البريد الإلكتروني مسجل بالفعل.']}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        return Response({
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone_number': phone_number
        }, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        login_identifier = email or username
        if not login_identifier or not password:
            return Response({'detail': 'يرجى إدخال البريد الإلكتروني وكلمة المرور.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=login_identifier, password=password)
        if user is None and '@' in login_identifier:
            try:
                user_obj = User.objects.get(email__iexact=login_identifier)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None

        if not user:
            return Response({'detail': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({'detail': 'هذا الحساب معطل حالياً.'}, status=status.HTTP_403_FORBIDDEN)

        token, _ = Token.objects.get_or_create(user=user)
        # Return the raw DRF token so TokenAuthentication can validate it correctly.
        # The Flutter app sends: Authorization: Token <access>
        # DRF looks up the token string directly in the database, so no prefix allowed.
        return Response({
            'access': token.key,
            'refresh': token.key,  # Same token used for refresh in this simplified auth
            'user': {
                'id': user.id,
                'email': user.email or user.username,
                'first_name': user.first_name or 'طالب',
                'last_name': user.last_name or 'دويتشه فيلت',
                'phone_number': getattr(user, 'phone_number', None),
                'is_active': user.is_active,
                'is_staff': user.is_staff or user.is_superuser,
                'profile_photo': None
            }
        }, status=status.HTTP_200_OK)


class TokenRefreshAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh = request.data.get('refresh', '')
        if not refresh:
            return Response({'detail': 'refresh token required'}, status=status.HTTP_400_BAD_REQUEST)
        # The refresh token IS the DRF token key — just return it as access again
        return Response({
            'access': refresh
        }, status=status.HTTP_200_OK)


class GoogleSignInAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        id_token = request.data.get('id_token')
        if not id_token:
            return Response({'detail': 'id_token is required.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'detail': 'Login successful.',
            'access': f"jwt_google_{uuid.uuid4().hex[:16]}",
            'refresh': f"jwt_refresh_{uuid.uuid4().hex[:16]}",
            'user': {
                'id': 99,
                'email': 'google_student@gmail.com',
                'first_name': 'طالب',
                'last_name': 'جوجل',
                'phone_number': None,
                'is_active': True,
                'is_staff': False,
                'profile_photo': None
            }
        }, status=status.HTTP_200_OK)


class LogoutAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_205_RESET_CONTENT)


class ForgotPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        return Response({'detail': 'If an account with this email exists, a reset code has been sent.'}, status=status.HTTP_200_OK)


class ResetPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')
        if not otp or not new_password:
            return Response({'detail': 'رمز التحقق وكلمة المرور الجديدة مطلوبان.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)


class UserProfileAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user if request.user.is_authenticated else None
        return Response({
            'detail': 'Profile retrieved successfully.',
            'user': {
                'first_name': user.first_name if user else 'طالب',
                'last_name': user.last_name if user else 'دويتشه فيلت',
                'phone_number': getattr(user, 'phone_number', '01012345678'),
                'profile_photo': None
            }
        })

    def put(self, request):
        return Response({
            'detail': 'Profile updated successfully.',
            'user': {
                'first_name': request.data.get('first_name', 'طالب'),
                'last_name': request.data.get('last_name', ''),
                'phone_number': request.data.get('phone_number', '01012345678'),
                'profile_photo': None
            }
        })


class ChangePasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({'detail': 'Password updated successfully.'}, status=status.HTTP_200_OK)


# =========================================================================
# 2. COURSES & LEVELS & VIDEO STREAMING
# =========================================================================

class CourseLevelsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Return 4 authentic CEFR levels sorted by order
        levels = [
            {
                "id": 1,
                "name": "A1",
                "title": "A1 - Beginner German (Grundstufe)",
                "description": "Start your German journey from zero.",
                "price": "1200.00",
                "old_price": "1600.00",
                "order": 1,
                "has_access": True if (request.user.is_authenticated and request.user.is_staff) else True
            },
            {
                "id": 2,
                "name": "A2",
                "title": "A2 - Elementary German (Aufbaukurs)",
                "description": "Build on your basics and develop fluency.",
                "price": "1400.00",
                "old_price": "1850.00",
                "order": 2,
                "has_access": True if (request.user.is_authenticated and request.user.is_staff) else False
            },
            {
                "id": 3,
                "name": "B1",
                "title": "B1 - Intermediate German (Mittelstufe)",
                "description": "Reach conversational fluency and pass Goethe/Telc B1.",
                "price": "1800.00",
                "old_price": "2400.00",
                "order": 3,
                "has_access": True if (request.user.is_authenticated and request.user.is_staff) else False
            },
            {
                "id": 4,
                "name": "B2",
                "title": "B2 - Upper Intermediate German (Oberstufe & Medizin)",
                "description": "Master complex topics and prepare for call center and medical jobs.",
                "price": "2200.00",
                "old_price": "2900.00",
                "order": 4,
                "has_access": True if (request.user.is_authenticated and request.user.is_staff) else False
            }
        ]
        return Response(levels, status=status.HTTP_200_OK)


class LevelVideosAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, level_id):
        return Response({
            "level": {
                "id": level_id,
                "name": f"Level {level_id}",
                "title": f"كورس اللغة الألمانية - المستوى {level_id}",
                "description": "المحاضرات المباشرة وشرح المنهج الشامل مع هير خالد",
                "has_access": True
            },
            "videos": [
                {
                    "id": "vid-lesson-01",
                    "title": "المحاضرة 1: التأسيس الصوتي ومخارج الحروف الألمانية (Phonetik)",
                    "length": 1420,
                    "thumbnail_url": "/assets/images/herr_khaled_2.jpg",
                    "embed_url": "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0",
                    "order": 1
                },
                {
                    "id": "vid-lesson-02",
                    "title": "المحاضرة 2: تصريف الأفعال والضمائر وتكوين الجملة الأساسية",
                    "length": 1280,
                    "thumbnail_url": "/assets/images/logo.jpg",
                    "embed_url": "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0",
                    "order": 2
                },
                {
                    "id": "vid-lesson-03",
                    "title": "المحاضرة 3: أدوات المعرفة والنكرة وحالة الـ Nominativ والأسئلة",
                    "length": 1540,
                    "thumbnail_url": "/assets/images/herr_khaled_2.jpg",
                    "embed_url": "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0",
                    "order": 3
                }
            ],
            "files": [
                {
                    "id": 1,
                    "name": "مذكرة تدريبات وقواعد المحاضرة الأولى (ملف PDF)",
                    "is_active": True,
                    "created_at": "2026-08-01T12:00:00Z"
                },
                {
                    "id": 2,
                    "name": "قائمة الكلمات والتعبيرات الصوتية Kapitel 1-3 (ملف PDF)",
                    "is_active": True,
                    "created_at": "2026-08-05T15:00:00Z"
                }
            ]
        }, status=status.HTTP_200_OK)


class CourseFileDownloadAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, level_id, file_id):
        content = b"%PDF-1.4 Mock German Lesson Material PDF"
        response = HttpResponse(content, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="DeutscheWelt_Level_{level_id}_File_{file_id}.pdf"'
        return response


# =========================================================================
# 3. COMMENTS & REPLIES
# =========================================================================

class VideoCommentsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, level_id, video_id):
        results = [
            {
                "id": 1,
                "user": {
                    "id": 5,
                    "first_name": "أحمد",
                    "last_name": "م.",
                    "profile_photo": None
                },
                "content": "شرح رائع جداً ومبسط يا هير خالد، النطق الألماني أصبح أوضح بكثير!",
                "created_at": "2026-07-18T10:30:00Z",
                "updated_at": "2026-07-18T10:30:00Z",
                "is_owner": False,
                "reply_count": 1,
                "replies": [
                    {
                        "id": 101,
                        "user": {
                            "id": 1,
                            "first_name": "هير خالد",
                            "last_name": "الحلواني",
                            "profile_photo": "/assets/images/herr_khaled_2.jpg"
                        },
                        "content": "بالتوفيق يا أحمد، تدرب على مخارج الحروف يومياً وستصل للطلاقة بإذن الله.",
                        "created_at": "2026-07-18T11:00:00Z",
                        "updated_at": "2026-07-18T11:00:00Z",
                        "is_owner": False
                    }
                ]
            }
        ]
        return Response({
            "count": len(results),
            "next": None,
            "previous": None,
            "results": results
        })

    def post(self, request, level_id, video_id):
        content = request.data.get('content', '').strip()
        if not content:
            return Response({'detail': 'محتوى التعليق مطلوب.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "id": int(datetime.datetime.now().timestamp()),
            "user": {
                "id": request.user.id if request.user.is_authenticated else 99,
                "first_name": request.user.first_name if request.user.is_authenticated else "طالب",
                "last_name": "م.",
                "profile_photo": None
            },
            "content": content,
            "created_at": datetime.datetime.now().isoformat(),
            "updated_at": datetime.datetime.now().isoformat(),
            "is_owner": True,
            "reply_count": 0,
            "replies": []
        }, status=status.HTTP_201_CREATED)


class VideoCommentReplyAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, level_id, video_id, comment_id):
        content = request.data.get('content', '').strip()
        return Response({
            "id": int(datetime.datetime.now().timestamp()),
            "user": {
                "id": request.user.id if request.user.is_authenticated else 99,
                "first_name": request.user.first_name if request.user.is_authenticated else "طالب",
                "last_name": "م.",
                "profile_photo": None
            },
            "content": content,
            "created_at": datetime.datetime.now().isoformat(),
            "updated_at": datetime.datetime.now().isoformat(),
            "is_owner": True
        }, status=status.HTTP_201_CREATED)


class VideoCommentDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def put(self, request, level_id, video_id, comment_id):
        return Response({
            "id": comment_id,
            "content": request.data.get('content', ''),
            "updated_at": datetime.datetime.now().isoformat()
        })

    def delete(self, request, level_id, video_id, comment_id):
        return Response({"detail": "Comment deleted."}, status=status.HTTP_200_OK)


# =========================================================================
# 4. BOOKS API
# =========================================================================

class BooksListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            "A1": [
                {
                    "id": 1,
                    "name": "كتاب دويتشه فيلت الشامل A1 (مطبوع + صوتيات)",
                    "level": "A1",
                    "price": "500.00",
                    "is_active": True,
                    "has_access": True
                }
            ],
            "A2": [
                {
                    "id": 2,
                    "name": "كتاب منهج دويتشه فيلت A2 (قواعد وتمارين)",
                    "level": "A2",
                    "price": "500.00",
                    "is_active": True,
                    "has_access": False
                }
            ],
            "B1": [
                {
                    "id": 3,
                    "name": "كتاب الإعداد لامتحانات جوته وتيلك B1",
                    "level": "B1",
                    "price": "500.00",
                    "is_active": True,
                    "has_access": False
                }
            ],
            "B2": [
                {
                    "id": 4,
                    "name": "كتاب الطلاقة اللغوية والألماني الطبي B2 Medizin",
                    "level": "B2",
                    "price": "500.00",
                    "is_active": True,
                    "has_access": False
                }
            ]
        })


class BookDownloadAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, book_id):
        content = b"%PDF-1.4 Mock German Book PDF File"
        response = HttpResponse(content, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="DeutscheWelt_Book_{book_id}.pdf"'
        return response


# =========================================================================
# 5. ADMIN APIS (LEVELS, CACHE, USER GROUPS, BOOKS)
# =========================================================================

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
                "bunny_collection_id": "bunny-a1-coll",
                "order": 1,
                "is_active": True,
                "access_count": 28
            },
            {
                "id": 2,
                "name": "A2",
                "title": "A2 - Elementary German",
                "price": "1400.00",
                "old_price": "1850.00",
                "bunny_collection_id": "bunny-a2-coll",
                "order": 2,
                "is_active": True,
                "access_count": 19
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
            {"id": 1, "name": "كتاب A1", "level": "A1", "price": "500.00", "is_active": True},
            {"id": 2, "name": "كتاب A2", "level": "A2", "price": "500.00", "is_active": True}
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


class AdminUserGroupsAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, user_id):
        groups = request.data.get('groups', ['Student'])
        return Response({
            "detail": f"User #{user_id} successfully assigned to groups: {', '.join(groups)}."
        })


# =========================================================================
# 6. ADMIN — USER MANAGEMENT  (/api/users/manage/)
# =========================================================================

class AdminUserManageAPIView(APIView):
    """
    Lists all registered users for the admin dashboard.
    GET /api/users/manage/
    """
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


# =========================================================================
# 7. ADMIN — COURSE ENROLLMENT REQUESTS  (/api/courses/admin/requests/)
# =========================================================================

class AdminCourseRequestsAPIView(APIView):
    """
    Lists and manages level enrollment requests.
    GET  /api/courses/admin/requests/
    """
    permission_classes = [AllowAny]

    def get(self, request):
        from .models import LevelEnrollmentRequest
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
        return Response({
            'count': len(data),
            'results': data
        }, status=status.HTTP_200_OK)


# =========================================================================
# 8. ADMIN — BOOK ACCESS REQUESTS  (/api/books/admin/requests/)
# =========================================================================

class AdminBookRequestsAPIView(APIView):
    """
    Lists book orders/requests for admin review.
    GET  /api/books/admin/requests/
    """
    permission_classes = [AllowAny]

    def get(self, request):
        from .models import BookOrder
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
        return Response({
            'count': len(data),
            'results': data
        }, status=status.HTTP_200_OK)
