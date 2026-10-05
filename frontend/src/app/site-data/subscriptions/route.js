import { isAdminRequest, getRequestUser } from '@/lib/siteStore';
import {
  loadSubscriptions, updateSubscriptions, startYear, stopYear, syncYears, expireYears, ownSubscriptionView,
} from '@/lib/subscriptionsStore';

// Yearly level subscriptions (see src/lib/subscriptionsStore.js).
//   GET  (student)        → the student's own subscriptions
//   GET  (admin, ?all=1)  → every record
//   POST (admin) { action: 'start' | 'stop', user_id, level_id, level_code?, name? }
//   POST (admin) { action: 'sync', rows: [{ user_id, level_id, level_code, name, granted_at }] } → { due }
//   POST (admin) { action: 'expire', items: [{ user_id, level_id }] } → the records marked expired
export const dynamic = 'force-dynamic';

const json = (data, status = 200) => Response.json(data, { status });

export async function GET(request) {
  const url = new URL(request.url);
  if (url.searchParams.get('all') === '1') {
    if (!(await isAdminRequest(request))) return json({ detail: 'هذا الإجراء يتطلب صلاحيات المسؤول.' }, 403);
    return json(await loadSubscriptions());
  }
  const user = await getRequestUser(request);
  if (!user) return json({ detail: 'سجّل الدخول الأول.' }, 401);
  const mine = (await loadSubscriptions()).filter((r) => r.user_id === user.id).map(ownSubscriptionView);
  return json(mine);
}

export async function POST(request) {
  if (!(await isAdminRequest(request))) return json({ detail: 'هذا الإجراء يتطلب صلاحيات المسؤول.' }, 403);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ detail: 'بيانات غير صحيحة.' }, 400);
  }
  const action = body?.action;

  if (action === 'start' || action === 'stop') {
    if (!Number(body.user_id) || !Number(body.level_id)) return json({ detail: 'بيانات غير صحيحة.' }, 400);
    const result = await updateSubscriptions(async (list) => (action === 'start' ? startYear(list, body) : stopYear(list, body)));
    return json({ detail: 'تم.', record: action === 'start' ? result : null });
  }
  if (action === 'sync') {
    const rows = Array.isArray(body.rows) ? body.rows.slice(0, 20000) : [];
    const result = await updateSubscriptions(async (list) => syncYears(list, rows));
    return json(result);
  }
  if (action === 'expire') {
    const items = Array.isArray(body.items) ? body.items.slice(0, 5000) : [];
    const result = await updateSubscriptions(async (list) => expireYears(list, items));
    return json({ expired: result });
  }
  return json({ detail: 'إجراء غير معروف.' }, 400);
}
