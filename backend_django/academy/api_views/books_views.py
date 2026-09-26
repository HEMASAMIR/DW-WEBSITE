"""
Deutsche Welt — Books API Views (Student)
==========================================
Production implementation using DigitalBook and BookAccess models.
Book files are in protected storage and only reachable through these access-checked views.
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from academy.models import DigitalBook, BookAccess
from academy.storage import protected_file_response


def _user_has_book_access(user, book: DigitalBook) -> bool:
    if not user or not user.is_authenticated:
        return False
    if user.is_staff or user.is_superuser or user.username == 'admin' or (hasattr(user, 'groups') and user.groups.filter(name='Admin').exists()):
        return True
    return BookAccess.objects.filter(user=user, book=book, is_active=True).exists()


def _serialize_book(book, user):
    # Never include the file or its URL — files are served only by BookFileAPIView.
    return {
        'id': book.id,
        'name': book.name,
        'level': book.level,
        'price': str(book.price),
        'is_active': book.is_active,
        'has_access': _user_has_book_access(user, book),
        'created_at': book.created_at.isoformat(),
    }


class BooksListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        books = DigitalBook.objects.filter(is_active=True).order_by('level', 'name')
        user = request.user if (request.user and request.user.is_authenticated) else None
        grouped = {}
        for book in books:
            grouped.setdefault(book.level, []).append(_serialize_book(book, user))
        return Response(grouped, status=status.HTTP_200_OK)


class BookDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, book_id):
        try:
            book = DigitalBook.objects.get(pk=book_id, is_active=True)
        except DigitalBook.DoesNotExist:
            return Response({'detail': 'الكتاب غير موجود.'}, status=status.HTTP_404_NOT_FOUND)
        user = request.user if (request.user and request.user.is_authenticated) else None
        return Response(_serialize_book(book, user))


class BookFileAPIView(APIView):
    """GET /api/books/<id>/view/ (inline) and /download/ (attachment). Requires book access."""
    permission_classes = [IsAuthenticated]
    inline = True

    def get(self, request, book_id):
        try:
            book = DigitalBook.objects.get(pk=book_id, is_active=True)
        except DigitalBook.DoesNotExist:
            return Response({'detail': 'الكتاب غير موجود.'}, status=status.HTTP_404_NOT_FOUND)

        if not _user_has_book_access(request.user, book):
            return Response({'detail': 'You do not have access to view this book.'}, status=status.HTTP_403_FORBIDDEN)

        if not book.file or not book.file.storage.exists(book.file.name):
            return Response({'detail': 'ملف الكتاب غير متوفر حالياً. تواصل مع الدعم.'}, status=status.HTTP_404_NOT_FOUND)

        return protected_file_response(book.file, book.name, inline=self.inline)


class BookViewAPIView(BookFileAPIView):
    inline = True


class BookDownloadAPIView(BookFileAPIView):
    inline = False
