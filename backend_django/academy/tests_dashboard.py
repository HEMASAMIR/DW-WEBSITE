"""
Admin dashboard, access requests and privacy.

    python manage.py test academy.tests_dashboard
"""

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from academy.models import AccessRequest, CourseLevel, DigitalBook, LevelAccess, StudentRegistration

User = get_user_model()


def client_for(user=None):
    c = APIClient()
    if user:
        c.credentials(HTTP_AUTHORIZATION=f'Bearer {RefreshToken.for_user(user).access_token}')
    return c


class DashboardTests(TestCase):
    def setUp(self):
        self.level = CourseLevel.objects.create(name='A1', title='Beginner', description='', price=1500)
        self.book = DigitalBook.objects.create(name='Book A2', level='A2', price=300, file='digital_books/x.pdf')
        self.student = User.objects.create_user('sara@example.com', 'sara@example.com', 'pass12345', first_name='Sara')
        self.other = User.objects.create_user('omar@example.com', 'omar@example.com', 'pass12345', first_name='Omar')
        self.admin = User.objects.create_user('boss@example.com', 'boss@example.com', 'pass12345')
        self.admin.groups.add(Group.objects.create(name='Admin'))

    def request_level(self, user=None):
        return client_for(user or self.student).post('/api/requests/', {
            'kind': 'level', 'item_id': self.level.id, 'full_name': 'Sara Ali',
            'phone': '01012345678', 'payment_method': 'فودافون كاش'})

    def test_request_then_approve_unlocks_level_immediately(self):
        res = self.request_level()
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data['status'], 'pending')
        self.assertEqual(self.request_level().status_code, 400)  # no duplicate pending request

        req_id = res.data['id']
        res = client_for(self.admin).post(f'/api/admin/requests/{req_id}/approve/')
        self.assertEqual(res.status_code, 200)
        self.assertTrue(LevelAccess.objects.filter(user=self.student, level=self.level, is_active=True).exists())

        levels = client_for(self.student).get('/api/courses/levels/').data
        self.assertTrue(levels[0]['has_access'])
        self.assertEqual(client_for(self.student).get('/api/requests/mine/').data[0]['status'], 'approved')

    def test_book_requests_are_grouped_by_book_level(self):
        res = client_for(self.student).post('/api/requests/', {
            'kind': 'book', 'item_id': self.book.id, 'full_name': 'Sara', 'phone': '01012345678'})
        self.assertEqual(res.status_code, 201)
        data = client_for(self.admin).get('/api/admin/requests/?kind=book&status=pending').data
        self.assertEqual(data['counts']['pending_by_level'], {'A2': 1})
        self.assertEqual(client_for(self.admin).get('/api/admin/requests/?kind=level').data['results'], [])

    def test_students_cannot_use_admin_endpoints(self):
        for url in ('/api/admin/overview/', '/api/admin/requests/', '/api/admin/users/', '/api/admin/branches/'):
            self.assertEqual(client_for(self.student).get(url).status_code, 403, url)
            self.assertEqual(client_for().get(url).status_code, 401, url)

    def test_students_only_see_their_own_requests(self):
        self.request_level(self.other)
        self.assertEqual(client_for(self.student).get('/api/requests/mine/').data, [])

    def test_user_list_masks_emails(self):
        rows = client_for(self.admin).get('/api/admin/users/').data['results']
        sara = next(r for r in rows if r['id'] == self.student.id)
        self.assertEqual(sara['email_masked'], 'sa***@example.com')
        self.assertNotIn('email', sara)

    def test_legacy_personal_data_is_not_public(self):
        StudentRegistration.objects.create(student_name='X', phone='01000000000', email='x@example.com')
        self.assertEqual(client_for().get('/api/registrations/').status_code, 401)
        self.assertEqual(client_for(self.student).get('/api/registrations/').status_code, 403)
        self.assertEqual(client_for(self.student).get('/api/level-requests/').status_code, 403)
        self.assertEqual(client_for().get('/api/branches/').status_code, 200)
        self.assertEqual(client_for(self.student).post('/api/announcements/', {'title': 'hack'}).status_code, 403)

    def test_admin_crud_level_and_branch(self):
        admin = client_for(self.admin)
        res = admin.post('/api/admin/levels/', {'name': 'b1', 'title': 'Intermediate', 'price': '2500'})
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data['name'], 'B1')
        self.assertEqual(admin.patch(f"/api/admin/levels/{res.data['id']}/", {'is_active': 'false'}).data['is_active'], False)
        res = admin.post('/api/admin/branches/', {'name': 'فرع طنطا', 'city': 'الغربية', 'address': 'ش البحر'})
        self.assertEqual(res.status_code, 201)
        self.assertEqual(admin.delete(f"/api/admin/branches/{res.data['id']}/").status_code, 200)

    def test_admin_sees_all_content(self):
        levels = client_for(self.admin).get('/api/courses/levels/').data
        self.assertTrue(all(l['has_access'] for l in levels))
        self.assertTrue(client_for(self.admin).post('/api/users/login/', {
            'email': 'boss@example.com', 'password': 'pass12345'}).data['user']['is_admin'])
