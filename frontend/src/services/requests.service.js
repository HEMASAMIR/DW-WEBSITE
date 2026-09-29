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

/** A student's request to unlock a level or a book. It waits in the admin dashboard until approved. */
export const requestsService = {
  /** fields: { kind: 'level'|'book', item_id, full_name, phone, payment_method, note?, receipt?: File } */
  create: async (fields) => {
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
