"""
Deutsche Welt — Authentication API Views
==========================================
Production-ready authentication using:
- JWT via djangorestframework-simplejwt
- Google Sign-In (google-auth library)
- Apple Sign-In (PyJWT + Apple public keys)
- OTP-based Forgot/Reset Password (email SMTP)
"""

import uuid
import requests
import jwt as pyjwt
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPublicNumbers
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
import base64
import struct

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils import timezone

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

try:
    from google.oauth2 import id_token as google_id_token
    from google.auth.transport import requests as google_requests
    GOOGLE_AUTH_AVAILABLE = True
except ImportError:
    GOOGLE_AUTH_AVAILABLE = False

from academy.models import PasswordResetOTP, SocialAuthProfile

User = get_user_model()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _user_data(user):
    """Return consistent user object for all auth responses."""
    profile_photo = None
    if hasattr(user, 'profile') and user.profile.profile_photo:
        profile_photo = user.profile.profile_photo.url
    return {
        'id': user.id,
        'email': user.email or user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone_number': getattr(user, 'phone_number', None),
        'is_active': user.is_active,
        'is_staff': user.is_staff or user.is_superuser,
        'profile_photo': profile_photo,
    }


def _jwt_for_user(user):
    """Issue a fresh JWT pair for the given user."""
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


def _get_or_create_social_user(provider, provider_user_id, email, first_name='', last_name=''):
    """
    Find or create a Django User linked to a social provider.
    Returns (user, created).
    """
    # Try existing social link first
    try:
        profile = SocialAuthProfile.objects.get(
            provider=provider,
            provider_user_id=provider_user_id,
        )
        return profile.user, False
    except SocialAuthProfile.DoesNotExist:
        pass

    # Try to match by email
    user = None
    if email:
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            pass

    # Create a new user if none found
    created = False
    if user is None:
        username = email or f"{provider}_{provider_user_id}"
        user = User.objects.create_user(
            username=username,
            email=email or '',
            first_name=first_name,
            last_name=last_name,
            password=None,  # No password for social users
        )
        created = True
    elif first_name and not user.first_name:
        user.first_name = first_name
        user.last_name = last_name
        user.save(update_fields=['first_name', 'last_name'])

    # Link the social profile
    SocialAuthProfile.objects.create(
        user=user,
        provider=provider,
        provider_user_id=provider_user_id,
    )
    return user, created


# ---------------------------------------------------------------------------
# 1.1 Register
# ---------------------------------------------------------------------------

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '').strip()
        first_name = request.data.get('first_name', '').strip()
        last_name = request.data.get('last_name', '').strip()
        phone_number = request.data.get('phone_number', '').strip()

        if not email or not password or not first_name:
            return Response(
                {'detail': 'يرجى إدخال البريد الإلكتروني، كلمة المرور، والاسم الأول.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if phone_number and len(phone_number) != 11:
            return Response(
                {'phone_number': ['يجب أن يكون رقم الهاتف 11 رقماً بالضبط.']},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email__iexact=email).exists():
            return Response(
                {'email': ['هذا البريد الإلكتروني مسجل بالفعل.']},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        # Store phone if the custom User model supports it
        if phone_number and hasattr(user, 'phone_number'):
            user.phone_number = phone_number
            user.save(update_fields=['phone_number'])

        return Response({
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone_number': phone_number,
        }, status=status.HTTP_201_CREATED)


# ---------------------------------------------------------------------------
# 1.2 Login (email + password → JWT)
# ---------------------------------------------------------------------------

class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '').strip()

        if not email or not password:
            return Response(
                {'detail': 'يرجى إدخال البريد الإلكتروني وكلمة المرور.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Find user by email
        try:
            user_obj = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {'detail': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user_obj.check_password(password):
            return Response(
                {'detail': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user_obj.is_active:
            return Response(
                {'detail': 'هذا الحساب معطل. تواصل مع الدعم.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        tokens = _jwt_for_user(user_obj)
        return Response({**tokens, 'user': _user_data(user_obj)}, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# 1.3 Token Refresh (delegate to simplejwt)
# ---------------------------------------------------------------------------

class TokenRefreshAPIView(TokenRefreshView):
    """
    POST /api/users/login/refresh/
    Body: { "refresh": "<token>" }
    Returns new access token (and rotated refresh if ROTATE_REFRESH_TOKENS=True).
    """
    pass


# ---------------------------------------------------------------------------
# 1.4 Google Sign-In
# ---------------------------------------------------------------------------

class GoogleSignInAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        id_token_str = request.data.get('id_token', '').strip()
        if not id_token_str:
            return Response({'detail': 'id_token مطلوب.'}, status=status.HTTP_400_BAD_REQUEST)

        if not GOOGLE_AUTH_AVAILABLE:
            return Response({'detail': 'Google auth library not installed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        client_id = settings.GOOGLE_CLIENT_ID
        if not client_id:
            return Response({'detail': 'GOOGLE_CLIENT_ID is not configured on the server.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            idinfo = google_id_token.verify_oauth2_token(
                id_token_str,
                google_requests.Request(),
                client_id,
            )
        except ValueError as e:
            return Response({'detail': f'Google token غير صالح: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        provider_user_id = idinfo['sub']
        email = idinfo.get('email', '')
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')

        user, _ = _get_or_create_social_user('google', provider_user_id, email, first_name, last_name)

        if not user.is_active:
            return Response({'detail': 'هذا الحساب معطل.'}, status=status.HTTP_403_FORBIDDEN)

        tokens = _jwt_for_user(user)
        return Response({
            'detail': 'Login successful.',
            **tokens,
            'user': _user_data(user),
        }, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# 1.5 Apple Sign-In
# ---------------------------------------------------------------------------

class AppleSignInAPIView(APIView):
    """
    POST /api/users/auth/apple/
    Body: { "id_token": "...", "first_name": "...", "last_name": "..." }

    Verifies the Apple identity token against Apple's public keys,
    then finds or creates the user.
    """
    permission_classes = [AllowAny]
    APPLE_KEYS_URL = 'https://appleid.apple.com/auth/keys'

    def _get_apple_public_key(self, kid, alg):
        """Fetch Apple JWKS and find the matching public key."""
        resp = requests.get(self.APPLE_KEYS_URL, timeout=10)
        resp.raise_for_status()
        keys = resp.json().get('keys', [])

        for key_data in keys:
            if key_data.get('kid') == kid:
                # Reconstruct RSA public key from n and e
                def _b64_to_int(b64_str):
                    # Add padding if needed
                    padded = b64_str + '=' * (4 - len(b64_str) % 4)
                    return int.from_bytes(base64.urlsafe_b64decode(padded), 'big')

                n = _b64_to_int(key_data['n'])
                e = _b64_to_int(key_data['e'])
                pub_key = RSAPublicNumbers(e, n).public_key(default_backend())
                return pub_key
        return None

    def post(self, request):
        id_token_str = request.data.get('id_token', '').strip()
        first_name = request.data.get('first_name', '').strip()
        last_name = request.data.get('last_name', '').strip()

        if not id_token_str:
            return Response({'detail': 'id_token مطلوب.'}, status=status.HTTP_400_BAD_REQUEST)

        # Decode header to get kid + alg (without verification first)
        try:
            header = pyjwt.get_unverified_header(id_token_str)
        except pyjwt.exceptions.DecodeError:
            return Response({'detail': 'Apple token غير صالح.'}, status=status.HTTP_400_BAD_REQUEST)

        kid = header.get('kid')
        alg = header.get('alg', 'RS256')

        # Fetch matching Apple public key
        try:
            public_key = self._get_apple_public_key(kid, alg)
        except Exception:
            return Response({'detail': 'تعذّر الاتصال بخوادم Apple. حاول مرة أخرى.'}, status=status.HTTP_502_BAD_GATEWAY)

        if public_key is None:
            return Response({'detail': 'Apple identity token has expired or is invalid.'}, status=status.HTTP_400_BAD_REQUEST)

        bundle_id = settings.APPLE_APP_BUNDLE_ID
        try:
            payload = pyjwt.decode(
                id_token_str,
                public_key,
                algorithms=[alg],
                audience=bundle_id,
                issuer='https://appleid.apple.com',
            )
        except pyjwt.exceptions.ExpiredSignatureError:
            return Response({'detail': 'Apple identity token has expired.'}, status=status.HTTP_400_BAD_REQUEST)
        except pyjwt.exceptions.InvalidAudienceError:
            return Response({'detail': 'Apple token audience mismatch.'}, status=status.HTTP_400_BAD_REQUEST)
        except pyjwt.exceptions.PyJWTError as e:
            return Response({'detail': f'Apple token غير صالح: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        provider_user_id = payload['sub']
        email = payload.get('email', '')

        user, _ = _get_or_create_social_user('apple', provider_user_id, email, first_name, last_name)

        if not user.is_active:
            return Response({'detail': 'هذا الحساب معطل.'}, status=status.HTTP_403_FORBIDDEN)

        tokens = _jwt_for_user(user)
        return Response({
            'detail': 'Login successful.',
            **tokens,
            'user': _user_data(user),
        }, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# 1.6 Logout (blacklist refresh token)
# ---------------------------------------------------------------------------

class LogoutAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh', '')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except (TokenError, Exception):
                pass  # Already invalid/blacklisted — still return success
        return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_205_RESET_CONTENT)


# ---------------------------------------------------------------------------
# 1.7 Forgot Password (send OTP via email)
# ---------------------------------------------------------------------------

class ForgotPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        if not email:
            return Response({'detail': 'البريد الإلكتروني مطلوب.'}, status=status.HTTP_400_BAD_REQUEST)

        # Always return 200 regardless of whether the email exists (security best practice)
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {'detail': 'إذا كان البريد الإلكتروني مسجلاً، سيصله رمز التحقق.'},
                status=status.HTTP_200_OK,
            )

        # Invalidate any previous OTPs for this email
        PasswordResetOTP.objects.filter(email=email, is_used=False).update(is_used=True)

        # Generate and save new OTP
        otp = PasswordResetOTP.generate_otp()
        PasswordResetOTP.objects.create(email=email, otp=otp)

        # Send email
        try:
            send_mail(
                subject='رمز إعادة تعيين كلمة المرور — Deutsch Welt',
                message=(
                    f'مرحباً {user.first_name or ""}،\n\n'
                    f'رمز التحقق الخاص بك هو: {otp}\n\n'
                    f'الرمز صالح لمدة 10 دقائق فقط.\n\n'
                    f'إذا لم تطلب إعادة تعيين كلمة المرور، تجاهل هذه الرسالة.\n\n'
                    f'فريق Deutsch Welt مع الأستاذ خالد'
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception:
            # Log error in production; don't expose details to client
            pass

        return Response(
            {'detail': 'إذا كان البريد الإلكتروني مسجلاً، سيصله رمز التحقق.'},
            status=status.HTTP_200_OK,
        )


# ---------------------------------------------------------------------------
# 1.8 Reset Password (verify OTP + set new password)
# ---------------------------------------------------------------------------

class ResetPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        otp = request.data.get('otp', '').strip()
        new_password = request.data.get('new_password', '').strip()

        if not email or not otp or not new_password:
            return Response(
                {'detail': 'البريد الإلكتروني، رمز التحقق، وكلمة المرور الجديدة مطلوبة.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 8:
            return Response(
                {'new_password': ['يجب أن تكون كلمة المرور 8 أحرف على الأقل.']},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Find the most recent valid OTP
        try:
            otp_obj = PasswordResetOTP.objects.filter(
                email=email, otp=otp, is_used=False
            ).latest('created_at')
        except PasswordResetOTP.DoesNotExist:
            return Response({'detail': 'رمز التحقق غير صحيح.'}, status=status.HTTP_400_BAD_REQUEST)

        if not otp_obj.is_valid():
            return Response({'detail': 'رمز التحقق منتهي الصلاحية. اطلب رمزاً جديداً.'}, status=status.HTTP_400_BAD_REQUEST)

        # Mark OTP as used
        otp_obj.is_used = True
        otp_obj.save(update_fields=['is_used'])

        # Update user password
        try:
            user = User.objects.get(email__iexact=email)
            user.set_password(new_password)
            user.save(update_fields=['password'])
        except User.DoesNotExist:
            return Response({'detail': 'الحساب غير موجود.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'detail': 'تم إعادة تعيين كلمة المرور بنجاح.'}, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# 2.1 Get / Update Profile
# ---------------------------------------------------------------------------

class UserProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile_photo = None
        if hasattr(user, 'profile') and user.profile.profile_photo:
            profile_photo = request.build_absolute_uri(user.profile.profile_photo.url)

        return Response({
            'detail': 'Profile retrieved successfully.',
            'user': {
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone_number': getattr(user, 'phone_number', None),
                'profile_photo': profile_photo,
            },
        })

    def put(self, request):
        user = request.user
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        phone_number = request.data.get('phone_number')

        update_fields = []
        if first_name is not None:
            user.first_name = first_name.strip()
            update_fields.append('first_name')
        if last_name is not None:
            user.last_name = last_name.strip()
            update_fields.append('last_name')
        if phone_number is not None and hasattr(user, 'phone_number'):
            if len(phone_number) != 11:
                return Response({'phone_number': ['يجب أن يكون رقم الهاتف 11 رقماً.']}, status=status.HTTP_400_BAD_REQUEST)
            user.phone_number = phone_number
            update_fields.append('phone_number')

        if update_fields:
            user.save(update_fields=update_fields)

        return Response({
            'detail': 'Profile updated successfully.',
            'user': {
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone_number': getattr(user, 'phone_number', None),
                'profile_photo': None,
            },
        })


# ---------------------------------------------------------------------------
# 2.3 Change Password
# ---------------------------------------------------------------------------

class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password', '').strip()
        new_password = request.data.get('new_password', '').strip()

        if not new_password or len(new_password) < 8:
            return Response(
                {'new_password': ['يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل.']},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # If user has a password, verify old one
        if user.has_usable_password() and old_password:
            if not user.check_password(old_password):
                return Response({'old_password': ['كلمة المرور الحالية غير صحيحة.']}, status=status.HTTP_400_BAD_REQUEST)
        elif user.has_usable_password() and not old_password:
            return Response({'old_password': ['كلمة المرور الحالية مطلوبة.']}, status=status.HTTP_400_BAD_REQUEST)
        # Social users with no usable password can set one without old_password

        user.set_password(new_password)
        user.save(update_fields=['password'])
        return Response({'detail': 'تم تحديث كلمة المرور بنجاح.'}, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Admin: User Groups
# ---------------------------------------------------------------------------

class AdminUserGroupsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({'detail': 'غير مصرح.'}, status=status.HTTP_403_FORBIDDEN)

        from django.contrib.auth.models import Group
        try:
            target_user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'detail': 'المستخدم غير موجود.'}, status=status.HTTP_404_NOT_FOUND)

        group_names = request.data.get('groups', [])
        groups = []
        for name in group_names:
            group, _ = Group.objects.get_or_create(name=name)
            groups.append(group)

        target_user.groups.set(groups)
        return Response({
            'detail': f'User {target_user.email} successfully assigned to groups: {", ".join(group_names)}.'
        })
