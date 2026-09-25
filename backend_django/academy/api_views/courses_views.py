from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.http import HttpResponse

class CourseLevelsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        levels = [
            {
                "id": 1,
                "name": "A1",
                "title": "A1 - Beginner German (Grundstufe)",
                "description": "Start your German journey from zero.",
                "price": "1200.00",
                "old_price": "1600.00",
                "order": 1,
                "has_access": True
            },
            {
                "id": 2,
                "name": "A2",
                "title": "A2 - Elementary German (Aufbaukurs)",
                "description": "Build on your basics and develop fluency.",
                "price": "1400.00",
                "old_price": "1850.00",
                "order": 2,
                "has_access": True if (request.user.is_authenticated and request.user.is_staff) else False
            },
            {
                "id": 3,
                "name": "B1",
                "title": "B1 - Intermediate German (Mittelstufe)",
                "description": "Reach conversational fluency and pass Goethe/Telc B1.",
                "price": "1800.00",
                "old_price": "2400.00",
                "order": 3,
                "has_access": True if (request.user.is_authenticated and request.user.is_staff) else False
            },
            {
                "id": 4,
                "name": "B2",
                "title": "B2 - Upper Intermediate German (Oberstufe & Medizin)",
                "description": "Master complex topics and prepare for call center and medical jobs.",
                "price": "2200.00",
                "old_price": "2900.00",
                "order": 4,
                "has_access": True if (request.user.is_authenticated and request.user.is_staff) else False
            }
        ]
        return Response(levels, status=status.HTTP_200_OK)


class LevelVideosAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, level_id):
        return Response({
            "level": {
                "id": level_id,
                "name": f"Level {level_id}",
                "title": f"كورس اللغة الألمانية - المستوى {level_id}",
                "description": "المحاضرات المباشرة وشرح المنهج الشامل مع هير خالد",
                "has_access": True
            },
            "videos": [
                {
                    "id": "vid-lesson-01",
                    "title": "المحاضرة 1: التأسيس الصوتي ومخارج الحروف الألمانية (Phonetik)",
                    "length": 1420,
                    "thumbnail_url": "/assets/images/herr_khaled_2.jpg",
                    "embed_url": "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0",
                    "order": 1
                },
                {
                    "id": "vid-lesson-02",
                    "title": "المحاضرة 2: تصريف الأفعال والضمائر وتكوين الجملة الأساسية",
                    "length": 1280,
                    "thumbnail_url": "/assets/images/logo.jpg",
                    "embed_url": "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0",
                    "order": 2
                }
            ],
            "files": [
                {
                    "id": 1,
                    "name": "مذكرة تدريبات وقواعد المحاضرة الأولى (ملف PDF)",
                    "is_active": True,
                    "created_at": "2026-08-01T12:00:00Z"
                }
            ]
        }, status=status.HTTP_200_OK)


class CourseFileDownloadAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, level_id, file_id):
        content = b"%PDF-1.4 Mock German Lesson Material PDF"
        response = HttpResponse(content, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="DeutscheWelt_Level_{level_id}_File_{file_id}.pdf"'
        return response
