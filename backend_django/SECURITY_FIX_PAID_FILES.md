# Security fix: paid books & course files were publicly downloadable

## The problem (found on production, 2026-09-26)

1. `GET /api/books/admin/` answers **200 to any logged-in student** (not only staff) and returns a
   `file` field with a direct URL to every book PDF.
2. Those URLs are under the public `/media/` path, so they open **without any login**
   (verified: books a test student had not bought downloaded fine with no token).

Result: anyone could create a free account, list the admin endpoint, and download every paid book —
or share the links with people who have no account at all.

## The fix (implemented and tested in this repo)

| File | Change |
|---|---|
| `academy/storage.py` | New `ProtectedFileSystemStorage`: files live in `PROTECTED_MEDIA_ROOT` (outside `MEDIA_ROOT`) and have **no URL** (`.url` raises). `protected_file_response()` streams a file only after the view has checked access — via nginx `X-Accel-Redirect` in production, `FileResponse` locally. Sends the real content type (PDF, DOCX…), `inline`/`attachment`, `Cache-Control: private, no-store`. |
| `academy/models.py` + migration `0004` | `DigitalBook.file` and `CourseFile.file` use the protected storage. |
| `academy/api_views/admin_views.py` | `AdminRequiredMixin` now uses a real DRF permission class (`IsAuthenticated` + `IsStaffUser`). The old version checked `request.user` in `dispatch()` **before** JWT authentication ran (so real admins using JWT were rejected) and returned an un-rendered `Response` (HTTP 500). Admin book list returns `has_file` / `file_name` — **never a URL**. Multipart `is_active="false"` is parsed correctly. |
| `academy/api_views/books_views.py` | `GET /api/books/<id>/`, `GET /api/books/<id>/view/` (inline), `/download/` (attachment) — all check `BookAccess` (staff bypass). Student lists never contain file info. |
| `academy/api_views/courses_views.py` | `GET /api/courses/levels/<id>/files/<id>/view/` + `/download/`, checking level access, with the file's real type (course files are `.docx`, not PDF). |
| `academy/api_views/auth_views.py` | `POST /api/users/<id>/groups/` only accepts `Admin`, `Moderator`, `Student` (it used to create any group name sent to it). |
| `academy/management/commands/secure_protected_files.py` | Moves existing files from `media/` to `protected_media/`. |
| `academy/tests_file_security.py` | 10 tests covering all of the above. |

Run the tests: `python manage.py test academy.tests_file_security`

## Deploying on the production server

> The production code is a different codebase (it has a `books` app). Port the same ideas:
> the permission class on **every** admin view, no file URLs in any serializer, protected storage,
> and access-checked `/view/` endpoints.

1. **Deploy the code**, then:
   ```bash
   python manage.py migrate
   python manage.py secure_protected_files          # dry run — review the list
   python manage.py secure_protected_files --apply  # move files out of media/
   ```
2. **Environment** (`.env`):
   ```env
   PROTECTED_MEDIA_ROOT=/path/to/project/protected_media
   PROTECTED_MEDIA_USE_X_ACCEL=True
   PROTECTED_MEDIA_X_ACCEL_PREFIX=/_protected/
   ```
3. **nginx** — add an `internal` location (not reachable from outside) and make sure no public
   location points at the protected folder:
   ```nginx
   location /_protected/ {
       internal;
       alias /path/to/project/protected_media/;
   }
   ```
   Then `sudo nginx -t && sudo systemctl reload nginx`.
4. **Verify from outside** (no token):
   ```bash
   curl -I https://py.deutschewelt.academy/media/digital_books/<old-file>.pdf   # must be 404
   curl -I https://py.deutschewelt.academy/_protected/digital_books/<file>.pdf  # must be 404
   ```
   and with a student token: `GET /api/books/admin/` → **403**.
5. **Old links were already exposed.** After moving, the old `/media/...` URLs stop working.
   To be extra safe, re-upload the books under new file names from the admin panel.

## Admin panel note

The website's admin panel already works with this: it never uses file URLs, it uploads books as
`multipart/form-data` and shows books through `/view/`.
