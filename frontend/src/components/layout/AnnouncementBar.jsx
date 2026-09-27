'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Percent,
  Timer
} from 'lucide-react';
import { adminService } from '@/services/admin.service';

const DISCOUNT_ITEMS = [
  {
    id: 1,
    tag: '🔥 خصم خاص 25%',
    icon: Flame,
    title: 'عرض الدفعة الجديدة لفترة محدودة',
    desc: 'خصم فوري 25% على باقة المستويات الألمانية المجمعة والتسجيل المبكر متاح الآن!',
    cta: 'احجز مقعدك بالخصم',
    link: '/#online-courses',
    badgeColor: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-400/50',
    highlightColor: 'text-amber-300',
    hasDiscount: true,
    discountPercent: '25%',
  },
  {
    id: 2,
    tag: '⚡ تخفيض حصري',
    icon: Percent,
    title: 'وفّر حتى 1,000 ج.م عند الاشتراك المجمع',
    desc: 'احصل على أكبر نسبة خصم عند حجز أكثر من مستوى معاً مع تدريبات المحادثة والملفات مجاناً.',
    cta: 'استفد من الخصم الآن',
    link: '/#online-courses',
    badgeColor: 'from-rose-500/20 to-orange-500/20 text-rose-300 border-rose-400/50',
    highlightColor: 'text-rose-300',
    hasDiscount: true,
    discountPercent: '1,000 ج',
  },
  {
    id: 3,
    tag: '⏳ مقاعد الخصم محدودة',
    icon: Timer,
    title: 'متبقي 4 مقاعد فقط بسعر الخصم المخفض',
    desc: 'بادر بحجز مقعدك بالخصم قبل اكتمال العدد وبدء المحاضرات مع هير خالد.',
    cta: 'احجز بالخصم قبل النفاذ',
    link: '/#online-courses',
    badgeColor: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-400/50',
    highlightColor: 'text-amber-300',
    hasDiscount: true,
    discountPercent: '25%',
  },
];

export default function AnnouncementBar() {
  const [items, setItems] = useState(DISCOUNT_ITEMS);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Load Admin Announcement configuration from API and localStorage
  const loadAnnouncementConfig = async () => {
    try {
      let config = null;
      try {
        config = await adminService.getAnnouncement();
      } catch {
        const local = localStorage.getItem('dw_site_announcement');
        if (local) config = JSON.parse(local);
      }

      if (config) {
        if (config.is_active === false) {
          setIsVisible(false);
          return;
        }
        setIsVisible(true);

        const customAdminItem = {
          id: 'admin-custom',
          tag: config.tag || '🔥 خصم خاص 25%',
          icon: Flame,
          title: config.title || 'عرض الخصم والتسجيل المبكر',
          desc: config.desc || 'خصم فوري 25% على باقة المستويات الألمانية المجمعة والتسجيل متاح الآن.',
          cta: config.cta_text || 'احجز مقعدك بالخصم',
          link: config.cta_link || '/#online-courses',
          badgeColor: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-400/50',
          highlightColor: 'text-amber-300',
          hasDiscount: config.has_discount !== false,
          discountPercent: config.discount_percent || '25%',
        };

        // All items are strictly discount-focused
        setItems([
          customAdminItem,
          DISCOUNT_ITEMS[1],
          DISCOUNT_ITEMS[2],
        ]);
      }
    } catch {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    loadAnnouncementConfig();

    const handleUpdate = (e) => {
      const config = e.detail;
      if (config) {
        if (config.is_active === false) {
          setIsVisible(false);
          return;
        }
        setIsVisible(true);
        const customItem = {
          id: 'admin-custom',
          tag: config.tag || '🔥 خصم خاص 25%',
          icon: Flame,
          title: config.title || 'عرض الخصم والتسجيل المبكر',
          desc: config.desc || 'خصم فوري 25% على باقة المستويات الألمانية المجمعة والتسجيل متاح الآن.',
          cta: config.cta_text || 'احجز مقعدك بالخصم',
          link: config.cta_link || '/#online-courses',
          badgeColor: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-400/50',
          highlightColor: 'text-amber-300',
          hasDiscount: config.has_discount !== false,
          discountPercent: config.discount_percent || '25%',
        };
        setItems([customItem, DISCOUNT_ITEMS[1], DISCOUNT_ITEMS[2]]);
        setIndex(0);
      }
    };

    window.addEventListener('announcementUpdated', handleUpdate);
    return () => window.removeEventListener('announcementUpdated', handleUpdate);
  }, []);

  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, items.length]);

  if (!isVisible || items.length === 0) return null;

  const current = items[index] || items[0];
  const IconComponent = current.icon;

  const handlePrev = (e) => {
    e.preventDefault();
    setIndex((i) => (i === 0 ? items.length - 1 : i - 1));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setIndex((i) => (i + 1) % items.length);
  };

  return (
    <div 
      className="relative z-30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white shadow-lg border-b border-amber-500/25 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="شريط عروض الخصم"
    >
      {/* Radiant Top Luminous Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-90 animate-pulse" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Right Side: Lead Tag & Live Pulse Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            <span className="tracking-wide">عروض وخصومات</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
          </div>

          {/* Navigation Arrows for fast browsing */}
          {items.length > 1 && (
            <div className="flex items-center gap-0.5 bg-slate-800/80 rounded-full p-0.5 border border-slate-700">
              <button 
                onClick={handleNext}
                className="p-1 rounded-full hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="العرض التالي"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={handlePrev}
                className="p-1 rounded-full hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="العرض السابق"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Center: Animated Announcement Message strictly about DISCOUNTS */}
        <div className="w-full overflow-hidden text-center md:text-right flex items-center justify-center md:justify-start gap-2 sm:gap-3 min-h-[32px]">
          <div 
            key={current.id || index} 
            className="flex flex-wrap items-center justify-center md:justify-start gap-2 animate-fadeIn transition-all duration-300"
          >
            {/* Tag Badge */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold bg-gradient-to-r ${current.badgeColor} border shadow-sm`}>
              <IconComponent className="w-3.5 h-3.5" />
              <span>{current.tag}</span>
            </span>

            {/* Discount Percentage Pill */}
            {current.hasDiscount && current.discountPercent && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.3)] animate-pulse">
                <Percent className="w-3 h-3 text-rose-400" />
                <span>خصم {current.discountPercent}</span>
              </span>
            )}

            {/* Title & Description with Maximum Contrast */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-medium">
              <span className="text-white font-extrabold tracking-wide drop-shadow-sm">
                {current.title}:
              </span>
              <span className="text-slate-200 font-normal leading-relaxed">
                {current.desc}
              </span>
            </div>
          </div>
        </div>

        {/* Left Side: High-Contrast VIP Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={current.link}
            className="group relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-black text-xs sm:text-sm shadow-[0_0_15px_rgba(20,184,166,0.35)] hover:shadow-[0_0_25px_rgba(20,184,166,0.65)] hover:scale-105 active:scale-95 transition-all"
          >
            <span>{current.cta}</span>
            <ArrowLeft className="w-3.5 h-3.5 text-white group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* Progress Dots Bar */}
      {items.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 pb-0.5">
          {items.map((item, i) => (
            <button
              key={item.id || i}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index 
                  ? 'w-6 bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.8)]' 
                  : 'w-1.5 bg-slate-700 hover:bg-slate-500'
              }`}
              title={item.tag}
            />
          ))}
        </div>
      )}
    </div>
  );
}
