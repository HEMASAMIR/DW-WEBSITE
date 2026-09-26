'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  BookOpen, 
  Briefcase,
  Percent
} from 'lucide-react';
import { adminService } from '@/services/admin.service';

const DEFAULT_ITEMS = [
  {
    id: 1,
    tag: '🔥 عرض خاص',
    icon: Flame,
    title: 'خصم خاص 25% على باقة المستويات المجمعة',
    desc: 'التسجيل متاح الآن للدفعة الجديدة مع محاضرات تفاعلية 24/7 وبنك أسئلة ومتابعة شخصية مستمرة.',
    cta: 'احجز مقعدك بالخصم',
    link: '/#online-courses',
    badgeColor: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-400/50',
    highlightColor: 'text-amber-300',
    hasDiscount: true,
    discountPercent: '25%',
  },
  {
    id: 2,
    tag: '📚 كتب المنهج المعتمدة',
    icon: BookOpen,
    title: 'كتاب دويتشه فيلت الشامل (مطبوع + PDF + صوتيات QR)',
    desc: 'المناهج الأصلية الأكثر طلباً مع شروحات وتدريبات وحلول وتوصيل سريع لجميع المحافظات.',
    cta: 'اطلب كتابك الآن',
    link: '/#books-store',
    badgeColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-400/50',
    highlightColor: 'text-emerald-300',
    hasDiscount: false,
    discountPercent: '',
  },
  {
    id: 3,
    tag: '💼 سوق العمل الألماني',
    icon: Briefcase,
    title: 'تأهيل احترافي لكبرى شركات الـ Call Center الألمانية',
    desc: 'رواتب مجزية تبدأ من 25,000 ج شهرياً مع تدريب عملي مكثف على طلاقة التحدث والمقابلات.',
    cta: 'تواصل للاستفسار',
    link: '/#contact',
    badgeColor: 'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-400/50',
    highlightColor: 'text-cyan-300',
    hasDiscount: false,
    discountPercent: '',
  },
];

export default function AnnouncementBar() {
  const [items, setItems] = useState(DEFAULT_ITEMS);
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
          tag: config.tag || '🔥 عرض خاص',
          icon: config.has_discount ? Flame : Sparkles,
          title: config.title || 'خصم خاص على باقة المستويات الألمانية',
          desc: config.desc || 'التسجيل متاح الآن للدفعة الجديدة مع محاضرات تفاعلية وبنك أسئلة ومتابعة شخصية.',
          cta: config.cta_text || 'احجز مقعدك بالخصم',
          link: config.cta_link || '/#online-courses',
          badgeColor: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-400/50',
          highlightColor: 'text-amber-300',
          hasDiscount: !!config.has_discount,
          discountPercent: config.discount_percent || '',
        };

        // Put custom announcement first
        setItems([
          customAdminItem,
          DEFAULT_ITEMS[1], // Books
          DEFAULT_ITEMS[2], // Call Center
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
          tag: config.tag || '🔥 عرض خاص',
          icon: config.has_discount ? Flame : Sparkles,
          title: config.title || 'خصم خاص على باقة المستويات الألمانية',
          desc: config.desc || 'التسجيل متاح الآن للدفعة الجديدة مع محاضرات تفاعلية وبنك أسئلة ومتابعة شخصية.',
          cta: config.cta_text || 'احجز مقعدك بالخصم',
          link: config.cta_link || '/#online-courses',
          badgeColor: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-400/50',
          highlightColor: 'text-amber-300',
          hasDiscount: !!config.has_discount,
          discountPercent: config.discount_percent || '',
        };
        setItems([customItem, DEFAULT_ITEMS[1], DEFAULT_ITEMS[2]]);
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
      aria-label="شريط الإعلانات الترويجي"
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
            <span className="tracking-wide">إعلان مميز</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
          </div>

          {/* Navigation Arrows for fast browsing if multiple items */}
          {items.length > 1 && (
            <div className="flex items-center gap-0.5 bg-slate-800/80 rounded-full p-0.5 border border-slate-700">
              <button 
                onClick={handleNext}
                className="p-1 rounded-full hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="الإعلان التالي"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={handlePrev}
                className="p-1 rounded-full hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="الإعلان السابق"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Center: Animated Announcement Message with Ultra-Clear Typography */}
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

            {/* Optional Discount Tag if Admin enabled discount */}
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

        {/* Left Side: Glowing High-Contrast VIP Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={current.link}
            className="group relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_15px_rgba(245,158,11,0.35)] hover:shadow-[0_0_25px_rgba(245,158,11,0.65)] hover:scale-105 active:scale-95 transition-all"
          >
            <span>{current.cta}</span>
            <ArrowLeft className="w-3.5 h-3.5 text-slate-950 group-hover:-translate-x-1 transition-transform" />
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
                  ? 'w-6 bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]' 
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
