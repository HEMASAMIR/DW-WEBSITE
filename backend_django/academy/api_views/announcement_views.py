"""
Deutsche Welt — Promotional Announcement API View
=================================================
Allows public clients to read the active site announcement banner,
and allows administrators to update the message, toggle visibility,
and manage discount badges.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from academy.models import SiteAnnouncement
from .admin_views import IsStaffUser


class AnnouncementAPIView(APIView):
    def get_permissions(self):
        # Anyone can read the banner; only admins can change it.
        return [AllowAny()] if self.request.method == 'GET' else [IsStaffUser()]

    def _get_or_create_announcement(self):
        announcement = SiteAnnouncement.objects.first()
        if not announcement:
            announcement = SiteAnnouncement.objects.create(
                is_active=True,
                tag='🔥 عرض خاص',
                title='خصم خاص 25% على باقة المستويات المجمعة',
                desc='التسجيل متاح الآن للدفعة الجديدة مع محاضرات تفاعلية وبنك أسئلة ومتابعة شخصية مستمرة.',
                has_discount=True,
                discount_percent='25%',
                cta_text='احجز مقعدك بالخصم',
                cta_link='/#online-courses'
            )
        return announcement

    def get(self, request):
        announcement = self._get_or_create_announcement()
        return Response({
            'is_active': announcement.is_active,
            'tag': announcement.tag,
            'title': announcement.title,
            'desc': announcement.desc,
            'has_discount': announcement.has_discount,
            'discount_percent': announcement.discount_percent,
            'cta_text': announcement.cta_text,
            'cta_link': announcement.cta_link,
            'updated_at': announcement.updated_at.isoformat(),
        }, status=status.HTTP_200_OK)

    def post(self, request):
        announcement = self._get_or_create_announcement()
        data = request.data

        if 'is_active' in data:
            val = data['is_active']
            announcement.is_active = val in (True, 'true', 'True', 1, '1')
        if 'tag' in data and data['tag']:
            announcement.tag = str(data['tag']).strip()
        if 'title' in data and data['title']:
            announcement.title = str(data['title']).strip()
        if 'desc' in data and data['desc']:
            announcement.desc = str(data['desc']).strip()
        if 'has_discount' in data:
            val = data['has_discount']
            announcement.has_discount = val in (True, 'true', 'True', 1, '1')
        if 'discount_percent' in data:
            announcement.discount_percent = str(data['discount_percent']).strip()
        if 'cta_text' in data and data['cta_text']:
            announcement.cta_text = str(data['cta_text']).strip()
        if 'cta_link' in data and data['cta_link']:
            announcement.cta_link = str(data['cta_link']).strip()

        announcement.save()

        return Response({
            'message': 'تم تحديث الإعلان الترويجي بنجاح',
            'is_active': announcement.is_active,
            'tag': announcement.tag,
            'title': announcement.title,
            'desc': announcement.desc,
            'has_discount': announcement.has_discount,
            'discount_percent': announcement.discount_percent,
            'cta_text': announcement.cta_text,
            'cta_link': announcement.cta_link,
            'updated_at': announcement.updated_at.isoformat(),
        }, status=status.HTTP_200_OK)
