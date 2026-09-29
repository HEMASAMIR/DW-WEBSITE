import apiClient, { isMissingEndpoint } from './api';
import { API_ENDPOINTS } from '@/constants/apiRoutes';
import { fetchFile } from './courses.service';
import { legacyAdmin, invalidateLegacy } from './adminLegacy';

/**
 * 'full'   → backend has the /api/admin/ dashboard API.
 * 'legacy' → the backend live today: the dashboard runs on its existing admin endpoints (see adminLegacy).
 * Detected once per page load.
 */
let modePromise = null;
export function getAdminMode() {
  if (!modePromise) {
    modePromise = apiClient.get(API_ENDPOINTS.ADMIN_PENDING_COUNT)
      .then(() => 'full')
      .catch((e) => {
        if (isMissingEndpoint(e)) return 'legacy';
        modePromise = null; // network / auth error: try again next time
        return 'full';
      });
  }
  return modePromise;
}

/** Runs `full()` on the dashboard API, or `legacy()` on the live backend's endpoints. */
const pick = (full, legacy) => async (...args) => ((await getAdminMode()) === 'legacy' ? legacy(...args) : full(...args));

const list = (data) => (Array.isArray(data) ? data : data?.results || []);
const get = async (url, params) => (await apiClient.get(url, { params })).data;
const post = async (url, body) => (await apiClient.post(url, body)).data;
const patch = async (url, body) => (await apiClient.patch(url, body)).data;
const del = async (url) => (await apiClient.delete(url)).data;

export const adminService = {
  // ---- Overview ----
  getOverview: pick(() => get(API_ENDPOINTS.ADMIN_OVERVIEW), legacyAdmin.getOverview),
  /** → { pending, level, book } */
  getPendingCount: pick(() => get(API_ENDPOINTS.ADMIN_PENDING_COUNT), async () => ({ pending: 0, level: 0, book: 0 })),

  // ---- Access requests ----
  /** params: { kind: 'level'|'book', status, level, search } → { counts, results } */
  getRequests: (params) => get(API_ENDPOINTS.ADMIN_REQUESTS, params),
  approveRequest: (id, adminNote = '') => post(API_ENDPOINTS.ADMIN_REQUEST_ACTION(id, 'approve'), { admin_note: adminNote }),
  rejectRequest: (id, adminNote = '') => post(API_ENDPOINTS.ADMIN_REQUEST_ACTION(id, 'reject'), { admin_note: adminNote }),
  deleteRequest: (id) => del(API_ENDPOINTS.ADMIN_REQUEST(id)),
  viewReceipt: (id, onProgress) => fetchFile(API_ENDPOINTS.ADMIN_REQUEST_RECEIPT(id), `receipt-${id}`, onProgress),

  // ---- Users ----
  /** params: { search, role, status, level, page } → { count, page, pages, results } */
  getUsers: pick((params) => get(API_ENDPOINTS.ADMIN_USERS, params), legacyAdmin.getUsers),
  getUser: pick((id) => get(API_ENDPOINTS.ADMIN_USER(id)), legacyAdmin.getUser),
  createUser: pick((fields) => post(API_ENDPOINTS.ADMIN_USERS, fields), legacyAdmin.createUser),
  updateUser: pick((id, fields) => patch(API_ENDPOINTS.ADMIN_USER(id), fields), legacyAdmin.updateUser),
  deleteUser: pick((id) => del(API_ENDPOINTS.ADMIN_USER(id)), legacyAdmin.deleteUser),
  /** Live backend only: who each level / book is unlocked for → { items, rows } */
  getAccessList: (kind, force) => legacyAdmin.getAccessList(kind, force),
  setUserAccess: pick((id, kind, itemId, grant) => post(API_ENDPOINTS.ADMIN_USER_ACCESS(id), { kind, item_id: itemId, grant }), legacyAdmin.setUserAccess),

  // ---- Levels (courses) ----
  getLevels: pick(async () => list(await get(API_ENDPOINTS.ADMIN_LEVELS_CRUD)), legacyAdmin.getLevels),
  createLevel: pick((fields) => post(API_ENDPOINTS.ADMIN_LEVELS_CRUD, fields), legacyAdmin.createLevel),
  updateLevel: pick((id, fields) => patch(API_ENDPOINTS.ADMIN_LEVEL(id), fields), legacyAdmin.updateLevel),
  deleteLevel: pick((id) => del(API_ENDPOINTS.ADMIN_LEVEL(id)), legacyAdmin.deleteLevel),
  refreshVideoCache: (levelId) => post(API_ENDPOINTS.ADMIN_REFRESH_CACHE(levelId)),
  getLevelContent: (id) => get(API_ENDPOINTS.ADMIN_LEVEL_CONTENT(id)),
  addVideo: (levelId, fields) => post(API_ENDPOINTS.ADMIN_LEVEL_CONTENT(levelId), { type: 'video', ...fields }),
  updateVideo: (id, fields) => patch(API_ENDPOINTS.ADMIN_VIDEO(id), fields),
  deleteVideo: (id) => del(API_ENDPOINTS.ADMIN_VIDEO(id)),
  addFile: (levelId, fields) => post(API_ENDPOINTS.ADMIN_LEVEL_CONTENT(levelId), toFormData({ type: 'file', ...fields })),
  updateFile: (id, fields) => patch(API_ENDPOINTS.ADMIN_FILE(id), fields),
  deleteFile: (id) => del(API_ENDPOINTS.ADMIN_FILE(id)),

  // ---- Books ----
  getBooks: pick(async () => list(await get(API_ENDPOINTS.ADMIN_BOOKS)), legacyAdmin.getBooks),
  /** fields: { name, level, price, is_active, file? } — sent as multipart/form-data. */
  createBook: (fields) => post(API_ENDPOINTS.ADMIN_BOOKS, toFormData(fields)).finally(invalidateLegacy),
  updateBook: (bookId, fields) => patch(API_ENDPOINTS.ADMIN_BOOK_DETAIL(bookId), toFormData(fields)).finally(invalidateLegacy),
  deleteBook: (bookId) => del(API_ENDPOINTS.ADMIN_BOOK_DETAIL(bookId)).finally(invalidateLegacy),

  // ---- Branches ----
  getBranches: pick(async () => list(await get(API_ENDPOINTS.ADMIN_BRANCHES)), legacyAdmin.getBranches),
  createBranch: pick((fields) => post(API_ENDPOINTS.ADMIN_BRANCHES, fields), legacyAdmin.createBranch),
  updateBranch: pick((id, fields) => patch(API_ENDPOINTS.ADMIN_BRANCH(id), fields), legacyAdmin.updateBranch),
  deleteBranch: pick((id) => del(API_ENDPOINTS.ADMIN_BRANCH(id)), legacyAdmin.deleteBranch),
  /** Moves a branch one place earlier (-1) or later (1) in the display order. */
  moveBranch: pick(async (id, dir, branches) => {
    const i = branches.findIndex((b) => b.id === id);
    const a = branches[i];
    const b = branches[i + dir];
    if (!a || !b) return;
    await patch(API_ENDPOINTS.ADMIN_BRANCH(a.id), { order: i + 1 + dir });
    await patch(API_ENDPOINTS.ADMIN_BRANCH(b.id), { order: i + 1 });
  }, (id, dir) => legacyAdmin.moveBranch(id, dir)),

  // ---- Announcement banner ----
  getAnnouncement: pick(() => get(API_ENDPOINTS.ANNOUNCEMENT), legacyAdmin.getAnnouncement),
  saveAnnouncement: pick((fields) => post(API_ENDPOINTS.ANNOUNCEMENT, fields), legacyAdmin.saveAnnouncement),
};

function toFormData(fields) {
  const fd = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    fd.append(key, typeof value === 'boolean' ? String(value) : value);
  });
  return fd;
}
