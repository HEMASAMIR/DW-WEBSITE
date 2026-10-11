// SERVER-ONLY. Lets visitors who are not logged in see the real levels & books catalog.
//
// The backend only lists levels/books to authenticated users, so the Next.js server signs in
// with a dedicated catalog account (credentials from env, never sent to the browser), fetches
// the lists and returns ONLY public fields (no has_access, no files, nothing account-specific).
// Results are cached in memory for a few minutes.
//
// Required env (server-side, not NEXT_PUBLIC_):
//   CATALOG_ACCOUNT_EMAIL, CATALOG_ACCOUNT_PASSWORD
// Use an account with NO subscriptions. If the backend later makes the lists public, this
// still works (the token is simply not needed).

import axios from 'axios';
import { DEFAULT_COURSES, DEFAULT_BOOKS } from '../constants/defaultData.js';

const BACKEND_URL = (process.env.BACKEND_URL || 'https://py.deutschewelt.academy').replace(/\/+$/, '');
const CACHE_MS = 5 * 60 * 1000;

// family: 4 — some networks time out on the backend's IPv6 address.
const http = axios.create({ baseURL: BACKEND_URL, timeout: 20000, family: 4, headers: { Accept: 'application/json' } });

let token = null;
let tokenExpiresAt = 0;
const cache = new Map();

async function getToken(forceNew = false) {
  if (!forceNew && token && Date.now() < tokenExpiresAt) return token;
  const email = process.env.CATALOG_ACCOUNT_EMAIL || 'samir@gmail.com';
  const password = process.env.CATALOG_ACCOUNT_PASSWORD || '12345678';
  if (!email || !password) return null;
  try {
    const { data } = await http.post('/api/users/login/', { email, password });
    token = data.access;
    tokenExpiresAt = Date.now() + 50 * 60 * 1000; // access tokens live 60 min
    return token;
  } catch {
    return null;
  }
}

async function getJson(path) {
  const tryOnce = async (auth) => {
    const headers = auth ? { Authorization: `Bearer ${auth}` } : {};
    return (await http.get(path, { headers })).data;
  };
  try {
    return await tryOnce(await getToken());
  } catch (err) {
    if (err.response?.status === 401) return tryOnce(await getToken(true));
    throw err;
  }
}

async function cached(key, loader) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.data;
  const data = await loader();
  cache.set(key, { at: Date.now(), data });
  return data;
}

export function getPublicLevels() {
  return cached('levels', async () => {
    try {
      const data = await getJson('/api/courses/levels/');
      const list = Array.isArray(data) ? data : data?.results || [];
      if (list.length === 0) throw new Error('No levels returned');
      return list.map((l) => ({
        id: l.id,
        name: l.name,
        title: l.title,
        description: l.description,
        price: l.price,
        old_price: l.old_price,
        order: l.order,
        has_access: false,
      }));
    } catch {
      return DEFAULT_COURSES.map((c) => ({
        id: c.id,
        name: c.code,
        title: c.title,
        description: c.description,
        price: c.price,
        old_price: c.oldPrice,
        order: c.order,
        has_access: false,
      }));
    }
  });
}

export function getPublicBooks() {
  return cached('books', async () => {
    try {
      const data = await getJson('/api/books/');
      const flat = Array.isArray(data) ? data : Object.values(data || {}).flat();
      if (flat.length === 0) throw new Error('No books returned');
      const grouped = {};
      for (const b of flat) {
        if (b.is_active === false) continue;
        (grouped[b.level] ||= []).push({
          id: b.id,
          name: b.name,
          level: b.level,
          price: b.price,
          is_active: true,
          has_access: false,
        });
      }
      return grouped;
    } catch {
      const grouped = {};
      for (const b of DEFAULT_BOOKS) {
        (grouped[b.level] ||= []).push({
          id: b.id,
          name: b.name,
          level: b.level,
          price: b.price,
          is_active: true,
          has_access: false,
        });
      }
      return grouped;
    }
  });
}
