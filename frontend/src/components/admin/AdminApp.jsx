'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { adminService, getAdminMode } from '@/services/admin.service';
import { ToastProvider, ConfirmProvider, Avatar, Btn, useToast } from './ui';
import { AdminPrefsProvider, useAdminPrefs, translate as t } from './prefs';
import OverviewSection from './OverviewSection';
import CombinedRequestsSection from './CombinedRequestsSection';
import UsersSection from './UsersSection';
import CoursesSection from './CoursesSection';
import BooksSection from './BooksSection';
import BranchesSection from './BranchesSection';
import AnnouncementSection from './AnnouncementSection';
import ContactPaySection from './ContactPaySection';
import CouponsSection from './CouponsSection';
import {
  LayoutDashboard, GraduationCap, BookMarked, Users, Layers, BookOpen, MapPin, Megaphone,
  Menu, X, LogOut, Home, RefreshCw, ShieldAlert, Loader2, ExternalLink, ChevronLeft, Sun, Moon, Languages, PhoneCall, Ticket,
} from 'lucide-react';

// Labels are translation keys; they're translated where they render.
const NAV = [
  { group: 'الرئيسية', items: [{ key: 'overview', label: 'لوحة القيادة', icon: LayoutDashboard, tone: 'teal' }] },
  {
    group: 'الطلبات',
    items: [
      { key: 'requests-level', label: 'طلبات الكورسات', icon: GraduationCap, badge: 'level', tone: 'emerald' },
      { key: 'requests-book', label: 'طلبات الكتب', icon: BookMarked, badge: 'book', tone: 'sky' },
    ],
  },
  {
    group: 'الإدارة',
    items: [
      { key: 'users', label: 'الطلاب والحسابات', icon: Users, tone: 'violet' },
      { key: 'courses', label: 'الكورسات والمحاضرات', icon: Layers, tone: 'amber' },
      { key: 'books', label: 'الكتب', icon: BookOpen, tone: 'rose' },
      { key: 'branches', label: 'الفروع', icon: MapPin, tone: 'cyan' },
      { key: 'contact', label: 'التواصل والدفع', icon: PhoneCall, tone: 'emerald' },
      { key: 'coupons', label: 'الكوبونات', icon: Ticket, tone: 'amber' },
      { key: 'announcement', label: 'إعلان الموقع', icon: Megaphone, tone: 'orange' },
    ],
  },
];
// Sidebar colour per section (full class names so Tailwind generates them).
const NAV_TONES = {
  teal: { idle: 'bg-teal-50 text-teal-600', on: 'from-teal-400 to-teal-600 shadow-teal-500/30', soft: 'bg-teal-50/80 border-teal-200 text-teal-900', bar: 'bg-teal-500' },
  emerald: { idle: 'bg-emerald-50 text-emerald-600', on: 'from-emerald-400 to-emerald-600 shadow-emerald-500/30', soft: 'bg-emerald-50/80 border-emerald-200 text-emerald-900', bar: 'bg-emerald-500' },
  sky: { idle: 'bg-sky-50 text-sky-600', on: 'from-sky-400 to-blue-600 shadow-sky-500/30', soft: 'bg-sky-50/80 border-sky-200 text-sky-900', bar: 'bg-sky-500' },
  violet: { idle: 'bg-violet-50 text-violet-600', on: 'from-violet-400 to-purple-600 shadow-violet-500/30', soft: 'bg-violet-50/80 border-violet-200 text-violet-900', bar: 'bg-violet-500' },
  amber: { idle: 'bg-amber-50 text-amber-600', on: 'from-amber-300 to-orange-500 shadow-amber-500/30', soft: 'bg-amber-50/80 border-amber-200 text-amber-900', bar: 'bg-amber-500' },
  rose: { idle: 'bg-rose-50 text-rose-600', on: 'from-rose-400 to-pink-600 shadow-rose-500/30', soft: 'bg-rose-50/80 border-rose-200 text-rose-900', bar: 'bg-rose-500' },
  cyan: { idle: 'bg-cyan-50 text-cyan-600', on: 'from-cyan-400 to-sky-600 shadow-cyan-500/30', soft: 'bg-cyan-50/80 border-cyan-200 text-cyan-900', bar: 'bg-cyan-500' },
  orange: { idle: 'bg-orange-50 text-orange-600', on: 'from-orange-400 to-red-500 shadow-orange-500/30', soft: 'bg-orange-50/80 border-orange-200 text-orange-900', bar: 'bg-orange-500' },
};

const ALL_KEYS = NAV.flatMap((g) => g.items.map((i) => i.key));
const LABELS = Object.fromEntries(NAV.flatMap((g) => g.items.map((i) => [i.key, i.label])));
const labelFor = (key) => t(LABELS[key]);

export default function AdminApp() {
  return (
    <AdminPrefsProvider>
      <AdminGate />
    </AdminPrefsProvider>
  );
}

function AdminGate() {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const { dir } = useAdminPrefs();

  if (loading) {
    return (
      <div dir={dir} className="min-h-screen bg-[#f3f6fa] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated || !isAdmin) return <NoAccess signedIn={isAuthenticated} />;

  return (
    <ToastProvider>
      <ConfirmProvider>
        <Shell user={user} />
      </ConfirmProvider>
    </ToastProvider>
  );
}

// Each language is named in itself, so it's findable whatever the current language is.
const LANG_OPTIONS = [
  { value: 'ar', label: 'ع', name: 'العربية' },
  { value: 'en', label: 'EN', name: 'English' },
  { value: 'de', label: 'DE', name: 'Deutsch' },
];

/** Light/dark + language switches for the top bar. */
function PrefsSwitches() {
  const { lang, setLang, theme, setTheme } = useAdminPrefs();
  const dark = theme === 'dark';
  return (
    <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200/70">
      <button
        type="button"
        onClick={() => setTheme(dark ? 'light' : 'dark')}
        title={dark ? t('الوضع الفاتح') : t('الوضع الداكن')}
        aria-label={dark ? t('الوضع الفاتح') : t('الوضع الداكن')}
        className="relative w-8 h-8 rounded-xl bg-white text-slate-700 hover:text-amber-500 shadow-sm flex items-center justify-center transition-colors overflow-hidden"
      >
        <Sun className={`absolute w-4 h-4 transition-all duration-500 ${dark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
        <Moon className={`absolute w-4 h-4 transition-all duration-500 ${dark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
      </button>
      <div role="radiogroup" aria-label={t('اللغة')} title={t('اللغة')} className="flex items-center gap-0.5">
        <Languages className="hidden sm:block w-4 h-4 mx-1 text-slate-400" />
        {LANG_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={lang === o.value}
            aria-label={o.name}
            onClick={() => setLang(o.value)}
            className={`h-8 min-w-8 px-2 rounded-xl text-xs font-black transition-colors ${
              lang === o.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Shell({ user }) {
  const { askLogout } = useModal();
  const { dir } = useAdminPrefs();
  const [tab, setTabState] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [pending, setPending] = useState({ level: 0, book: 0 });
  const [reloadKey, setReloadKey] = useState(0);
  // 'legacy' = the live backend without the dashboard API: requests, branches and the banner aren't available.
  const [mode, setMode] = useState(null);
  const legacy = mode === 'legacy';
  useEffect(() => { getAdminMode().then(setMode); }, []);

  // Levels are yearly: on open, lock the subscriptions whose year is over (src/lib/subscriptionsStore.js).
  const toast = useToast();
  useEffect(() => {
    if (mode !== 'legacy') return;
    adminService.syncSubscriptions()
      .then(({ expired }) => {
        if (!expired.length) return;
        const names = expired.slice(0, 3).map((r) => `${r.name || `#${r.user_id}`} (${r.level_code})`).join('، ');
        toast('ok', t('اتقفل {n} اشتراك خلصت سنته: {names}', { n: expired.length, names: expired.length > 3 ? `${names}…` : names }));
      })
      .catch(() => {});
  }, [mode, toast]);

  // Section lives in the URL hash so refresh / back keep the admin where they were.
  useEffect(() => {
    const read = () => {
      const key = window.location.hash.replace('#', '');
      setTabState(ALL_KEYS.includes(key) ? key : 'overview');
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  const setTab = useCallback((key) => {
    window.location.hash = key;
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const refreshCounts = useCallback(() => {
    adminService.getPendingCount().then((c) => setPending({ level: c.level || 0, book: c.book || 0 })).catch(() => {});
  }, []);

  useEffect(() => {
    refreshCounts();
    const id = setInterval(refreshCounts, 60000); // new requests show up without reloading
    return () => clearInterval(id);
  }, [refreshCounts]);

  const name = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || t('الأدمن');
  const totalPending = pending.level + pending.book;

  const sectionProps = { onChanged: refreshCounts, goTo: setTab, legacy };
  let section;
  if (!mode) section = <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 text-teal-600 animate-spin" /></div>;
  else if (tab === 'requests-level') section = <CombinedRequestsSection kind="level" {...sectionProps} />;
  else if (tab === 'requests-book') section = <CombinedRequestsSection kind="book" {...sectionProps} />;
  else if (tab === 'users') section = <UsersSection {...sectionProps} />;
  else if (tab === 'courses') section = <CoursesSection {...sectionProps} />;
  else if (tab === 'books') section = <BooksSection {...sectionProps} />;
  else if (tab === 'branches') section = <BranchesSection {...sectionProps} />;
  else if (tab === 'announcement') section = <AnnouncementSection {...sectionProps} />;
  else if (tab === 'contact') section = <ContactPaySection {...sectionProps} />;
  else if (tab === 'coupons') section = <CouponsSection {...sectionProps} />;
  else section = <OverviewSection {...sectionProps} adminName={name} />;

  const sidebar = (
    <div className="h-full flex flex-col bg-white text-slate-800 relative overflow-hidden border-e border-slate-200/80 shadow-[0_0_40px_-12px_rgba(15,23,42,0.18)]">
      {/* soft light + texture */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_90%_30%_at_100%_0%,rgba(20,184,166,0.10),transparent_70%),radial-gradient(ellipse_80%_30%_at_0%_100%,rgba(245,158,11,0.08),transparent_70%)]" />
      <div
        className="dw-admin-dots absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)', backgroundSize: '18px 18px' }}
      />
      <div className="absolute top-0 inset-x-0 flex h-1" dir="ltr">
        <span className="flex-1 bg-slate-900" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
      </div>

      {/* brand — the academy's full logo (mark + name) on the navy/teal card */}
      <div className="relative px-4 pt-6 pb-4 [@media(max-height:760px)]:pt-4 [@media(max-height:760px)]:pb-2">
        <div className="dw-keep-light group relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#07192e] via-[#0c2847] to-[#0e3b68] px-4 pt-5 pb-4 [@media(max-height:760px)]:pt-3 [@media(max-height:760px)]:pb-3 shadow-xl shadow-[#07192e]/25 border border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_100%_0%,rgba(20,184,166,0.45),transparent_60%),radial-gradient(ellipse_70%_70%_at_0%_100%,rgba(245,158,11,0.28),transparent_60%)]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '16px 16px' }}
          />
          <span className="absolute -inset-x-10 -top-10 h-24 bg-white/10 blur-2xl rotate-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative flex flex-col items-center">
            <Image
              src="/assets/images/logo-full-white.png"
              alt="Deutsche Welt"
              width={954}
              height={622}
              sizes="240px"
              priority
              className="h-[4.75rem] [@media(max-height:760px)]:h-12 w-auto drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-105"
            />
            <span className="mt-3 [@media(max-height:760px)]:mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur text-[11px] font-black text-amber-300">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </span>
              {t('لوحة تحكم الأكاديمية')}
            </span>
          </div>
          <div className="absolute bottom-0 inset-x-0 flex h-1" dir="ltr">
            <span className="flex-1 bg-slate-950" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
          </div>
          <button onClick={() => setMenuOpen(false)} className="lg:hidden absolute top-3 end-3 w-9 h-9 rounded-xl bg-white/15 text-white flex items-center justify-center" aria-label={t('إغلاق القائمة')}>
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* navigation — scrolls on short screens, fading out above the account card */}
      <div className="relative flex-1 min-h-0">
        <nav className="dw-no-scrollbar h-full overflow-y-auto px-4 pt-1 pb-6 space-y-6 [@media(max-height:760px)]:space-y-5">
          {NAV.map((g) => (
            <div key={g.group}>
              <p className="flex items-center gap-2 px-2 mb-2.5 text-[10px] font-black tracking-widest text-slate-400">
                {t(g.group)}
                <span className="flex-1 h-px bg-gradient-to-l from-slate-200 to-transparent" />
              </p>
              <div className="space-y-2">
                {g.items.map((item) => {
                  const Icon = item.icon;
                  const tone = NAV_TONES[item.tone] || NAV_TONES.teal;
                  const active = tab === item.key;
                  const count = item.badge ? pending[item.badge] : 0;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setTab(item.key)}
                      className={`group relative w-full flex items-center gap-3 ps-3 pe-3 h-12 [@media(max-height:760px)]:h-11 rounded-2xl text-[13px] font-bold border transition-all duration-200 ${
                        active ? `${tone.soft} shadow-sm` : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {active && <span className={`absolute start-1 top-3 bottom-3 w-[3px] rounded-full ${tone.bar}`} />}
                      <span className={`w-8 h-8 [@media(max-height:760px)]:w-7 [@media(max-height:760px)]:h-7 rounded-xl flex items-center justify-center transition-all ${
                        active ? `bg-gradient-to-br ${tone.on} text-white shadow-lg` : `${tone.idle} group-hover:scale-110`
                      }`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="flex-1 text-start truncate">{labelFor(item.key)}</span>
                      {count > 0 ? (
                        <span className="min-w-5 h-5 px-1.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center animate-pulse">
                          {count}
                        </span>
                      ) : active ? (
                        <ChevronLeft className="w-4 h-4 opacity-60 ltr:-scale-x-100" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* account */}
      <div className="relative px-4 pb-4 pt-3 [@media(max-height:760px)]:pb-3 border-t border-slate-100">
        <div className="relative rounded-2xl p-[1px] bg-gradient-to-l from-teal-300 via-slate-200 to-amber-300">
          <div className="flex items-center gap-3 rounded-[15px] bg-white px-3 py-3 [@media(max-height:760px)]:py-2">
            <span className="relative shrink-0">
              <Avatar name={name} size="sm" />
              <span className="absolute -top-1 -end-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" title="online" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-slate-900 truncate">{name}</p>
              <p className="text-[10px] font-bold text-teal-600">{t('مدير المنصة')}</p>
            </div>
            <Link href="/" title={t('الرجوع للموقع')} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <button onClick={askLogout} title={t('تسجيل الخروج')} className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div dir={dir} className="min-h-screen bg-[#f3f6fa] text-slate-900 bg-[radial-gradient(ellipse_60%_40%_at_100%_0%,rgba(20,184,166,0.10),transparent_70%),radial-gradient(ellipse_50%_40%_at_0%_100%,rgba(245,158,11,0.08),transparent_70%)] bg-fixed">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 start-0 w-72 z-30">{sidebar}</aside>

      {/* Mobile sidebar */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm animate-fadeIn" onClick={(e) => e.target === e.currentTarget && setMenuOpen(false)}>
          <aside className="absolute inset-y-0 start-0 w-[82%] max-w-xs dw-sidebar-in">{sidebar}</aside>
        </div>
      )}

      <div className="lg:ms-72 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/70">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
            <button onClick={() => setMenuOpen(true)} className="lg:hidden w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center" aria-label={t('القائمة')}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-400">{t('لوحة التحكم')}</p>
              <h1 className="text-sm sm:text-base font-black text-slate-900 truncate">{labelFor(tab)}</h1>
            </div>

            <div className="ms-auto flex items-center gap-2">
              {totalPending > 0 && tab !== 'requests-level' && tab !== 'requests-book' && (
                <button
                  onClick={() => setTab(pending.level ? 'requests-level' : 'requests-book')}
                  className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-black hover:bg-amber-200"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  {t('{n} طلب مستني موافقتك', { n: totalPending })}
                </button>
              )}
              <PrefsSwitches />
              <Btn variant="ghost" size="icon" title={t('تحديث')} onClick={() => { setReloadKey((k) => k + 1); refreshCounts(); }}>
                <RefreshCw className="w-4 h-4" />
              </Btn>
              <Link href="/courses" target="_blank" className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50">
                <ExternalLink className="w-3.5 h-3.5" /> {t('شوف الموقع كطالب')}
              </Link>
              <div className="flex items-center gap-2 ps-2 sm:border-s border-slate-200">
                <Avatar name={name} size="sm" />
                <div className="hidden sm:block leading-tight">
                  <p className="text-xs font-black text-slate-800 max-w-[9rem] truncate">{name}</p>
                  <p className="text-[10px] font-bold text-teal-600">{t('مدير المنصة')}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div key={`${tab}-${reloadKey}`} className="animate-fadeIn">{section}</div>
        </main>
      </div>
    </div>
  );
}

function NoAccess({ signedIn }) {
  const { openAuthModal } = useModal();
  const { dir } = useAdminPrefs();
  return (
    <div dir={dir} className="min-h-screen bg-[#0a2340] text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.3),transparent_60%)]" />
      <div className="relative text-center max-w-md space-y-5">
        <span className="mx-auto w-20 h-20 rounded-[1.75rem] bg-white/10 border border-white/15 flex items-center justify-center">
          <ShieldAlert className="w-10 h-10 text-amber-300" />
        </span>
        <h1 className="text-2xl font-black">{signedIn ? t('الصفحة دي للإدارة بس') : t('سجّل دخول بحساب الإدارة')}</h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          {signedIn ? t('حسابك مالوش صلاحية على لوحة التحكم.') : t('لوحة التحكم متاحة لحسابات الإدارة فقط.')}
        </p>
        <div className="flex justify-center gap-3">
          {!signedIn && <Btn variant="gold" onClick={() => openAuthModal('login')}>{t('تسجيل الدخول')}</Btn>}
          <Link href="/" className="inline-flex items-center h-11 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-sm font-black">{t('الصفحة الرئيسية')}</Link>
        </div>
      </div>
    </div>
  );
}
