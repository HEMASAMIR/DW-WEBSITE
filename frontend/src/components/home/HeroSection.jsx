'use client';

import React from 'react';
import { useModal } from '@/context/ModalContext';
import { ACADEMY_INFO } from '@/constants/mockData';
import { 
  Sparkles, 
  Award, 
  Play, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  Globe2,
  ArrowLeft
} from 'lucide-react';

export default function HeroSection() {
  const { openQuizModal, openStudentDashboard } = useModal();

  return (
    <section id="hero" className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Content (RTL Right side in Arabic) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-950/80 to-amber-950/80 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg shadow-amber-950/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{ACADEMY_INFO.heroBadge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              تعلم اللغة الألمانية من <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-red-500">الصفر حتى الاحترافي</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              مع الأستاذ خالد بخبرة تزيد عن 10 سنوات. إعداد كامل للمراحل الثانوية والجامعية والامتحانات الدولية <span className="text-amber-300 font-bold">(Goethe & Telc & ÖSD)</span> للسفر والعمل في ألمانيا.
            </p>

            {/* Key Advantages Bullet Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>محاضرات أونلاين تفاعلية وجداول مرتبة</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>كتب مطبوعة ونسخ PDF مجاناً</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>متابعة وتصحيح واجبات يومياً</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>شهادات إتمام مستوى معتمدة</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={openQuizModal}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-2xl shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-1"
              >
                <Award className="w-5 h-5" />
                <span>ابدأ اختبار تحديد المستوى (مجاناً)</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <a
                href="#online-courses"
                className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-white font-bold px-6 py-3.5 rounded-2xl border border-slate-700 transition-all shadow-lg"
              >
                <BookOpen className="w-5 h-5 text-red-500" />
                <span>استعرض الكورسات</span>
              </a>
            </div>

            {/* Trust Metrics Row */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-amber-400 font-mono">+15,000</span>
                <span className="text-xs text-slate-400">طالب وطالبة</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-red-500 font-mono">98.4%</span>
                <span className="text-xs text-slate-400">نسبة اجتياز الامتحانات</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-emerald-400 font-mono">10+</span>
                <span className="text-xs text-slate-400">سنوات خبرة</span>
              </div>
            </div>

          </div>

          {/* Right Card / Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-gradient-to-b from-slate-800/90 to-slate-900/90 rounded-3xl p-6 border border-slate-700 shadow-2xl shadow-slate-950">
              
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="bg-red-600/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-500/30">
                  Herr Khaled Online Academy
                </span>
                <span className="text-xs text-amber-400 flex items-center gap-1 font-semibold">
                  <Globe2 className="w-3.5 h-3.5" />
                  أونلاين & بالحضور
                </span>
              </div>

              {/* Video Thumbnail Preview */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 mb-5 border border-slate-800 group">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                  alt="Herr Khaled Teaching"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <button
                  onClick={() => openStudentDashboard(1)}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 hover:bg-slate-950/20 transition-colors"
                >
                  <div className="w-14 h-14 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/40 transform group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current mr-0.5" />
                  </div>
                  <span className="text-xs font-bold text-white mt-2 bg-slate-900/80 px-3 py-1 rounded-full backdrop-blur-sm">
                    معاينة محتوى المحاضرات
                  </span>
                </button>
              </div>

              {/* Course Card Preview Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 font-bold">المستوى الأساسي A1 (مجموعة أكتوبر)</span>
                  <span className="text-amber-400 font-extrabold">1200 ج.م</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-400 to-red-500 h-full w-[85%] rounded-full"></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>تم اكتمال 85% من المقاعد</span>
                  <span className="text-amber-300 font-medium">متبقي 4 مقاعد</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
