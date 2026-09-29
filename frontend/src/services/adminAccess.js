import apiClient, { tokenStorage } from './api';
import { API_ENDPOINTS } from '@/constants/apiRoutes';

/** Same rule as AuthContext.isAdmin, read from the stored session (usable outside React). */
export function isStoredAdmin() {
  const user = tokenStorage.getUser();
  const groups = (user?.groups || []).map((g) => (typeof g === 'string' ? g : g?.name));
  return !!tokenStorage.getAccess() && (user?.is_admin === true || groups.includes('Admin'));
}

/**
 * Admins see every level and book. If the backend still answers 403 for an admin account
 * (some deployments only unlock content for is_staff), unlock the item for the admin's own
 * account with the admin grant endpoint and try once more.
 * kind: 'level' | 'book'
 */
export async function withAdminAccess(kind, itemId, load) {
  try {
    return await load();
  } catch (err) {
    const user = tokenStorage.getUser();
    if (err.response?.status !== 403 || !isStoredAdmin() || !user?.id) throw err;
    const url = kind === 'level' ? API_ENDPOINTS.ADMIN_GRANT_LEVEL(itemId) : API_ENDPOINTS.ADMIN_GRANT_BOOK(itemId);
    const body = kind === 'level' ? { user_id: Number(user.id), notes: 'حساب الأدمن' } : { user_id: Number(user.id) };
    try {
      await apiClient.post(url, body);
    } catch {
      throw err; // keep the original "no access" error
    }
    return load();
  }
}
