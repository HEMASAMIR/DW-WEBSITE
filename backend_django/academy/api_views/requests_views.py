"""
Deutsche Welt — Access Requests (Student)
=========================================
A logged-in student asks to unlock a course level or a digital book from the site.
The request waits in the admin dashboard; approving it grants access immediately.

- POST /api/requests/        create a request (multipart: kind, item_id, full_name, phone, payment_method, note, receipt?)
- GET  /api/requests/mine/   the student's own requests (never anyone else's)
"""

import os

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from academy.models import AccessRequest, CourseLevel, DigitalBook, LevelAccess, BookAccess

MAX_RECEIPT_BYTES = 8 * 1024 * 1024
RECEIPT_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.heic', '.pdf'}


def serialize_own_request(req):
    """Fields a student may see about their own request."""
    return {
        'id': req.id,
        'kind': req.kind,
        'item_id': req.level_id if req.kind == AccessRequest.KIND_LEVEL else req.book_id,
        'item_name': req.item_name,
        'level_code': req.level_code,
        'amount': str(req.amount),
        'payment_method': req.payment_method,
        'status': req.status,
        'admin_note': req.admin_note if req.status == 'rejected' else '',
        'created_at': req.created_at.isoformat(),
        'reviewed_at': req.reviewed_at.isoformat() if req.reviewed_at else None,
    }


class AccessRequestCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        kind = str(data.get('kind', '')).strip()
        item_id = data.get('item_id')
        full_name = str(data.get('full_name', '')).strip()
        phone = ''.join(ch for ch in str(data.get('phone', '')) if ch.isdigit())

        if kind not in (AccessRequest.KIND_LEVEL, AccessRequest.KIND_BOOK):
            return Response({'detail': 'نوع الطلب غير صحيح.'}, status=status.HTTP_400_BAD_REQUEST)
        if not full_name:
            return Response({'full_name': ['الاسم مطلوب.']}, status=status.HTTP_400_BAD_REQUEST)
        if len(phone) != 11:
            return Response({'phone': ['رقم الهاتف يجب أن يكون 11 رقماً.']}, status=status.HTTP_400_BAD_REQUEST)

        receipt = request.FILES.get('receipt')
        if receipt:
            ext = os.path.splitext(receipt.name)[1].lower()
            if ext not in RECEIPT_EXTENSIONS:
                return Response({'receipt': ['صورة التحويل يجب أن تكون صورة أو PDF.']}, status=status.HTTP_400_BAD_REQUEST)
            if receipt.size > MAX_RECEIPT_BYTES:
                return Response({'receipt': ['حجم صورة التحويل أكبر من 8 ميجا.']}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        fields = {}
        if kind == AccessRequest.KIND_LEVEL:
            try:
                level = CourseLevel.objects.get(pk=item_id, is_active=True)
            except (CourseLevel.DoesNotExist, ValueError, TypeError):
                return Response({'detail': 'المستوى غير موجود.'}, status=status.HTTP_404_NOT_FOUND)
            if LevelAccess.objects.filter(user=user, level=level, is_active=True).exists():
                return Response({'detail': 'المستوى مفعّل على حسابك بالفعل.'}, status=status.HTTP_400_BAD_REQUEST)
            fields = {'level': level, 'level_code': level.name, 'amount': level.price}
            pending = AccessRequest.objects.filter(user=user, kind=kind, level=level, status='pending')
        else:
            try:
                book = DigitalBook.objects.get(pk=item_id, is_active=True)
            except (DigitalBook.DoesNotExist, ValueError, TypeError):
                return Response({'detail': 'الكتاب غير موجود.'}, status=status.HTTP_404_NOT_FOUND)
            if BookAccess.objects.filter(user=user, book=book, is_active=True).exists():
                return Response({'detail': 'الكتاب مفعّل على حسابك بالفعل.'}, status=status.HTTP_400_BAD_REQUEST)
            fields = {'book': book, 'level_code': book.level, 'amount': book.price}
            pending = AccessRequest.objects.filter(user=user, kind=kind, book=book, status='pending')

        if pending.exists():
            return Response({'detail': 'عندك طلب لنفس العنصر قيد المراجعة بالفعل، هيتم تفعيله أول ما الإدارة تراجعه.'},
                            status=status.HTTP_400_BAD_REQUEST)

        req = AccessRequest.objects.create(
            user=user,
            kind=kind,
            full_name=full_name[:255],
            phone=phone,
            payment_method=str(data.get('payment_method', '')).strip()[:50],
            note=str(data.get('note', '')).strip()[:2000],
            receipt=receipt or '',
            **fields,
        )
        return Response(serialize_own_request(req), status=status.HTTP_201_CREATED)


class MyAccessRequestsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = AccessRequest.objects.filter(user=request.user).select_related('level', 'book')[:50]
        return Response([serialize_own_request(r) for r in qs])
