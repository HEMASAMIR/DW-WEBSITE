// Deutsch Welt REST API — see MOBILE_DEV_GUIDE (v4) for the full contract.
// Empty = same origin: requests go to /api/* on the website and next.config.mjs proxies them to
// BACKEND_URL (https://py.deutschewelt.academy). Set NEXT_PUBLIC_API_URL only to call a backend
// directly (it must then allow the site's origin via CORS).
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');

export const API_ENDPOINTS = {
  // 1. Authentication
  REGISTER: '/api/users/register/',
  LOGIN: '/api/users/login/',
  REFRESH_TOKEN: '/api/users/login/refresh/',
  GOOGLE_SIGNIN: '/api/users/auth/google/',
  LOGOUT: '/api/users/logout/',
  FORGOT_PASSWORD: '/api/users/password/forgot/',
  RESET_PASSWORD: '/api/users/password/reset/',

  // 2. Profile
  PROFILE: '/api/users/profile/',
  CHANGE_PASSWORD: '/api/users/password/change/',
  USER_GROUPS: (userId) => `/api/users/${userId}/groups/`,

  // 3. Courses & levels
  COURSE_LEVELS: '/api/courses/levels/',
  LEVEL_VIDEOS: (levelId) => `/api/courses/levels/${levelId}/videos/`,
  COURSE_FILE_VIEW: (levelId, fileId) => `/api/courses/levels/${levelId}/files/${fileId}/view/`,

  // 5. Comments
  VIDEO_COMMENTS: (levelId, videoId) => `/api/courses/levels/${levelId}/videos/${videoId}/comments/`,
  COMMENT_DETAIL: (levelId, videoId, commentId) => `/api/courses/levels/${levelId}/videos/${videoId}/comments/${commentId}/`,
  COMMENT_REPLY: (levelId, videoId, commentId) => `/api/courses/levels/${levelId}/videos/${videoId}/comments/${commentId}/reply/`,

  // Admin — levels
  ADMIN_LEVELS: '/api/courses/admin/levels/',
  ADMIN_GRANT_LEVEL: (levelId) => `/api/courses/admin/levels/${levelId}/grant/`,
  ADMIN_REVOKE_LEVEL: (levelId) => `/api/courses/admin/levels/${levelId}/revoke/`,
  ADMIN_LEVEL_USERS: (levelId) => `/api/courses/admin/levels/${levelId}/users/`,
  ADMIN_REFRESH_CACHE: (levelId) => `/api/courses/admin/levels/${levelId}/refresh-cache/`,

  // 7. Books
  BOOKS: '/api/books/',
  BOOK_VIEW: (bookId) => `/api/books/${bookId}/view/`,

  // 10. Books (admin)
  ADMIN_BOOKS: '/api/books/admin/',
  ADMIN_BOOK_DETAIL: (bookId) => `/api/books/admin/${bookId}/`,
  ADMIN_BOOK_USERS: (bookId) => `/api/books/admin/${bookId}/users/`,
  ADMIN_GRANT_BOOK: (bookId) => `/api/books/admin/${bookId}/grant/`,
  ADMIN_REVOKE_BOOK: (bookId) => `/api/books/admin/${bookId}/revoke/`,

  // 11. Site Announcement Banner
  ANNOUNCEMENT: '/api/announcements/',
};

// Relative media paths from the API (e.g. "/media/profile_photos/x.jpg") need the API host.
export function mediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
