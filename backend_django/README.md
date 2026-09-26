# Deutsch Welt Backend — Production Setup Guide

## What Changed (Production Upgrade)

| Feature | Before | After |
|---|---|---|
| Auth | DRF Token (same access & refresh) | **JWT** (60min access / 1day refresh) |
| Videos | Hardcoded YouTube links | **Bunny Stream API** with signed URLs |
| Access Control | Hardcoded (everyone/staff only) | **DB-backed `LevelAccess`** per user |
| Books | Hardcoded mock data | **DB `DigitalBook` + `BookAccess`** |
| Comments | Hardcoded demo data | **Real DB** with pagination + rate limiting |
| Apple Sign-In | Not implemented | **Full Apple JWKS verification** |
| Forgot Password | Always returns 200 | **Real OTP via email SMTP** |

---

## 1. Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Required Variables

```env
SECRET_KEY=<generate a 50+ char random key>
DEBUG=False  # For production

# Bunny Stream
BUNNY_API_KEY=<your Bunny API key from bunny.net dashboard>
BUNNY_LIBRARY_ID=<your Video Library ID>
BUNNY_STREAM_CDN_HOSTNAME=<your CDN pull zone hostname, e.g. vz-abc123.b-cdn.net>
BUNNY_TOKEN_AUTH_KEY=<Token Authentication key from Library settings>

# Google Sign-In
GOOGLE_CLIENT_ID=<your OAuth 2.0 client ID from Google Cloud Console>

# Apple Sign-In
APPLE_APP_BUNDLE_ID=<your iOS app bundle ID, e.g. com.yourcompany.deutschewelt>

# Email (OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=<Gmail App Password>
DEFAULT_FROM_EMAIL=Deutsch Welt <your-email@gmail.com>
```

---

## 2. Bunny Stream Setup

### Step 1: Get your credentials from Bunny Dashboard

1. Go to [bunny.net](https://bunny.net) → **Stream** → your Library
2. **Library ID** — shown at the top of the library page
3. **API Key** — Account → API Keys
4. **Token Auth Key** — Library → Security → Enable Token Authentication → copy the key
5. **CDN Hostname** — Library → Pull Zone → Hostname (e.g. `vz-abc123.b-cdn.net`)

### Step 2: Create a Collection per Level in Bunny

In Bunny Stream, create 4 collections (A1, A2, B1, B2) and upload videos to each.

### Step 3: Set collection IDs in DB

```bash
python manage.py shell
```

```python
from academy.models import CourseLevel

CourseLevel.objects.filter(name='A1').update(bunny_collection_id='your-a1-collection-uuid')
CourseLevel.objects.filter(name='A2').update(bunny_collection_id='your-a2-collection-uuid')
CourseLevel.objects.filter(name='B1').update(bunny_collection_id='your-b1-collection-uuid')
CourseLevel.objects.filter(name='B2').update(bunny_collection_id='your-b2-collection-uuid')
```

### Step 4: Add videos to DB

Option A: Via Django Admin → Videos → Add Video (enter `bunny_video_id` from Bunny)

Option B: Via shell:
```python
from academy.models import CourseLevel, Video

a1 = CourseLevel.objects.get(name='A1')
Video.objects.create(
    level=a1,
    title='المحاضرة 1: التأسيس الصوتي',
    bunny_video_id='d4f5a6b7-c8d9-4e0f-a1b2-c3d4e5f6a7b8',  # from Bunny dashboard
    length=1500,  # seconds
    order=1,
)
```

---

## 3. Grant Student Access

After a student pays, grant them access via:

### Via Admin Panel
Django Admin → Level Access → Add → select user + level

### Via API
```
POST /api/courses/admin/levels/1/grant/
Authorization: Bearer <admin_token>

{ "user_id": 5, "notes": "دفع 1200 جنيه فودافون كاش" }
```

---

## 4. Running Locally

```bash
# Activate venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Seed the 4 levels
python manage.py seed_levels

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver
```

---

## 5. JWT Token Lifecycle

| Token | Lifetime | Notes |
|---|---|---|
| Access Token | 60 minutes | Send in `Authorization: Bearer <token>` header |
| Refresh Token | 1 day | Call `POST /api/users/login/refresh/` to get a new access token |

> On logout, the refresh token is **blacklisted** (can't be reused).

---

## 6. Apple Sign-In Notes

The app must send:
- `id_token` — the identity token string from Apple SDK
- `first_name` / `last_name` — **only on first sign-in** (Apple only provides this once)

Set `APPLE_APP_BUNDLE_ID` to your iOS app's bundle ID exactly.

---

## 7. Video Cache

Videos are cached per Bunny collection for **10 minutes**.

To force a refresh (e.g. after uploading new videos):
```
POST /api/courses/admin/levels/{level_id}/refresh-cache/
Authorization: Bearer <admin_token>
```

Or from Django shell:
```python
from django.core.cache import cache
cache.delete('bunny_collection_<collection-id>')
```
