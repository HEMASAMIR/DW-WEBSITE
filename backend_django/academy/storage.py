"""
Protected file storage for paid content (digital books, course files).

Files live in PROTECTED_MEDIA_ROOT — outside MEDIA_ROOT — so nginx / Django static serving never
exposes them. They have NO public URL: the only way to read one is through an API view that has
already checked the user's access, via `protected_file_response()`.

Production (nginx): set PROTECTED_MEDIA_USE_X_ACCEL=True and add an `internal` location, e.g.

    location /_protected/ {
        internal;                               # unreachable from outside
        alias /home/<user>/<project>/protected_media/;
    }

Django then only authorizes the request and nginx streams the file (fast, supports Range).
"""

import mimetypes
import os
from urllib.parse import quote

from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.http import FileResponse, HttpResponse
from django.utils.functional import LazyObject


class ProtectedFileSystemStorage(FileSystemStorage):
    def __init__(self, **kwargs):
        kwargs.setdefault('location', settings.PROTECTED_MEDIA_ROOT)
        kwargs['base_url'] = None
        super().__init__(**kwargs)

    def url(self, name):
        # Never hand out a direct link. Serve through an access-checked view instead.
        raise ValueError('Protected files have no public URL; serve them through an API view.')


class _LazyProtectedStorage(LazyObject):
    def _setup(self):
        self._wrapped = ProtectedFileSystemStorage()


protected_storage = _LazyProtectedStorage()


def get_protected_storage():
    """Callable used by model FileFields (keeps migrations independent of settings)."""
    return protected_storage


def protected_file_response(field_file, download_name, inline=True):
    """
    Stream a protected FieldFile to an already-authorized user.
    `download_name` is the name the browser shows; the real extension is always kept.
    """
    stored_name = field_file.name
    ext = os.path.splitext(stored_name)[1].lower()
    base = os.path.splitext(download_name)[0] or 'file'
    filename = f'{base}{ext}'
    content_type = mimetypes.guess_type(filename)[0] or 'application/octet-stream'

    disposition = 'inline' if inline else 'attachment'
    ascii_name = filename.encode('ascii', 'ignore').decode() or f'file{ext}'
    content_disposition = f"{disposition}; filename=\"{ascii_name}\"; filename*=UTF-8''{quote(filename)}"

    if getattr(settings, 'PROTECTED_MEDIA_USE_X_ACCEL', False):
        response = HttpResponse(content_type=content_type)
        prefix = settings.PROTECTED_MEDIA_X_ACCEL_PREFIX.rstrip('/')
        response['X-Accel-Redirect'] = quote(f'{prefix}/{stored_name}')
    else:
        response = FileResponse(field_file.open('rb'), content_type=content_type)

    response['Content-Disposition'] = content_disposition
    response['Cache-Control'] = 'private, no-store'
    response['X-Content-Type-Options'] = 'nosniff'
    return response
