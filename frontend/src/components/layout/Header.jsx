'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useModal } from '@/context/ModalContext';
import {
  BookOpen,
  Sun,
  Moon,
  User,
  Menu,
  X,
  Home,
  Sparkles,
  MapPin,
  UserRound,
  Star,
  MessageCircle,
  PlayCircle,
  LogOut,
  LogIn,
  LayoutDashboard,
} from 'lucide-react';

// Each link has its own accent colour (full class names so Tailwind generates them).
const NAV_LINKS = [
  { label: 'الرئيسية', href: '/#hero', section: 'hero', icon: Home, bar: 'bg-teal-500', text: 'text-teal-600', tile: 'bg-teal-50 text-teal-600' },
  { label: 'الكورسات', href: '/courses', icon: Sparkles, highlighted: true, tile: 'bg-amber-50 text-amber-600' },
  { label: 'الكتب', href: '/books', icon: BookOpen, bar: 'bg-amber-500', text: 'text-amber-600', tile: 'bg-amber-50 text-amber-600' },
  { label: 'آراء الطلاب', href: '/#reviews', section: 'reviews', icon: Star, bar: 'bg-emerald-500', text: 'text-emerald-600', tile: 'bg-emerald-50 text-emerald-600' },
  { label: 'عن الأستاذ خالد', href: '/#about-teacher', section: 'about-teacher', icon: UserRound, bar: 'bg-violet-500', text: 'text-violet-600', tile: 'bg-violet-50 text-violet-600' },
  { label: 'الفروع', href: '/#branches', section: 'branches', icon: MapPin, bar: 'bg-rose-500', text: 'text-rose-600', tile: 'bg-rose-50 text-rose-600' },
  { label: 'تواصل معنا', href: '/#contact', section: 'contact', icon: MessageCircle, bar: 'bg-sky-500', text: 'text-sky-600', tile: 'bg-sky-50 text-sky-600' },
];

const noopSubscribe = () => () => {};

export default function Header() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { openAuthModal, openProfileModal, openAdminDashboard, askLogout } = useModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  // true only in the browser (auth state lives in localStorage) — avoids a hydration mismatch
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  // Shrink + shadow once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: highlight the section currently in view
  useEffect(() => {
    const ids = NAV_LINKS.filter((l) => l.section).map((l) => l.section);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [mounted]);

  const initial = (user?.first_name || user?.email || '؟').trim().charAt(0).toUpperCase();

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/85 backdrop-blur-xl shadow-lg shadow-slate-900/[0.06]' : 'bg-white'
      } border-b border-slate-200/70`}
    >
      {/* German-flag brand stripe */}
      <div className="flex h-1" dir="ltr">
        <span className="flex-1 bg-slate-900" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
      </div>

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>

        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- local static logo */}
          <img
            src="/assets/images/logo-mark.png"
            alt="Deutsche Welt"
            className={`w-auto transition-all duration-300 group-hover:scale-105 ${scrolled ? 'h-9' : 'h-11'}`}
          />
          <div className="hidden sm:flex flex-col whitespace-nowrap">
            <span className="font-serif font-bold text-xl lg:text-2xl text-[#0e2c4e] tracking-tight leading-tight" dir="ltr">
              deutsche welt
            </span>
            <span className="text-[11px] text-slate-500 font-bold tracking-wide flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              الأستاذ خالد • أكاديمية الألمانية
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {NAV_LINKS.map((link) => {
            if (link.highlighted) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="dw-shine group mx-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0e2c4e] text-white text-[13px] font-black shadow-lg shadow-[#0e2c4e]/25 hover:-translate-y-0.5 transition-all"
                >
                  <Sparkles className="dw-wiggle w-4 h-4 text-amber-300" />
                  <span>{link.label}</span>
                </Link>
              );
            }
            const active = mounted && link.section === activeSection;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => link.section && setActiveSection(link.section)}
                className={`group relative px-2.5 xl:px-3 py-2 text-[13px] font-bold whitespace-nowrap transition-colors ${
                  active ? `${link.text}` : 'text-slate-600 hover:text-[#0e2c4e]'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 right-2.5 left-2.5 xl:right-3 xl:left-3 h-[3px] rounded-full ${link.bar} origin-center transition-transform duration-300 ${
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {mounted && isAdmin && (
            <button
              onClick={openAdminDashboard}
              className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
              title="لوحة تحكم الإدارة"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-600 hover:text-[#0e2c4e] hover:rotate-45 flex items-center justify-center transition-all duration-300"
            title="تبديل الوضع"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
          </button>

          {!mounted ? (
            <span className="w-28 h-10 rounded-full bg-slate-100 animate-pulse" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-1.5">
              <Link
                href="/courses"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 h-10 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-black hover:bg-teal-600 hover:text-white transition-colors"
                title="محاضراتي"
              >
                <PlayCircle className="w-4 h-4" />
                <span>محاضراتي</span>
              </Link>
              <button
                onClick={openProfileModal}
                className="flex items-center gap-2 h-10 pl-3 pr-1 rounded-full bg-white border border-slate-200 hover:border-[#0e2c4e]/30 hover:shadow-md transition-all"
                title="حسابي"
              >
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-[#0e2c4e] text-white text-sm font-black flex items-center justify-center">
                  {initial}
                </span>
                <span className="text-xs font-black text-[#0e2c4e] max-w-[90px] truncate hidden sm:inline">{user?.first_name || 'حسابي'}</span>
              </button>
              <button
                onClick={askLogout}
                className="w-10 h-10 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                title="خروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="dw-shine inline-flex items-center gap-2 h-10 sm:h-11 px-4 sm:px-5 rounded-full bg-gradient-to-l from-[#0e2c4e] to-teal-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-[#0e2c4e]/25 hover:-translate-y-0.5 transition-all"
            >
              <User className="w-4 h-4" />
              <span>دخول<span className="hidden sm:inline"> / حساب جديد</span></span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-[#0e2c4e] flex items-center justify-center"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 pt-2 pb-5 space-y-2 border-t border-slate-100 bg-white">
          <div className="grid grid-cols-2 gap-2">
            {[...NAV_LINKS].sort((a, b) => Number(!!b.highlighted) - Number(!!a.highlighted)).map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-colors ${
                    link.highlighted ? 'col-span-2 bg-[#0e2c4e] border-[#0e2c4e] text-white' : 'bg-slate-50 border-slate-200/70 text-[#0e2c4e] hover:bg-white'
                  }`}
                >
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${link.highlighted ? 'bg-white/10 text-amber-300' : link.tile}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-black">{link.label}</span>
                </a>
              );
            })}
          </div>
          {mounted && !isAuthenticated && (
            <button
              onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-l from-[#0e2c4e] to-teal-700 text-white text-sm font-black"
            >
              <LogIn className="w-4 h-4" />
              دخول / حساب جديد
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
