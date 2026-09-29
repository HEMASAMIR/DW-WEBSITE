# رفع تحديث لوحة التحكم ونظام الطلبات على السيرفر

السيرفر: `https://py.deutschewelt.academy`

الموقع (Next.js) جاهز. لحد ما التحديث ده يترفع:
- لوحة التحكم (`/admin`) بتعرض رسالة «مستنية تحديث السيرفر».
- طلبات الاشتراك بتروح على واتساب زي الأول.

أول ما التحديث يترفع، الاتنين بيشتغلوا تلقائياً من غير أي تعديل في الموقع.

## 1) الخطوات على السيرفر

```bash
git pull                                  # أو ارفع فولدر backend_django المحدَّث
source venv/bin/activate
pip install -r requirements.txt           # مفيش مكتبات جديدة، بس للاحتياط
python manage.py migrate                  # 0006 (طلبات التفعيل + ترتيب الفروع) و 0007 (إضافة الفروع الحالية لو الجدول فاضي)
python manage.py test academy             # 19 اختبار، لازم كلهم OK
sudo systemctl restart gunicorn           # أو اسم خدمة Django عندكم
```

صور التحويل بتتخزن في `PROTECTED_MEDIA_ROOT/receipts/`، وده نفس المكان المحمي بتاع الكتب. مفيش إعداد nginx جديد.

## 2) اتأكد إنه اشتغل

```bash
curl -I https://py.deutschewelt.academy/api/admin/pending-count/   # لازم 401 (مش 404)
curl -I https://py.deutschewelt.academy/api/branches/              # لازم 200
curl -I https://py.deutschewelt.academy/api/registrations/         # لازم 401 (كانت مفتوحة لأي حد)
```

بعدها ادخل على الموقع بحساب أدمن وافتح `/admin`.

## 3) إيه اللي اتغيّر

| الجزء | التغيير |
|---|---|
| `models.py` | موديل `AccessRequest` (طلب كورس أو كتاب)، وحقول `order` و`is_active` للفروع، وكود المستوى بقى نص حر بدل قايمة ثابتة. |
| `api_views/requests_views.py` | `POST /api/requests/` (الطالب يبعت طلب ومعاه صورة التحويل) و `GET /api/requests/mine/`. |
| `api_views/dashboard_views.py` | كل الـ endpoints تحت `/api/admin/`: الإحصائيات، والطلبات (قبول ورفض بيفعّل فوراً)، والحسابات، والمستويات والمحاضرات والملفات، والفروع. كلها للأدمن بس. |
| `views.py` | **إصلاح أمني:** endpoints الـ router القديمة (`registrations`, `orders`, `students`, `comments`, `level-requests`, `quizzes`, `analytics`) كانت مفتوحة لأي حد، ودلوقتي للأدمن بس. الفروع قراءة فقط للزوار. |
| `announcement_views.py` | **إصلاح أمني:** تعديل إعلان الموقع كان مفتوح لأي حد، ودلوقتي للأدمن بس. |
| `auth_views.py` | `is_admin` في رد تسجيل الدخول بقى بيشمل جروب `Admin`. |
| `admin_views.py` | قايمة كتب الأدمن بقت بترجع عدد القرّاء والطلبات المستنية. |

الخصوصية: قوايم الحسابات بترجع الإيميل متخفي (`sa***@gmail.com`). الإيميل الكامل بيظهر بس في تفاصيل حساب واحد، وده للأدمن بس. والطالب مايقدرش يشوف غير طلباته هو.
