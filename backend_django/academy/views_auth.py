from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

class LoginAPIView(APIView):
    """
    Secure API Endpoint for Admin Login.
    Returns Auth Token and user profile details upon successful authentication.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        if not username or not password:
            return Response(
                {'error': 'يرجى إدخال اسم المستخدم وكلمة المرور'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Authenticate user against Django User model
        user = authenticate(username=username, password=password)
        
        # Fallback: support email login as username if username match fails
        if user is None and '@' in username:
            try:
                user_obj = User.objects.get(email__iexact=username)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None

        if not user:
            return Response(
                {'error': 'اسم المستخدم أو كلمة المرور غير صحيحة'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {'error': 'هذا الحساب معطل حالياً'}, 
                status=status.HTTP_403_FORBIDDEN
            )

        # Get or generate DRF auth token
        token, _ = Token.objects.get_or_create(user=user)

        full_name = f"{user.first_name} {user.last_name}".strip() or user.username
        if user.is_superuser or user.is_staff:
            role_label = "مشرف النظام 👑"
        else:
            role_label = "عضو الأكاديمية"

        return Response({
            'status': 'success',
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': full_name,
                'role': role_label,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
            }
        }, status=status.HTTP_200_OK)


class LogoutAPIView(APIView):
    """
    Revokes the current user's Auth Token.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            if hasattr(request.user, 'auth_token'):
                request.user.auth_token.delete()
            return Response({'status': 'success', 'message': 'تم تسجيل الخروج بنجاح'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserMeAPIView(APIView):
    """
    Verifies the active token and returns logged-in user profile.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        full_name = f"{user.first_name} {user.last_name}".strip() or user.username
        if user.is_superuser or user.is_staff:
            role_label = "مشرف النظام 👑"
        else:
            role_label = "عضو الأكاديمية"

        return Response({
            'status': 'authenticated',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': full_name,
                'role': role_label,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
            }
        }, status=status.HTTP_200_OK)
