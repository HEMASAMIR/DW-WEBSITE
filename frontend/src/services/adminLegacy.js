// Admin dashboard on the backend that is live today (no /api/admin/ dashboard API yet).
// Everything is built from the endpoints that backend already has: users/manage, the level
// admin endpoints (list / edit / subscribers / grant / revoke), the book admin endpoints and
// user groups. Methods return the same shapes as the full dashboard API so the sections don't
// care which backend they talk to. Not available here: access requests, branches, lecture
// videos/files, the announcement banner.

import apiClient from './api';
import { API_ENDPOINTS } from '@/constants/apiRoutes';

const ADMIN_GROUP = 'Admin';
const PAGE_SIZE = 20;

const asList = (data) => (Array.isArray(data) ? data : data?.results || []);

/** Follows DRF pagination (`next`) so lists are complete. */
async function getAll(url, params) {
  let { data } = await apiClient.get(url, { params });
  const out = [...asList(data)];
  let guard = 0;
  while (data && !Array.isArray(data) && data.next && guard++ < 50) {
    const next = String(data.next).replace(/^https?:\/\/[^/]+/, ''); // keep requests on our own origin (proxy)
    ({ data } = await apiClient.get(next));
    out.push(...asList(data));
  }
  return out;
}

const maskEmail = (email) => {
  if (!email || !email.includes('@')) return '';
  const [local, domain] = email.split('@');
  return `${local.slice(0, 2)}***@${domain}`;
};

const groupNames = (u) => (u.groups || []).map((g) => (typeof g === 'string' ? g : g?.name)).filter(Boolean);
const isAdminUser = (u) => !!(u.is_admin || u.is_staff || u.is_superuser || groupNames(u).includes(ADMIN_GROUP));
const displayName = (u) =>
  [u.first_name, u.last_name].filter(Boolean).join(' ') || u.full_name || (u.email || u.username || '').split('@')[0] || `#${u.id}`;

/* ------------------------------------------------------------------ */
/* Snapshot: users + who has which level / book (cached briefly)       */
/* ------------------------------------------------------------------ */

let snapshot = null;
let snapshotAt = 0;
const SNAPSHOT_MS = 30 * 1000;

export function invalidateLegacy() {
  snapshot = null;
}

async function loadSnapshot(force = false) {
  if (!force && snapshot && Date.now() - snapshotAt < SNAPSHOT_MS) return snapshot;
  const [users, levels, books] = await Promise.all([
    getAll(API_ENDPOINTS.ADMIN_USERS_MANAGE),
    getAll(API_ENDPOINTS.ADMIN_LEVELS),
    getAll(API_ENDPOINTS.ADMIN_BOOKS).catch(() => []),
  ]);

  const levelUsers = await Promise.all(levels.map((l) => getAll(API_ENDPOINTS.ADMIN_LEVEL_USERS(l.id)).catch(() => [])));
  const bookUsers = await Promise.all(books.map((b) => getAll(API_ENDPOINTS.ADMIN_BOOK_USERS(b.id)).catch(() => [])));

  const levelsByUser = new Map(); // userId → [{ level, granted_at, notes }]
  levels.forEach((l, i) => {
    levelUsers[i].filter((a) => a.is_active !== false).forEach((a) => {
      const uid = a.user_id ?? a.user;
      if (!levelsByUser.has(uid)) levelsByUser.set(uid, []);
      levelsByUser.get(uid).push({ level: l, granted_at: a.granted_at, notes: a.notes || '' });
    });
  });
  const booksByUser = new Map();
  books.forEach((b, i) => {
    bookUsers[i].filter((a) => a.is_active !== false).forEach((a) => {
      const uid = a.user_id ?? a.user;
      if (!booksByUser.has(uid)) booksByUser.set(uid, []);
      booksByUser.get(uid).push({ book: b, granted_at: a.granted_at });
    });
  });

  // Flat list of every active grant, for the subscriptions pages.
  const toRow = (kind, item, levelCode, a) => ({
    kind,
    item_id: item.id,
    item_name: kind === 'level' ? item.title : item.name,
    level_code: levelCode,
    user_id: a.user_id ?? a.user,
    name: [a.user_first_name, a.user_last_name].filter(Boolean).join(' ') || a.user_name || (a.user_email || '').split('@')[0] || `#${a.user_id ?? a.user}`,
    email_masked: maskEmail(a.user_email),
    granted_at: a.granted_at || null,
    notes: a.notes || '',
  });
  const accesses = [
    ...levels.flatMap((l, i) => levelUsers[i].filter((a) => a.is_active !== false).map((a) => toRow('level', l, l.name, a))),
    ...books.flatMap((b, i) => bookUsers[i].filter((a) => a.is_active !== false).map((a) => toRow('book', b, b.level, a))),
  ];

  snapshot = {
    accesses,
    users,
    levels,
    books: books.map((b, i) => ({ ...b, readers: bookUsers[i].filter((a) => a.is_active !== false).length, pending: 0 })),
    levelsByUser,
    booksByUser,
  };
  snapshotAt = Date.now();
  return snapshot;
}

function userRow(u, snap) {
  const levels = (snap.levelsByUser.get(u.id) || []).map((x) => x.level.name);
  return {
    id: u.id,
    name: displayName(u),
    email_masked: maskEmail(u.email || u.username),
    phone: u.phone_number || '',
    is_active: u.is_active !== false,
    is_admin: isAdminUser(u),
    is_superuser: !!u.is_superuser,
    date_joined: u.date_joined || null,
    last_login: u.last_login || null,
    levels: [...new Set(levels)].sort(),
    books_count: (snap.booksByUser.get(u.id) || []).length,
    pending_count: 0,
  };
}

/* ------------------------------------------------------------------ */
/* API (same shapes as the full dashboard API)                         */
/* ------------------------------------------------------------------ */

export const legacyAdmin = {
  async getOverview() {
    const snap = await loadSnapshot(true);
    const now = Date.now();
    const students = snap.users.filter((u) => !isAdminUser(u));
    const joinedAt = (u) => (u.date_joined ? new Date(u.date_joined).getTime() : 0);

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 13);
    const signups = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      return {
        date: d.toISOString().slice(0, 10),
        count: snap.users.filter((u) => joinedAt(u) >= d.getTime() && joinedAt(u) < next.getTime()).length,
      };
    });

    return {
      stats: {
        students: students.length,
        new_students_7d: students.filter((u) => joinedAt(u) >= now - 7 * 86400000).length,
        pending_level_requests: 0,
        pending_book_requests: 0,
        active_level_subscriptions: snap.levels.reduce((s, l) => s + (Number(l.access_count) || 0), 0),
        active_book_accesses: snap.books.reduce((s, b) => s + b.readers, 0),
        levels: snap.levels.length,
        books: snap.books.length,
        branches: 0,
        revenue_total: null,
        revenue_30d: null,
      },
      pending_by_level: { level: {}, book: {} },
      levels: [...snap.levels]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((l) => ({ id: l.id, name: l.name, title: l.title, subscribers: Number(l.access_count) || 0, pending: 0, is_active: l.is_active !== false })),
      signups_14d: signups,
      recent_requests: [],
      // Every book with its readers, so the overview can show each one on its own.
      books: [...snap.books]
        .map((b) => ({ id: b.id, name: b.name, level: b.level, readers: b.readers || 0, is_active: b.is_active !== false })),
      // Latest unlocks (levels & books) — the live activity on this backend; the overview filters them.
      recent_activations: [...snap.accesses]
        .filter((a) => a.granted_at)
        .sort((a, b) => new Date(b.granted_at) - new Date(a.granted_at))
        .slice(0, 300),
      has_join_dates: snap.users.some((u) => u.date_joined),
      recent_users: [...snap.users]
        .sort((a, b) => joinedAt(b) - joinedAt(a))
        .slice(0, 6)
        .map((u) => ({
          id: u.id,
          name: displayName(u),
          date_joined: u.date_joined,
          levels: [...new Set((snap.levelsByUser.get(u.id) || []).map((x) => x.level.name))].sort(),
          books: (snap.booksByUser.get(u.id) || []).map((x) => ({ id: x.book.id, name: x.book.name, level: x.book.level })),
        })),
    };
  },

  async getUsers({ search, role, status, level, page = 1 } = {}) {
    const snap = await loadSnapshot();
    const q = (search || '').trim().toLowerCase();
    // users/manage may return only the newest accounts: search on the server too and keep what it finds.
    if (q) {
      const found = await getAll(API_ENDPOINTS.ADMIN_USERS_MANAGE, { search: search.trim() }).catch(() => []);
      const known = new Set(snap.users.map((u) => u.id));
      found.forEach((u) => { if (!known.has(u.id)) snap.users.push(u); });
    }
    let rows = snap.users.map((u) => ({ u, row: userRow(u, snap) }));
    if (q) {
      rows = rows.filter(({ u, row }) =>
        [row.name, u.email, u.username, u.phone_number].some((v) => String(v || '').toLowerCase().includes(q)));
    }
    if (role === 'admin') rows = rows.filter(({ row }) => row.is_admin);
    if (role === 'student') rows = rows.filter(({ row }) => !row.is_admin);
    if (status === 'active') rows = rows.filter(({ row }) => row.is_active);
    if (status === 'inactive') rows = rows.filter(({ row }) => !row.is_active);
    if (level) rows = rows.filter(({ row }) => row.levels.includes(level));
    rows.sort((a, b) => new Date(b.u.date_joined || 0) - new Date(a.u.date_joined || 0));

    const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    const p = Math.min(Math.max(1, Number(page) || 1), pages);
    return { count: rows.length, page: p, pages, results: rows.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE).map((r) => r.row) };
  },

  async getUser(id) {
    const snap = await loadSnapshot();
    const u = snap.users.find((x) => String(x.id) === String(id));
    if (!u) throw Object.assign(new Error('المستخدم غير موجود.'), { isAxiosError: false });
    return {
      ...userRow(u, snap),
      email: u.email || u.username || '',
      first_name: u.first_name || '',
      last_name: u.last_name || '',
      level_access: (snap.levelsByUser.get(u.id) || []).map((x) => ({
        level_id: x.level.id, code: x.level.name, title: x.level.title, granted_at: x.granted_at, notes: x.notes,
      })),
      book_access: (snap.booksByUser.get(u.id) || []).map((x) => ({
        book_id: x.book.id, name: x.book.name, level: x.book.level, granted_at: x.granted_at,
      })),
      requests: [],
    };
  },

  async createUser({ email, password, first_name, last_name, is_admin }) {
    const { data } = await apiClient.post(API_ENDPOINTS.REGISTER, { email, password, first_name: first_name || email.split('@')[0], last_name });
    if (is_admin && data?.id) await apiClient.post(API_ENDPOINTS.USER_GROUPS(data.id), { groups: [ADMIN_GROUP] });
    invalidateLegacy();
    return { detail: 'تم إنشاء الحساب.', id: data?.id };
  },

  async updateUser(id, fields) {
    const { is_admin: makeAdmin, ...rest } = fields;
    if (Object.keys(rest).length) {
      await apiClient.patch(API_ENDPOINTS.ADMIN_USER_MANAGE(id), rest);
    }
    if (makeAdmin !== undefined) {
      await apiClient.post(API_ENDPOINTS.USER_GROUPS(id), { groups: [makeAdmin ? ADMIN_GROUP : 'Student'] });
    }
    invalidateLegacy();
    return { detail: 'تم حفظ التعديلات.' };
  },

  async deleteUser(id) {
    await apiClient.delete(API_ENDPOINTS.ADMIN_USER_MANAGE(id));
    invalidateLegacy();
    return { detail: 'تم حذف الحساب.' };
  },

  async setUserAccess(id, kind, itemId, grant) {
    const url = kind === 'level'
      ? (grant ? API_ENDPOINTS.ADMIN_GRANT_LEVEL(itemId) : API_ENDPOINTS.ADMIN_REVOKE_LEVEL(itemId))
      : (grant ? API_ENDPOINTS.ADMIN_GRANT_BOOK(itemId) : API_ENDPOINTS.ADMIN_REVOKE_BOOK(itemId));
    const body = { user_id: Number(id) };
    if (kind === 'level' && grant) body.notes = 'تفعيل من لوحة التحكم';
    await apiClient.post(url, body);
    invalidateLegacy();
    // Levels are yearly: activating starts a fresh year, revoking by hand ends it (src/lib/subscriptionsStore.js).
    if (kind === 'level') {
      const level = snapshot?.levels?.find((l) => Number(l.id) === Number(itemId));
      await apiClient
        .post(SITE_SUBSCRIPTIONS, { action: grant ? 'start' : 'stop', user_id: Number(id), level_id: Number(itemId), level_code: level?.name })
        .catch(() => {});
    }
    return { detail: grant ? 'تم التفعيل.' : 'تم إلغاء التفعيل.' };
  },

  /**
   * Runs when the dashboard opens: gives every active level grant a yearly record (counting from the
   * backend's granted_at), revokes the ones whose year is over, and returns them.
   * → { expired: [{ user_id, level_id, level_code, name, expires_at }], records }
   */
  async syncSubscriptions() {
    const snap = await loadSnapshot(true);
    const rows = snap.accesses
      .filter((a) => a.kind === 'level')
      .map((a) => ({ user_id: a.user_id, level_id: a.item_id, level_code: a.level_code, name: a.name, granted_at: a.granted_at }));
    const { data } = await apiClient.post(SITE_SUBSCRIPTIONS, { action: 'sync', rows });
    const due = data?.due || [];
    const revoked = [];
    for (const r of due) {
      try {
        await apiClient.post(API_ENDPOINTS.ADMIN_REVOKE_LEVEL(r.level_id), { user_id: Number(r.user_id) });
        revoked.push(r);
      } catch {
        // stays due; tried again next time the dashboard opens
      }
    }
    if (revoked.length) {
      await apiClient.post(SITE_SUBSCRIPTIONS, { action: 'expire', items: revoked.map(({ user_id, level_id }) => ({ user_id, level_id })) });
      invalidateLegacy();
    }
    const { data: records } = await apiClient.get(SITE_SUBSCRIPTIONS, { params: { all: 1 } });
    return { expired: revoked, records: Array.isArray(records) ? records : [] };
  },

  async getLevels() {
    const [levels, snap] = await Promise.all([getAll(API_ENDPOINTS.ADMIN_LEVELS), loadSnapshot().catch(() => null)]);
    const subs = (id) => (snap ? snap.accesses.filter((a) => a.kind === 'level' && a.item_id === id) : [])
      .sort((a, b) => new Date(b.granted_at || 0) - new Date(a.granted_at || 0));
    return levels
      .map((l) => ({
        ...l,
        subscribers: Number(l.access_count) || 0,
        recent_subscribers: subs(l.id).slice(0, 5).map((a) => ({ name: a.name, granted_at: a.granted_at })),
        videos_count: null,
        files_count: null,
        pending: 0,
      }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },

  async createLevel(fields) {
    const { data } = await apiClient.post(API_ENDPOINTS.ADMIN_LEVELS, fields);
    return data;
  },

  async updateLevel(id, fields) {
    const { data } = await apiClient.patch(API_ENDPOINTS.ADMIN_LEVEL_DETAIL(id), fields);
    invalidateLegacy();
    return data;
  },

  async deleteLevel(id) {
    await apiClient.delete(API_ENDPOINTS.ADMIN_LEVEL_DETAIL(id));
    invalidateLegacy();
    return { detail: 'تم حذف المستوى.' };
  },

  /** Everyone a level (kind="level") or book (kind="book") is unlocked for, newest first. */
  async getAccessList(kind, force = false) {
    const snap = await loadSnapshot(force);
    return {
      items: kind === 'level'
        ? [...snap.levels].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((l) => ({ id: l.id, name: l.title, level_code: l.name }))
        : snap.books.map((b) => ({ id: b.id, name: b.name, level_code: b.level })),
      rows: snap.accesses
        .filter((a) => a.kind === kind)
        .sort((a, b) => new Date(b.granted_at || 0) - new Date(a.granted_at || 0)),
    };
  },

  async getBooks() {
    const snap = await loadSnapshot();
    return snap.books;
  },

  // ---- Branches & announcement: stored by the website itself (src/app/site-data) ----
  async getBranches() {
    const { data } = await apiClient.get(SITE_BRANCHES);
    return (Array.isArray(data) ? data : []).map((b, i) => ({ ...b, order: i + 1 }));
  },

  async createBranch(fields) {
    const list = await legacyAdmin.getBranches();
    const saved = await saveBranches([...list, { ...fields, id: `b-${Date.now().toString(36)}` }]);
    return saved[saved.length - 1];
  },

  async updateBranch(id, fields) {
    const list = await legacyAdmin.getBranches();
    const saved = await saveBranches(list.map((b) => (String(b.id) === String(id) ? { ...b, ...fields } : b)));
    return saved.find((b) => String(b.id) === String(id));
  },

  async deleteBranch(id) {
    const list = await legacyAdmin.getBranches();
    await saveBranches(list.filter((b) => String(b.id) !== String(id)));
    return { detail: 'تم حذف الفرع.' };
  },

  /** dir: -1 (earlier) | 1 (later) */
  async moveBranch(id, dir) {
    const list = await legacyAdmin.getBranches();
    const i = list.findIndex((b) => String(b.id) === String(id));
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return list;
    [list[i], list[j]] = [list[j], list[i]];
    return saveBranches(list);
  },

  async getAnnouncement() {
    try {
      return (await apiClient.get(SITE_ANNOUNCEMENT)).data;
    } catch (e) {
      if (e.response?.status === 404) return { ...EMPTY_ANNOUNCEMENT };
      throw e;
    }
  },

  async saveAnnouncement(fields) {
    return (await apiClient.put(SITE_ANNOUNCEMENT, fields)).data;
  },
};

const SITE_BRANCHES = '/site-data/branches';
const SITE_ANNOUNCEMENT = '/site-data/announcement';
const SITE_SUBSCRIPTIONS = '/site-data/subscriptions';
const EMPTY_ANNOUNCEMENT = {
  is_active: false, tag: '🔥 عرض خاص', title: '', desc: '', has_discount: false, discount_percent: '',
  cta_text: 'احجز الآن', cta_link: '/#online-courses',
};

async function saveBranches(list) {
  const { data } = await apiClient.put(SITE_BRANCHES, list);
  return data;
}
