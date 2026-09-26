import apiClient, { saveBlob, filenameFromResponse, tokenStorage } from './api';
import { API_ENDPOINTS } from '@/constants/apiRoutes';
const toNumber = (v) => (v === null || v === undefined || v === '' ? null : Number(v));

/** Normalizes an API level. Admin automatically has full access to all levels. */
export function normalizeLevel(level) {
  const user = tokenStorage.getUser();
  const isAdmin = user && (
    !!user.is_staff || 
    !!user.is_superuser || 
    !!user.is_admin || 
    user.role === 'admin' || 
    user.username === 'admin' || 
    (Array.isArray(user.groups) && user.groups.some(g => (typeof g === 'string' ? g : g?.name) === 'Admin'))
  );
  return {
    id: level.id,
    code: level.name,
    title: level.title,
    description: level.description,
    price: toNumber(level.price),
    oldPrice: toNumber(level.old_price),
    order: level.order ?? 0,
    hasAccess: isAdmin ? true : !!level.has_access,
    subName: null,
    badge: null,
    features: [],
  };
}

/** Parses a JSON error body out of a Blob response so getErrorMessage() can read it. */
async function unwrapBlobError(error) {
  const data = error.response?.data;
  if (data instanceof Blob && data.type?.includes('json')) {
    try {
      error.response.data = JSON.parse(await data.text());
    } catch {
      // keep original
    }
  }
  throw error;
}

/**
 * Fetches an authenticated file (the /view/ endpoints need the Bearer token, so they can't be
 * opened as a plain link). Returns { blob, filename, type }.
 */
export async function fetchFile(url, fallbackName, onProgress) {
  try {
    const response = await apiClient.get(url, {
      responseType: 'blob',
      timeout: 300000,
      onDownloadProgress: (e) => onProgress?.(e.total ? e.loaded / e.total : null, e.loaded),
    });
    const filename = filenameFromResponse(response, fallbackName);
    let type = response.data.type || response.headers?.['content-type'] || '';
    // Servers sometimes send PDFs as application/octet-stream; trust the extension then.
    if (!type.includes('pdf') && /\.pdf$/i.test(filename)) type = 'application/pdf';
    const blob = type && type !== response.data.type ? new Blob([response.data], { type }) : response.data;
    return { blob, filename, type };
  } catch (error) {
    return unwrapBlobError(error);
  }
}

export function saveFile({ blob, filename }) {
  saveBlob(blob, filename);
}

export const coursesService = {
  getLevels: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.COURSE_LEVELS);
    const list = Array.isArray(data) ? data : data?.results || data?.value || [];
    return list.map(normalizeLevel).sort((a, b) => a.order - b.order);
  },

  /** Real catalog for visitors who are not logged in (served by the site, see lib/publicCatalog). */
  getPublicLevels: async () => {
    const { data } = await apiClient.get('/public-data/levels');
    return (Array.isArray(data) ? data : []).map(normalizeLevel).sort((a, b) => a.order - b.order);
  },

  /** Returns { level, videos, files }. Throws 403 if the user has no access. */
  getLevelContent: async (levelId) => {
    const { data } = await apiClient.get(API_ENDPOINTS.LEVEL_VIDEOS(levelId));
    return {
      level: data.level ? normalizeLevel(data.level) : null,
      videos: [...(data.videos || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      files: (data.files || []).filter((f) => f.is_active !== false),
    };
  },

  viewFile: (levelId, file, onProgress) =>
    fetchFile(API_ENDPOINTS.COURSE_FILE_VIEW(levelId, file.id), file.name || 'file', onProgress),
};

export function formatDuration(seconds) {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function formatPrice(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return Number(value).toLocaleString('ar-EG', { maximumFractionDigits: 2 });
}
