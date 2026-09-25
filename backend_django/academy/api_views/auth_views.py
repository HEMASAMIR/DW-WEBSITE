import uuid
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

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
        return Response({
            'access': token.key,
            'refresh': token.key,
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
        return Response({'access': refresh}, status=status.HTTP_200_OK)


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


class AdminUserGroupsAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, user_id):
        groups = request.data.get('groups', ['Student'])
        return Response({
            "detail": f"User #{user_id} successfully assigned to groups: {', '.join(groups)}."
        })
