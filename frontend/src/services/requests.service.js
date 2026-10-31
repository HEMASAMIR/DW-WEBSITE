import apiClient, { isMissingEndpoint } from './api';
import { API_ENDPOINTS } from '@/constants/apiRoutes';

// Backend that has no requests API yet → the website keeps the requests (src/app/site-data/requests).
const SITE_REQUESTS = '/site-data/requests';

function toFormData(fields) {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') fd.append(k, v);
  });
  return fd;
}

function saveLocalRequest(fields, res) {
  if (typeof window === 'undefined') return;
  try {
    const list = JSON.parse(localStorage.getItem('dw_my_requests') || '[]');
    const record = {
      id: res?.id || `local-${Date.now()}`,
      kind: fields.kind,
      item_id: fields.item_id,
      status: 'pending',
      created_at: new Date().toISOString(),
      full_name: fields.full_name,
      phone: fields.phone,
      payment_method: fields.payment_method,
    };
    const next = [record, ...list.filter((x) => !(x.kind === fields.kind && String(x.item_id) === String(fields.item_id)))].slice(0, 30);
    localStorage.setItem('dw_my_requests', JSON.stringify(next));
  } catch {}
}

function getLocalRequests() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('dw_my_requests') || '[]');
  } catch {
    return [];
  }
}

/** Fired on window after a request is sent, so open pages can switch to "under review". */
export const ACCESS_REQUEST_EVENT = 'dw:access-request';

/** A student's request to unlock a level or a book. It waits in the admin dashboard until approved. */
export const requestsService = {
  /** fields: { kind: 'level'|'book', item_id, full_name, phone, payment_method, note?, receipt?: File, coupon? } */
  create: async (fields) => {
    // All requests go directly to the website's persistent cloud store (/site-data/requests)
    const res = (await apiClient.post(SITE_REQUESTS, toFormData(fields))).data;
    saveLocalRequest(fields, res);
    return res;
  },

  /** The logged-in student's own requests only. */
  mine: async () => {
    let data = [];
    try {
      const res = await apiClient.get(API_ENDPOINTS.MY_REQUESTS);
      data = res.data;
    } catch (err) {
      if (isMissingEndpoint(err)) {
        try {
          const res = await apiClient.get(SITE_REQUESTS, { params: { mine: 1 } });
          data = res.data;
        } catch {}
      }
    }
    const serverList = Array.isArray(data) ? data : [];
    const localList = getLocalRequests();
    const merged = [...serverList];
    localList.forEach((local) => {
      if (!merged.some((s) => s.kind === local.kind && String(s.item_id) === String(local.item_id))) {
        merged.push(local);
      }
    });
    return merged;
  },
};

/** Discount coupons — each student has one, ever (src/lib/couponsStore.js). */
export const couponsService = {
  /** → { code, type, value, original, discount, final, ends_at } — throws with the reason when it doesn't apply. */
  check: async (code, kind, itemId) => (await apiClient.post('/site-data/coupons/check', { code, kind, item_id: itemId })).data,
  /** → { used: null | { code, discount, item_name, status, created_at } } */
  mine: async () => (await apiClient.get('/site-data/coupons/mine')).data,
};

/** The student's yearly level subscriptions → [{ level_id, level_code, started_at, expires_at, status }] */
export const subscriptionsService = {
  mine: async () => {
    const { data } = await apiClient.get('/site-data/subscriptions');
    return Array.isArray(data) ? data : [];
  },
};
