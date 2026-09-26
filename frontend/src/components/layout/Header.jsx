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
  PlayCircle,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { openAuthModal, openQuizModal, openStudentDashboard, openProfileModal, openAdminDashboard } = useModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('/#hero');
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { label: 'الرئيسية', href: '/#hero' },
    { label: 'الكورسات المميزة', href: '/courses', highlighted: true },
    { label: 'متجر الكتب', href: '/books' },
    { label: 'الفروع', href: '/#branches' },
    { label: 'عن الأستاذ خالد', href: '/#about-teacher' },
    { label: 'آراء الطلاب', href: '/#reviews' },
    { label: 'تواصل معنا', href: '/#contact' },
  ];

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 h-20" />
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo with Real Academy Logo Image & Fayrouza Shining Text */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-teal-500/30 shadow-md shadow-teal-500/10 group-hover:scale-105 transition-transform flex items-center justify-center p-1">
            <img src="/assets/images/logo.png" alt="Deutsche Welt Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="fayrouza-logo-text font-extrabold text-xl sm:text-2xl tracking-tight leading-tight">
              Deutsche Welt
            </span>
            <span className="text-[11px] text-teal-700 font-bold tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shadow-sm shadow-teal-400"></span>
              الأستاذ خالد • أكاديمية الألمانية
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Capsule Pills (Fayrouza Store Design) */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-full border border-slate-200 shadow-inner">
          {navLinks.map((link) => {
            const isActive = activeNav === link.href;
            if (link.highlighted) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setActiveNav(link.href)}
                  className="glass-pill-gold px-4 py-2 text-xs rounded-full flex items-center gap-1.5 transition-all transform hover:scale-105"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>{link.label}</span>
                </a>
              );
            }
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActiveNav(link.href)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
                  isActive 
                    ? 'bg-teal-600 text-white shadow-sm' 
                    : 'text-slate-700 hover:text-teal-700 hover:bg-slate-200/60'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          
          {/* Level Quiz Button */}
          <button
            onClick={openQuizModal}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 px-4 py-2.5 rounded-full shadow-md shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 border border-amber-300"
          >
            <Award className="w-4 h-4" />
            <span>اختبار المستوى</span>
          </button>

          {/* Admin Dashboard */}
          {isAdmin && (
            <button
              onClick={openAdminDashboard}
              className="p-2.5 rounded-full glass-pill hover:text-amber-600 transition-all"
              title="لوحة تحكم الإدارة"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full glass-pill transition-all"
            title="تبديل الوضع"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-teal-700" />}
          </button>

          {/* User Auth Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openStudentDashboard()}
                className="flex items-center gap-2 text-xs text-teal-800 glass-pill px-3.5 py-2"
                title="محاضراتي"
              >
                <PlayCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold hidden sm:inline">محاضراتي</span>
              </button>
              <button
                onClick={openProfileModal}
                className="flex items-center gap-2 text-xs text-teal-800 glass-pill px-3.5 py-2"
                title="حسابي"
              >
                <User className="w-4 h-4 text-teal-600" />
                <span className="font-semibold max-w-[90px] truncate hidden sm:inline">{user?.first_name || 'حسابي'}</span>
              </button>
              <button
                onClick={logout}
                className="text-xs text-rose-600 hover:text-rose-700 px-2 py-1 font-semibold"
              >
                خروج
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="inline-flex items-center gap-1.5 text-xs font-black text-white bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 hover:from-teal-500 hover:to-emerald-600 px-4 py-2.5 rounded-full transition-all shadow-md shadow-teal-600/25 border border-teal-500/30"
            >
              <User className="w-4 h-4" />
              <span>دخول / حساب جديد</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-full glass-pill"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-teal-700" /> : <Menu className="w-5 h-5 text-teal-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-slate-800 hover:text-teal-700 py-2 border-b border-slate-100"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <button
              onClick={() => { setMobileMenuOpen(false); openQuizModal(); }}
              className="w-full text-center text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 py-3 rounded-full shadow-md border border-amber-300"
            >
              اختبار تحديد المستوى المجاني 🏆
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
