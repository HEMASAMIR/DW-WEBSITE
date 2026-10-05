import { isAdminRequest } from '@/lib/siteStore';
import { loadRequests } from '@/lib/requestsStore';
import { loadCoupons, updateCoupons, cleanCoupon, adminCouponView, usesOf } from '@/lib/couponsStore';

// One coupon. Admins only.
//   GET    → the coupon + who used it (name, phone, item, amounts, request status)
//   PATCH  → edit (same fields as create; partial is fine, e.g. { is_active: false })
//   DELETE → remove (requests that used it keep their coupon code and discount)
export const dynamic = 'force-dynamic';

const json = (data, status = 200) => Response.json(data, { status });
const forbidden = () => json({ detail: 'هذا الإجراء يتطلب صلاحيات المسؤول.' }, 403);

export async function GET(request, { params }) {
  if (!(await isAdminRequest(request))) return forbidden();
  const { id } = await params;
  const [coupons, requests] = await Promise.all([loadCoupons(), loadRequests()]);
  const coupon = coupons.find((c) => c.id === id);
  if (!coupon) return json({ detail: 'الكوبون غير موجود.' }, 404);
  const uses = usesOf(coupon, requests)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((r) => ({
      request_id: r.id,
      name: r.full_name,
      phone: r.phone,
      kind: r.kind,
      item_name: r.item_name,
      level_code: r.level_code,
      original_amount: r.original_amount,
      discount: r.discount,
      amount: r.amount,
      status: r.status,
      created_at: r.created_at,
    }));
  return json({ ...adminCouponView(coupon, requests), uses });
}

export async function PATCH(request, { params }) {
  if (!(await isAdminRequest(request))) return forbidden();
  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ detail: 'بيانات غير صحيحة.' }, 400);
  }
  const out = await updateCoupons(async (list) => {
    const i = list.findIndex((c) => c.id === id);
    if (i < 0) return { list, result: { missing: true } };
    const { coupon, error } = cleanCoupon({ ...list[i], ...(body || {}) }, list[i], list);
    if (error) return { list, result: { error } };
    const next = [...list];
    next[i] = coupon;
    return { list: next, result: { coupon } };
  });
  if (out.missing) return json({ detail: 'الكوبون غير موجود.' }, 404);
  if (out.error) return json({ detail: out.error }, 400);
  return json(adminCouponView(out.coupon, await loadRequests()));
}

export async function DELETE(request, { params }) {
  if (!(await isAdminRequest(request))) return forbidden();
  const { id } = await params;
  const removed = await updateCoupons(async (list) => ({
    list: list.filter((c) => c.id !== id),
    result: list.some((c) => c.id === id),
  }));
  if (!removed) return json({ detail: 'الكوبون غير موجود.' }, 404);
  return json({ detail: 'تم حذف الكوبون.' });
}
