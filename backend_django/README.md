# Deutsche Welt Akademie - Python Django REST API Backend

مشروع الباك إند بايثون ديجانجو (Django REST Framework) المخصص لمنصة **Deutsche Welt Akademie** لتدريس اللغة الألمانية تحت إشراف **هير خالد**.

---

## 🚀 طريقة تشغيل الباك إند (Quick Start):

1. **إنشاء البيئة الافتراضية وتفعيلها:**
   ```bash
   python -m venv venv
   # على ويندوز:
   .\venv\Scripts\activate
   ```

2. **تثبيت المكاتب المطلوبة:**
   ```bash
   pip install -r requirements.txt
   ```

3. **تطبيق قواعد البيانات (Migrations):**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **إنشاء حساب المدير الأساسي (Superuser):**
   ```bash
   python manage.py createsuperuser
   ```

5. **تشغيل السيرفر المحلي:**
   ```bash
   python manage.py runserver 8000
   ```

---

## 📡 مسارات الـ REST API المتوفرة:

- **الكورسات:** `GET /api/courses/` | `POST /api/courses/`
- **حجوزات الطلاب:** `GET /api/registrations/` | `POST /api/registrations/`
- **كتب المنهج (500ج):** `GET /api/books/` | `POST /api/books/`
- **طلبات الشحن والتوصيل:** `GET /api/orders/` | `POST /api/orders/`
- **اختبارات تحديد المستوى:** `GET /api/quizzes/` | `POST /api/quizzes/`
- **لوحة الأرباح والإحصائيات:** `GET /api/analytics/summary/`
- **لوحة تحكم جانجو الرسمية:** `http://127.0.0.1:8000/admin/`
