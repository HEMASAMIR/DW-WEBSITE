// SERVER-ONLY. Site content the live backend has no endpoints for (branches, announcement banner),
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
import { BRANCHES_DATA } from '@/constants/siteContent';

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
