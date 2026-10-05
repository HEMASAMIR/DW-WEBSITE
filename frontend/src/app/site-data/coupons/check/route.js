import { getRequestUser } from '@/lib/siteStore';
import { loadRequests, findItem } from '@/lib/requestsStore';
import { loadCoupons, updateCoupons, evaluateCoupon, normalizeCode } from '@/lib/couponsStore';

// Student: "does this code work for this item?" — POST { code, kind, item_id }
//   → { code, type, value, original, discount, final, ends_at } or 400 { detail }
// Typing an existing code counts the student as "tried" on that coupon (once) — even when it can't be
// used (full, ended, wrong item…). Nothing is used until the request is sent.
export const dynamic = 'force-dynamic';

const json = (data, status = 200) => Response.json(data, { status });

export async function POST(request) {
  const user = await getRequestUser(request);
  if (!user) return json({ detail: 'سجّل الدخول الأول.' }, 401);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ detail: 'بيانات غير صحيحة.' }, 400);
  }
  const kind = body?.kind === 'book' ? 'book' : 'level';
  if (!String(body?.code || '').trim()) return json({ detail: 'اكتب كود الكوبون.' }, 400);

  const item = await findItem(kind, body?.item_id, user.token);
  if (!item) return json({ detail: kind === 'level' ? 'المستوى غير موجود.' : 'الكتاب غير موجود.' }, 404);

  const [coupons, requests] = await Promise.all([loadCoupons(), loadRequests()]);
  const typed = coupons.find((c) => c.code === normalizeCode(body.code));
  if (typed && !(typed.tried_by || []).includes(user.id)) {
    await updateCoupons(async (list) => ({
      list: list.map((c) => (c.id === typed.id && !(c.tried_by || []).includes(user.id) ? { ...c, tried_by: [...(c.tried_by || []), user.id] } : c)),
      result: null,
    }));
  }

  const out = evaluateCoupon({ coupons, requests, code: body.code, userId: user.id, kind, levelCode: item.level_code, amount: item.amount });
  if (out.error) return json({ detail: out.error }, 400);

  return json({
    code: out.coupon.code,
    type: out.coupon.type,
    value: out.coupon.value,
    original: Number(item.amount) || 0,
    discount: out.discount,
    final: out.final,
    ends_at: out.coupon.ends_at,
  });
}
