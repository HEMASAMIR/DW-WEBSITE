// SERVER-ONLY. Yearly level subscriptions, kept by the website (the live backend's level access has
// no end date). One record per (student, level):
//   { user_id, level_id, level_code, name, started_at, expires_at, status: 'active' | 'expired', expired_at? }
//
// • Approving a request / activating from the dashboard starts a fresh year (action "start").
// • Revoking by hand removes the record (action "stop").
// • The dashboard syncs on open: every active grant gets a record (its year counts from the backend's
//   granted_at), and the ones past expires_at come back as "due" — the dashboard revokes them on the
//   backend and reports them back (action "expire").

import { readStore, writeStore, withLock } from './siteStore';

export const YEAR_MS = 365 * 24 * 60 * 60 * 1000;
export const WARN_DAYS = 30;

const key = (userId, levelId) => `${Number(userId)}:${Number(levelId)}`;
const plusYear = (iso) => new Date(new Date(iso).getTime() + YEAR_MS).toISOString();

export const loadSubscriptions = () => readStore('subscriptions');

export const updateSubscriptions = (fn) => withLock('subscriptions', async () => {
  const list = await readStore('subscriptions');
  const { list: next, result } = await fn(list);
  await writeStore('subscriptions', next);
  return result;
});

const str = (v, max) => String(v ?? '').trim().slice(0, max);

/** A fresh year from now (approve / activate / renew). */
export function startYear(list, { user_id, level_id, level_code, name }) {
  const now = new Date().toISOString();
  const record = {
    user_id: Number(user_id),
    level_id: Number(level_id),
    level_code: str(level_code, 10),
    name: str(name, 120),
    started_at: now,
    expires_at: plusYear(now),
    status: 'active',
  };
  const rest = list.filter((r) => key(r.user_id, r.level_id) !== key(user_id, level_id));
  return { list: [...rest, record], result: record };
}

export function stopYear(list, { user_id, level_id }) {
  return { list: list.filter((r) => key(r.user_id, r.level_id) !== key(user_id, level_id)), result: true };
}

/**
 * rows: every active level grant on the backend [{ user_id, level_id, level_code, name, granted_at }].
 * Returns the new list and the records whose year is over (still active on the backend).
 */
export function syncYears(list, rows, now = new Date()) {
  const byKey = new Map(list.map((r) => [key(r.user_id, r.level_id), r]));
  const activeKeys = new Set();
  const next = [];

  rows.forEach((row) => {
    const k = key(row.user_id, row.level_id);
    if (activeKeys.has(k) || !Number(row.user_id) || !Number(row.level_id)) return;
    activeKeys.add(k);
    const existing = byKey.get(k);
    let record;
    if (!existing) {
      // First time we see this grant: the year counts from when the backend granted it.
      const started = row.granted_at && !Number.isNaN(new Date(row.granted_at).getTime()) ? new Date(row.granted_at).toISOString() : now.toISOString();
      record = { user_id: Number(row.user_id), level_id: Number(row.level_id), started_at: started, expires_at: plusYear(started), status: 'active' };
    } else if (existing.status === 'expired') {
      // Expired here but active again on the backend → it was re-activated outside the dashboard flow: new year.
      record = { ...existing, started_at: now.toISOString(), expires_at: plusYear(now.toISOString()), status: 'active', expired_at: undefined };
    } else {
      record = { ...existing };
    }
    record.level_code = str(row.level_code, 10) || record.level_code || '';
    record.name = str(row.name, 120) || record.name || '';
    next.push(record);
  });

  // Keep expired records (the student's page shows "your subscription ended"); drop active ones that
  // are no longer granted (revoked elsewhere).
  list.forEach((r) => {
    if (r.status === 'expired' && !activeKeys.has(key(r.user_id, r.level_id))) next.push(r);
  });

  const due = next.filter((r) => r.status === 'active' && new Date(r.expires_at) <= now);
  return { list: next, result: { due } };
}

/** Marks records expired after the dashboard revoked them on the backend. */
export function expireYears(list, items) {
  const keys = new Set(items.map((i) => key(i.user_id, i.level_id)));
  const now = new Date().toISOString();
  const changed = [];
  const next = list.map((r) => {
    if (!keys.has(key(r.user_id, r.level_id)) || r.status === 'expired') return r;
    const e = { ...r, status: 'expired', expired_at: now };
    changed.push(e);
    return e;
  });
  return { list: next, result: changed };
}

/** What the student sees about their own subscriptions. */
export const ownSubscriptionView = (r) => ({
  level_id: r.level_id,
  level_code: r.level_code,
  started_at: r.started_at,
  expires_at: r.expires_at,
  status: r.status === 'active' && new Date(r.expires_at) <= new Date() ? 'expired' : r.status,
});
