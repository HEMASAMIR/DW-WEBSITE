'use client';

import React from 'react';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';
import { ACADEMY_INFO } from '@/constants/mockData';
import { GraduationCap, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const { openAdminDashboard } = useModal();

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800/80 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white">Deutsche Welt</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {ACADEMY_INFO.subtitle}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href={`https://wa.me/${ACADEMY_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </a>
              <a href={`mailto:${ACADEMY_INFO.email}`} className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-r-4 border-amber-500 pr-3">روابط السريعة</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#hero" className="hover:text-amber-400 transition-colors">الرئيسية</a></li>
              <li><a href="#online-courses" className="hover:text-amber-400 transition-colors">الكورسات والمستويات (A1 - C1)</a></li>
              <li><a href="#books-store" className="hover:text-amber-400 transition-colors">متجر الكتب المطبوعة</a></li>
              <li><a href="#about-teacher" className="hover:text-amber-400 transition-colors">السيرة الذاتية للأستاذ خالد</a></li>
              <li><a href="#reviews" className="hover:text-amber-400 transition-colors">تجارب الطلاب الموثقة</a></li>
            </ul>
          </div>

          {/* Branches Contact */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-r-4 border-red-600 pr-3">فروعنا بالحضور</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 mt-1 shrink-0" />
                <span>فرع الدقي: شارع مصدق - بجوار مترو الدقي</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                <span>فرع مدينة نصر: شارع عباس العقاد</span>
              </li>
              <li className="flex items-center gap-2 pt-2 text-xs text-amber-300">
                <Phone className="w-3.5 h-3.5" />
                <span>للاستفسار: {ACADEMY_INFO.phonePrimary}</span>
              </li>
            </ul>
          </div>

          {/* Admin Shortcut Box */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-500/30">
                Portal Shortcuts
              </span>
              <h5 className="text-white font-bold text-sm mt-3 mb-1">لوحة الإدارة والمتابعة</h5>
              <p className="text-xs text-slate-400">إدارة طلبات المستويات والكتب والتحليلات</p>
            </div>

            <button
              onClick={openAdminDashboard}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-purple-950"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>دخول لوحة التحكم</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Deutsche Welt Academy - الأستاذ خالد. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>تم التطوير بواسطة</span>
            <span className="text-amber-400 font-semibold">Next.js & Django REST</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
