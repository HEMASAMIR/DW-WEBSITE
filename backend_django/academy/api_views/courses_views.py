"""
Deutsche Welt — Courses & Levels API Views
===========================================
Production implementation:
- CourseLevel data from DB
- LevelAccess check per user
- Videos fetched from Bunny Stream API with signed tokens
- 10-minute server-side cache
- CourseFiles served from DB + FileField
"""

import hashlib
import hmac
import time
import requests as http_requests
from functools import lru_cache
from django.conf import settings
from django.core.cache import cache
from django.http import FileResponse, HttpResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from academy.models import CourseLevel, LevelAccess, Video, CourseFile


# ---------------------------------------------------------------------------
# Bunny Stream helpers
# ---------------------------------------------------------------------------

BUNNY_CACHE_TTL = 600  # 10 minutes (seconds)
BUNNY_SIGNED_URL_TTL = 4 * 3600  # 4 hours


def _bunny_signed_token(video_id: str) -> tuple[str, int]:
    """
    Generate a Bunny Stream signed URL token.
    Returns (token_string, expires_timestamp).

    Token formula (Bunny docs):
    token = sha256( TOKEN_AUTH_KEY + video_id + expires )
    """
    token_key = settings.BUNNY_TOKEN_AUTH_KEY
    expires = int(time.time()) + BUNNY_SIGNED_URL_TTL

    if not token_key:
        return ('', expires)

    raw = f"{token_key}{video_id}{expires}"
    token_hash = hashlib.sha256(raw.encode()).digest()
    # Bunny expects base64-url-safe without padding, then specific replacements
    import base64
    token_b64 = base64.b64encode(token_hash).decode()
    token_b64 = token_b64.replace('+', '-').replace('/', '_').replace('=', '')
    return (token_b64, expires)


def _bunny_embed_url(video_id: str) -> str:
    """Build the Bunny Stream embed URL with a signed token."""
    library_id = settings.BUNNY_LIBRARY_ID
    token, expires = _bunny_signed_token(video_id)

    base = f"https://iframe.mediadelivery.net/embed/{library_id}/{video_id}"
    if token:
        return f"{base}?token={token}&expires={expires}"
    return base


def _bunny_thumbnail_url(video_id: str) -> str:
    """Build the Bunny CDN thumbnail URL."""
    cdn = settings.BUNNY_STREAM_CDN_HOSTNAME
    if cdn:
        return f"https://{cdn}/{video_id}/thumbnail.jpg"
    library_id = settings.BUNNY_LIBRARY_ID
    return f"https://vz-{library_id}.b-cdn.net/{video_id}/thumbnail.jpg"


def _fetch_bunny_collection_videos(collection_id: str) -> list[dict]:
    """
    Fetch all videos from a Bunny Stream collection via the Bunny API.
    Returns a list of video dicts.
    Cached for BUNNY_CACHE_TTL seconds.
    """
    cache_key = f"bunny_collection_{collection_id}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    api_key = settings.BUNNY_API_KEY
    library_id = settings.BUNNY_LIBRARY_ID

    if not api_key or not library_id:
        return []

    url = f"https://video.bunnycdn.com/library/{library_id}/videos"
    params = {
        'collectionId': collection_id,
        'orderBy': 'date',
        'itemsPerPage': 200,
        'page': 1,
    }
    headers = {
        'AccessKey': api_key,
        'accept': 'application/json',
    }

    try:
        resp = http_requests.get(url, params=params, headers=headers, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        videos = data.get('items', [])
        cache.set(cache_key, videos, BUNNY_CACHE_TTL)
        return videos
    except Exception:
        return []


def _serialize_video(video_db: Video) -> dict:
    """
    Serialize a DB Video record with fresh Bunny signed URLs.
    """
    return {
        'id': video_db.bunny_video_id,
        'title': video_db.title,
        'length': video_db.length,
        'thumbnail_url': _bunny_thumbnail_url(video_db.bunny_video_id),
        'embed_url': _bunny_embed_url(video_db.bunny_video_id),
        'order': video_db.order,
    }


def _serialize_file(f: CourseFile) -> dict:
    return {
        'id': f.id,
        'name': f.name,
        'is_active': f.is_active,
        'created_at': f.created_at.isoformat(),
    }


def _user_has_level_access(user, level: CourseLevel) -> bool:
    """Return True if user is allowed to access this level's content."""
    if not user or not user.is_authenticated:
        return False
    if user.is_staff or user.is_superuser:
        return True
    return LevelAccess.objects.filter(user=user, level=level, is_active=True).exists()


# ---------------------------------------------------------------------------
# 3.1 List All Levels
# ---------------------------------------------------------------------------

class CourseLevelsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        levels = CourseLevel.objects.filter(is_active=True).order_by('order')
        data = []
        for lvl in levels:
            has_access = _user_has_level_access(request.user, lvl)
            entry = {
                'id': lvl.id,
                'name': lvl.name,
                'title': lvl.title,
                'description': lvl.description,
                'price': str(lvl.price),
                'order': lvl.order,
                'has_access': has_access,
            }
            if lvl.old_price:
                entry['old_price'] = str(lvl.old_price)
            else:
                entry['old_price'] = None
            data.append(entry)
        return Response(data, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# 3.2 Get Level Videos
# ---------------------------------------------------------------------------

class LevelVideosAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, level_id):
        try:
            level = CourseLevel.objects.get(pk=level_id, is_active=True)
        except CourseLevel.DoesNotExist:
            return Response({'detail': 'المستوى غير موجود.'}, status=status.HTTP_404_NOT_FOUND)

        if not _user_has_level_access(request.user, level):
            return Response({'detail': 'ليس لديك صلاحية الوصول لهذا المستوى.'}, status=status.HTTP_403_FORBIDDEN)

        # Fetch videos from DB (already ordered)
        videos_qs = Video.objects.filter(level=level, is_active=True).order_by('order')
        videos_data = [_serialize_video(v) for v in videos_qs]

        # Fetch course files from DB
        files_qs = CourseFile.objects.filter(level=level, is_active=True).order_by('created_at')
        files_data = [_serialize_file(f) for f in files_qs]

        return Response({
            'level': {
                'id': level.id,
                'name': level.name,
                'title': level.title,
                'description': level.description,
                'price': str(level.price),
                'old_price': str(level.old_price) if level.old_price else None,
                'order': level.order,
                'has_access': True,
            },
            'videos': videos_data,
            'files': files_data,
        }, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Course File Download
# ---------------------------------------------------------------------------

class CourseFileDownloadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, level_id, file_id):
        try:
            level = CourseLevel.objects.get(pk=level_id, is_active=True)
        except CourseLevel.DoesNotExist:
            return Response({'detail': 'المستوى غير موجود.'}, status=status.HTTP_404_NOT_FOUND)

        if not _user_has_level_access(request.user, level):
            return Response({'detail': 'ليس لديك صلاحية الوصول لهذا الملف.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            course_file = CourseFile.objects.get(pk=file_id, level=level, is_active=True)
        except CourseFile.DoesNotExist:
            return Response({'detail': 'الملف غير موجود.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            return FileResponse(
                course_file.file.open('rb'),
                content_type='application/pdf',
                as_attachment=True,
                filename=f"{course_file.name}.pdf",
            )
        except Exception:
            return Response({'detail': 'تعذّر فتح الملف. تواصل مع الدعم.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
