from django.contrib import admin
from .models import (
    AccessRequest,
    # New production models
    CourseLevel, LevelAccess, Video, CourseFile,
    DigitalBook, BookAccess,
    PasswordResetOTP, SocialAuthProfile, VideoComment,
    # Legacy models
    Course, StudentRegistration, Book, BookOrder, PlacementQuizSubmission,
)


# ---------------------------------------------------------------------------
# New Production Models
# ---------------------------------------------------------------------------

@admin.register(CourseLevel)
class CourseLevelAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'price', 'old_price', 'order', 'is_active', 'access_count')
    list_filter = ('is_active',)
    search_fields = ('name', 'title')
    ordering = ('order',)
    list_editable = ('order', 'is_active')

    def access_count(self, obj):
        return obj.user_accesses.filter(is_active=True).count()
    access_count.short_description = '# Subscribers'


class LevelAccessInline(admin.TabularInline):
    model = LevelAccess
    extra = 0
    readonly_fields = ('granted_at', 'granted_by')
    raw_id_fields = ('user',)


@admin.register(LevelAccess)
class LevelAccessAdmin(admin.ModelAdmin):
    list_display = ('user', 'level', 'is_active', 'granted_by', 'granted_at', 'notes')
    list_filter = ('is_active', 'level')
    search_fields = ('user__email', 'user__first_name', 'notes')
    raw_id_fields = ('user', 'granted_by')
    list_editable = ('is_active',)
    date_hierarchy = 'granted_at'


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('level', 'order', 'title', 'bunny_video_id', 'length_display', 'is_active')
    list_filter = ('level', 'is_active')
    search_fields = ('title', 'bunny_video_id')
    ordering = ('level', 'order')
    list_editable = ('order', 'is_active')

    def length_display(self, obj):
        mins = obj.length // 60
        secs = obj.length % 60
        return f"{mins:02d}:{secs:02d}"
    length_display.short_description = 'Duration'


@admin.register(CourseFile)
class CourseFileAdmin(admin.ModelAdmin):
    list_display = ('level', 'name', 'is_active', 'created_at')
    list_filter = ('level', 'is_active')
    search_fields = ('name',)
    list_editable = ('is_active',)


@admin.register(DigitalBook)
class DigitalBookAdmin(admin.ModelAdmin):
    list_display = ('name', 'level', 'price', 'is_active', 'access_count', 'created_at')
    list_filter = ('level', 'is_active')
    search_fields = ('name',)
    list_editable = ('is_active',)

    def access_count(self, obj):
        return obj.user_accesses.filter(is_active=True).count()
    access_count.short_description = '# Subscribers'


@admin.register(BookAccess)
class BookAccessAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'is_active', 'granted_at')
    list_filter = ('is_active', 'book')
    search_fields = ('user__email',)
    raw_id_fields = ('user', 'granted_by')
    list_editable = ('is_active',)


@admin.register(VideoComment)
class VideoCommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'level_id', 'video_id', 'content_preview', 'parent', 'created_at')
    list_filter = ('level_id',)
    search_fields = ('user__email', 'content')
    date_hierarchy = 'created_at'

    def content_preview(self, obj):
        return obj.content[:60] + '...' if len(obj.content) > 60 else obj.content
    content_preview.short_description = 'Content'


@admin.register(PasswordResetOTP)
class PasswordResetOTPAdmin(admin.ModelAdmin):
    list_display = ('email', 'otp', 'is_used', 'created_at')
    list_filter = ('is_used',)
    search_fields = ('email',)
    readonly_fields = ('otp', 'created_at')


@admin.register(SocialAuthProfile)
class SocialAuthProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'provider', 'provider_user_id', 'created_at')
    list_filter = ('provider',)
    search_fields = ('user__email', 'provider_user_id')


# ---------------------------------------------------------------------------
# Legacy Models
# ---------------------------------------------------------------------------

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


@admin.register(AccessRequest)
class AccessRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'phone', 'kind', 'level_code', 'amount', 'status', 'created_at')
    list_filter = ('status', 'kind', 'level_code')
    search_fields = ('full_name', 'phone')
