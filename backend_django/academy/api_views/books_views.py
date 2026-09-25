from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.http import HttpResponse

class BooksListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            "A1": [
                {
                    "id": 1,
                    "name": "كتاب دويتشه فيلت الشامل A1 (مطبوع + صوتيات)",
                    "level": "A1",
                    "price": "500.00",
                    "is_active": True,
                    "has_access": True
                }
            ],
            "A2": [
                {
                    "id": 2,
                    "name": "كتاب منهج دويتشه فيلت A2 (قواعد وتمارين)",
                    "level": "A2",
                    "price": "500.00",
                    "is_active": True,
                    "has_access": False
                }
            ],
            "B1": [
                {
                    "id": 3,
                    "name": "كتاب الإعداد لامتحانات جوته وتيلك B1",
                    "level": "B1",
                    "price": "500.00",
                    "is_active": True,
                    "has_access": False
                }
            ]
        })


class BookDownloadAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, book_id):
        content = b"%PDF-1.4 Mock German Book PDF File"
        response = HttpResponse(content, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="DeutscheWelt_Book_{book_id}.pdf"'
        return response
