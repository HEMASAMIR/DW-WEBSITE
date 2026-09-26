from rest_framework.authentication import TokenAuthentication


class BearerTokenAuthentication(TokenAuthentication):
    """Accepts `Authorization: Bearer <token>` like the production JWT API."""
    keyword = 'Bearer'
