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

/** Fired on window after a request is sent, so open pages can switch to "under review". */
export const ACCESS_REQUEST_EVENT = 'dw:access-request';

/** A student's request to unlock a level or a book. It waits in the admin dashboard until approved. */
export const requestsService = {
  /** fields: { kind: 'level'|'book', item_id, full_name, phone, payment_method, note?, receipt?: File, coupon? } */
  create: async (fields) => {
    // Coupons live on the website, so a request with one always goes there.
    if (fields.coupon) return (await apiClient.post(SITE_REQUESTS, toFormData(fields))).data;
    try {
      return (await apiClient.post(API_ENDPOINTS.REQUESTS, toFormData(fields))).data;
    } catch (err) {
      if (!isMissingEndpoint(err)) throw err;
      return (await apiClient.post(SITE_REQUESTS, toFormData(fields))).data;
    }
  },

  /** The logged-in student's own requests only. */
  mine: async () => {
    let data;
    try {
      ({ data } = await apiClient.get(API_ENDPOINTS.MY_REQUESTS));
    } catch (err) {
      if (!isMissingEndpoint(err)) throw err;
      ({ data } = await apiClient.get(SITE_REQUESTS, { params: { mine: 1 } }));
    }
    return Array.isArray(data) ? data : [];
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
