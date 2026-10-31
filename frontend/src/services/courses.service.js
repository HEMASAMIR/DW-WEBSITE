import apiClient, { saveBlob, filenameFromResponse, getWithRetry } from './api';
import { langMeta } from '@/lib/i18n';
import { API_ENDPOINTS } from '@/constants/apiRoutes';
import { withAdminAccess } from './adminAccess';
const toNumber = (v) => (v === null || v === undefined || v === '' ? null : Number(v));

/** Normalizes an API level. Only backend data — no hard-coded text. */
export function normalizeLevel(level) {
  return {
    id: level.id,
    code: level.name,
    title: level.title,
    description: level.description,
    price: toNumber(level.price),
    oldPrice: toNumber(level.old_price),
    order: level.order ?? 0,
    hasAccess: !!level.has_access,
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

export function formatLectureTitle(title, index = 0) {
  if (!title || typeof title !== 'string') return `المحاضرة ${index + 1}`;
  const t = title.trim();
  const isRaw = /(^GMT|\.mp4$|\.mov$|\.mkv$|\.avi$|^Recording|^VID_|^Zoom_)/i.test(t);
  if (isRaw) {
    return index === 0
      ? 'الدرس الأول: مدخل اللغة الألمانية - كتاب Netzwerk Neu'
      : `المحاضرة ${index + 1}`;
  }
  return t;
}

export const coursesService = {
  getLevels: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.COURSE_LEVELS);
    const list = Array.isArray(data) ? data : data?.results || data?.value || [];
    return list.map(normalizeLevel).sort((a, b) => a.order - b.order);
  },

  /** Real catalog for visitors who are not logged in (served by the site, see lib/publicCatalog). */
  getPublicLevels: async () => {
    const { data } = await getWithRetry('/public-data/levels');
    return (Array.isArray(data) ? data : []).map(normalizeLevel).sort((a, b) => a.order - b.order);
  },

  /** Returns { level, videos, files }. Throws 403 if the user has no access. */
  getLevelContent: async (levelId) => {
    const { data } = await withAdminAccess('level', levelId, () => apiClient.get(API_ENDPOINTS.LEVEL_VIDEOS(levelId)));
    const sortedVideos = [...(data.videos || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return {
      level: data.level ? normalizeLevel(data.level) : null,
      videos: sortedVideos.map((v, i) => ({
        ...v,
        title: formatLectureTitle(v.title, i),
        raw_title: v.title,
      })),
      files: (data.files || []).filter((f) => f.is_active !== false),
    };
  },

  viewFile: (levelId, file, onProgress) =>
    withAdminAccess('level', levelId, () => fetchFile(API_ENDPOINTS.COURSE_FILE_VIEW(levelId, file.id), file.name || 'file', onProgress)),

  trackWatch: (levelId, videoId, videoTitle) => trackVideoWatch(levelId, videoId, videoTitle),
  getWatchedVideos: () => getLocalWatchedVideos(),
};

export async function trackVideoWatch(levelId, videoId, videoTitle) {
  if (typeof window !== 'undefined') {
    try {
      const watched = JSON.parse(localStorage.getItem('dw_watched_videos') || '[]');
      if (!watched.includes(String(videoId))) {
        watched.push(String(videoId));
        localStorage.setItem('dw_watched_videos', JSON.stringify(watched));
      }
    } catch {}
  }
  try {
    return (await apiClient.post('/site-data/activity', { level_id: levelId, video_id: videoId, video_title: videoTitle })).data;
  } catch {
    return null;
  }
}

export function getLocalWatchedVideos() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('dw_watched_videos') || '[]');
  } catch {
    return [];
  }
}

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
  return Number(value).toLocaleString(langMeta().locale, { maximumFractionDigits: 2 });
}

/** Western digits (2,000) — reads better than Arabic-Indic digits at large display sizes. */
export function formatPriceLatin(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return null;
  return Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 });
}
