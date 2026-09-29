import { useEffect, useState } from 'react';
import apiClient from '@/services/api';
import { API_ENDPOINTS } from '@/constants/apiRoutes';
import { BRANCHES_DATA } from '@/constants/siteContent';

/**
 * Branches managed from the admin dashboard: GET /api/branches/ on the backend, or the list the
 * dashboard saved on this site (/site-data/branches). The academy's current list shows until they load.
 */
export function useBranches() {
  const [branches, setBranches] = useState(BRANCHES_DATA);
  useEffect(() => {
    let cancelled = false;
    // The backend's branches if it has them, otherwise the ones saved from the dashboard on this site.
    const fromBackend = apiClient.get(API_ENDPOINTS.BRANCHES).then(({ data }) => (Array.isArray(data) ? data : data?.results));
    fromBackend
      .catch(() => null)
      .then((list) => (Array.isArray(list) && list.length ? list : apiClient.get('/site-data/branches').then(({ data }) => data)))
      .then((list) => {
        if (cancelled || !Array.isArray(list)) return;
        setBranches(list.filter((b) => b.is_active !== false).map((b) => ({
          id: b.id, name: b.name, city: b.city, address: b.address, phone: b.phone,
          badge: b.badge || b.city, mapUrl: b.map_url, color: b.color,
        })));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return branches;
}
