import { getRequestUser } from '@/lib/siteStore';
import { loadRequests } from '@/lib/requestsStore';
import { usedByStudent } from '@/lib/couponsStore';

// Student: has my one coupon been used? → { used: null | { code, discount, item_name, status, created_at } }
export const dynamic = 'force-dynamic';

const json = (data, status = 200) => Response.json(data, { status });

export async function GET(request) {
  const user = await getRequestUser(request);
  if (!user) return json({ detail: 'سجّل الدخول الأول.' }, 401);
  const r = usedByStudent(await loadRequests(), user.id);
  return json({
    used: r ? { code: r.coupon_code, discount: r.discount, item_name: r.item_name, status: r.status, created_at: r.created_at } : null,
  });
}
