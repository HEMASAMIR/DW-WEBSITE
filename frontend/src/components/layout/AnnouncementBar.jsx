'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Megaphone, Sparkles, Flame } from 'lucide-react';
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
    <div className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 shrink-0 whitespace-nowrap select-none" dir="rtl">
      {/* Glowing live pill badge */}
      {data.tag && (
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-400/20 via-teal-400/15 to-amber-400/20 border border-amber-400/50 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)] shrink-0">
          <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '5s' }} />
          <span>{data.tag}</span>
        </span>
      )}

      {/* Discount badge if present */}
      {showDiscount && (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-[0_0_12px_rgba(225,29,72,0.4)] shrink-0 animate-pulse">
          <Flame className="w-3 h-3 text-yellow-200" />
          <span>{data.discount_percent}</span>
        </span>
      )}

      {/* Title */}
      <span className="text-[13px] sm:text-sm font-black text-white tracking-wide drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
        {data.title}
      </span>

      {/* Luminous Separator */}
      {data.desc && <span className="text-amber-300 text-xs font-bold drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">✦</span>}

      {/* Description */}
      {data.desc && (
        <span className="text-xs sm:text-[13px] font-medium text-teal-100/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
          {data.desc}
        </span>
      )}

      {/* End Loop Gem Separator */}
      <span className="text-amber-400/50 text-xs mx-2">✦ ✦</span>
    </div>
  );

  return (
    <div
      className="dw-announcement-wrapper relative z-30 text-white overflow-hidden shadow-lg border-b border-teal-500/20 bg-gradient-to-r from-[#061426] via-[#0b2848] to-[#061426]"
      role="region"
      aria-label={t('إعلان')}
    >
      {/* Top luminous animated German-flag ambient light line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_8px_rgba(251,191,36,0.8)]" />

      {/* Ambient background soft glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(13,148,136,0.18),transparent_70%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-2 sm:px-6 h-11 sm:h-12 flex items-center justify-between gap-2 sm:gap-4">
        {/* Fixed badge on the right (Desktop & Tablet) */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0 pe-3 border-e border-teal-500/25">
          <span className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400/20 to-teal-400/20 border border-amber-400/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
            <Megaphone className="w-3.5 h-3.5 animate-pulse" />
          </span>
          {data.tag && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-400/20 to-teal-400/20 border border-amber-300/40 text-amber-200 shadow-xs">
              {data.tag}
            </span>
          )}
        </div>

        {/* Center Marquee Ticker (Smooth Continuous Moving Text) */}
        <Link
          href={link}
          className="relative flex-1 h-full flex items-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_28px,black_calc(100%-28px),transparent)] group cursor-pointer"
          title={data.title}
        >
          <div className="dw-announcement-ticker" dir="ltr">
            {tickerItem}
            {tickerItem}
            {tickerItem}
            {tickerItem}
          </div>
        </Link>

        {/* Fixed CTA button on the left (Ultra Luxury Gold & Ember) */}
        {data.cta_text && (
          <Link
            href={link}
            className="group/cta relative inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_28px_rgba(245,158,11,0.65)] hover:scale-105 active:scale-95 transition-all overflow-hidden"
          >
            {/* Shimmer sweep animation */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 ease-out" />
            <span className="relative z-10">{data.cta_text}</span>
            <ArrowLeft className="relative z-10 w-3.5 h-3.5 ltr:-scale-x-100 transition-transform group-hover/cta:-translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
