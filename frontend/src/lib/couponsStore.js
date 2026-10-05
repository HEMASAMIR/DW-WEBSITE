// SERVER-ONLY. Discount coupons, kept by the website (the live backend has no coupons API).
//
// Rules:
//   • A coupon works between starts_at and ends_at, then closes by itself.
//   • max_uses = how many students may use it (null = no limit). A use = a request sent with it,
//     whatever the admin decides later.
//   • Each student can use ONE coupon, ever (any coupon). Rejected requests still count.
//   • scope: 'all' | 'levels' | 'books', optionally narrowed to some level codes (books count by their level).
// The counts shown to the admin: tried (typed it and it was valid for them), used (sent a request),
// benefited (request approved) + the total discount given.

import { readStore, writeStore, withLock } from './siteStore';

export const COUPON_TYPES = ['percent', 'fixed'];
export const COUPON_SCOPES = ['all', 'levels', 'books'];

const str = (v, max) => String(v ?? '').trim().slice(0, max);
const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const isoOrNull = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

export const normalizeCode = (code) => str(code, 40).toUpperCase().replace(/\s+/g, '');

export const loadCoupons = () => readStore('coupons');

/** Changes the list under a lock. fn(list) returns { list, result }. */
export const updateCoupons = (fn) => withLock('coupons', async () => {
  const list = await readStore('coupons');
  const { list: next, result } = await fn(list);
  await writeStore('coupons', next);
  return result;
});

/**
 * Validates and cleans what the dashboard sends. Returns { coupon } or { error }.
 * `existing` = the coupon being edited (keeps id, created_at, tried_by).
 */
// i18n-translated: these messages reach the screen through getErrorMessage(), which passes them through t()
export function cleanCoupon(input, existing = null, all = []) {
  const code = normalizeCode(input.code);
  if (!/^[A-Z0-9_-]{3,40}$/.test(code)) return { error: 'كود الكوبون لازم يكون من 3 لـ 40 حرف إنجليزي أو رقم (من غير مسافات).' };
  if (all.some((c) => c.code === code && c.id !== existing?.id)) return { error: 'فيه كوبون تاني بنفس الكود.' };

  const type = COUPON_TYPES.includes(input.type) ? input.type : 'percent';
  const value = num(input.value);
  if (!value || value <= 0) return { error: 'قيمة الخصم لازم تكون أكبر من صفر.' };
  if (type === 'percent' && value > 100) return { error: 'نسبة الخصم مينفعش تعدّي 100%.' };

  const starts_at = isoOrNull(input.starts_at) || existing?.starts_at || new Date().toISOString();
  const ends_at = isoOrNull(input.ends_at);
  if (!ends_at) return { error: 'حدد تاريخ نهاية الكوبون.' };
  if (new Date(ends_at) <= new Date(starts_at)) return { error: 'تاريخ النهاية لازم يكون بعد تاريخ البداية.' };

  const maxUses = input.max_uses === '' || input.max_uses === null || input.max_uses === undefined ? null : Math.floor(num(input.max_uses));
  if (maxUses !== null && (!maxUses || maxUses < 1)) return { error: 'عدد الطلاب المسموحلهم لازم يكون 1 أو أكتر (أو سيبه فاضي لعدد مفتوح).' };

  return {
    coupon: {
      id: existing?.id || `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      code,
      type,
      value: Math.round(value * 100) / 100,
      scope: COUPON_SCOPES.includes(input.scope) ? input.scope : 'all',
      level_codes: (Array.isArray(input.level_codes) ? input.level_codes : []).map((c) => str(c, 10)).filter(Boolean).slice(0, 12),
      starts_at,
      ends_at,
      max_uses: maxUses,
      is_active: input.is_active !== false,
      note: str(input.note, 300),
      tried_by: existing?.tried_by || [],
      created_at: existing?.created_at || new Date().toISOString(),
    },
  };
}

/** Requests sent with this coupon (pending / approved / rejected — every one is a use). */
export const usesOf = (coupon, requests) => requests.filter((r) => r.coupon_id === coupon.id);

/**
 * 'paused' (switched off) | 'scheduled' (not started) | 'ended' (past ends_at) | 'full' (no uses left) | 'active'
 */
export function couponStatus(coupon, requests, now = new Date()) {
  if (!coupon.is_active) return 'paused';
  if (new Date(coupon.starts_at) > now) return 'scheduled';
  if (new Date(coupon.ends_at) <= now) return 'ended';
  if (coupon.max_uses !== null && usesOf(coupon, requests).length >= coupon.max_uses) return 'full';
  return 'active';
}

/** Discount on `amount` (EGP), never more than the amount itself. */
export function discountFor(coupon, amount) {
  const a = Number(amount) || 0;
  const d = coupon.type === 'percent' ? (a * coupon.value) / 100 : coupon.value;
  return Math.round(Math.min(Math.max(d, 0), a) * 100) / 100;
}

/** Does the coupon cover this item? kind: 'level' | 'book', levelCode: the level (or the book's level). */
export function coversItem(coupon, kind, levelCode) {
  if (coupon.scope === 'levels' && kind !== 'level') return false;
  if (coupon.scope === 'books' && kind !== 'book') return false;
  if (coupon.level_codes?.length && !coupon.level_codes.includes(String(levelCode || ''))) return false;
  return true;
}

/** The student's coupon use (the request it was used in), or null. */
export const usedByStudent = (requests, userId) => requests.find((r) => r.user_id === userId && r.coupon_id) || null;

const STATUS_ERRORS = {
  paused: 'الكوبون ده متوقف حالياً.',
  scheduled: 'الكوبون ده لسه مبدأش.',
  ended: 'الكوبون ده انتهت مدته.',
  full: 'الكوبون ده خلص — العدد المسموح بيه اكتمل.',
};

/**
 * Checks a code for a student and an item. Returns { coupon, discount, final } or { error }.
 */
// i18n-translated: these messages reach the screen through getErrorMessage(), which passes them through t()
export function evaluateCoupon({ coupons, requests, code, userId, kind, levelCode, amount }) {
  const coupon = coupons.find((c) => c.code === normalizeCode(code));
  if (!coupon) return { error: 'الكود ده مش صحيح — اتأكد منه وجرّب تاني.' };
  const status = couponStatus(coupon, requests);
  if (status !== 'active') return { error: STATUS_ERRORS[status] };
  const used = usedByStudent(requests, userId);
  if (used) return { error: 'إنت استخدمت الكوبون بتاعك قبل كده — كل طالب ليه كوبون واحد بس.' };
  if (!coversItem(coupon, kind, levelCode)) return { error: kind === 'book' ? 'الكوبون ده مش شغال على الكتب دي.' : 'الكوبون ده مش شغال على المستوى ده.' };
  const discount = discountFor(coupon, amount);
  if (discount <= 0) return { error: 'الكوبون ده مش هيفرق في السعر هنا.' };
  return { coupon, discount, final: Math.round((Number(amount) - discount) * 100) / 100 };
}

/** What the admin sees: the coupon + its numbers. */
export function adminCouponView(coupon, requests) {
  const uses = usesOf(coupon, requests);
  const approved = uses.filter((r) => r.status === 'approved');
  return {
    ...coupon,
    tried_by: undefined,
    status: couponStatus(coupon, requests),
    stats: {
      tried: (coupon.tried_by || []).length,
      used: uses.length,
      benefited: approved.length,
      pending: uses.filter((r) => r.status === 'pending').length,
      discount_total: Math.round(approved.reduce((s, r) => s + (Number(r.discount) || 0), 0) * 100) / 100,
    },
  };
}
