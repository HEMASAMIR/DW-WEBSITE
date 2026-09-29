import { isAdminRequest } from '@/lib/siteStore';
import { loadRequests } from '@/lib/requestsStore';

// Pending requests for the dashboard badges. Admins only.
export const dynamic = 'force-dynamic';

export async function GET(request) {
  if (!(await isAdminRequest(request))) return Response.json({ detail: 'غير مصرح.' }, { status: 403 });
  const pending = (await loadRequests()).filter((r) => r.status === 'pending');
  const level = pending.filter((r) => r.kind === 'level').length;
  return Response.json({ pending: pending.length, level, book: pending.length - level });
}
