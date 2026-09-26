import os
import sys
import django

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'deutsche_welt_backend.settings')
django.setup()


from academy.models import (
    Course, StudentRegistration, Book, BookOrder,
    AcademyStudent, LessonComment, LevelEnrollmentRequest, Branch
)
from django.contrib.auth import get_user_model

User = get_user_model()

def seed():
    print("Seeding database with authentic Herr Khaled Academy data...")

    # 1. Courses
    courses_data = [
        {
            'level': 'A1',
            'category': 'beginner',
            'title': 'كورس اللغة الألمانية - المستوى A1',
            'subtitle': 'تعليم اللغة الألمانية للمبتدئين من الصفر — أونلاين Live',
            'hours': 60,
            'lectures': 24,
            'duration': 'شهرين ونصف',
            'price': 1200.00,
            'status': 'open',
            'featured': True,
            'syllabus': "تأسيس صوتي متقن ومخارج الحروف وقواعد النطق السليم\nتكوين الجمل الصحيحة وقواعد الضمائر والأفعال وأدوات المعرفة\nإجراء المحادثات اليومية للتعريف بالنفس والسكن والتسوق والمطاعم\nتدريب عملي على نماذج امتحانات المستوى A1 والتحدث بثقة"
        },
        {
            'level': 'A2',
            'category': 'beginner',
            'title': 'كورس اللغة الألمانية - المستوى A2',
            'subtitle': 'المستوى المتوسط وتطوير المحادثة والقواعد — أونلاين Live',
            'hours': 65,
            'lectures': 26,
            'duration': 'شهرين ونصف',
            'price': 1400.00,
            'status': 'open',
            'featured': False,
            'syllabus': "التحدث بطلاقة في مواقف الحياة اليومية والعملية المختلفة\nإتقان زمن الماضي والتفريق الاحترافي بين الأفعال وتراكيب الجمل\nحالات الجر وحروف الجر المشتركة والأفعال المنفصلة والمتصلة\nكتابة الرسائل والإيميلات الرسمية وغير الرسمية باحترافية كاملة"
        },
        {
            'level': 'B1',
            'category': 'intermediate',
            'title': 'كورس اللغة الألمانية - المستوى B1 (المعتمد للسفر والعمل)',
            'subtitle': 'المستوى فوق المتوسط واجتياز امتحانات جوته وتيلك الدولية — أونلاين Live',
            'hours': 75,
            'lectures': 30,
            'duration': 'ثلاثة أشهر',
            'price': 1800.00,
            'status': 'open',
            'featured': True,
            'syllabus': "الطلاقة التامة في النقاشات والمناظرات والتعبير عن الرأي والتفاوض\nأسرار اجتياز امتحان Goethe / TELC B1 من المرة الأولى بنسب امتياز\nكتابة المقالات والشكاوى والخطابات الرسمية الأكاديمية وسوق العمل\nقواعد B1 المتقدمة والربط الاحترافي بين الجمل المركبة"
        },
        {
            'level': 'B2',
            'category': 'career',
            'title': 'كورس الاحتراف والألماني الطبي والشركات B2',
            'subtitle': 'التحضير لمقابلات الكول سنتر وسوق العمل ومعادلة الأطباء والتمريض — Live',
            'hours': 80,
            'lectures': 32,
            'duration': 'ثلاثة أشهر ونصف',
            'price': 2200.00,
            'status': 'open',
            'featured': False,
            'syllabus': "المصطلحات الطبية المتخصصة للأطباء والتمريض Fachsprache Medizin\nتأهيل فوري لمقابلات كبرى شركات الكول سنتر والـ BPO برواتب مجزية\nأساليب الإقناع واللغة الألمانية الرفيعة للمراسلات التجارية الرسمية\nاجتياز امتحانات B2 الدولية والتعامل التلقائي في بيئة العمل الألمانية"
        }
    ]

    for cd in courses_data:
        course, created = Course.objects.update_or_create(
            level=cd['level'],
            defaults=cd
        )
        if created:
            print(f"Created course: {course.title}")

    # 2. Books
    books_data = [
        {
            'level': 'A1',
            'title': 'كتاب دويتشه فيلت الشامل A1 (مطبوع + QR كود صوتيات)',
            'description': 'المرجع التأسيسي الأول في العالم العربي لتعلم الألمانية من الصفر حتى إتقان A1.',
            'pages_count': 180,
            'price': 500.00,
            'has_audio_qr': True,
            'in_stock': True
        },
        {
            'level': 'A2',
            'title': 'كتاب دويتشه فيلت المتقدم (A2) 📖',
            'description': 'الانطلاق في التعبير عن الماضي والمستقبل وقواعد Dativ & Wechselpräpositionen.',
            'pages_count': 220,
            'price': 500.00,
            'has_audio_qr': True,
            'in_stock': True
        },
        {
            'level': 'B1',
            'title': 'كتاب التأهيل والامتحانات الدولية (B1) 🏆',
            'description': 'سلسلة هير خالد الذهبية لتخطي امتحان B1 والتأهيل لمقابلات الكول سنتر وسوق العمل.',
            'pages_count': 260,
            'price': 500.00,
            'has_audio_qr': True,
            'in_stock': True
        },
        {
            'level': 'B2',
            'title': 'كتاب الطلاقة اللغوية والألماني الطبي B2 Medizin 🩺',
            'description': 'التحضير الشامل لمعادلات الأطباء وامتحانات B2 وسوق العمل والشركات الألمانية.',
            'pages_count': 280,
            'price': 500.00,
            'has_audio_qr': True,
            'in_stock': True
        }
    ]

    for bd in books_data:
        b, created = Book.objects.update_or_create(
            level=bd['level'],
            defaults=bd
        )
        if created:
            print(f"Created book: {b.title}")

    # 3. Branches
    branches_data = [
        {
            'name': 'فرع شبين الكوم',
            'city': 'المنوفية',
            'branch_type': 'physical',
            'address': 'برج حجازي – الدور الثاني علوي\nأمام مستشفى الجامعة مباشرة',
            'map_url': 'https://maps.app.goo.gl/NJRj414R5yurS7Gs8?g_st=ac',
            'badge': '🏢 فرع رئيسي',
            'phone': '010552287454'
        },
        {
            'name': 'فرع مدينة نصر',
            'city': 'القاهرة',
            'branch_type': 'physical',
            'address': '١٦ ش شريف سامي - بالقرب من (كوبري المنهل / جامع السلام) - الدور الأول',
            'map_url': 'https://maps.app.goo.gl/i55RDUisL7wcdwf3A',
            'badge': '📍 القاهرة',
            'phone': '01144151673'
        },
        {
            'name': 'فرع المنصورة',
            'city': 'الدقهلية',
            'branch_type': 'physical',
            'address': '١ شارع الشيخ الغزالي أمام مستشفي الجامعة البوابة الرئيسية',
            'map_url': 'https://maps.app.goo.gl/PpTdBa3fkWC7WGYt5',
            'badge': '📍 الدقهلية',
            'phone': '010552287454'
        },
        {
            'name': 'فرع الإسكندرية',
            'city': 'الإسكندرية',
            'branch_type': 'physical',
            'address': 'سموحة ١ شارع 3 من شارع النصر أمام صيدلية الخليلي',
            'map_url': 'https://maps.app.goo.gl/WY4LqQKPTK4M9e4A7',
            'badge': '🥳 عروس البحر',
            'phone': '01144151673'
        },
        {
            'name': 'فرع الدراسة أونلاين (Online)',
            'city': 'جميع المحافظات والدول',
            'branch_type': 'online',
            'address': 'محاضرات تفاعلية مباشرة عبر Zoom / Teams لجميع المحافظات ودول العالم مع المتابعة المستمرة للمستويات',
            'map_url': 'https://wa.me/2010552287454?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%87%D9%8A%D8%B1%20%D8%AE%D8%A7%D9%84%D8%AF%D9%80%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D9%83%D9%88%D8%B1%D8%B3%D8%A7%D8%AA%20%D8%A7%D9%84%D8%A3%D9%88%D9%86%D9%84%D8%A7%D9%8A%D9%86',
            'badge': '💻 محاضرة مباشرة (Live)',
            'phone': '010552287454'
        }
    ]

    for br in branches_data:
        b_obj, created = Branch.objects.update_or_create(
            name=br['name'],
            defaults=br
        )
        if created:
            print(f"Created branch: {b_obj.name}")

    # 4. Students Directory
    students_data = [
        {
            'name': 'أحمد محمود حسن',
            'email': 'ahmed.m@gmail.com',
            'phone': '01012345678',
            'level': 'A1',
            'status': 'active',
            'progress': 85
        },
        {
            'name': 'سارة عبد الله علي',
            'email': 'sara.ali@gmail.com',
            'phone': '01123456789',
            'level': 'A2',
            'status': 'active',
            'progress': 60
        },
        {
            'name': 'محمد إبراهيم حسام',
            'email': 'm.hossam@outlook.com',
            'phone': '01234567890',
            'level': 'B1',
            'status': 'active',
            'progress': 92
        },
        {
            'name': 'نور الهدى سمير',
            'email': 'nour.samir@yahoo.com',
            'phone': '01098765432',
            'level': 'B2',
            'status': 'active',
            'progress': 45
        },
        {
            'name': 'كريم وائل السيد',
            'email': 'karim.wael@gmail.com',
            'phone': '01512348765',
            'level': 'A1',
            'status': 'suspended',
            'progress': 20
        },
        {
            'name': 'مريم طارق يوسف',
            'email': 'mariam.t@gmail.com',
            'phone': '01065432198',
            'level': 'A2',
            'status': 'active',
            'progress': 75
        }
    ]

    for sd in students_data:
        s_obj, created = AcademyStudent.objects.update_or_create(
            phone=sd['phone'],
            defaults=sd
        )
        if created:
            print(f"Created student: {s_obj.name}")

    # 5. Registrations
    c_a1 = Course.objects.filter(level='A1').first()
    c_a2 = Course.objects.filter(level='A2').first()
    c_b1 = Course.objects.filter(level='B1').first()
    c_b2 = Course.objects.filter(level='B2').first()

    regs_data = [
        {
            'registration_code': 'REG-101',
            'student_name': 'أحمد محمود العوضي',
            'phone': '01012345678',
            'email': 'ahmed.awadi@example.com',
            'course': c_b1,
            'course_title_cache': 'المستوى الذهبي للسفر والعمل (B1)',
            'payment_method': 'vodafone_cash',
            'notes': 'بدأت بالمحاضرة الأولى عبر المنصة ومحتاج تفعيل الدعم',
            'status': 'confirmed'
        },
        {
            'registration_code': 'REG-102',
            'student_name': 'سارة خالد الدسوقي',
            'phone': '01198765432',
            'email': 'sara.desouky@example.com',
            'course': c_b2,
            'course_title_cache': 'كورس تأهيل سوق العمل & الكول سنتر الألماني',
            'payment_method': 'instapay',
            'notes': 'تحضير لمقابلة Concentrix',
            'status': 'confirmed'
        },
        {
            'registration_code': 'REG-103',
            'student_name': 'د. محمود حسن عبدالفتاح',
            'phone': '01234567890',
            'email': 'dr.mahmoud@example.com',
            'course': c_b2,
            'course_title_cache': 'كورس اللغة الألمانية الطبية (للأطباء والتمريض)',
            'payment_method': 'bank_transfer',
            'notes': 'تجهيز لمعادلة الأطباء في ألمانيا',
            'status': 'pending'
        },
        {
            'registration_code': 'REG-104',
            'student_name': 'مريم إبراهيم خليل',
            'phone': '01555556666',
            'email': 'mariam.khalil@example.com',
            'course': c_a1,
            'course_title_cache': 'كورس المستوى التأسيسي الشامل (A1)',
            'payment_method': 'vodafone_cash',
            'notes': 'مبتدئة تماماً من الصفر',
            'status': 'pending'
        }
    ]

    for rd in regs_data:
        r_obj, created = StudentRegistration.objects.update_or_create(
            registration_code=rd['registration_code'],
            defaults=rd
        )
        if created:
            print(f"Created registration: {r_obj.student_name}")

    # 6. Book Orders
    b_a1 = Book.objects.filter(level='A1').first()
    b_b1 = Book.objects.filter(level='B1').first()

    orders_data = [
        {
            'order_code': 'BORD-201',
            'buyer_name': 'كريم طارق حسني',
            'phone': '01099887766',
            'address': 'مدينة نصر - القاهرة',
            'book': b_a1,
            'book_name_cache': 'سلسلة كتب دويتشه فيلت A1',
            'quantity': 1,
            'total_price': 500.00,
            'status': 'shipped'
        },
        {
            'order_code': 'BORD-202',
            'buyer_name': 'نوران حسام الدين',
            'phone': '01222334455',
            'address': 'سموحة - الإسكندرية',
            'book': b_b1,
            'book_name_cache': 'كتاب التأهيل والامتحانات الدولية (B1)',
            'quantity': 2,
            'total_price': 1000.00,
            'status': 'pending'
        }
    ]

    for od in orders_data:
        o_obj, created = BookOrder.objects.update_or_create(
            order_code=od['order_code'],
            defaults=od
        )
        if created:
            print(f"Created book order: {o_obj.buyer_name}")

    # 7. Lesson Comments for Moderation
    comments_data = [
        {
            'student_name': 'أحمد محمود حسن',
            'student_phone': '01012345678',
            'level': 'A1',
            'lesson_title': 'فيديو: تصريف الأفعال الشاذة وغير القياسية - A1',
            'text': 'شرح عظيم ومبسط جداً يا هير خالد، ربنا يباركلك ويجعله في ميزان حسناتك! هل في ملزمة تمارين إضافية للقاعدة دي؟',
            'status': 'pending'
        },
        {
            'student_name': 'سارة عبد الله علي',
            'student_phone': '01123456789',
            'level': 'A2',
            'lesson_title': 'فيديو: حالات الإعراب وقاعدة Akkusativ والتفريق مع Dativ - A2',
            'text': 'يا هير هل في فرق بين الأفعال المنفصلة والمتصلة في صياغة الماضي Perfekt؟ نقطة ممتازة جداً وواضحة.',
            'status': 'pending'
        },
        {
            'student_name': 'محمد إبراهيم حسام',
            'student_phone': '01234567890',
            'level': 'B1',
            'lesson_title': 'فيديو: صياغة الجمل الجانبية المعقدة بـ Nebensatz - B1',
            'text': 'المثال الثالث كان محتاج تركيز عالي بس بعد الإعادة فهمت موقع الفعل بدقة. شكراً لفريق الأكاديمية.',
            'status': 'pending'
        },
        {
            'student_name': 'نور الهدى سمير',
            'student_phone': '01098765432',
            'level': 'B2',
            'lesson_title': 'فيديو: أسرار التعبير الشفهي والتحدث بثقة لامتحان جوته B2',
            'text': 'بفضل تدريبات حضرتك نجحت في الامتحان التجريبي بنسبة 94% واجتزت الجزء الشفهي بدون تردد!',
            'status': 'approved'
        }
    ]

    for cmd in comments_data:
        cm_obj, created = LessonComment.objects.get_or_create(
            student_name=cmd['student_name'],
            lesson_title=cmd['lesson_title'],
            defaults=cmd
        )
        if created:
            print(f"Created comment for: {cm_obj.student_name}")

    # 8. Level Requests
    reqs_data = [
        {
            'student_name': 'يوسف رامي مصطفى',
            'phone': '01054321678',
            'email': 'youssef.r@gmail.com',
            'level': 'A1',
            'status': 'pending',
            'amount': '1200 EGP',
            'payment_method': 'فودافون كاش'
        },
        {
            'student_name': 'هدى مصطفى كمال',
            'phone': '01198765432',
            'email': 'hoda.m@gmail.com',
            'level': 'A2',
            'status': 'pending',
            'amount': '1400 EGP',
            'payment_method': 'إنستا باي'
        },
        {
            'student_name': 'خالد عبد الرحمن',
            'phone': '01287654321',
            'email': 'khaled.abdo@gmail.com',
            'level': 'B1',
            'status': 'approved',
            'amount': '1600 EGP',
            'payment_method': 'فودافون كاش'
        }
    ]

    for req in reqs_data:
        rq_obj, created = LevelEnrollmentRequest.objects.get_or_create(
            student_name=req['student_name'],
            level=req['level'],
            defaults=req
        )
        if created:
            print(f"Created level request: {rq_obj.student_name}")

    print("Database seeding completed successfully! All tables populated.")

if __name__ == '__main__':
    seed()
