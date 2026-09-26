"""
Security tests for paid content (books & course files).

    python manage.py test academy.tests_file_security
"""

import shutil
import tempfile

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from academy.models import BookAccess, CourseFile, CourseLevel, DigitalBook, LevelAccess

User = get_user_model()
PDF = b'%PDF-1.4 secret paid content'
DOCX = b'PK\x03\x04 fake docx content'


class PaidContentSecurityTests(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.tmp_public = tempfile.mkdtemp()
        cls.tmp_protected = tempfile.mkdtemp()
        cls.override = override_settings(MEDIA_ROOT=cls.tmp_public, PROTECTED_MEDIA_ROOT=cls.tmp_protected)
        cls.override.enable()

    @classmethod
    def tearDownClass(cls):
        cls.override.disable()
        shutil.rmtree(cls.tmp_public, ignore_errors=True)
        shutil.rmtree(cls.tmp_protected, ignore_errors=True)
        super().tearDownClass()

    def setUp(self):
        # Re-create the lazy storage so it picks up the overridden PROTECTED_MEDIA_ROOT.
        from django.utils.functional import empty
        from academy.storage import protected_storage
        protected_storage._wrapped = empty

        self.student = User.objects.create_user(username='s@x.com', email='s@x.com', password='pass12345')
        self.buyer = User.objects.create_user(username='b@x.com', email='b@x.com', password='pass12345')
        self.admin = User.objects.create_user(username='a@x.com', email='a@x.com', password='pass12345', is_staff=True)

        self.book = DigitalBook.objects.create(name='B1 Book', level='B1', price=500)
        self.book.file.save('b1.pdf', ContentFile(PDF))
        BookAccess.objects.create(user=self.buyer, book=self.book, is_active=True)

        self.level = CourseLevel.objects.create(name='A1', title='A1', price=1500, order=1)
        self.cfile = CourseFile.objects.create(level=self.level, name='Kapitel 1')
        self.cfile.file.save('kapitel_1.docx', ContentFile(DOCX))
        LevelAccess.objects.create(user=self.buyer, level=self.level, is_active=True)

    def client_for(self, user=None):
        c = APIClient()
        if user:
            c.credentials(HTTP_AUTHORIZATION=f'Bearer {RefreshToken.for_user(user).access_token}')
        return c

    # --- The reported hole: admin book list for non-admins -------------------------------
    def test_student_cannot_list_admin_books(self):
        r = self.client_for(self.student).get('/api/books/admin/')
        self.assertEqual(r.status_code, 403)

    def test_anonymous_cannot_list_admin_books(self):
        self.assertEqual(self.client_for().get('/api/books/admin/').status_code, 401)

    def test_student_cannot_use_any_admin_endpoint(self):
        c = self.client_for(self.student)
        for method, url in [
            ('get', '/api/courses/admin/levels/'),
            ('get', f'/api/books/admin/{self.book.id}/users/'),
            ('post', f'/api/books/admin/{self.book.id}/grant/'),
            ('post', f'/api/courses/admin/levels/{self.level.id}/grant/'),
            ('patch', f'/api/books/admin/{self.book.id}/'),
            ('delete', f'/api/books/admin/{self.book.id}/'),
        ]:
            with self.subTest(url=url, method=method):
                self.assertEqual(getattr(c, method)(url, {'user_id': self.student.id}, format='json').status_code, 403)

    def test_admin_with_jwt_can_list_books_without_file_urls(self):
        r = self.client_for(self.admin).get('/api/books/admin/')
        self.assertEqual(r.status_code, 200)
        self.assertNotIn('/media/', r.content.decode())
        book = r.json()[0]
        self.assertNotIn('file', book)
        self.assertTrue(book['has_file'])

    # --- Files are never publicly reachable ----------------------------------------------
    def test_files_are_not_in_public_media(self):
        import os
        self.assertFalse(os.path.exists(os.path.join(self.tmp_public, self.book.file.name)))
        self.assertTrue(os.path.exists(os.path.join(self.tmp_protected, self.book.file.name)))
        with self.assertRaises(ValueError):
            self.book.file.url  # noqa: B018 — no public URL exists

    def test_student_lists_have_no_file_urls(self):
        r = self.client_for(self.student).get('/api/books/')
        self.assertEqual(r.status_code, 200)
        self.assertNotIn('file', r.json()['B1'][0])
        r = self.client_for(self.admin).get(f'/api/courses/levels/{self.level.id}/videos/')
        if r.status_code == 200:  # Bunny may be unconfigured in tests
            self.assertNotIn('/media/', r.content.decode())

    # --- /view/ only for owners -----------------------------------------------------------
    def test_book_view_requires_access(self):
        url = f'/api/books/{self.book.id}/view/'
        self.assertEqual(self.client_for().get(url).status_code, 401)
        self.assertEqual(self.client_for(self.student).get(url).status_code, 403)
        r = self.client_for(self.buyer).get(url)
        self.assertEqual(r.status_code, 200)
        self.assertEqual(b''.join(r.streaming_content), PDF)
        self.assertEqual(r['Content-Type'], 'application/pdf')
        self.assertTrue(r['Content-Disposition'].startswith('inline'))
        self.assertEqual(r['Cache-Control'], 'private, no-store')

    def test_course_file_view_keeps_real_type_and_requires_access(self):
        url = f'/api/courses/levels/{self.level.id}/files/{self.cfile.id}/view/'
        self.assertEqual(self.client_for(self.student).get(url).status_code, 403)
        r = self.client_for(self.buyer).get(url)
        self.assertEqual(r.status_code, 200)
        self.assertIn('wordprocessingml', r['Content-Type'])
        self.assertIn('.docx', r['Content-Disposition'])

    @override_settings(PROTECTED_MEDIA_USE_X_ACCEL=True, PROTECTED_MEDIA_X_ACCEL_PREFIX='/_protected/')
    def test_x_accel_redirect_in_production_mode(self):
        r = self.client_for(self.buyer).get(f'/api/books/{self.book.id}/view/')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r['X-Accel-Redirect'], f'/_protected/{self.book.file.name}')
        self.assertEqual(r.content, b'')

    # --- Groups endpoint only accepts known roles -----------------------------------------
    def test_groups_rejects_unknown_roles(self):
        c = self.client_for(self.admin)
        url = f'/api/users/{self.student.id}/groups/'
        self.assertEqual(c.post(url, {'groups': ['SuperHacker']}, format='json').status_code, 400)
        self.assertEqual(c.post(url, {'groups': ['Moderator']}, format='json').status_code, 200)
        self.assertEqual(self.client_for(self.student).post(url, {'groups': ['Admin']}, format='json').status_code, 403)
