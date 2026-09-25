'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useModal } from '@/context/ModalContext';
import { 
  BookOpen, 
  Sun, 
  Moon, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  GraduationCap, 
  Award,
  PlayCircle
} from 'lucide-react';

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { openAuthModal, openQuizModal, openStudentDashboard, openAdminDashboard } = useModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'الرئيسية', href: '#hero' },
    { label: 'الكورسات الأونلاين', href: '#online-courses' },
    { label: 'متجر الكتب', href: '#books-store' },
    { label: 'الفروع', href: '#branches' },
    { label: 'عن الأستاذ خالد', href: '#about-teacher' },
    { label: 'آراء الطلاب', href: '#reviews' },
    { label: 'تواصل معنا', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80 dark:bg-slate-950/85 border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-red-600 to-slate-900 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl text-slate-100 leading-tight group-hover:text-amber-400 transition-colors">
              Deutsche Welt
            </span>
            <span className="text-xs text-amber-400 font-semibold tracking-wide">
              الأستاذ خالد • ألماني
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Level Quiz Button */}
          <button
            onClick={openQuizModal}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 px-3 py-2 rounded-xl transition-all shadow-sm transform hover:-translate-y-0.5"
          >
            <Award className="w-4 h-4" />
            <span>اختبار تحديد المستوى</span>
          </button>

          {/* Student Dashboard Portal Button */}
          {isAuthenticated ? (
            <button
              onClick={() => openStudentDashboard(1)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-2 rounded-xl transition-all"
            >
              <PlayCircle className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">منصة دروسي</span>
            </button>
          ) : null}

          {/* Admin Quick Button */}
          {isAdmin && (
            <button
              onClick={openAdminDashboard}
              className="p-2 rounded-xl bg-purple-900/30 border border-purple-500/30 text-purple-300 hover:bg-purple-900/50 transition-all"
              title="لوحة تحكم الإدارة"
            >
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700 transition-all border border-slate-700"
            title="تبديل الوضع"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* User Auth Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openStudentDashboard(1)}
                className="flex items-center gap-2 text-xs text-slate-200 bg-slate-800 px-3 py-2 rounded-xl border border-slate-700"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span className="font-semibold max-w-[100px] truncate">{user?.first_name || user?.username || 'حسابي'}</span>
              </button>
              <button
                onClick={logout}
                className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
              >
                خروج
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl transition-all shadow-md shadow-red-950/50"
            >
              <User className="w-4 h-4" />
              <span>دخول / حساب جديد</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-300 hover:text-amber-400 py-2 border-b border-slate-800/60"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); openQuizModal(); }}
              className="w-full text-center text-xs font-bold text-slate-900 bg-amber-400 py-2.5 rounded-xl"
            >
              اختبار تحديد المستوى المجاني
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
