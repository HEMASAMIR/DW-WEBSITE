// Django REST API Routes Definition
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  // Auth & Profile
  LOGIN: '/api/users/login/',
  REGISTER: '/api/users/register/',
  LOGOUT: '/api/users/logout/',
  REFRESH_TOKEN: '/api/users/login/refresh/',
  GOOGLE_SIGNIN: '/api/users/auth/google/',
  PROFILE: '/api/users/profile/',
  CHANGE_PASSWORD: '/api/users/password/change/',
  FORGOT_PASSWORD: '/api/users/password/forgot/',
  RESET_PASSWORD: '/api/users/password/reset/',

  // Courses & Levels
  COURSES: '/api/courses/',
  COURSE_LEVELS: '/api/courses/levels/',
  LEVEL_VIDEOS: (levelId) => `/api/courses/levels/${levelId}/videos/`,
  COURSE_FILE_DOWNLOAD: (levelId, fileId) => `/api/courses/levels/${levelId}/files/${fileId}/download/`,
  LEVEL_ENROLL_REQUEST: '/api/level-requests/',

  // Comments
  VIDEO_COMMENTS: (levelId, videoId) => `/api/courses/levels/${levelId}/videos/${videoId}/comments/`,
  COMMENT_REPLY: (levelId, videoId, commentId) => `/api/courses/levels/${levelId}/videos/${videoId}/comments/${commentId}/reply/`,

  // Books
  BOOKS: '/api/books/',
  BOOK_ORDER: '/api/orders/',
  BOOK_DOWNLOAD: (bookId) => `/api/books/${bookId}/download/`,

  // Quiz
  PLACEMENT_QUIZ: '/api/quizzes/',

  // Branches
  BRANCHES: '/api/branches/',

  // Admin Endpoints
  ANALYTICS_SUMMARY: '/api/analytics/summary/',
  ADMIN_USERS: '/api/users/manage/',
  ADMIN_COURSE_REQUESTS: '/api/courses/admin/requests/',
  ADMIN_BOOK_REQUESTS: '/api/books/admin/requests/',
  ADMIN_GRANT_LEVEL: (levelId) => `/api/courses/admin/levels/${levelId}/grant/`,
  ADMIN_REVOKE_LEVEL: (levelId) => `/api/courses/admin/levels/${levelId}/revoke/`,
  ADMIN_GRANT_BOOK: (bookId) => `/api/books/admin/${bookId}/grant/`,
  ADMIN_REVOKE_BOOK: (bookId) => `/api/books/admin/${bookId}/revoke/`,
  ADMIN_REFRESH_CACHE: (levelId) => `/api/courses/admin/levels/${levelId}/refresh-cache/`,
};
