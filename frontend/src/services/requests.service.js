import apiClient from './api';
import { API_ENDPOINTS } from '@/constants/apiRoutes';

/** A student's request to unlock a level or a book. It waits in the admin dashboard until approved. */
export const requestsService = {
  /** fields: { kind: 'level'|'book', item_id, full_name, phone, payment_method, note?, receipt?: File } */
  create: async (fields) => {
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') fd.append(k, v);
    });
    return (await apiClient.post(API_ENDPOINTS.REQUESTS, fd)).data;
  },

  /** The logged-in student's own requests only. */
  mine: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.MY_REQUESTS);
    return Array.isArray(data) ? data : [];
  },
};
