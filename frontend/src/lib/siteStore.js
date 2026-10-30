// SERVER-ONLY. Site content the live backend has no endpoints for (branches, announcement banner,
// contact numbers & payment methods),
// stored as JSON files next to the website and edited from the admin dashboard.
//
// Automatically adapts to serverless environments (e.g. Vercel / AWS Lambda) where process.cwd() is read-only.
// Uses writable temporary storage and memory cache to ensure operations succeed.
//
// Writes are allowed only for admins: the caller's token is checked against an admin-only
// backend endpoint, so the backend stays the single source of truth for who is an admin.

import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import axios from 'axios';
import { BRANCHES_DATA, DEFAULT_CONTACT } from '@/constants/siteContent';

const BACKEND_URL = (process.env.BACKEND_URL || 'https://py.deutschewelt.academy').replace(/\/+$/, '');

// Detect serverless host (Vercel / Lambda) where process.cwd() is read-only
const isServerless = !!(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT
);

let resolvedDataDir = process.env.SITE_DATA_DIR || (
  isServerless
    ? path.join(os.tmpdir(), 'dw_site_data')
    : path.join(process.cwd(), 'data')
);

// In-memory cache ensures zero latency and persists changes during warm lambda lifecycle
const memoryCache = new Map();

// family: 4 — some networks time out on the backend's IPv6 address.
const http = axios.create({ baseURL: BACKEND_URL, timeout: 20000, family: 4 });

export const BRANCH_COLORS = ['teal', 'sky', 'amber', 'rose', 'violet', 'emerald'];

function sanitizeData(data) {
  if (!data) return data;
  try {
    const raw = JSON.stringify(data).replace(/552287454/g, '55287454');
    return JSON.parse(raw);
  } catch {
    return data;
  }
}

export const DEFAULT_ANNOUNCEMENT = {
  is_active: true,
  tag: '📚 درس جديد',
  title: 'تم نزول الدرس الأول للمستوى الأول A1 من كتاب Netzwerk Neu 🇩🇪',
  desc: 'المحاضرة الأولى متوفرة الآن مع تدريبات النطق والقواعد وملفات الـ PDF التفاعلية بالكامل؛ ابدأ دراستك وانضم للمتابعة!',
  has_discount: false,
  discount_percent: '',
  cta_text: 'شاهد الدرس الآن',
  cta_link: '/#online-courses',
  updated_at: new Date().toISOString(),
};

const DEFAULTS = {
  branches: () => BRANCHES_DATA.map((b, i) => ({
    id: b.id,
    name: b.name,
    city: b.city,
    address: b.address,
    phone: b.phone,
    badge: b.badge,
    map_url: b.mapUrl,
    color: BRANCH_COLORS[i % 4],
    is_active: true,
    order: i + 1,
  })),
  announcement: () => DEFAULT_ANNOUNCEMENT,
  contact: () => DEFAULT_CONTACT,
  requests: () => [],
  coupons: () => [],
  subscriptions: () => [],
};

const fileFor = (key, dir = resolvedDataDir) => path.join(dir, `${key}.json`);

export async function readStore(key) {
  if (memoryCache.has(key)) {
    return sanitizeData(memoryCache.get(key));
  }

  // 1. Try reading from resolvedDataDir (e.g. /tmp/dw_site_data or custom dir)
  try {
    const data = JSON.parse(await fs.readFile(fileFor(key), 'utf8'));
    const clean = sanitizeData(data);
    memoryCache.set(key, clean);
    return clean;
  } catch {}

  // 2. Try reading from project seed data if present
  try {
    const staticFile = path.join(process.cwd(), 'data', `${key}.json`);
    const data = JSON.parse(await fs.readFile(staticFile, 'utf8'));
    const clean = sanitizeData(data);
    memoryCache.set(key, clean);
    return clean;
  } catch {}

  // 3. Try reading from os.tmpdir() fallback
  try {
    const tmpFile = path.join(os.tmpdir(), 'dw_site_data', `${key}.json`);
    const data = JSON.parse(await fs.readFile(tmpFile, 'utf8'));
    const clean = sanitizeData(data);
    memoryCache.set(key, clean);
    return clean;
  } catch {}

  // 4. Default seed fallback
  const def = sanitizeData(DEFAULTS[key] ? DEFAULTS[key]() : null);
  memoryCache.set(key, def);
  return def;
}

export async function writeStore(key, value) {
  memoryCache.set(key, value);

  // Helper to attempt write to a directory
  const tryWriteTo = async (targetDir) => {
    await fs.mkdir(targetDir, { recursive: true });
    const targetFile = fileFor(key, targetDir);
    const tmp = `${targetFile}.${Date.now()}-${Math.random().toString(36).slice(2)}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(value, null, 2), 'utf8');
    await fs.rename(tmp, targetFile); // atomic replace
  };

  try {
    await tryWriteTo(resolvedDataDir);
  } catch (err) {
    // If read-only filesystem (EROFS/EACCES), permanently switch to os.tmpdir()
    if (err.code === 'EROFS' || err.code === 'EACCES') {
      try {
        resolvedDataDir = path.join(os.tmpdir(), 'dw_site_data');
        await tryWriteTo(resolvedDataDir);
      } catch (innerErr) {
        console.warn(`writeStore fallback write warning for ${key}:`, innerErr?.message);
      }
    } else {
      console.warn(`writeStore write warning for ${key}:`, err?.message);
    }
  }

  return value;
}

// Serialises read-modify-write per file so two requests at once can't overwrite each other.
const locks = new Map();
export function withLock(key, fn) {
  const prev = locks.get(key) || Promise.resolve();
  const next = prev.catch(() => {}).then(fn);
  locks.set(key, next.catch(() => {}));
  return next;
}

export const dataPath = (...parts) => path.join(resolvedDataDir, ...parts);

/**
 * The logged-in user behind the request's Bearer token: the backend validates the token
 * (profile endpoint), then the user id is read from the token's own payload.
 * Returns { id, name, token } or null.
 */
export async function getRequestUser(request) {
  const auth = request.headers.get('authorization') || '';
  const m = auth.match(/^Bearer\s+(\S+)$/i);
  if (!m) return null;
  try {
    const res = await http.get('/api/users/profile/', { headers: { Authorization: auth }, validateStatus: () => true });
    if (res.status !== 200) return null;
    const payload = JSON.parse(Buffer.from(m[1].split('.')[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
    const id = Number(payload.user_id ?? payload.id);
    if (!id) return null;
    const u = res.data?.user || res.data || {};
    return {
      id,
      name: [u.first_name, u.last_name].filter(Boolean).join(' '),
      email: u.email || payload.email || '',
      phone: u.phone_number || '',
      is_admin: !!(u.is_admin || payload.is_admin || u.is_staff),
      token: auth,
    };
  } catch {
    return null;
  }
}

/** GET on the backend as the caller (their own token). */
export async function backendGet(pathname, auth) {
  const res = await http.get(pathname, { headers: { Authorization: auth }, validateStatus: () => true });
  return res.status === 200 ? res.data : null;
}

/** True when the request's Bearer token belongs to an admin on the backend. */
export async function isAdminRequest(request) {
  const auth = request.headers.get('authorization') || '';
  if (!/^Bearer\s+\S+/i.test(auth)) return false;
  try {
    const res = await http.get('/api/courses/admin/levels/', { headers: { Authorization: auth }, validateStatus: () => true });
    return res.status === 200;
  } catch {
    return false;
  }
}

const str = (v, max = 200) => String(v ?? '').trim().slice(0, max);
const phoneDigits = (v) => String(v ?? '').replace(/[^\d+]/g, '').slice(0, 20);
const safeUrl = (v) => {
  const s = str(v, 500);
  return /^https?:\/\//i.test(s) ? s : '';
};
const id = (v, prefix, idx) => str(v, 40) || `${prefix}-${Date.now().toString(36)}-${idx}`;
const list = (v) => (Array.isArray(v) ? v : []);

export function cleanBranch(b, idx) {
  const rawId = b?.id;
  const validId = rawId !== undefined && rawId !== null && String(rawId).trim() !== '' ? rawId : id(null, 'b', idx);
  return {
    id: validId,
    name: str(b?.name, 80),
    city: str(b?.city, 40),
    address: str(b?.address, 200),
    phone: phoneDigits(b?.phone),
    badge: str(b?.badge, 40),
    map_url: safeUrl(b?.map_url || b?.mapUrl),
    color: BRANCH_COLORS.includes(b?.color) ? b.color : BRANCH_COLORS[idx % BRANCH_COLORS.length],
    is_active: b?.is_active !== false,
    order: Number.isInteger(b?.order) ? b.order : idx + 1,
  };
}

export function cleanAnnouncement(a) {
  if (!a) return null;
  return {
    is_active: !!a.is_active,
    tag: str(a.tag, 30) || '🔥 عرض خاص',
    title: str(a.title, 120),
    desc: str(a.desc, 300),
    has_discount: !!a.has_discount,
    discount_percent: str(a.discount_percent, 10),
    cta_text: str(a.cta_text, 40) || 'احجز الآن',
    cta_link: str(a.cta_link, 300) || '/#online-courses',
    expires_at: a.expires_at ? new Date(a.expires_at).toISOString() : null,
    updated_at: new Date().toISOString(),
  };
}

const PAYMENT_TYPES = ['vodafone', 'instapay', 'fawry', 'bank', 'other'];

export function cleanContact(c) {
  c = sanitizeData(c || {});
  return {
    whatsapp: phoneDigits(c.whatsapp || DEFAULT_CONTACT.whatsapp),
    phones: list(c.phones)
      .map((p, i) => ({ id: id(p?.id, 'p', i), label: str(p?.label, 40), number: phoneDigits(p?.number), is_primary: !!p?.is_primary }))
      .filter((p) => p.number),
    payment: {
      methods: list(c.payment?.methods)
        .map((m, i) => ({
          id: id(m?.id, 'm', i),
          type: PAYMENT_TYPES.includes(m?.type) ? m.type : 'other',
          label: str(m?.label, 60),
          // Bank accounts / IBANs may contain letters and spaces.
          number: m?.type === 'bank' ? str(m?.number, 60) : phoneDigits(m?.number),
          hint: str(m?.hint, 160),
          is_active: m?.is_active !== false,
        }))
        .filter((m) => m.label && m.number),
      cash_at_branch: c.payment?.cash_at_branch !== false,
    },
    groups: list(c.groups)
      .map((g) => ({ code: str(g?.code, 10).toUpperCase(), url: safeUrl(g?.url) }))
      .filter((g) => g.code && /^https:\/\//i.test(g.url)),
    updated_at: new Date().toISOString(),
  };
}
