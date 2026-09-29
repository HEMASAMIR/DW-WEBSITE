// SERVER-ONLY. Site content the live backend has no endpoints for (branches, announcement banner,
// contact numbers & payment methods),
// stored as JSON files next to the website and edited from the admin dashboard.
//
// Files live in SITE_DATA_DIR (default: <project>/data). Needs a normal Node server with a
// writable disk (a VPS / `npm run start`); read-only hosts (e.g. Vercel) can read the defaults
// but can't save changes.
//
// Writes are allowed only for admins: the caller's token is checked against an admin-only
// backend endpoint, so the backend stays the single source of truth for who is an admin.

import { promises as fs } from 'fs';
import path from 'path';
import axios from 'axios';
import { BRANCHES_DATA, DEFAULT_CONTACT } from '@/constants/siteContent';

const BACKEND_URL = (process.env.BACKEND_URL || 'https://py.deutschewelt.academy').replace(/\/+$/, '');
const DATA_DIR = process.env.SITE_DATA_DIR || path.join(process.cwd(), 'data');

// family: 4 — some networks time out on the backend's IPv6 address.
const http = axios.create({ baseURL: BACKEND_URL, timeout: 20000, family: 4 });

export const BRANCH_COLORS = ['teal', 'sky', 'amber', 'rose', 'violet', 'emerald'];

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
  announcement: () => null,
  contact: () => DEFAULT_CONTACT,
  requests: () => [],
};

const fileFor = (key) => path.join(DATA_DIR, `${key}.json`);

export async function readStore(key) {
  try {
    return JSON.parse(await fs.readFile(fileFor(key), 'utf8'));
  } catch {
    return DEFAULTS[key]();
  }
}

export async function writeStore(key, value) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${fileFor(key)}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), 'utf8');
  await fs.rename(tmp, fileFor(key)); // atomic replace
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

export const dataPath = (...parts) => path.join(DATA_DIR, ...parts);

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
    return { id, name: [u.first_name, u.last_name].filter(Boolean).join(' '), phone: u.phone_number || '', token: auth };
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

const str = (v, max) => String(v ?? '').trim().slice(0, max);
const safeUrl = (v) => {
  const s = str(v, 500);
  return /^https?:\/\//i.test(s) || s.startsWith('/') ? s : '';
};

/** Cleans one branch coming from the dashboard. */
export function cleanBranch(b, index) {
  return {
    id: str(b.id, 60) || `b-${Date.now().toString(36)}-${index}`,
    name: str(b.name, 120),
    city: str(b.city, 80),
    address: str(b.address, 400),
    phone: str(b.phone, 20).replace(/[^\d+]/g, ''),
    badge: str(b.badge, 60),
    map_url: safeUrl(b.map_url),
    color: BRANCH_COLORS.includes(b.color) ? b.color : BRANCH_COLORS[index % BRANCH_COLORS.length],
    is_active: b.is_active !== false,
    order: index + 1,
  };
}

export function cleanAnnouncement(a) {
  if (!a || typeof a !== 'object') return null;
  return {
    is_active: a.is_active !== false,
    tag: str(a.tag, 60),
    title: str(a.title, 200),
    desc: str(a.desc, 500),
    has_discount: !!a.has_discount,
    discount_percent: str(a.discount_percent, 20),
    cta_text: str(a.cta_text, 60),
    cta_link: safeUrl(a.cta_link) || '/#online-courses',
    updated_at: new Date().toISOString(),
  };
}

export const PAYMENT_TYPES = ['wallet', 'instapay', 'bank', 'other'];
const phoneDigits = (v) => str(v, 20).replace(/[^\d+]/g, '');

/** Cleans the contact numbers / payment methods coming from the dashboard. */
export function cleanContact(c) {
  if (!c || typeof c !== 'object') return null;
  const list = (v) => (Array.isArray(v) ? v.slice(0, 12) : []);
  const id = (v, prefix, i) => str(v, 40) || `${prefix}-${Date.now().toString(36)}-${i}`;
  return {
    whatsapp: phoneDigits(c.whatsapp),
    phones: list(c.phones)
      .map((p, i) => ({ id: id(p?.id, 'p', i), label: str(p?.label, 60), number: phoneDigits(p?.number) }))
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
