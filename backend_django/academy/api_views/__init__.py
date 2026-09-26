from .auth_views import (
    RegisterAPIView,
    LoginAPIView,
    TokenRefreshAPIView,
    GoogleSignInAPIView,
    AppleSignInAPIView,
    LogoutAPIView,
    ForgotPasswordAPIView,
    ResetPasswordAPIView,
    UserProfileAPIView,
    ChangePasswordAPIView,
    AdminUserGroupsAPIView,
)

from .courses_views import (
    CourseLevelsAPIView,
    LevelVideosAPIView,
    CourseFileDownloadAPIView,
)

from .comments_views import (
    VideoCommentsAPIView,
    VideoCommentReplyAPIView,
    VideoCommentDetailAPIView,
)

from .books_views import (
    BooksListAPIView,
    BookDownloadAPIView,
)

from .admin_views import (
    AdminCourseLevelsAPIView,
    AdminGrantLevelAccessAPIView,
    AdminRevokeLevelAccessAPIView,
    AdminLevelUsersAPIView,
    AdminRefreshVideoCacheAPIView,
    AdminBooksAPIView,
    AdminBookDetailAPIView,
    AdminBookUsersAPIView,
    AdminGrantBookAccessAPIView,
    AdminRevokeBookAccessAPIView,
    AdminUserManageAPIView,
    AdminCourseRequestsAPIView,
    AdminBookRequestsAPIView,
)
