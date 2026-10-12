from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

ADMIN_EXEMPT_EMAILS = {
    'khaled.nabil26@gmail.com',
    'admin@deutschwelt.com',
    'nwrhanmhmwdahmd1@gmail.com',
    '01055673184hs@gmail.com',
}

def is_admin_or_staff_user(user):
    if not user or not getattr(user, 'is_active', False):
        return False
    if getattr(user, 'is_staff', False) or getattr(user, 'is_superuser', False):
        return True
    if getattr(user, 'username', '') == 'admin':
        return True
    email = (getattr(user, 'email', '') or '').strip().lower()
    if email in ADMIN_EXEMPT_EMAILS:
        return True
    if hasattr(user, 'groups') and user.groups.filter(name='Admin').exists():
        return True
    return False


class SingleSessionJWTAuthentication(JWTAuthentication):
    """
    Enforces a single-active-device policy for students.
    Admins and staff are completely exempt and can use multiple devices concurrently.
    """
    def get_user(self, validated_token):
        user = super().get_user(validated_token)
        if not user or not user.is_active:
            return user

        # ── 1. Admins & Staff are completely exempt
        if is_admin_or_staff_user(user):
            return user

        # ── 2. For Students: verify session_id against active DB session
        token_session_id = validated_token.get('session_id')
        if not token_session_id:
            # Token issued prior to single-session activation or without session_id
            return user

        try:
            from academy.models import StudentActiveSession
            session = StudentActiveSession.objects.filter(user=user).first()
            if session and session.session_id and session.session_id != token_session_id:
                raise AuthenticationFailed(
                    {
                        'detail': 'SESSION_TERMINATED_ANOTHER_DEVICE',
                        'message': 'تم تسجيل الدخول إلى حسابك من جهاز آخر. تم إنهاء الجلسة على هذا الجهاز لحماية حسابك.'
                    },
                    code='session_terminated'
                )
        except AuthenticationFailed:
            raise
        except Exception:
            pass

        return user


class BearerTokenAuthentication(TokenAuthentication):
    """Accepts `Authorization: Bearer <token>` like the production JWT API."""
    keyword = 'Bearer'
