'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { Home, BookOpen, Sparkles, MessageCircle, User } from 'lucide-react';

// One accent colour per tab (full class names so Tailwind generates them).
const TABS = [
  { key: 'home', label: 'الرئيسية', href: '/', icon: Home, text: 'text-teal-600', pill: 'bg-teal-100', dot: 'bg-teal-500' },
  { key: 'books', label: 'الكتب', href: '/books', icon: BookOpen, text: 'text-amber-600', pill: 'bg-amber-100', dot: 'bg-amber-500' },
  { key: 'courses', label: 'الكورسات', href: '/courses', icon: Sparkles, center: true },
  { key: 'contact', label: 'تواصل', href: '/#contact', icon: MessageCircle, text: 'text-sky-600', pill: 'bg-sky-100', dot: 'bg-sky-500' },
  { key: 'account', label: 'حسابي', icon: User, text: 'text-violet-600', pill: 'bg-violet-100', dot: 'bg-violet-500' },
];

// Pages that need the full screen height (the book reader) don't get the bar.
const HIDDEN_ON = [/^\/books\/[^/]+\/read/];

/** Mobile / tablet bottom navigation (hidden from lg and up). */
export default function BottomNav() {
  const pathname = usePathname() || '/';
  const { user, isAuthenticated } = useAuth();
  const { openAuthModal, openProfileModal, activeModal } = useModal();
  const [contactInView, setContactInView] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [bump, setBump] = useState(null); // key of the tab that was just tapped (replays the wiggle)
  const lastY = useRef(0);

  // Hide while scrolling down, show again when scrolling up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY.current) < 8) return;
      setHidden(y > lastY.current && y > 160);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // On the home page, "تواصل" lights up while the contact section is on screen
  useEffect(() => {
    if (pathname !== '/') return undefined;
    const el = document.getElementById('contact');
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setContactInView(e.isIntersecting), { rootMargin: '-35% 0px -35% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  if (HIDDEN_ON.some((re) => re.test(pathname))) return null;

  const activeKey =
    activeModal === 'profile' || activeModal === 'auth' ? 'account'
      : pathname.startsWith('/courses') ? 'courses'
        : pathname.startsWith('/books') ? 'books'
          : pathname === '/' ? (contactInView ? 'contact' : 'home')
            : null;
  const activeIndex = TABS.findIndex((t) => t.key === activeKey);
  const initial = (user?.first_name || user?.email || '').trim().charAt(0).toUpperCase();

  const tap = (tab) => {
    setBump(tab.key);
    setTimeout(() => setBump(null), 650);
    if (tab.key === 'account') {
      if (isAuthenticated) openProfileModal();
      else openAuthModal('login');
    }
  };

  return (
    <>
      {/* spacer so page content never hides behind the bar */}
      <div className="h-24 lg:hidden" aria-hidden />

      <nav
        aria-label="التنقل السفلي"
        className={`lg:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          hidden && !activeModal ? 'translate-y-[130%]' : 'translate-y-0'
        }`}
      >
        <div className="relative max-w-md mx-auto pointer-events-auto">
          {/* Glass bar */}
          <div className="relative grid grid-cols-5 items-end h-[70px] rounded-[1.75rem] bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_12px_40px_-12px_rgba(14,44,78,0.35)]">
            {/* German-flag hairline */}
            <div className="absolute top-0 inset-x-10 flex h-[3px] rounded-b-full overflow-hidden" dir="ltr">
              <span className="flex-1 bg-slate-900" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
            </div>

            {/* Sliding indicator (bouncy) — skips the raised centre button */}
            {activeIndex >= 0 && !TABS[activeIndex].center && (
              <span
                className="absolute bottom-1.5 h-1 w-8 rounded-full transition-all duration-500 ease-[cubic-bezier(.68,-0.6,.32,1.6)]"
                style={{ right: `calc(${activeIndex * 20}% + 10% - 1rem)` }}
              >
                <span className={`block w-full h-full rounded-full ${TABS[activeIndex].dot}`} />
              </span>
            )}

            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = tab.key === activeKey;
              const content = tab.center ? (
                <CenterButton active={active} bump={bump === tab.key} />
              ) : (
                <span className="relative flex flex-col items-center justify-center gap-1 h-full pb-2.5 pt-2">
                  <span className="relative flex items-center justify-center w-12 h-8">
                    <span
                      className={`absolute inset-0 rounded-full ${tab.pill} transition-transform duration-300 ease-out ${active ? 'scale-100' : 'scale-0'}`}
                    />
                    {tab.key === 'account' && isAuthenticated && initial ? (
                      <span
                        className={`relative w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-[#0e2c4e] text-white text-[11px] font-black flex items-center justify-center transition-transform duration-300 ${active ? '-translate-y-0.5 scale-110' : ''} ${bump === tab.key ? 'dw-nav-pop' : ''}`}
                      >
                        {initial}
                      </span>
                    ) : (
                      <Icon
                        className={`relative w-[22px] h-[22px] transition-all duration-300 ${active ? `${tab.text} -translate-y-0.5` : 'text-slate-400'} ${bump === tab.key ? 'dw-nav-pop' : ''}`}
                        strokeWidth={active ? 2.4 : 2}
                      />
                    )}
                  </span>
                  <span className={`text-[10.5px] font-black leading-none transition-colors duration-300 ${active ? tab.text : 'text-slate-500'}`}>
                    {tab.label}
                  </span>
                </span>
              );

              const cls = 'relative h-full flex items-end justify-center active:scale-90 transition-transform duration-150 select-none';
              return tab.href ? (
                <Link key={tab.key} href={tab.href} onClick={() => tap(tab)} className={cls} aria-current={active ? 'page' : undefined}>
                  {content}
                </Link>
              ) : (
                <button key={tab.key} type="button" onClick={() => tap(tab)} className={cls} aria-label={tab.label}>
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

/** Raised circular "courses" button in the middle of the bar. */
function CenterButton({ active, bump }) {
  return (
    <span className="relative flex flex-col items-center gap-1 pb-2.5 -mt-7">
      <span className="relative">
        {active && <span className="absolute inset-0 rounded-full bg-amber-400/50 animate-ping" />}
        <span
          className={`relative w-[60px] h-[60px] rounded-full flex items-center justify-center border-4 border-white shadow-xl transition-all duration-500 ${
            active
              ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-[#0e2c4e] shadow-amber-500/40 -translate-y-1 rotate-[360deg]'
              : 'bg-gradient-to-br from-[#0e2c4e] to-teal-700 text-amber-300 shadow-[#0e2c4e]/40'
          } ${bump ? 'dw-nav-pop' : ''}`}
        >
          <Sparkles className="w-6 h-6" />
        </span>
      </span>
      <span className={`text-[10.5px] font-black leading-none ${active ? 'text-amber-600' : 'text-[#0e2c4e]'}`}>الكورسات</span>
    </span>
  );
}
