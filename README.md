<div align="center">

<img src="frontend/public/assets/images/logo-full.png" alt="Deutsche Welt" width="180" />

# Deutsche Welt Academy

**منصة تعليم اللغة الألمانية — أكاديمية هير خالد الحلواني**

محاضرات فيديو من A1 لحد B2 · كتب ومذكرات · تعليقات ونقاش تحت كل درس · لوحة تحكم كاملة للإدارة

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-149eca?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Django](https://img.shields.io/badge/Django-REST-092e20?logo=django)
![Bunny Stream](https://img.shields.io/badge/Video-Bunny_Stream-f97316)

</div>

---

## نظرة سريعة

| الجزء | الفولدر | التقنية |
|---|---|---|
| الموقع + لوحة التحكم | [`frontend/`](frontend) | Next.js 16 · React 19 · Tailwind CSS 4 · Axios |
| الباك إند (الـ API) | [`backend_django/`](backend_django) | Django REST Framework · JWT · Bunny Stream |

الموقع الحالي بيشتغل على الباك إند المرفوع `https://py.deutschewelt.academy`. كل البيانات (الأسعار، الكورسات، الطلاب، الصلاحيات) جاية منه، ومفيش حاجة منها مكتوبة جوه الكود.

---

## المميزات

### للطالب
- **حساب واحد لكل حاجة:** تسجيل بالإيميل أو بجوجل.
- **استرجاع كلمة المرور خطوة بخطوة:** كود من 6 أرقام على الإيميل، مع عداد صلاحية (10 دقايق) وإعادة إرسال، وبعد التغيير بيدخل على حسابه على طول.
- **المستويات A1 → B2:** المستوى المفعّل بيفتح بالفيديوهات، والمقفول بيوضّح إزاي تشترك.
- **مشغّل فيديو محمي:** روابط Bunny Stream موقّعة ومؤقتة، وعليها حماية DRM.
- **الكتب:** قراءة PDF و Word جوه الموقع للكتب المفعّلة.
- **التعليقات:** تعليق ورد على كل درس، وتعديل خلال 15 دقيقة، وحذف.
- **طلب اشتراك:** من الموقع مع صورة التحويل، أو عن طريق واتساب.

### للإدارة — `/admin`
- لوحة قيادة بالأرقام الأساسية وآخر التفعيلات والمسجلين.
- تفعيل وإلغاء المستويات والكتب لأي طالب، وقبول ورفض طلبات الاشتراك.
- إدارة الطلاب والحسابات والكورسات والكتب والفروع وشريط الإعلان.
- **أرقام التواصل وطرق الدفع:** الواتساب وأرقام الاتصال وطرق الدفع وجروبات المستويات بتتعدّل من اللوحة وبتظهر في الموقع على طول.
- اللوحة نفسها فيها وضع فاتح وداكن، وعربي وإنجليزي وألماني.
- خصوصية: الإيميلات بتظهر متخفية في القوايم (`sa***@gmail.com`).

---

## التشغيل محلياً

**المتطلبات:** Node.js 20 أو أحدث.

```bash
cd frontend
npm install
cp .env.example .env.local   # وبعدين املا القيم (شوف الجدول تحت)
npm run dev                  # http://localhost:3000
```

### الإعدادات (`frontend/.env.local`)

| المتغيّر | لازم؟ | الاستخدام |
|---|---|---|
| `CATALOG_ACCOUNT_EMAIL` / `CATALOG_ACCOUNT_PASSWORD` | أيوه | حساب طالب **من غير اشتراكات**، بيخلّي الزوار يشوفوا المستويات والكتب بأسعارها. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | لا | رقم واتساب الاشتراكات بالصيغة الدولية من غير `+`. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | لا | زرار الدخول بجوجل. |
| `BACKEND_URL` | لا | الافتراضي `https://py.deutschewelt.academy`. للتطوير المحلي: `http://127.0.0.1:8000`. |
| `SITE_DATA_DIR` | على السيرفر | مكان حفظ الفروع والإعلان والطلبات. لازم يكون فولدر ثابت مايتمسحش مع الرفع. |

> المتصفح بيكلّم `/api/*` على نفس الموقع، والـ Next.js بيوصّلها للباك إند (مفيش مشاكل CORS). **ماتحطش** `NEXT_PUBLIC_API_URL`.

### الباك إند (اختياري للتطوير)

```bash
cd backend_django
python -m venv venv
venv\Scripts\activate          # Windows — أو: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

التفاصيل الكاملة (المتغيرات، Bunny Stream، SMTP للـ OTP) في [backend_django/README.md](backend_django/README.md).

---

## الرفع على السيرفر

```bash
cd frontend
npm run build
npm run start        # بورت 3000 — أو: npm run start -- -p 80
```

الموقع لازم يشتغل **كسيرفر Node** (VPS أو ما شابه)، لأنه بيوصّل طلبات الـ API ويحفظ ملفات JSON على الـ disk.
الخطوات بالتفصيل في [frontend/DEPLOY.md](frontend/DEPLOY.md).

---

## تسجيل الدخول والأمان

| الموضوع | إزاي شغال |
|---|---|
| التوكنات | JWT: الـ access صالح 60 دقيقة، والـ refresh صالح يوم. |
| التجديد | interceptor في [`api.js`](frontend/src/services/api.js) بيجدد التوكن لوحده عند أي `401`، وبطلب تجديد واحد مشترك لكل الطلبات. |
| الطلبات العامة | الدخول والتسجيل ونسيت كلمة المرور بيتبعتوا **من غير** توكن، عشان توكن قديم مايخليش الباك إند يرفضهم. |
| الأجهزة المشتركة | خانات الدخول مابتتملاش لوحدها ببيانات حد تاني. |
| الأدمن | الصلاحية من الباك إند (`is_admin` أو جروب `Admin`)، وكل عملية أدمن بيتأكد منها الباك إند تاني. |

شاشة الدخول كلها في [`AuthModal.jsx`](frontend/src/components/modals/AuthModal.jsx).

### تفعيل الدخول بجوجل

زرار جوجل بيظهر في «تسجيل الدخول» و«حساب جديد» أول ما `NEXT_PUBLIC_GOOGLE_CLIENT_ID` يتحط.
لو الحساب جديد ومفيهوش رقم موبايل، الموقع بيطلبه في خطوة سريعة بعد الدخول، والطالب يقدر يأجّلها.

1. من [Google Cloud Console](https://console.cloud.google.com/apis/credentials) هات الـ **Web Client ID** اللي الباك إند شغال بيه. لازم يكون **نفس** قيمة `GOOGLE_CLIENT_ID` على الباك إند، لأن الباك إند بيرفض أي توكن متعمل لـ Client ID تاني.
2. في نفس الـ Client، ضيف دومين الموقع في **Authorized JavaScript origins**، مثلاً `https://deutschewelt.academy` و `http://localhost:3000`.
3. حط القيمة في `frontend/.env.local` واعمل `npm run build` من جديد، لأن القيمة بتدخل في الـ build:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
   ```

---

## هيكل المشروع

```
herr_khaled_web/
├─ frontend/
│  ├─ src/
│  │  ├─ app/
│  │  │  ├─ (site)/         الصفحة الرئيسية
│  │  │  ├─ (learn)/        الكورسات والكتب وصفحات المشاهدة والقراءة
│  │  │  ├─ admin/          لوحة التحكم
│  │  │  ├─ public-data/    كتالوج المستويات والكتب للزوار
│  │  │  └─ site-data/      الفروع والإعلان والطلبات (JSON على السيرفر)
│  │  ├─ components/        admin · home · layout · course · book · modals · common
│  │  ├─ services/          الاتصال بالـ API (auth, courses, books, comments, admin, requests)
│  │  ├─ context/           AuthContext · ModalContext
│  │  └─ hooks/ constants/ lib/
│  ├─ public/assets/        اللوجو والصور
│  ├─ README.md             تفاصيل الموقع ولوحة التحكم
│  └─ DEPLOY.md             خطوات الرفع
└─ backend_django/          الـ API (Django REST)
```

---

## المساهمة

1. اعمل branch جديد من `main`.
2. قبل الـ commit شغّل `npm run lint` جوه `frontend`.
3. ماترفعش أي ملف `.env` أو بيانات طلاب أو ملفات مدفوعة (`media/`، `protected_media/`، `frontend/data/`). كلهم متجاهلين في `.gitignore`.

---

<div align="center">

**Deutsch lernen — Schritt für Schritt.** 🇩🇪

</div>
