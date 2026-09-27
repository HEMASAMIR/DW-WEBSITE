'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { Home, ListVideo, BookOpen, User, LayoutDashboard, LogOut, LogIn } from 'lucide-react';

/** Slim top bar for the standalone courses/books pages (replaces the site header & footer). */
export default function LearnTopBar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { openAuthModal, openProfileModal, openAdminDashboard } = useModal();

  const links = [
    { href: '/courses', label: 'المستويات', icon: ListVideo },
    { href: '/books', label: 'الكتب', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Brand → home */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0" title="الرئيسية">
          <span className="w-10 h-10 rounded-full overflow-hidden bg-white border border-teal-500/30 p-0.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- local static logo */}
            <img src="/assets/images/logo.png" alt="Deutsche Welt" className="w-full h-full object-contain" />
          </span>
          <span className="hidden sm:block font-black text-lg text-slate-900 tracking-tight">Deutsche Welt</span>
        </Link>

        {/* Section switcher */}
        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-black transition-colors ${
                  active ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Account */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Link href="/" className="p-2 rounded-full text-slate-500 hover:text-teal-700 hover:bg-slate-100 hidden md:inline-flex" title="الرئيسية">
            <Home className="w-4 h-4" />
          </Link>
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <button onClick={openAdminDashboard} className="p-2 rounded-full text-slate-500 hover:text-teal-700 hover:bg-slate-100" title="لوحة التحكم">
                  <LayoutDashboard className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={openProfileModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-black text-slate-700 hover:border-teal-300"
                title="حسابي"
              >
                <User className="w-4 h-4 text-teal-600" />
                <span className="hidden sm:inline max-w-[90px] truncate">{user?.first_name || 'حسابي'}</span>
              </button>
              <button onClick={logout} className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50" title="خروج">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white text-xs font-black"
            >
              <LogIn className="w-4 h-4" />
              دخول
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
