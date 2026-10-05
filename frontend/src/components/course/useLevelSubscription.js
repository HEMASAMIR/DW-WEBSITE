'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { subscriptionsService } from '@/services/requests.service';

const DAY = 24 * 60 * 60 * 1000;
export const WARN_DAYS = 30;

// One fetch per page load, shared by every component that asks.
let cache = null;
const loadMine = () => {
  if (!cache) cache = subscriptionsService.mine().catch(() => { cache = null; return []; });
  return cache;
};

/**
 * The student's yearly subscription to a level:
 *   null (none / not loaded / logged out) or
 *   { started_at, expires_at, status: 'active' | 'expired', daysLeft, ending (≤ 30 days left), elapsed }
 * An expired year locks the level here even before the dashboard revokes it on the backend.
 */
export function useLevelSubscription(levelId) {
  const { isAuthenticated } = useAuth();
  const [record, setRecord] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    let cancelled = false;
    loadMine().then((list) => {
      if (cancelled) return;
      const r = list.find((x) => String(x.level_id) === String(levelId));
      setRecord(r ? describe(r, Date.now()) : null);
    });
    return () => { cancelled = true; };
  }, [levelId, isAuthenticated]);

  return isAuthenticated ? record : null;
}

/** Adds status / daysLeft / ending / elapsed (0–1 of the year) as of `now`. */
function describe(record, now) {
  const start = new Date(record.started_at).getTime();
  const end = new Date(record.expires_at).getTime();
  const expired = record.status === 'expired' || end - now <= 0;
  const daysLeft = Math.max(0, Math.ceil((end - now) / DAY));
  return {
    ...record,
    status: expired ? 'expired' : 'active',
    daysLeft,
    ending: !expired && daysLeft <= WARN_DAYS,
    elapsed: Math.min(1, Math.max(0, (now - start) / (end - start || 1))),
  };
}
