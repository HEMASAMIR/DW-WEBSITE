from rest_framework import serializers
from .models import (
    Course, StudentRegistration, Book, BookOrder,
    PlacementQuizSubmission, AcademyStudent, LessonComment,
    LevelEnrollmentRequest, Branch
)

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class StudentRegistrationSerializer(serializers.ModelSerializer):
    course_title = serializers.SerializerMethodField()

    class Meta:
        model = StudentRegistration
        fields = '__all__'
        extra_kwargs = {
            'registration_code': {'required': False, 'allow_blank': True},
            'course': {'required': False, 'allow_null': True}
        }

    def get_course_title(self, obj):
        if obj.course:
            return obj.course.title
        return obj.course_title_cache or 'كورس دويتشه فيلت'

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class BookOrderSerializer(serializers.ModelSerializer):
    book_title = serializers.SerializerMethodField()

    class Meta:
        model = BookOrder
        fields = '__all__'
        extra_kwargs = {
            'order_code': {'required': False, 'allow_blank': True},
            'book': {'required': False, 'allow_null': True}
        }

    def get_book_title(self, obj):
        if obj.book:
            return obj.book.title
        return obj.book_name_cache or 'كتاب المنهج'

class PlacementQuizSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementQuizSubmission
        fields = '__all__'

class AcademyStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademyStudent
        fields = '__all__'

class LessonCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonComment
        fields = '__all__'

class LevelEnrollmentRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelEnrollmentRequest
        fields = '__all__'

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'
