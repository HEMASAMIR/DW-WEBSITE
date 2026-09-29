'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { DEFAULT_CONTACT } from '@/constants/siteContent';

/**
 * Contact numbers + payment methods, as saved from the admin dashboard (site-data/contact).
 * Every component reads the same copy: it's fetched once per page load, and a save from the
 * dashboard updates all of them at once (setContactInfo).
 */

let current = DEFAULT_CONTACT;
let fetched = false;
const listeners = new Set();

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export function setContactInfo(next) {
  if (!next || typeof next !== 'object') return;
  current = {
    ...DEFAULT_CONTACT,
    ...next,
    payment: { ...DEFAULT_CONTACT.payment, ...(next.payment || {}) },
  };
  listeners.forEach((fn) => fn());
}

function loadOnce() {
  if (fetched) return;
  fetched = true;
  fetch('/site-data/contact', { cache: 'no-store' })
    .then((res) => (res.ok ? res.json() : null))
    .then(setContactInfo)
    .catch(() => { fetched = false; }); // try again on the next mount
}

export function useContactInfo() {
  const info = useSyncExternalStore(subscribe, () => current, () => DEFAULT_CONTACT);
  useEffect(loadOnce, []);
  return info;
}

/* ---------------- helpers ---------------- */

/** 010… or +20 10… → 2010… for wa.me */
export function waNumber(number) {
  const digits = String(number || '').replace(/\D/g, '');
  return digits.startsWith('0') ? `2${digits}` : digits;
}

export const whatsappHref = (info, message = '') =>
  `https://wa.me/${waNumber(info.whatsapp)}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const primaryPhone = (info) => info.phones?.find((p) => p.number)?.number || '';

/** Payment methods shown to students (active ones with a number). */
export const activeMethods = (info) => (info.payment?.methods || []).filter((m) => m.is_active !== false && m.number);

/** The value stored on a request when the student pays cash at a branch. */
export const CASH_METHOD = 'دفع نقدي بالفرع';

/** Transfer number for a payment method label (falls back to the first active method). */
export function numberForMethod(info, label) {
  const methods = activeMethods(info);
  return (methods.find((m) => m.label === label) || methods[0])?.number || '';
}

export const groupLink = (info, code) =>
  (info.groups || []).find((g) => String(g.code).toUpperCase() === String(code || '').toUpperCase())?.url || null;
