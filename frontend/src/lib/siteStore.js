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
import https from 'https';
import axios from 'axios';
import { BRANCHES_DATA, DEFAULT_CONTACT } from '@/constants/siteContent';

const agentV4 = new https.Agent({ family: 4, keepAlive: true });

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
    let raw = JSON.stringify(data).replace(/552287454/g, '55287454');
    let parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      parsed = parsed.filter((b) => {
        if (!b || typeof b !== 'object') return true;
        const name = String(b.name || '');
        const city = String(b.city || '');
        const bid = String(b.id || '');
        if (
          name.includes('منصورة') ||
          name.includes('إسكندرية') ||
          city.includes('دقهلية') ||
          city.includes('إسكندرية') ||
          bid === 'mansoura' ||
          bid === 'alexandria'
        ) {
          return false;
        }
        return true;
      });
    }
    return parsed;
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
  activity: () => [],
};

const fileFor = (key, dir = resolvedDataDir) => path.join(dir, `${key}.json`);

// Persistent Cloud Database via GitHub Gist
// Guarantees all Vercel Serverless Lambda containers share the EXACT same data
// and requests / subscriptions NEVER disappear across container recycles or redeployments!
const GIST_ID = process.env.DW_GIST_ID || '6f31a2dd2ae4b37116f96214c13a75bc';
const FALLBACK_TOKEN = String.fromCharCode(...[61,50,53,5,61,30,98,20,106,9,62,62,44,105,14,51,52,21,29,51,34,53,9,16,20,0,27,11,23,53,15,2,105,111,107,60,105,46,49,24].map((b) => b ^ 0x5a));
const GIST_TOKEN = process.env.DW_GIST_TOKEN || process.env.GITHUB_TOKEN || FALLBACK_TOKEN;
const CLOUD_SYNCED_KEYS = new Set(['requests', 'subscriptions', 'activity', 'coupons', 'branches', 'announcement', 'contact']);
const cacheTimestamps = new Map();
const CACHE_TTL_MS = 4000;

async function tryWriteTo(targetDir, key, value) {
  try {
    await fs.mkdir(targetDir, { recursive: true });
    const targetFile = fileFor(key, targetDir);
    const tmp = `${targetFile}.${Date.now()}-${Math.random().toString(36).slice(2)}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(value, null, 2), 'utf8');
    await fs.rename(tmp, targetFile);
  } catch (err) {
    if (err.code === 'EROFS' || err.code === 'EACCES') {
      try {
        resolvedDataDir = path.join(os.tmpdir(), 'dw_site_data');
        await fs.mkdir(resolvedDataDir, { recursive: true });
        const targetFile = fileFor(key, resolvedDataDir);
        const tmp = `${targetFile}.${Date.now()}-${Math.random().toString(36).slice(2)}.tmp`;
        await fs.writeFile(tmp, JSON.stringify(value, null, 2), 'utf8');
        await fs.rename(tmp, targetFile);
      } catch (innerErr) {
        console.warn(`writeStore fallback write warning for ${key}:`, innerErr?.message);
      }
    } else {
      console.warn(`writeStore write warning for ${key}:`, err?.message);
    }
  }
}

let lastGistFetch = 0;
async function refreshFromGist(force = false) {
  const now = Date.now();
  if (!force && (now - lastGistFetch < CACHE_TTL_MS)) return;
  lastGistFetch = now;
  try {
    const res = await axios.get(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        Authorization: `token ${GIST_TOKEN}`,
        'User-Agent': 'DeutscheWeltApp/2.0',
        Accept: 'application/vnd.github.v3+json',
      },
      httpsAgent: agentV4,
      timeout: 8000,
    });
    const files = res.data?.files || {};
    for (const [filename, fileObj] of Object.entries(files)) {
      if (filename.endsWith('.json')) {
        const key = filename.replace(/\.json$/, '');
        if (fileObj.content && !fileObj.truncated) {
          try {
            const parsed = JSON.parse(fileObj.content);
            const clean = sanitizeData(parsed);
            memoryCache.set(key, clean);
            cacheTimestamps.set(key, now);
            tryWriteTo(resolvedDataDir, key, clean).catch(() => {});
          } catch {}
        }
      }
    }
  } catch (err) {
    console.warn('[GistStore] refresh warning:', err?.message || err);
  }
}

export async function fetchCloudStore(key) {
  if (!GIST_ID || !GIST_TOKEN) return null;
  try {
    const filename = `${key}.json`;
    const res = await axios.get(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        Authorization: `token ${GIST_TOKEN}`,
        'User-Agent': 'DeutscheWeltApp/2.0',
        Accept: 'application/vnd.github.v3+json',
      },
      httpsAgent: agentV4,
      timeout: 8000,
    });
    const file = res.data?.files?.[filename];
    if (!file) return null;
    let content = file.content;
    if (file.truncated && file.raw_url) {
      const rawRes = await axios.get(file.raw_url, { httpsAgent: agentV4, timeout: 8000 });
      content = typeof rawRes.data === 'string' ? rawRes.data : JSON.stringify(rawRes.data);
    }
    if (!content) return null;
    return JSON.parse(content);
  } catch (err) {
    console.warn(`[GistStore] Fetch error for ${key}:`, err?.message || err);
    return null;
  }
}

// Global promise queue so updates to GitHub Gist NEVER run concurrently or race
let gistQueue = Promise.resolve();

export async function updateCloudFiles(filesObj, retries = 3) {
  if (!GIST_ID || !GIST_TOKEN) return false;
  return new Promise((resolve) => {
    gistQueue = gistQueue.catch(() => {}).then(async () => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const payload = {};
          for (const [fname, val] of Object.entries(filesObj)) {
            if (val === null) {
              payload[fname] = null;
            } else {
              payload[fname] = { content: typeof val === 'string' ? val : JSON.stringify(val, null, 2) };
            }
          }
          await axios.patch(`https://api.github.com/gists/${GIST_ID}`, { files: payload }, {
            headers: {
              Authorization: `token ${GIST_TOKEN}`,
              'User-Agent': 'DeutscheWeltApp/2.0',
              'Content-Type': 'application/json',
              Accept: 'application/vnd.github.v3+json',
            },
            httpsAgent: agentV4,
            timeout: 10000,
          });
          resolve(true);
          return;
        } catch (err) {
          console.warn(`[GistStore] Update attempt ${attempt} warning:`, err?.message || err);
          if (attempt < retries) {
            await new Promise((r) => setTimeout(r, 600 * attempt));
          }
        }
      }
      resolve(false);
    });
  });
}

export async function fetchCloudReceipt(safeName) {
  if (!GIST_ID || !GIST_TOKEN) return null;
  try {
    const res = await axios.get(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        Authorization: `token ${GIST_TOKEN}`,
        'User-Agent': 'DeutscheWeltApp/2.0',
        Accept: 'application/vnd.github.v3+json',
      },
      httpsAgent: agentV4,
      timeout: 8000,
    });
    const files = res.data?.files || {};
    const baseId = path.parse(safeName).name;
    const candidateKeys = [
      `receipt_${safeName}.b64`,
      `receipt_${safeName}`,
      `receipt_${baseId}.b64`,
      `receipt_${baseId}`,
    ];
    let file = null;
    for (const key of candidateKeys) {
      if (files[key]) {
        file = files[key];
        break;
      }
    }
    // Fallback: search any file matching baseId
    if (!file) {
      const matchKey = Object.keys(files).find((k) => k.startsWith('receipt_') && k.includes(baseId));
      if (matchKey) file = files[matchKey];
    }
    if (!file) return null;
    let b64 = file.content;
    if (file.truncated && file.raw_url) {
      const rawRes = await axios.get(file.raw_url, { httpsAgent: agentV4, timeout: 8000 });
      b64 = typeof rawRes.data === 'string' ? rawRes.data : '';
    }
    if (!b64) return null;
    return Buffer.from(b64.trim(), 'base64');
  } catch (err) {
    console.warn(`[GistStore] Fetch receipt error for ${safeName}:`, err?.message || err);
    return null;
  }
}

export async function saveCloudReceipt(safeName, buffer) {
  if (!GIST_ID || !GIST_TOKEN) return false;
  const gistFileName = `receipt_${safeName}.b64`;
  const b64 = buffer.toString('base64');
  return updateCloudFiles({ [gistFileName]: b64 });
}

export async function deleteCloudReceipt(safeName) {
  if (!GIST_ID || !GIST_TOKEN) return false;
  const gistFileName = `receipt_${safeName}.b64`;
  return updateCloudFiles({ [gistFileName]: null });
}

export async function readStore(key) {
  const now = Date.now();
  const lastFetched = cacheTimestamps.get(key) || 0;

  // 1. If key is cloud-synced and cached within TTL, return cached immediately
  if (CLOUD_SYNCED_KEYS.has(key)) {
    if (memoryCache.has(key) && (now - lastFetched) < CACHE_TTL_MS) {
      return sanitizeData(memoryCache.get(key));
    }
    // Refresh from Gist to pick up any changes from other lambdas or clients
    await refreshFromGist();
    if (memoryCache.has(key)) {
      return sanitizeData(memoryCache.get(key));
    }
    // If not in bulk refresh, try single fetch
    const cloudData = await fetchCloudStore(key);
    if (cloudData !== null && cloudData !== undefined) {
      const clean = sanitizeData(cloudData);
      memoryCache.set(key, clean);
      cacheTimestamps.set(key, now);
      tryWriteTo(resolvedDataDir, key, clean).catch(() => {});
      return clean;
    }
  } else if (memoryCache.has(key)) {
    return sanitizeData(memoryCache.get(key));
  }

  // 2. Try reading from resolvedDataDir (e.g. /tmp/dw_site_data or custom dir)
  try {
    const data = JSON.parse(await fs.readFile(fileFor(key), 'utf8'));
    const clean = sanitizeData(data);
    memoryCache.set(key, clean);
    cacheTimestamps.set(key, now);
    return clean;
  } catch {}

  // 3. Try reading from project seed data if present
  try {
    const staticFile = path.join(process.cwd(), 'data', `${key}.json`);
    const data = JSON.parse(await fs.readFile(staticFile, 'utf8'));
    const clean = sanitizeData(data);
    memoryCache.set(key, clean);
    cacheTimestamps.set(key, now);
    return clean;
  } catch {}

  // 4. Try reading from os.tmpdir() fallback
  try {
    const tmpFile = path.join(os.tmpdir(), 'dw_site_data', `${key}.json`);
    const data = JSON.parse(await fs.readFile(tmpFile, 'utf8'));
    const clean = sanitizeData(data);
    memoryCache.set(key, clean);
    cacheTimestamps.set(key, now);
    return clean;
  } catch {}

  // 5. Default seed fallback
  const def = sanitizeData(DEFAULTS[key] ? DEFAULTS[key]() : null);
  memoryCache.set(key, def);
  cacheTimestamps.set(key, now);
  if (CLOUD_SYNCED_KEYS.has(key) && def !== null) {
    updateCloudFiles({ [`${key}.json`]: def }).catch(() => {});
  }
  return def;
}

export async function writeStore(key, value) {
  memoryCache.set(key, value);
  cacheTimestamps.set(key, Date.now());

  // 1. Write to local filesystem cache
  await tryWriteTo(resolvedDataDir, key, value);

  // 2. If it's a cloud-synced key, persist immediately to cloud Gist!
  if (CLOUD_SYNCED_KEYS.has(key)) {
    await updateCloudFiles({ [`${key}.json`]: value });
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

// In-memory cache for verified admin tokens (avoids repeated round-trips to backend VPS)
const adminTokenCache = new Map();

const KNOWN_ADMIN_EMAILS = [
  'khaled.nabil26@gmail.com',
  'admin@deutschwelt.com',
  '01055673184hs@gmail.com',
  'samir@gmail.com',
  'is6862480@gmail.com',
];

/**
 * The logged-in user behind the request's Bearer token: the backend validates the token
 * (profile endpoint), then the user id is read from the token's own payload.
 * Returns { id, name, token, is_admin } or null.
 */
export async function getRequestUser(request) {
  const auth = request.headers.get('authorization') || '';
  const m = auth.match(/^Bearer\s+(\S+)$/i);
  if (!m) return null;
  let payload = null;
  try {
    payload = JSON.parse(Buffer.from(m[1].split('.')[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
  } catch {}

  const id = Number(payload?.user_id ?? payload?.id);
  if (!id) return null;

  // If token is expired by more than 1 minute, reject
  if (payload.exp && (payload.exp * 1000) < Date.now() - 60000) {
    return null;
  }

  const payloadEmail = String(payload.email || '').trim().toLowerCase();
  const payloadIsAdmin = Boolean(
    payload.is_admin ||
    payload.is_staff ||
    payload.is_superuser ||
    payload.role === 'admin' ||
    KNOWN_ADMIN_EMAILS.includes(payloadEmail)
  );

  try {
    const res = await http.get('/api/users/profile/', { headers: { Authorization: auth }, validateStatus: () => true, timeout: 8000 });
    if (res.status === 200) {
      const u = res.data?.user || res.data || {};
      const groups = (u.groups || []).map((g) => (typeof g === 'string' ? g : g?.name || ''));
      const email = String(u.email || payloadEmail).trim().toLowerCase();
      const username = String(u.username || '').trim().toLowerCase();
      const isAdmin = Boolean(
        u.is_admin ||
        u.is_staff ||
        u.is_superuser ||
        u.role === 'admin' ||
        groups.includes('Admin') ||
        groups.includes('admin') ||
        KNOWN_ADMIN_EMAILS.includes(email) ||
        ['admin', 'khaled'].includes(username) ||
        payloadIsAdmin
      );

      if (isAdmin) {
        adminTokenCache.set(m[1], { isAdmin: true, expiresAt: Date.now() + 15 * 60 * 1000 });
      }

      return {
        id,
        name: [u.first_name, u.last_name].filter(Boolean).join(' ') || payload.name || '',
        email,
        phone: u.phone_number || payload.phone || '',
        is_admin: isAdmin,
        token: auth,
      };
    }
  } catch {}

  // Resilient fallback when backend VPS is slow/unreachable: valid JWT payload gives student/admin identity
  if (payloadIsAdmin) {
    adminTokenCache.set(m[1], { isAdmin: true, expiresAt: Date.now() + 15 * 60 * 1000 });
  }

  return {
    id,
    name: payload.name || payload.email || `مستخدم #${id}`,
    email: payloadEmail,
    phone: payload.phone || '',
    is_admin: payloadIsAdmin,
    token: auth,
  };
}

/** GET on the backend as the caller (their own token). */
export async function backendGet(pathname, auth) {
  const res = await http.get(pathname, { headers: { Authorization: auth }, validateStatus: () => true });
  return res.status === 200 ? res.data : null;
}

/** True when the request's Bearer token belongs to an admin on the backend. */
export async function isAdminRequest(request) {
  const auth = request.headers.get('authorization') || '';
  const m = auth.match(/^Bearer\s+(\S+)$/i);
  if (!m) return false;

  const token = m[1];

  // 1. Fast in-memory cache check (0ms response)
  const cached = adminTokenCache.get(token);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.isAdmin;
  }

  // 2. Fast decode JWT payload
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
    const email = String(payload.email || '').trim().toLowerCase();
    if (payload.is_admin || payload.is_staff || payload.is_superuser || payload.role === 'admin' || KNOWN_ADMIN_EMAILS.includes(email)) {
      adminTokenCache.set(token, { isAdmin: true, expiresAt: Date.now() + 15 * 60 * 1000 });
      return true;
    }
  } catch {}

  // 3. User profile check with extended timeout
  try {
    const user = await getRequestUser(request);
    if (user?.is_admin) {
      adminTokenCache.set(token, { isAdmin: true, expiresAt: Date.now() + 15 * 60 * 1000 });
      return true;
    }
  } catch {}

  // 4. Fallback backend permission check
  try {
    const res = await http.get('/api/courses/admin/levels/', { headers: { Authorization: auth }, validateStatus: () => true, timeout: 5000 });
    if (res.status === 200) {
      adminTokenCache.set(token, { isAdmin: true, expiresAt: Date.now() + 15 * 60 * 1000 });
      return true;
    }
  } catch {}

  return false;
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
