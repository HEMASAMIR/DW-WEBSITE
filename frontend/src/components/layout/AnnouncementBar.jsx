'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Megaphone } from 'lucide-react';
import apiClient from '@/services/api';

import { t } from '@/lib/i18n';
// Shows ONLY the announcement from the backend (GET /api/announcements/) or saved from the dashboard (/site-data/announcement).
// No hard-coded offers/discounts: if the backend has no announcement (404) or it is
// disabled, the bar is not rendered at all.
export default function AnnouncementBar() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    // The backend's banner if it has one, otherwise the one saved from the dashboard on this site.
    apiClient
      .get('/api/announcements/')
      .catch(() => apiClient.get('/site-data/announcement'))
      .then(({ data: a }) => {
        if (!cancelled && a && a.is_active !== false && (a.title || a.desc)) setData(a);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) return null;

  const showDiscount = data.has_discount && data.discount_percent;
  const link = data.cta_link || '/#online-courses';

  return (
    <div className="relative z-30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-b border-amber-500/25" role="region" aria-label={t('إعلان')}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0 text-center md:text-start">
          <Megaphone className="w-4 h-4 text-amber-400 shrink-0 hidden sm:block" />
          {data.tag && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-amber-300 border border-amber-500/40 shrink-0">
              {data.tag}
            </span>
          )}
          {showDiscount && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-600 text-white shrink-0">
              {data.discount_percent}
            </span>
          )}
          <span className="text-xs sm:text-sm font-bold text-white truncate">{data.title}</span>
          {data.desc && <span className="text-xs text-slate-300 hidden lg:inline truncate">{data.desc}</span>}
        </div>

        {data.cta_text && (
          <Link
            href={link}
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-black bg-amber-400 text-slate-950 shrink-0 hover:bg-amber-300"
          >
            <span>{data.cta_text}</span>
            <ArrowLeft className="w-3 h-3 ltr:-scale-x-100" />
          </Link>
        )}
      </div>
    </div>
  );
}
