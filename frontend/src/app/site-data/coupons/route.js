import { isAdminRequest } from '@/lib/siteStore';
import { loadRequests } from '@/lib/requestsStore';
import { loadCoupons, updateCoupons, cleanCoupon, adminCouponView } from '@/lib/couponsStore';

// Discount coupons (see src/lib/couponsStore.js). Admins only.
//   GET  → every coupon with its numbers (tried / used / benefited / discount given)
//   POST → create { code, type, value, scope, level_codes, starts_at, ends_at, max_uses, is_active, note }
export const dynamic = 'force-dynamic';

const json = (data, status = 200) => Response.json(data, { status });
const forbidden = () => json({ detail: 'هذا الإجراء يتطلب صلاحيات المسؤول.' }, 403);

export async function GET(request) {
  if (!(await isAdminRequest(request))) return forbidden();
  const [coupons, requests] = await Promise.all([loadCoupons(), loadRequests()]);
  const results = coupons
    .map((c) => adminCouponView(c, requests))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return json(results);
}

export async function POST(request) {
  if (!(await isAdminRequest(request))) return forbidden();
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ detail: 'بيانات غير صحيحة.' }, 400);
  }
  const out = await updateCoupons(async (list) => {
    const { coupon, error } = cleanCoupon(body || {}, null, list);
    if (error) return { list, result: { error } };
    return { list: [...list, coupon], result: { coupon } };
  });
  if (out.error) return json({ detail: out.error }, 400);
  return json(adminCouponView(out.coupon, await loadRequests()), 201);
}
