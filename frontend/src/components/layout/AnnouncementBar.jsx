'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Megaphone, Sparkles } from 'lucide-react';
import apiClient from '@/services/api';
import { t } from '@/lib/i18n';

export default function AnnouncementBar() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
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

  const tickerItem = (
    <div className="flex items-center gap-3 sm:gap-5 px-3 sm:px-5 shrink-0 whitespace-nowrap select-none" dir="rtl">
      {/* Icon + Tag */}
      {data.tag && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400/15 border border-amber-400/40 text-amber-300 shrink-0 shadow-xs">
          <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{data.tag}</span>
        </span>
      )}

      {/* Discount badge if present */}
      {showDiscount && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-black bg-rose-600 text-white shadow-xs shrink-0 animate-pulse">
          {data.discount_percent}
        </span>
      )}

      {/* Title */}
      <span className="text-xs sm:text-[13px] font-black text-white tracking-wide">
        {data.title}
      </span>

      {/* Separator */}
      {data.desc && <span className="text-amber-400/60 text-xs">✦</span>}

      {/* Description */}
      {data.desc && (
        <span className="text-xs sm:text-[13px] font-medium text-slate-300">
          {data.desc}
        </span>
      )}

      {/* Loop Separator */}
      <span className="text-amber-400/40 text-xs mx-1 sm:mx-3">✦ ✦</span>
    </div>
  );

  return (
    <div
      className="dw-announcement-wrapper relative z-30 bg-gradient-to-r from-slate-950 via-[#0a192f] to-slate-950 text-white border-b border-amber-500/25 overflow-hidden shadow-sm"
      role="region"
      aria-label={t('إعلان')}
    >
      {/* Top subtle golden shimmer border */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-2 sm:px-6 h-10 sm:h-11 flex items-center justify-between gap-2 sm:gap-4">
        {/* Fixed badge on the right (Desktop & Tablet) */}
        <div className="hidden md:flex items-center gap-2 shrink-0 pe-3 border-e border-slate-800/80">
          <span className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-400 shadow-xs">
            <Megaphone className="w-3.5 h-3.5 animate-pulse" />
          </span>
          {data.tag && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400/15 border border-amber-400/40 text-amber-300 shadow-xs">
              {data.tag}
            </span>
          )}
        </div>

        {/* Center Marquee Ticker (Smooth Continuous Moving Text) */}
        <Link
          href={link}
          className="relative flex-1 h-full flex items-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)] group"
          title={data.title}
        >
          <div className="dw-announcement-ticker" dir="ltr">
            {tickerItem}
            {tickerItem}
            {tickerItem}
            {tickerItem}
          </div>
        </Link>

        {/* Fixed CTA button on the left */}
        {data.cta_text && (
          <Link
            href={link}
            className="group/cta inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shrink-0 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.03] active:scale-95 transition-all"
          >
            <span>{data.cta_text}</span>
            <ArrowLeft className="w-3 h-3 ltr:-scale-x-100 transition-transform group-hover/cta:-translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
