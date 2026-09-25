from django.contrib import admin
from .models import Course, StudentRegistration, Book, BookOrder, PlacementQuizSubmission

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('level', 'title', 'price', 'status', 'featured', 'created_at')
    list_filter = ('level', 'category', 'status', 'featured')
    search_fields = ('title', 'subtitle', 'syllabus')
    ordering = ('id',)

@admin.register(StudentRegistration)
class StudentRegistrationAdmin(admin.ModelAdmin):
    list_display = ('registration_code', 'student_name', 'phone', 'course', 'payment_method', 'status', 'registered_at')
    list_filter = ('status', 'payment_method', 'course')
    search_fields = ('registration_code', 'student_name', 'phone', 'email')
    list_editable = ('status',)

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('level', 'title', 'price', 'pages_count', 'in_stock')
    list_filter = ('level', 'in_stock')

@admin.register(BookOrder)
class BookOrderAdmin(admin.ModelAdmin):
    list_display = ('order_code', 'buyer_name', 'phone', 'book', 'quantity', 'total_price', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('order_code', 'buyer_name', 'phone', 'address')
    list_editable = ('status',)

@admin.register(PlacementQuizSubmission)
class PlacementQuizSubmissionAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'phone', 'score_percentage', 'recommended_level', 'created_at')
    list_filter = ('recommended_level',)
