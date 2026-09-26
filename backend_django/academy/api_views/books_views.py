"""
Deutsche Welt — Books API Views (Student)
==========================================
Production implementation using DigitalBook and BookAccess models.
"""

from django.http import FileResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from academy.models import DigitalBook, BookAccess


def _user_has_book_access(user, book: DigitalBook) -> bool:
    if not user or not user.is_authenticated:
        return False
    if user.is_staff or user.is_superuser:
        return True
    return BookAccess.objects.filter(user=user, book=book, is_active=True).exists()


class BooksListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        books = DigitalBook.objects.filter(is_active=True).order_by('level', 'name')
        grouped = {}
        for book in books:
            level_key = book.level
            if level_key not in grouped:
                grouped[level_key] = []
            grouped[level_key].append({
                'id': book.id,
                'name': book.name,
                'level': book.level,
                'price': str(book.price),
                'is_active': book.is_active,
                'has_access': _user_has_book_access(request.user, book),
            })
        return Response(grouped, status=status.HTTP_200_OK)


class BookDownloadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, book_id):
        try:
            book = DigitalBook.objects.get(pk=book_id, is_active=True)
        except DigitalBook.DoesNotExist:
            return Response({'detail': 'الكتاب غير موجود.'}, status=status.HTTP_404_NOT_FOUND)

        if not _user_has_book_access(request.user, book):
            return Response({'detail': 'ليس لديك صلاحية تحميل هذا الكتاب.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            return FileResponse(
                book.file.open('rb'),
                content_type='application/pdf',
                as_attachment=True,
                filename=f"{book.name}.pdf",
            )
        except Exception:
            return Response({'detail': 'تعذّر فتح الملف. تواصل مع الدعم.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
