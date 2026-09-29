from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet, 
    StudentRegistrationViewSet, 
    BookViewSet, 
    BookOrderViewSet, 
    PlacementQuizSubmissionViewSet,
    AcademyStudentViewSet,
    LessonCommentViewSet,
    LevelEnrollmentRequestViewSet,
    BranchViewSet,
    AnalyticsSummaryView
)
from .views_auth import LoginAPIView as LegacyLoginAPIView, LogoutAPIView as LegacyLogoutAPIView, UserMeAPIView
from . import api_views as api
from .api_views import (
    AdminUserManageAPIView,
    AdminCourseRequestsAPIView,
    AdminBookRequestsAPIView,
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'registrations', StudentRegistrationViewSet)
router.register(r'books', BookViewSet)
router.register(r'orders', BookOrderViewSet)
router.register(r'quizzes', PlacementQuizSubmissionViewSet)
router.register(r'students', AcademyStudentViewSet)
router.register(r'comments', LessonCommentViewSet)
router.register(r'level-requests', LevelEnrollmentRequestViewSet)
router.register(r'branches', BranchViewSet)

urlpatterns = [
    path('api/analytics/summary/', AnalyticsSummaryView.as_view(), name='analytics-summary'),

    
    # Legacy Auth Endpoints
    path('api/auth/login/', LegacyLoginAPIView.as_view(), name='auth-login'),
    path('api/auth/logout/', LegacyLogoutAPIView.as_view(), name='auth-logout'),
    path('api/auth/me/', UserMeAPIView.as_view(), name='auth-me'),

    # =========================================================================
    # OFFICIAL DEUTSCH WELT MOBILE & WEB API SUITE ENDPOINTS
    # =========================================================================
    
    # 1. Authentication & Users
    path('api/users/register/', api.RegisterAPIView.as_view(), name='api-register'),
    path('api/users/login/', api.LoginAPIView.as_view(), name='api-login'),
    path('api/users/login/refresh/', api.TokenRefreshAPIView.as_view(), name='api-refresh'),
    path('api/users/auth/google/', api.GoogleSignInAPIView.as_view(), name='api-google-signin'),
    path('api/users/auth/apple/', api.AppleSignInAPIView.as_view(), name='api-apple-signin'),
    path('api/users/logout/', api.LogoutAPIView.as_view(), name='api-logout'),
    path('api/users/password/forgot/', api.ForgotPasswordAPIView.as_view(), name='api-password-forgot'),
    path('api/users/password/reset/', api.ResetPasswordAPIView.as_view(), name='api-password-reset'),
    path('api/users/profile/', api.UserProfileAPIView.as_view(), name='api-profile'),
    path('api/users/password/change/', api.ChangePasswordAPIView.as_view(), name='api-password-change'),
    path('api/users/<int:user_id>/groups/', api.AdminUserGroupsAPIView.as_view(), name='api-user-groups'),

    # 2. Courses, Levels & Video Streaming
    path('api/courses/levels/', api.CourseLevelsAPIView.as_view(), name='api-levels-list'),
    path('api/courses/levels/<int:level_id>/videos/', api.LevelVideosAPIView.as_view(), name='api-level-videos'),
    path('api/courses/levels/<int:level_id>/files/<int:file_id>/view/', api.CourseFileViewAPIView.as_view(), name='api-course-file-view'),
    path('api/courses/levels/<int:level_id>/files/<int:file_id>/download/', api.CourseFileDownloadAPIView.as_view(), name='api-course-file-download'),

    # 3. Comments & Discussion Forum
    path('api/courses/levels/<int:level_id>/videos/<str:video_id>/comments/', api.VideoCommentsAPIView.as_view(), name='api-comments'),
    path('api/courses/levels/<int:level_id>/videos/<str:video_id>/comments/<int:comment_id>/reply/', api.VideoCommentReplyAPIView.as_view(), name='api-comment-reply'),
    path('api/courses/levels/<int:level_id>/videos/<str:video_id>/comments/<int:comment_id>/', api.VideoCommentDetailAPIView.as_view(), name='api-comment-detail'),

    # 4. Admin Courses Management
    path('api/courses/admin/levels/', api.AdminCourseLevelsAPIView.as_view(), name='api-admin-levels'),
    path('api/courses/admin/levels/<int:level_id>/grant/', api.AdminGrantLevelAccessAPIView.as_view(), name='api-admin-grant-level'),
    path('api/courses/admin/levels/<int:level_id>/revoke/', api.AdminRevokeLevelAccessAPIView.as_view(), name='api-admin-revoke-level'),
    path('api/courses/admin/levels/<int:level_id>/users/', api.AdminLevelUsersAPIView.as_view(), name='api-admin-level-users'),
    path('api/courses/admin/levels/<int:level_id>/refresh-cache/', api.AdminRefreshVideoCacheAPIView.as_view(), name='api-admin-refresh-cache'),

    # 5. Books Store (Student & Admin)
    path('api/books/', api.BooksListAPIView.as_view(), name='api-books-list'),
    path('api/books/<int:book_id>/', api.BookDetailAPIView.as_view(), name='api-book-detail'),
    path('api/books/<int:book_id>/view/', api.BookViewAPIView.as_view(), name='api-book-view'),
    path('api/books/<int:book_id>/download/', api.BookDownloadAPIView.as_view(), name='api-book-download'),
    path('api/books/admin/', api.AdminBooksAPIView.as_view(), name='api-admin-books'),
    path('api/books/admin/<int:book_id>/', api.AdminBookDetailAPIView.as_view(), name='api-admin-book-detail'),
    path('api/books/admin/<int:book_id>/users/', api.AdminBookUsersAPIView.as_view(), name='api-admin-book-users'),
    path('api/books/admin/<int:book_id>/grant/', api.AdminGrantBookAccessAPIView.as_view(), name='api-admin-grant-book'),
    path('api/books/admin/<int:book_id>/revoke/', api.AdminRevokeBookAccessAPIView.as_view(), name='api-admin-revoke-book'),

    # 6. Admin User Management
    path('api/users/manage/', AdminUserManageAPIView.as_view(), name='api-admin-users-manage'),

    # 7. Admin Course Enrollment Requests
    path('api/courses/admin/requests/', AdminCourseRequestsAPIView.as_view(), name='api-admin-course-requests'),

    # 8. Admin Book Access Requests
    path('api/books/admin/requests/', AdminBookRequestsAPIView.as_view(), name='api-admin-book-requests'),

    # 9. Site Announcement Banner (Admin & Public)
    path('api/announcements/', api.AnnouncementAPIView.as_view(), name='api-announcements'),

    # 10. Access requests (student → admin approval)
    path('api/requests/', api.AccessRequestCreateAPIView.as_view(), name='api-requests-create'),
    path('api/requests/mine/', api.MyAccessRequestsAPIView.as_view(), name='api-requests-mine'),

    # 11. Admin dashboard
    path('api/admin/overview/', api.dashboard.AdminOverviewAPIView.as_view(), name='api-admin-overview'),
    path('api/admin/pending-count/', api.dashboard.AdminPendingCountAPIView.as_view(), name='api-admin-pending-count'),
    path('api/admin/requests/', api.dashboard.AdminRequestsAPIView.as_view(), name='api-admin-requests'),
    path('api/admin/requests/<int:request_id>/', api.dashboard.AdminRequestDetailAPIView.as_view(), name='api-admin-request-detail'),
    path('api/admin/requests/<int:request_id>/receipt/', api.dashboard.AdminRequestReceiptAPIView.as_view(), name='api-admin-request-receipt'),
    path('api/admin/requests/<int:request_id>/<str:action>/', api.dashboard.AdminRequestActionAPIView.as_view(), name='api-admin-request-action'),
    path('api/admin/users/', api.dashboard.AdminUsersAPIView.as_view(), name='api-admin-users'),
    path('api/admin/users/<int:user_id>/', api.dashboard.AdminUserDetailAPIView.as_view(), name='api-admin-user-detail'),
    path('api/admin/users/<int:user_id>/access/', api.dashboard.AdminUserAccessAPIView.as_view(), name='api-admin-user-access'),
    path('api/admin/levels/', api.dashboard.AdminLevelsCrudAPIView.as_view(), name='api-admin-levels-crud'),
    path('api/admin/levels/<int:level_id>/', api.dashboard.AdminLevelCrudDetailAPIView.as_view(), name='api-admin-level-crud'),
    path('api/admin/levels/<int:level_id>/content/', api.dashboard.AdminLevelContentAPIView.as_view(), name='api-admin-level-content'),
    path('api/admin/videos/<int:video_id>/', api.dashboard.AdminVideoDetailAPIView.as_view(), name='api-admin-video'),
    path('api/admin/files/<int:file_id>/', api.dashboard.AdminFileDetailAPIView.as_view(), name='api-admin-file'),
    path('api/admin/branches/', api.dashboard.AdminBranchesAPIView.as_view(), name='api-admin-branches'),
    path('api/admin/branches/<int:branch_id>/', api.dashboard.AdminBranchDetailAPIView.as_view(), name='api-admin-branch'),

    # Default Router URLs
    path('api/', include(router.urls)),
]

