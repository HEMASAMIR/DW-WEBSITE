from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.http import FileResponse
import os

PROJECT_ROOT = settings.BASE_DIR.parent

def index_view(request):
    return FileResponse(open(os.path.join(PROJECT_ROOT, 'index.html'), 'rb'), content_type='text/html')

urlpatterns = [
    path('', index_view, name='index'),
    path('admin/', admin.site.urls),
    path('', include('academy.urls')),
    re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': os.path.join(PROJECT_ROOT, 'assets')}),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

