'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { Home, ListVideo, BookOpen, User, LayoutDashboard, LogOut, LogIn } from 'lucide-react';

import { t } from '@/lib/i18n';
import LangSwitcher from '@/components/common/LangSwitcher';
/** Slim top bar for the standalone courses/books pages (replaces the site header & footer). */
export default function LearnTopBar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { openAuthModal, openProfileModal, openAdminDashboard, askLogout } = useModal();

  const links = [
    { href: '/courses', label: t('المستويات'), icon: ListVideo },
    { href: '/books', label: t('الكتب'), icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Brand → home */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0" title={t('الرئيسية')}>
          <Image src="/assets/images/logo-mark.png" alt="Deutsche Welt" width={682} height={425} sizes="200px" className="h-9 w-auto" />
          <span className="hidden sm:block font-serif font-bold text-xl text-[#0e2c4e] tracking-tight" dir="ltr">deutsche welt</span>
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
          <LangSwitcher />
          <Link href="/" className="p-2 rounded-full text-slate-500 hover:text-teal-700 hover:bg-slate-100 hidden md:inline-flex" title={t('الرئيسية')}>
            <Home className="w-4 h-4" />
          </Link>
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <button onClick={openAdminDashboard} className="p-2 rounded-full text-slate-500 hover:text-teal-700 hover:bg-slate-100" title={t('لوحة التحكم')}>
                  <LayoutDashboard className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={openProfileModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-black text-slate-700 hover:border-teal-300"
                title={t('حسابي')}
              >
                <User className="w-4 h-4 text-teal-600" />
                <span className="hidden sm:inline max-w-[90px] truncate">{user?.first_name || t('حسابي')}</span>
              </button>
              <button onClick={askLogout} className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50" title={t('خروج')}>
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white text-xs font-black"
            >
              <LogIn className="w-4 h-4" />
              {t('دخول')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
