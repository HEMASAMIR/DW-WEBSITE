import datetime
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class VideoCommentsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, level_id, video_id):
        results = [
            {
                "id": 1,
                "user": {
                    "id": 5,
                    "first_name": "أحمد",
                    "last_name": "م.",
                    "profile_photo": None
                },
                "content": "شرح رائع جداً ومبسط يا هير خالد، النطق الألماني أصبح أوضح بكثير!",
                "created_at": "2026-07-18T10:30:00Z",
                "updated_at": "2026-07-18T10:30:00Z",
                "is_owner": False,
                "reply_count": 1,
                "replies": [
                    {
                        "id": 101,
                        "user": {
                            "id": 1,
                            "first_name": "هير خالد",
                            "last_name": "الحلواني",
                            "profile_photo": None
                        },
                        "content": "بالتوفيق يا أحمد، تدرب على مخارج الحروف يومياً وستصل للطلاقة بإذن الله.",
                        "created_at": "2026-07-18T11:00:00Z",
                        "updated_at": "2026-07-18T11:00:00Z",
                        "is_owner": False
                    }
                ]
            }
        ]
        return Response({
            "count": len(results),
            "next": None,
            "previous": None,
            "results": results
        })

    def post(self, request, level_id, video_id):
        content = request.data.get('content', '').strip()
        if not content:
            return Response({'detail': 'محتوى التعليق مطلوب.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "id": int(datetime.datetime.now().timestamp()),
            "user": {
                "id": request.user.id if request.user.is_authenticated else 99,
                "first_name": request.user.first_name if request.user.is_authenticated else "طالب",
                "last_name": "م.",
                "profile_photo": None
            },
            "content": content,
            "created_at": datetime.datetime.now().isoformat(),
            "updated_at": datetime.datetime.now().isoformat(),
            "is_owner": True,
            "reply_count": 0,
            "replies": []
        }, status=status.HTTP_201_CREATED)


class VideoCommentReplyAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, level_id, video_id, comment_id):
        content = request.data.get('content', '').strip()
        return Response({
            "id": int(datetime.datetime.now().timestamp()),
            "user": {
                "id": request.user.id if request.user.is_authenticated else 99,
                "first_name": request.user.first_name if request.user.is_authenticated else "طالب",
                "last_name": "م.",
                "profile_photo": None
            },
            "content": content,
            "created_at": datetime.datetime.now().isoformat(),
            "updated_at": datetime.datetime.now().isoformat(),
            "is_owner": True
        }, status=status.HTTP_201_CREATED)


class VideoCommentDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def put(self, request, level_id, video_id, comment_id):
        return Response({
            "id": comment_id,
            "content": request.data.get('content', ''),
            "updated_at": datetime.datetime.now().isoformat()
        })

    def delete(self, request, level_id, video_id, comment_id):
        return Response({"detail": "Comment deleted."}, status=status.HTTP_200_OK)
