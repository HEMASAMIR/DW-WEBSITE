// SERVER-ONLY. Students' access requests (level / book), kept by the website while the live
// backend has no requests API. Same shape as the backend's /api/admin/requests/ so the admin
// dashboard works with either. Approving is done by the dashboard: it unlocks the item with the
// backend's admin grant endpoint, then marks the request approved here.

import { promises as fs } from 'fs';
import path from 'path';
import { readStore, writeStore, withLock, dataPath, backendGet } from './siteStore';

/**
 * The item as the student sees it (name, price, level, already unlocked?) — straight from the backend,
 * with the student's own token. → { name, level_code, amount, has_access } or null.
 */
export async function findItem(kind, itemId, token) {
  if (kind === 'level') {
    const data = await backendGet('/api/courses/levels/', token);
    const list = Array.isArray(data) ? data : data?.results || [];
    const l = list.find((x) => Number(x.id) === Number(itemId));
    return l ? { name: l.title || l.name, level_code: l.name, amount: l.price, has_access: l.has_access } : null;
  }
  const data = await backendGet('/api/books/', token);
  const list = Array.isArray(data) ? data : Object.values(data || {}).flat();
  const b = list.find((x) => Number(x.id) === Number(itemId));
  return b ? { name: b.name, level_code: b.level, amount: b.price, has_access: b.has_access } : null;
}

export const RECEIPT_TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.heic': 'image/heic', '.pdf': 'application/pdf' };
export const MAX_RECEIPT_BYTES = 8 * 1024 * 1024;

const maskEmail = (email) => {
  if (!email || !email.includes('@')) return '';
  const [local, domain] = email.split('@');
  return `${local.slice(0, 2)}***@${domain}`;
};

export const loadRequests = () => readStore('requests');

/** Changes the list under a lock. fn(list) returns { list, result }. */
export const updateRequests = (fn) => withLock('requests', async () => {
  const list = await readStore('requests');
  const { list: next, result } = await fn(list);
  await writeStore('requests', next);
  return result;
});

/** What the admin sees. No e-mail address — only a masked one. */
export function adminView(r) {
  return {
    id: r.id,
    kind: r.kind,
    item_id: r.item_id,
    item_name: r.item_name,
    level_code: r.level_code,
    full_name: r.full_name,
    phone: r.phone,
    payment_method: r.payment_method,
    amount: r.amount,
    original_amount: r.original_amount ?? null,
    coupon_code: r.coupon_code || null,
    discount: r.discount ?? null,
    note: r.note,
    has_receipt: !!r.receipt,
    status: r.status,
    admin_note: r.admin_note || '',
    created_at: r.created_at,
    reviewed_at: r.reviewed_at || null,
    reviewed_by: r.reviewed_by || null,
    user: { id: r.user_id, name: r.full_name, email_masked: maskEmail(r.user_email) },
  };
}

/** What the student sees about their own request. */
export function ownView(r) {
  return {
    id: r.id,
    kind: r.kind,
    item_id: r.item_id,
    item_name: r.item_name,
    level_code: r.level_code,
    amount: r.amount,
    original_amount: r.original_amount ?? null,
    coupon_code: r.coupon_code || null,
    discount: r.discount ?? null,
    payment_method: r.payment_method,
    status: r.status,
    admin_note: r.status === 'rejected' ? r.admin_note || '' : '',
    created_at: r.created_at,
    reviewed_at: r.reviewed_at || null,
  };
}

export async function saveReceipt(id, file) {
  const ext = path.extname(file.name || '').toLowerCase();
  const dir = dataPath('receipts');
  await fs.mkdir(dir, { recursive: true });
  const name = `${id}${ext}`;
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return name;
}

export async function readReceipt(name) {
  const safe = path.basename(name);
  const buf = await fs.readFile(dataPath('receipts', safe));
  return { buf, type: RECEIPT_TYPES[path.extname(safe).toLowerCase()] || 'application/octet-stream', name: safe };
}

export async function deleteReceipt(name) {
  if (!name) return;
  await fs.unlink(dataPath('receipts', path.basename(name))).catch(() => {});
}
