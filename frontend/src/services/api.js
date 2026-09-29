import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/apiRoutes';
import { t } from '@/lib/i18n';

const KEYS = {
  ACCESS: 'dw_access_token',
  REFRESH: 'dw_refresh_token',
  USER: 'dw_user',
};

export const AUTH_LOGOUT_EVENT = 'dw:auth-logout';

const isBrowser = () => typeof window !== 'undefined';

export const tokenStorage = {
  getAccess: () => (isBrowser() ? localStorage.getItem(KEYS.ACCESS) : null),
  getRefresh: () => (isBrowser() ? localStorage.getItem(KEYS.REFRESH) : null),
  getUser: () => {
    if (!isBrowser()) return null;
    try {
      return JSON.parse(localStorage.getItem(KEYS.USER) || 'null');
    } catch {
      return null;
    }
  },
  setTokens: ({ access, refresh }) => {
    if (!isBrowser()) return;
    if (access) localStorage.setItem(KEYS.ACCESS, access);
    if (refresh) localStorage.setItem(KEYS.REFRESH, refresh);
  },
  setUser: (user) => {
    if (isBrowser()) localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },
  clear: () => {
    if (!isBrowser()) return;
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    // Legacy key from the previous frontend build
    localStorage.removeItem('dw_token');
  },
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: 'application/json' },
  timeout: 20000,
});

// Public auth endpoints: a stale token in the header would make DRF reject them with 401.
const PUBLIC_URLS = [
  API_ENDPOINTS.LOGIN,
  API_ENDPOINTS.REGISTER,
  API_ENDPOINTS.GOOGLE_SIGNIN,
  API_ENDPOINTS.FORGOT_PASSWORD,
  API_ENDPOINTS.RESET_PASSWORD,
];

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token && !PUBLIC_URLS.includes(config.url)) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Single in-flight refresh shared by all requests that hit 401 at the same time.
let refreshPromise = null;

async function refreshAccessToken() {
  const refresh = tokenStorage.getRefresh();
  if (!refresh) throw new Error('no refresh token');
  const { data } = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`, { refresh });
  tokenStorage.setTokens({ access: data.access, refresh: data.refresh });
  return data.access;
}

const NO_REFRESH_URLS = [...PUBLIC_URLS, API_ENDPOINTS.REFRESH_TOKEN];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const skip = !original || original._retry || NO_REFRESH_URLS.includes(original.url);

    if (status === 401 && !skip && tokenStorage.getRefresh()) {
      original._retry = true;
      try {
        refreshPromise = refreshPromise || refreshAccessToken().finally(() => { refreshPromise = null; });
        const access = await refreshPromise;
        original.headers.Authorization = `Bearer ${access}`;
        return apiClient(original);
      } catch {
        tokenStorage.clear();
        if (isBrowser()) window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
      }
    }
    return Promise.reject(error);
  }
);

const STATUS_MESSAGES = {
  401: 'انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى.',
  403: 'ليس لديك صلاحية الوصول لهذا المحتوى.',
  404: 'العنصر المطلوب غير موجود.',
  429: 'محاولات كثيرة في وقت قصير، يرجى الانتظار قليلاً ثم المحاولة.',
  502: 'تعذر الاتصال بخادم الفيديو حالياً، حاول مرة أخرى لاحقاً.',
};

/**
 * Turns an axios error into a readable message in the visitor's language (Arabic texts —
 * including the backend's own — are translated when the site dictionary knows them).
 * Handles `{detail}` and DRF field errors `{field: ["msg"]}`.
 */
export function getErrorMessage(error, fallback) {
  return t(errorText(error, fallback || t('حدث خطأ غير متوقع، حاول مرة أخرى.')));
}

// i18n-translated: getErrorMessage passes the result through t()
function errorText(error, fallback) {
  if (!error) return fallback;
  if (!error.response) {
    if (error.code === 'ECONNABORTED') return 'انتهت مهلة الاتصال بالخادم، حاول مرة أخرى.';
    return error.message && !error.isAxiosError ? error.message : 'تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت.';
  }
  const { status, data } = error.response;
  if (data && typeof data === 'object' && !(data instanceof Blob)) {
    if (typeof data.detail === 'string') return data.detail;
    const firstField = Object.values(data).find((v) => Array.isArray(v) ? v.length : typeof v === 'string');
    if (firstField) return Array.isArray(firstField) ? String(firstField[0]) : firstField;
  }
  return STATUS_MESSAGES[status] || fallback;
}

/**
 * True when the backend doesn't have this endpoint at all (an older deployment answers with
 * Django's HTML "Not Found" page), as opposed to a JSON 404 like "level not found".
 */
export function isMissingEndpoint(error) {
  const res = error?.response;
  if (!res || res.status !== 404) return false;
  const data = res.data;
  return !(data && typeof data === 'object' && !(data instanceof Blob));
}

/** Saves a Blob response as a file in the browser. */
export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Extracts filename from a Content-Disposition header. */
export function filenameFromResponse(response, fallback) {
  const header = response.headers?.['content-disposition'] || '';
  const utf = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf) return decodeURIComponent(utf[1]);
  const plain = header.match(/filename="?([^";]+)"?/i);
  return plain ? plain[1] : fallback;
}

export default apiClient;
