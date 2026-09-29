'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { adminService, getAdminMode } from '@/services/admin.service';
import { ToastProvider, ConfirmProvider, Avatar, Btn } from './ui';
import OverviewSection from './OverviewSection';
import SubscriptionsSection from './SubscriptionsSection';
import RequestsSection from './RequestsSection';
import UsersSection from './UsersSection';
import CoursesSection from './CoursesSection';
import BooksSection from './BooksSection';
import BranchesSection from './BranchesSection';
import AnnouncementSection from './AnnouncementSection';
import {
  LayoutDashboard, GraduationCap, BookMarked, Users, Layers, BookOpen, MapPin, Megaphone,
  Menu, X, LogOut, Home, RefreshCw, ShieldAlert, Loader2, ExternalLink, ChevronLeft,
} from 'lucide-react';

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
// On the live backend (no requests API) these tabs show who each level / book is unlocked for.
const LEGACY_LABELS = { 'requests-level': 'اشتراكات الكورسات', 'requests-book': 'اشتراكات الكتب' };
const labelFor = (key, legacy) => (legacy && LEGACY_LABELS[key]) || LABELS[key];

export default function AdminApp() {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
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

function Shell({ user }) {
  const { askLogout } = useModal();
  const [tab, setTabState] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [pending, setPending] = useState({ level: 0, book: 0 });
  const [reloadKey, setReloadKey] = useState(0);
  // 'legacy' = the live backend without the dashboard API: requests, branches and the banner aren't available.
  const [mode, setMode] = useState(null);
  const legacy = mode === 'legacy';
  useEffect(() => { getAdminMode().then(setMode); }, []);

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

  const name = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'الأدمن';
  const totalPending = pending.level + pending.book;

  const sectionProps = { onChanged: refreshCounts, goTo: setTab, legacy };
  let section;
  if (!mode) section = <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 text-teal-600 animate-spin" /></div>;
  else if (legacy && tab === 'requests-level') section = <SubscriptionsSection kind="level" {...sectionProps} />;
  else if (legacy && tab === 'requests-book') section = <SubscriptionsSection kind="book" {...sectionProps} />;
  else if (tab === 'requests-level') section = <RequestsSection kind="level" {...sectionProps} />;
  else if (tab === 'requests-book') section = <RequestsSection kind="book" {...sectionProps} />;
  else if (tab === 'users') section = <UsersSection {...sectionProps} />;
  else if (tab === 'courses') section = <CoursesSection {...sectionProps} />;
  else if (tab === 'books') section = <BooksSection {...sectionProps} />;
  else if (tab === 'branches') section = <BranchesSection {...sectionProps} />;
  else if (tab === 'announcement') section = <AnnouncementSection {...sectionProps} />;
  else section = <OverviewSection {...sectionProps} adminName={name} />;

  const sidebar = (
    <div className="h-full flex flex-col bg-white text-slate-800 relative overflow-hidden border-l border-slate-200/80 shadow-[0_0_40px_-12px_rgba(15,23,42,0.18)]">
      {/* soft light + texture */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_90%_30%_at_100%_0%,rgba(20,184,166,0.10),transparent_70%),radial-gradient(ellipse_80%_30%_at_0%_100%,rgba(245,158,11,0.08),transparent_70%)]" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)', backgroundSize: '18px 18px' }}
      />
      <div className="absolute top-0 inset-x-0 flex h-1" dir="ltr">
        <span className="flex-1 bg-slate-900" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
      </div>

      {/* brand */}
      <div className="relative px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-l from-[#0e2c4e] to-teal-800 text-white p-2.5 pl-3 shadow-lg shadow-[#0e2c4e]/20">
          <span className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- local static logo */}
            <img src="/assets/images/logo-mark.png" alt="Deutsche Welt" className="w-9 h-auto" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-black leading-tight tracking-tight text-right">deutsche welt</p>
            <p className="text-[11px] text-amber-300 font-black flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> لوحة تحكم الأكاديمية
            </p>
          </div>
          <button onClick={() => setMenuOpen(false)} className="lg:hidden w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center" aria-label="إغلاق القائمة">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* navigation */}
      <nav className="dw-no-scrollbar relative flex-1 overflow-y-auto px-4 pb-3 space-y-4">
        {NAV.map((g) => (
          <div key={g.group}>
            <p className="flex items-center gap-2 px-2 mb-1.5 text-[10px] font-black tracking-widest text-slate-400">
              {g.group}
              <span className="flex-1 h-px bg-gradient-to-l from-slate-200 to-transparent" />
            </p>
            <div className="space-y-1">
              {g.items.map((item) => {
                const Icon = item.icon;
                const t = NAV_TONES[item.tone] || NAV_TONES.teal;
                const active = tab === item.key;
                const count = item.badge ? pending[item.badge] : 0;
                return (
                  <button
                    key={item.key}
                    onClick={() => setTab(item.key)}
                    className={`group relative w-full flex items-center gap-3 pr-2 pl-3 h-11 rounded-2xl text-[13px] font-bold border transition-all duration-200 ${
                      active ? `${t.soft} shadow-sm` : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900 hover:-translate-x-0.5'
                    }`}
                  >
                    {active && <span className={`absolute right-0 top-2.5 bottom-2.5 w-1 rounded-l-full ${t.bar}`} />}
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      active ? `bg-gradient-to-br ${t.on} text-white shadow-lg` : `${t.idle} group-hover:scale-110`
                    }`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="flex-1 text-right truncate">{labelFor(item.key, legacy)}</span>
                    {count > 0 ? (
                      <span className="min-w-5 h-5 px-1.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center animate-pulse">
                        {count}
                      </span>
                    ) : active ? (
                      <ChevronLeft className="w-4 h-4 opacity-60" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* account */}
      <div className="relative p-4 pt-3">
        <div className="relative rounded-2xl p-[1px] bg-gradient-to-l from-teal-300 via-slate-200 to-amber-300">
          <div className="flex items-center gap-2.5 rounded-2xl bg-white p-2.5">
            <span className="relative">
              <Avatar name={name} size="sm" />
              <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-slate-900 truncate">{name}</p>
              <p className="text-[10px] font-bold text-teal-600">مدير المنصة</p>
            </div>
            <Link href="/" title="الرجوع للموقع" className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <button onClick={askLogout} title="تسجيل الخروج" className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-[#f3f6fa] text-slate-900 bg-[radial-gradient(ellipse_60%_40%_at_100%_0%,rgba(20,184,166,0.10),transparent_70%),radial-gradient(ellipse_50%_40%_at_0%_100%,rgba(245,158,11,0.08),transparent_70%)] bg-fixed">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 right-0 w-72 z-30">{sidebar}</aside>

      {/* Mobile sidebar */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm animate-fadeIn" onClick={(e) => e.target === e.currentTarget && setMenuOpen(false)}>
          <aside className="absolute inset-y-0 right-0 w-[82%] max-w-xs dw-sidebar-in">{sidebar}</aside>
        </div>
      )}

      <div className="lg:mr-72 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/70">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
            <button onClick={() => setMenuOpen(true)} className="lg:hidden w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center" aria-label="القائمة">
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-400">لوحة التحكم</p>
              <h1 className="text-sm sm:text-base font-black text-slate-900 truncate">{labelFor(tab, legacy)}</h1>
            </div>

            <div className="mr-auto flex items-center gap-2">
              {totalPending > 0 && tab !== 'requests-level' && tab !== 'requests-book' && (
                <button
                  onClick={() => setTab(pending.level ? 'requests-level' : 'requests-book')}
                  className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-black hover:bg-amber-200"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  {totalPending} طلب مستني موافقتك
                </button>
              )}
              <Btn variant="ghost" size="icon" title="تحديث" onClick={() => { setReloadKey((k) => k + 1); refreshCounts(); }}>
                <RefreshCw className="w-4 h-4" />
              </Btn>
              <Link href="/courses" target="_blank" className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50">
                <ExternalLink className="w-3.5 h-3.5" /> شوف الموقع كطالب
              </Link>
              <div className="flex items-center gap-2 pr-2 sm:border-r border-slate-200">
                <Avatar name={name} size="sm" />
                <div className="hidden sm:block leading-tight">
                  <p className="text-xs font-black text-slate-800 max-w-[9rem] truncate">{name}</p>
                  <p className="text-[10px] font-bold text-teal-600">مدير المنصة</p>
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
  return (
    <div dir="rtl" className="min-h-screen bg-[#0a2340] text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.3),transparent_60%)]" />
      <div className="relative text-center max-w-md space-y-5">
        <span className="mx-auto w-20 h-20 rounded-[1.75rem] bg-white/10 border border-white/15 flex items-center justify-center">
          <ShieldAlert className="w-10 h-10 text-amber-300" />
        </span>
        <h1 className="text-2xl font-black">{signedIn ? 'الصفحة دي للإدارة بس' : 'سجّل دخول بحساب الإدارة'}</h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          {signedIn ? 'حسابك مالوش صلاحية على لوحة التحكم.' : 'لوحة التحكم متاحة لحسابات الإدارة فقط.'}
        </p>
        <div className="flex justify-center gap-3">
          {!signedIn && <Btn variant="gold" onClick={() => openAuthModal('login')}>تسجيل الدخول</Btn>}
          <Link href="/" className="inline-flex items-center h-11 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-sm font-black">الصفحة الرئيسية</Link>
        </div>
      </div>
    </div>
  );
}
