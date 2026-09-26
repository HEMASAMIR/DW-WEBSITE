import apiClient from './api';
import { API_ENDPOINTS } from '@/constants/apiRoutes';

const list = (data) => (Array.isArray(data) ? data : data?.results || []);

export const adminService = {
  // ---- Levels ----
  getLevels: async () => list((await apiClient.get(API_ENDPOINTS.ADMIN_LEVELS)).data),

  getLevelUsers: async (levelId) => list((await apiClient.get(API_ENDPOINTS.ADMIN_LEVEL_USERS(levelId))).data),

  grantLevelAccess: async (levelId, userId, notes = '') =>
    (await apiClient.post(API_ENDPOINTS.ADMIN_GRANT_LEVEL(levelId), { user_id: Number(userId), notes })).data,

  revokeLevelAccess: async (levelId, userId) =>
    (await apiClient.post(API_ENDPOINTS.ADMIN_REVOKE_LEVEL(levelId), { user_id: Number(userId) })).data,

  refreshVideoCache: async (levelId) => (await apiClient.post(API_ENDPOINTS.ADMIN_REFRESH_CACHE(levelId))).data,

  // ---- Books ----
  getBooks: async () => list((await apiClient.get(API_ENDPOINTS.ADMIN_BOOKS)).data),

  /** fields: { name, level, price, is_active, file? } — sent as multipart/form-data. */
  createBook: async (fields) => (await apiClient.post(API_ENDPOINTS.ADMIN_BOOKS, toFormData(fields))).data,

  updateBook: async (bookId, fields) =>
    (await apiClient.patch(API_ENDPOINTS.ADMIN_BOOK_DETAIL(bookId), toFormData(fields))).data,

  deleteBook: async (bookId) => (await apiClient.delete(API_ENDPOINTS.ADMIN_BOOK_DETAIL(bookId))).data,

  getBookUsers: async (bookId) => list((await apiClient.get(API_ENDPOINTS.ADMIN_BOOK_USERS(bookId))).data),

  grantBookAccess: async (bookId, userId) =>
    (await apiClient.post(API_ENDPOINTS.ADMIN_GRANT_BOOK(bookId), { user_id: Number(userId) })).data,

  revokeBookAccess: async (bookId, userId) =>
    (await apiClient.post(API_ENDPOINTS.ADMIN_REVOKE_BOOK(bookId), { user_id: Number(userId) })).data,

  // ---- Roles ----
  setUserGroups: async (userId, groups) =>
    (await apiClient.post(API_ENDPOINTS.USER_GROUPS(userId), { groups })).data,

  // ---- Announcement Banner ----
  getAnnouncement: async () => (await apiClient.get(API_ENDPOINTS.ANNOUNCEMENT)).data,
  updateAnnouncement: async (data) => (await apiClient.post(API_ENDPOINTS.ANNOUNCEMENT, data)).data,
};

function toFormData(fields) {
  const fd = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    fd.append(key, typeof value === 'boolean' ? String(value) : value);
  });
  return fd;
}
