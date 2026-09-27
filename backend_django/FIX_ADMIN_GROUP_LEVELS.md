# Fix: "Admin" group gets 403 on level management

## Symptom (production, checked 2026-09-27)

An account in the **Admin** group (with `is_staff = False`) logs in fine, but:

| Endpoint | Result |
|---|---|
| `GET /api/books/admin/` | **200** (books admin checks the `Admin` group) |
| `GET /api/books/admin/1/users/` | **200** |
| `GET /api/courses/admin/levels/` | **403** `You do not have permission to perform this action.` |
| `GET /api/courses/admin/levels/1/users/` | **403** |

So in the admin panel, the **Levels & subscriptions** tab (list levels, see subscribers, grant/revoke a level) is blocked for Admin-group accounts.

## Cause

The level admin views only accept `is_staff` / `is_superuser`. They don't check the `Admin` group the way the books views do.

## Fix: `academy/api_views/admin_views.py`

```python
ADMIN_GROUP = 'Admin'


def _is_admin(user):
    """Staff, superuser, or a member of the "Admin" group (roles are managed with groups)."""
    if not (user and user.is_authenticated):
        return False
    return bool(user.is_staff or user.is_superuser or user.groups.filter(name=ADMIN_GROUP).exists())
```

`IsStaffUser` / `AdminRequiredMixin` already call `_is_admin`, so every admin endpoint (levels, grant/revoke, users, refresh-cache) accepts the Admin group after this change. **Moderator** and **Student** are still rejected.

If the production code uses DRF's `IsAdminUser` on the level views instead, replace it with a permission that uses the `_is_admin` check above.

## Test

`academy/tests_file_security.py::test_admin_group_member_can_manage_levels_and_books`

```
python manage.py test academy.tests_file_security   # 11 tests, OK
```

## Also recommended

Include `groups` in the login / profile response (for example `"groups": ["Admin"]`). The frontend can then read admin rights from the server, and the temporary email list in `frontend/src/constants/temporaryAdmins.js` can be deleted.
