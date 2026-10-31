// SERVER-ONLY. Students' access requests (level / book), kept by the website while the live
// backend has no requests API. Same shape as the backend's /api/admin/requests/ so the admin
// dashboard works with either. Approving is done by the dashboard: it unlocks the item with the
// backend's admin grant endpoint, then marks the request approved here.

import { promises as fs } from 'fs';
import path from 'path';
import { readStore, writeStore, withLock, dataPath, backendGet, updateCloudFiles, saveCloudReceipt, fetchCloudReceipt, deleteCloudReceipt } from './siteStore';

const KNOWN_LEVELS = {
  1: { name: 'المستوى الأول A1', level_code: 'A1', amount: '1500.00' },
  2: { name: 'المستوى الثاني A2', level_code: 'A2', amount: '2000.00' },
  3: { name: 'المستوى الثالث B1', level_code: 'B1', amount: '2500.00' },
  4: { name: 'المستوى الرابع B2', level_code: 'B2', amount: '3000.00' },
};

/**
 * The item as the student sees it (name, price, level, already unlocked?) — straight from the backend,
 * with the student's own token. Falls back gracefully so network delays never lose a student's request.
 */
export async function findItem(kind, itemId, token) {
  if (kind === 'level') {
    try {
      const data = await backendGet('/api/courses/levels/', token);
      const list = Array.isArray(data) ? data : data?.results || [];
      const l = list.find((x) => Number(x.id) === Number(itemId));
      if (l) return { name: l.title || l.name, level_code: l.name, amount: l.price, has_access: l.has_access };
    } catch {}
    const fb = KNOWN_LEVELS[itemId] || { name: `المستوى ${itemId}`, level_code: `A${itemId}`, amount: '1500.00' };
    return { ...fb, has_access: false };
  }
  try {
    const data = await backendGet('/api/books/', token);
    const list = Array.isArray(data) ? data : Object.values(data || {}).flat();
    const b = list.find((x) => Number(x.id) === Number(itemId));
    if (b) return { name: b.name, level_code: b.level, amount: b.price, has_access: b.has_access };
  } catch {}
  return { name: `كتاب تعليمي #${itemId}`, level_code: 'ALL', amount: '350.00', has_access: false };
}

export const RECEIPT_TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.heic': 'image/heic', '.pdf': 'application/pdf' };
export const MAX_RECEIPT_BYTES = 8 * 1024 * 1024;

const maskEmail = (email) => {
  if (!email || !email.includes('@')) return '';
  const [local, domain] = email.split('@');
  return `${local.slice(0, 2)}***@${domain}`;
};

export const loadRequests = () => readStore('requests');

/** Changes the list under a lock. fn(list) returns { list, result }. Atomically syncs extraCloudFiles (like receipts) with requests.json */
export const updateRequests = (fn, extraCloudFiles = {}) => withLock('requests', async () => {
  const list = await readStore('requests');
  const { list: next, result } = await fn(list);
  await writeStore('requests', next);
  if (Object.keys(extraCloudFiles).length > 0) {
    await updateCloudFiles(extraCloudFiles);
  }
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

const receiptBufferCache = new Map();

/**
 * Prepares the receipt file: stores in local cache and returns the filename and cloud file payload
 * so it can be committed atomically in the same Gist update as requests.json.
 */
export async function prepareReceipt(id, file) {
  let ext = path.extname(file.name || '').toLowerCase();
  if (!ext && typeof file.type === 'string' && file.type.startsWith('image/')) {
    ext = file.type === 'image/png' ? '.png' : file.type === 'image/webp' ? '.webp' : '.jpg';
  }
  if (!ext) ext = '.jpg';
  const dir = dataPath('receipts');
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {}
  const name = `${id}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    await fs.writeFile(path.join(/*turbopackIgnore: true*/ dir, name), buffer);
  } catch {}
  receiptBufferCache.set(name, buffer);

  const b64 = buffer.toString('base64');
  return {
    name,
    cloudFiles: { [`receipt_${name}.b64`]: b64 },
  };
}

export async function saveReceipt(id, file) {
  const prep = await prepareReceipt(id, file);
  saveCloudReceipt(prep.name, receiptBufferCache.get(prep.name)).catch(() => {});
  return prep.name;
}

export async function readReceipt(name) {
  const safe = path.basename(name);
  let buf = receiptBufferCache.get(safe);
  if (!buf) {
    try {
      buf = await fs.readFile(dataPath('receipts', safe));
    } catch {
      // Not on local disk; fetch from persistent cloud Gist!
      buf = await fetchCloudReceipt(safe);
      if (buf) {
        try {
          const dir = dataPath('receipts');
          await fs.mkdir(dir, { recursive: true });
          await fs.writeFile(path.join(/*turbopackIgnore: true*/ dir, safe), buf);
        } catch {}
      }
    }
    if (buf) {
      receiptBufferCache.set(safe, buf);
    }
  }
  if (!buf) {
    throw new Error('Receipt not found');
  }
  return { buf, type: RECEIPT_TYPES[path.extname(safe).toLowerCase()] || 'application/octet-stream', name: safe };
}

export async function deleteReceipt(name) {
  if (!name) return;
  const safe = path.basename(name);
  receiptBufferCache.delete(safe);
  await fs.unlink(dataPath('receipts', safe)).catch(() => {});
  deleteCloudReceipt(safe).catch(() => {});
}
