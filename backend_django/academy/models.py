"""
Deutsche Welt Academy — Database Models
========================================
Full production models for:
- Course Levels (managed via Admin)
- Videos (synced from Bunny Stream)
- Level Access (per-user access control)
- Course Files (PDF attachments per level)
- Digital Books (PDF purchases)
- Book Access (per-user book access)
- OTP Tokens (Forgot Password)
- Social Auth Profiles (Google / Apple)
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import uuid
import random
import string

from academy.storage import get_protected_storage

User = get_user_model()


# ---------------------------------------------------------------------------
# Course Level & Access
# ---------------------------------------------------------------------------

class CourseLevel(models.Model):
    """
    Represents a German proficiency level (A1, A2, B1, B2).
    Managed via Django Admin or Admin API.
    """
    LEVEL_CHOICES = [
        ('A1', 'A1 - للمبتدئين من الصفر'),
        ('A2', 'A2 - المحادثة والتأسيس الثاني'),
        ('B1', 'B1 - مؤهل السفر والكول سنتر'),
        ('B2', 'B2 - الطلاقة والكفاءة التخصصية'),
    ]

    name = models.CharField(max_length=10, choices=LEVEL_CHOICES, unique=True, verbose_name="رمز المستوى")
    title = models.CharField(max_length=300, verbose_name="العنوان الكامل")
    description = models.TextField(verbose_name="الوصف")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="السعر")
    old_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="السعر القديم (للخصم)")
    order = models.PositiveSmallIntegerField(default=1, verbose_name="ترتيب العرض")
    is_active = models.BooleanField(default=True, verbose_name="مفعّل")

    # Bunny Stream Collection
    bunny_collection_id = models.CharField(max_length=255, blank=True, default='', verbose_name="معرف Collection في Bunny Stream")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "مستوى دراسي"
        verbose_name_plural = "المستويات الدراسية"
        ordering = ['order']

    def __str__(self):
        return f"{self.name} — {self.title}"


class LevelAccess(models.Model):
    """
    Grants a specific user access to a specific level.
    Created by admin after payment confirmation.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='level_accesses', verbose_name="الطالب")
    level = models.ForeignKey(CourseLevel, on_delete=models.CASCADE, related_name='user_accesses', verbose_name="المستوى")
    granted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='granted_accesses', verbose_name="منحه الوصول")
    granted_at = models.DateTimeField(auto_now_add=True, verbose_name="تاريخ المنح")
    is_active = models.BooleanField(default=True, verbose_name="نشط")
    notes = models.TextField(blank=True, default='', verbose_name="ملاحظات (طريقة الدفع، إلخ)")

    class Meta:
        unique_together = ('user', 'level')
        verbose_name = "صلاحية مستوى"
        verbose_name_plural = "صلاحيات الوصول للمستويات"
        ordering = ['-granted_at']

    def __str__(self):
        return f"{self.user.email} → {self.level.name}"


# ---------------------------------------------------------------------------
# Videos (Bunny Stream)
# ---------------------------------------------------------------------------

class Video(models.Model):
    """
    A video lesson stored in Bunny Stream.
    Synced via Admin API or manually via Django Admin.
    """
    level = models.ForeignKey(CourseLevel, on_delete=models.CASCADE, related_name='videos', verbose_name="المستوى")
    title = models.CharField(max_length=500, verbose_name="عنوان المحاضرة")
    bunny_video_id = models.CharField(max_length=255, unique=True, verbose_name="معرف الفيديو في Bunny Stream")
    length = models.PositiveIntegerField(default=0, verbose_name="المدة بالثواني")
    order = models.PositiveSmallIntegerField(default=1, verbose_name="ترتيب العرض")
    is_active = models.BooleanField(default=True, verbose_name="مفعّل")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "محاضرة فيديو"
        verbose_name_plural = "محاضرات الفيديو"
        ordering = ['level', 'order']
        unique_together = ('level', 'order')

    def __str__(self):
        return f"[{self.level.name}] {self.title}"


# ---------------------------------------------------------------------------
# Course Files (PDF attachments per level)
# ---------------------------------------------------------------------------

class CourseFile(models.Model):
    """
    A PDF file attached to a course level (e.g., notes, workbook, exam sample).
    Accessible only to users who have level access.
    """
    level = models.ForeignKey(CourseLevel, on_delete=models.CASCADE, related_name='files', verbose_name="المستوى")
    name = models.CharField(max_length=300, verbose_name="اسم الملف")
    file = models.FileField(upload_to='course_files/', storage=get_protected_storage, verbose_name="الملف")
    is_active = models.BooleanField(default=True, verbose_name="مفعّل")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "ملف المستوى"
        verbose_name_plural = "ملفات المستويات"
        ordering = ['level', 'created_at']

    def __str__(self):
        return f"[{self.level.name}] {self.name}"


# ---------------------------------------------------------------------------
# Digital Books
# ---------------------------------------------------------------------------

class DigitalBook(models.Model):
    """
    A purchasable PDF book (digital version, not physical shipping).
    """
    LEVEL_CHOICES = [('A1', 'A1'), ('A2', 'A2'), ('B1', 'B1'), ('B2', 'B2'), ('General', 'عام')]

    name = models.CharField(max_length=300, verbose_name="اسم الكتاب")
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES, verbose_name="المستوى")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="السعر")
    file = models.FileField(upload_to='digital_books/', storage=get_protected_storage, verbose_name="ملف PDF")
    is_active = models.BooleanField(default=True, verbose_name="متاح")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "كتاب رقمي"
        verbose_name_plural = "الكتب الرقمية"
        ordering = ['level', 'name']

    def __str__(self):
        return f"{self.name} ({self.level})"


class BookAccess(models.Model):
    """
    Grants a user access to download a specific digital book.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='book_accesses', verbose_name="الطالب")
    book = models.ForeignKey(DigitalBook, on_delete=models.CASCADE, related_name='user_accesses', verbose_name="الكتاب")
    granted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='granted_book_accesses', verbose_name="منحه الوصول")
    granted_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('user', 'book')
        verbose_name = "صلاحية كتاب"
        verbose_name_plural = "صلاحيات الكتب"

    def __str__(self):
        return f"{self.user.email} → {self.book.name}"


# ---------------------------------------------------------------------------
# OTP — Forgot Password
# ---------------------------------------------------------------------------

class PasswordResetOTP(models.Model):
    """
    A 6-digit OTP for the Forgot Password flow.
    Expires after 10 minutes.
    """
    email = models.EmailField(verbose_name="البريد الإلكتروني")
    otp = models.CharField(max_length=6, verbose_name="رمز التحقق")
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        verbose_name = "رمز إعادة تعيين كلمة المرور"
        verbose_name_plural = "رموز إعادة تعيين كلمة المرور"
        ordering = ['-created_at']

    def is_valid(self):
        """Returns True if OTP is unused and not older than 10 minutes."""
        expiry = self.created_at + timedelta(minutes=10)
        return not self.is_used and timezone.now() < expiry

    @staticmethod
    def generate_otp():
        return ''.join(random.choices(string.digits, k=6))

    def __str__(self):
        return f"{self.email} — {self.otp} ({'used' if self.is_used else 'valid'})"


# ---------------------------------------------------------------------------
# Social Auth Profile
# ---------------------------------------------------------------------------

class SocialAuthProfile(models.Model):
    """
    Links a Django User to a third-party auth provider (Google / Apple).
    """
    PROVIDER_CHOICES = [('google', 'Google'), ('apple', 'Apple')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_profiles')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    provider_user_id = models.CharField(max_length=255)  # Google sub / Apple sub
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('provider', 'provider_user_id')
        verbose_name = "حساب اجتماعي مرتبط"
        verbose_name_plural = "الحسابات الاجتماعية المرتبطة"

    def __str__(self):
        return f"{self.user.email} — {self.provider}"


# ---------------------------------------------------------------------------
# Video Comments & Replies
# ---------------------------------------------------------------------------

class VideoComment(models.Model):
    """
    A comment (or reply) on a specific video lesson.
    Replies have a non-null `parent` FK pointing to the top-level comment.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='video_comments')
    level_id = models.IntegerField(db_index=True, verbose_name="معرف المستوى")
    video_id = models.CharField(max_length=255, db_index=True, verbose_name="معرف الفيديو (Bunny)")
    parent = models.ForeignKey(
        'self', on_delete=models.CASCADE, null=True, blank=True,
        related_name='replies', verbose_name="تعليق أصلي (للردود)"
    )
    content = models.TextField(max_length=2000, verbose_name="محتوى التعليق")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "تعليق فيديو"
        verbose_name_plural = "تعليقات الفيديوهات"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['level_id', 'video_id']),
        ]

    def __str__(self):
        return f"{self.user.email}: {self.content[:40]}"


# ---------------------------------------------------------------------------
# Legacy models (kept for backward compatibility with existing admin panels)
# ---------------------------------------------------------------------------

class Course(models.Model):
    LEVEL_CHOICES = [
        ('A1', 'A1 - Anfänger'),
        ('A2', 'A2 - Grundstufe'),
        ('B1', 'B1 - Mittelstufe'),
        ('B2', 'B2 - Gute Mittelstufe'),
        ('C1', 'C1 - Oberstufe (قريباً)'),
        ('C2', 'C2 - Exzellente Kenntnisse (قريباً)'),
        ('Upskilling', 'Upskilling & Call Center'),
        ('Medizin', 'Medizinisches Deutsch (للأطباء)'),
    ]
    CATEGORY_CHOICES = [
        ('beginner', 'مبتدئ'),
        ('intermediate', 'متوسط ومتقدم'),
        ('career', 'سوق العمل والشركات'),
        ('advanced', 'مستويات عليا'),
    ]
    STATUS_CHOICES = [
        ('open', 'متاح للتسجيل'),
        ('coming_soon', 'قريباً'),
        ('closed', 'مكتمل'),
    ]

    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, verbose_name="المستوى")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='beginner', verbose_name="التصنيف")
    title = models.CharField(max_length=255, verbose_name="عنوان الكورس")
    subtitle = models.CharField(max_length=500, verbose_name="الوصف المختصر")
    hours = models.IntegerField(default=60, verbose_name="عدد الساعات التدريبية")
    lectures = models.IntegerField(default=24, verbose_name="عدد المحاضرات")
    duration = models.CharField(max_length=100, default="شهران ونصف", verbose_name="المدة الزمنية")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=1500.00, verbose_name="السعر بالجنيه")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open', verbose_name="حالة التسجيل")
    featured = models.BooleanField(default=False, verbose_name="كورس مميز / الأكثر طلباً")
    syllabus = models.TextField(blank=True, default='', help_text="نقاط المنهج مفصولة بأسطر جديدة", verbose_name="محاور المنهج")
    audio_sample = models.TextField(blank=True, null=True, verbose_name="جملة النطق الصوتي التفاعلي")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "كورس ألماني"
        verbose_name_plural = "الكورسات والمستويات"
        ordering = ['id']

    def __str__(self):
        return f"{self.level} - {self.title} ({self.price} EGP)"


class StudentRegistration(models.Model):
    STATUS_CHOICES = [
        ('pending', 'قيد الانتظار ⏳'),
        ('confirmed', 'مؤكد ✅'),
        ('paid', 'تم الدفع 💰'),
        ('cancelled', 'ملغي ❌'),
    ]
    PAYMENT_CHOICES = [
        ('vodafone_cash', 'فودافون كاش'),
        ('instapay', 'إنستاباي'),
        ('bank_transfer', 'تحويل بنكي'),
        ('card', 'فيزا / ماستركارد'),
    ]

    registration_code = models.CharField(max_length=50, unique=True, blank=True, verbose_name="كود التسجيل")
    student_name = models.CharField(max_length=255, verbose_name="اسم الطالب")
    phone = models.CharField(max_length=20, verbose_name="رقم الهاتف (واتساب)")
    email = models.EmailField(blank=True, null=True, verbose_name="البريد الإلكتروني")
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="registrations", verbose_name="الكورس المختار")
    course_title_cache = models.CharField(max_length=255, blank=True, default='', verbose_name="اسم الكورس النصي")
    payment_method = models.CharField(max_length=50, choices=PAYMENT_CHOICES, default='vodafone_cash', verbose_name="طريقة الدفع")
    notes = models.TextField(blank=True, null=True, verbose_name="ملاحظات الطالب")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="حالة الحجز")
    registered_at = models.DateTimeField(auto_now_add=True, verbose_name="تاريخ التسجيل")

    def save(self, *args, **kwargs):
        if not self.registration_code:
            self.registration_code = f"REG-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "حجز طالب"
        verbose_name_plural = "تسجيلات وحجوزات الطلاب"
        ordering = ['-registered_at']

    def __str__(self):
        return f"{self.student_name} - {self.phone} ({self.status})"


class Book(models.Model):
    level = models.CharField(max_length=10, verbose_name="المستوى")
    title = models.CharField(max_length=255, verbose_name="اسم الكتاب")
    description = models.TextField(verbose_name="وصف الكتاب ومحتوياته")
    pages_count = models.IntegerField(default=200, verbose_name="عدد الصفحات")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=500.00, verbose_name="السعر بالجنيه")
    has_audio_qr = models.BooleanField(default=True, verbose_name="يحتوي على تسجيلات صوتية QR")
    in_stock = models.BooleanField(default=True, verbose_name="متوفر في المخزن")

    class Meta:
        verbose_name = "كتاب المنهج"
        verbose_name_plural = "متجر كتب دويتشه فيلت"

    def __str__(self):
        return f"{self.title} ({self.price} EGP)"


class BookOrder(models.Model):
    STATUS_CHOICES = [
        ('pending', 'قيد التجهيز ⏳'),
        ('shipped', 'تم الشحن 🚚'),
        ('delivered', 'تم الاستلام والتسليم ✅'),
        ('cancelled', 'ملغي ❌'),
    ]

    order_code = models.CharField(max_length=50, unique=True, blank=True, verbose_name="رقم الطلب")
    buyer_name = models.CharField(max_length=255, verbose_name="اسم المشتري")
    phone = models.CharField(max_length=20, verbose_name="رقم الهاتف")
    address = models.TextField(verbose_name="عنوان التوصيل بالتفصيل")
    book = models.ForeignKey(Book, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="الكتاب المطلوب")
    book_name_cache = models.CharField(max_length=255, blank=True, default='', verbose_name="اسم الكتاب")
    quantity = models.IntegerField(default=1, verbose_name="الكمية")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=500.00, verbose_name="المبلغ الإجمالي")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="حالة الشحن")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاريخ الطلب")

    def save(self, *args, **kwargs):
        if not self.order_code:
            self.order_code = f"BORD-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "طلب كتاب"
        verbose_name_plural = "طلبات شحن الكتب"
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.order_code} - {self.buyer_name}"


class PlacementQuizSubmission(models.Model):
    student_name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    score_percentage = models.IntegerField(verbose_name="نسبة النتيجة %")
    recommended_level = models.CharField(max_length=20, verbose_name="المستوى الموصى به")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "نتيجة اختبار تحديد مستوى"
        verbose_name_plural = "نتائج اختبارات تحديد المستوى"


class AcademyStudent(models.Model):
    STATUS_CHOICES = [
        ('active', 'نشط ومفعل ✅'),
        ('suspended', 'موقوف مؤقتاً ⏸️'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='academy_profile')
    name = models.CharField(max_length=255, verbose_name="اسم الطالب")
    email = models.EmailField(blank=True, null=True, verbose_name="البريد الإلكتروني")
    phone = models.CharField(max_length=20, verbose_name="رقم الهاتف")
    level = models.CharField(max_length=10, default='A1', verbose_name="المستوى الدراسي")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', verbose_name="الحالة")
    progress = models.IntegerField(default=0, verbose_name="نسبة الإنجاز %")
    join_date = models.DateField(auto_now_add=True, verbose_name="تاريخ الانضمام")

    class Meta:
        verbose_name = "طالب الأكاديمية"
        verbose_name_plural = "دليل الطلاب"
        ordering = ['-id']

    def __str__(self):
        return f"{self.name} ({self.level})"


class LessonComment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'قيد المراجعة ⏳'),
        ('approved', 'معتمد ومنشور ✅'),
        ('rejected', 'مرفوض ❌'),
    ]
    student_name = models.CharField(max_length=255, verbose_name="اسم الطالب")
    student_phone = models.CharField(max_length=20, blank=True, default='', verbose_name="هاتف الطالب")
    level = models.CharField(max_length=10, default='A1', verbose_name="المستوى")
    lesson_title = models.CharField(max_length=255, default='المحاضرة العامة', verbose_name="عنوان المحاضرة")
    text = models.TextField(verbose_name="نص التعليق / السؤال")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="حالة الاعتماد")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاريخ الإرسال")

    class Meta:
        verbose_name = "تعليق المحاضرة"
        verbose_name_plural = "اعتماد تعليقات الدروس"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student_name}: {self.text[:30]}..."


class LevelEnrollmentRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'قيد الانتظار ⏳'),
        ('approved', 'مقبول ومفعل ✅'),
        ('rejected', 'مرفوض ❌'),
    ]
    student_name = models.CharField(max_length=255, verbose_name="اسم الطالب")
    phone = models.CharField(max_length=20, verbose_name="رقم الهاتف")
    email = models.EmailField(blank=True, null=True, verbose_name="البريد الإلكتروني")
    level = models.CharField(max_length=10, verbose_name="المستوى المطلوب")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="الحالة")
    amount = models.CharField(max_length=50, default='1200 EGP', verbose_name="المبلغ")
    payment_method = models.CharField(max_length=50, default='فودافون كاش', verbose_name="طريقة الدفع")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاريخ الطلب")

    class Meta:
        verbose_name = "طلب اشتراك بمستوى"
        verbose_name_plural = "طلبات تفعيل المستويات"
        ordering = ['-created_at']


class Branch(models.Model):
    TYPE_CHOICES = [
        ('physical', 'فرع رئيسي / فرعي'),
        ('online', 'أونلاين (Live)'),
    ]
    name = models.CharField(max_length=255, verbose_name="اسم الفرع")
    city = models.CharField(max_length=100, verbose_name="المدينة / المحافظة")
    branch_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='physical', verbose_name="نوع الفرع")
    address = models.TextField(verbose_name="العنوان التفصيلي")
    map_url = models.TextField(verbose_name="رابط الخريطة أو الواتساب")
    badge = models.CharField(max_length=100, blank=True, default='', verbose_name="الشارة الترويجية")
    phone = models.CharField(max_length=20, default='010552287454', verbose_name="هاتف الفرع")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "فرع الأكاديمية"
        verbose_name_plural = "فروع دويتشه فيلت"
        ordering = ['id']

    def __str__(self):
        return f"{self.name} - {self.city}"
