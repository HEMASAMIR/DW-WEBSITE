'use client';

import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import Reveal from '@/components/common/Reveal';
import { 
  Sparkles, 
  Award, 
  Play, 
  Users, 
  BookOpen, 
  Search,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Globe,
  FileText,
  Briefcase,
  Building2,
  ChevronLeft,
  MessagesSquare,
  MonitorPlay,
  PlayCircle
} from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  const { openCvModal } = useModal();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const coursesSection = document.getElementById('online-courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden z-10 bg-gradient-to-br from-[#f0fdfa] via-[#ecfeff] to-[#fffbeb] border-b border-teal-500/10">
      
      {/* Radial Glow Spotlight in Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Hero Section Header Content */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Top Capsule Badge */}
          <div className="inline-flex items-center gap-2 glass-pill px-5 py-2 rounded-full shadow-md text-xs sm:text-sm font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
            <span>منصة تأسيس واستكمال اللغة الألمانية الأولى في مصر والوطن العربي</span>
          </div>

          {/* Multi-Tone Gradient Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
            تعلم الألمانية مع الأستاذ خالد <br className="hidden sm:inline" />
            <span className="text-gradient-cyan">لكل مرحلة تستحق التوثيق </span>
            <span className="text-gradient-gold">والتميز</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            خبرة أكثر من 10 سنوات في إعداد وتهيئة الطلاب للامتحانات الدولية <span className="text-amber-700 font-bold">(Goethe & Telc & ÖSD)</span> والالتحاق بالجامعات وسوق العمل بألمانيا.
          </p>

          {/* Search Capsule Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="search-glow relative max-w-2xl mx-auto rounded-full bg-white backdrop-blur-xl border border-teal-500/30 p-2 sm:p-2.5 flex items-center shadow-lg transition-all">
              <div className="pr-3 text-teal-600">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم الكورس (A1, A2, B1, B2) أو الثانوية العامة..."
                className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none px-2"
              />
              <button
                type="submit"
                className="glass-pill-gold px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-1.5 shrink-0 transition-transform transform hover:scale-105"
              >
                <span>استعرض الكورسات</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Interactive CV Banner Trigger Bar */}
          <div 
            onClick={() => openCvModal('overview')}
            className="glass-pill p-3 sm:p-4 rounded-full max-w-3xl mx-auto flex items-center justify-between cursor-pointer border border-teal-500/30 hover:border-teal-400 transition-all shadow-md group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                الملف المهني والشهادات المعتمدة للمحاضر هير خالد (Concentrix & Vodafone DE)
              </span>
            </div>
            <div className="glass-pill-gold px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1 shrink-0">
              <span>استعرض الـ CV كاملاً</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>

          {/* Feature Capsule Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs">
            <div className="glass-pill px-4 py-2 rounded-full flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>+15,000 طالب محترف</span>
            </div>
            <div className="glass-pill px-4 py-2 rounded-full flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>شهادات معتمدة 100%</span>
            </div>
            <div className="glass-pill px-4 py-2 rounded-full flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>كتب ومناهج أونلاين</span>
            </div>
            <div className="glass-pill px-4 py-2 rounded-full flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-600" />
              <span>استجابة وتصحيح يومي</span>
            </div>
          </div>

        </div>

        {/* Bottom Hero Grid Details & Photo Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Key Benefits & CV Stats */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#0e2c4e] text-white p-6 sm:p-8 shadow-2xl shadow-[#0e2c4e]/30">
              {/* light + dot pattern + German-flag stripe (brand) */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(20,184,166,0.35),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(245,158,11,0.22),transparent_55%)]" />
              <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
              <div className="absolute top-0 inset-x-0 h-1.5 flex">
                <span className="flex-1 bg-slate-950" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
              </div>

              <div className="relative space-y-6">
                <h3 className="text-xl sm:text-2xl font-black flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-[#0e2c4e] flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                    <Award className="w-6 h-6" />
                  </span>
                  <span>لماذا تشترك في أكاديمية <span className="text-amber-300" dir="ltr">Herr Khaled</span>؟</span>
                </h3>

                <ol className="space-y-3">
                  {[
                    {
                      icon: MessagesSquare, title: 'شرح مبسط وتأسيس قوي في الجرامر والـ Sprechen', desc: 'أساليب حديثة تعتمد على التحدث والتدريب العملي المستمر.',
                      bar: 'bg-teal-400', icon_: 'bg-teal-400/15 border-teal-300/30 text-teal-300 group-hover:bg-teal-400', border: 'hover:border-teal-300/50', num: 'group-hover:[-webkit-text-stroke:1px_rgba(45,212,191,0.7)]',
                    },
                    {
                      icon: MonitorPlay, title: 'منصة تفاعلية مخصصة لكل طالب', desc: 'محاضرات مسجلة ومباشرة مع متابعة التقييم والواجبات أونلاين.',
                      bar: 'bg-amber-400', icon_: 'bg-amber-400/15 border-amber-300/30 text-amber-300 group-hover:bg-amber-400', border: 'hover:border-amber-300/50', num: 'group-hover:[-webkit-text-stroke:1px_rgba(251,191,36,0.7)]',
                    },
                  ].map(({ icon: Icon, title, desc, bar, icon_, border, num }, i) => (
                    <Reveal
                      as="li"
                      key={title}
                      from="left"
                      delay={150 + i * 150}
                      className={`dw-shine group relative flex items-start gap-4 p-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.11] border border-white/10 ${border} hover:-translate-x-1`}
                    >
                      <span className={`absolute right-0 top-4 bottom-4 w-1 rounded-l-full ${bar} opacity-70 group-hover:opacity-100 transition-opacity`} />
                      <span className={`dw-wiggle w-11 h-11 rounded-xl border ${icon_} group-hover:text-[#0e2c4e] flex items-center justify-center shrink-0 transition-colors`}>
                        <Icon className="w-5 h-5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="font-black text-sm sm:text-base block leading-snug">{title}</span>
                        <span className="text-xs sm:text-[13px] text-slate-300 leading-relaxed block mt-1">{desc}</span>
                      </div>
                      <span className={`text-3xl font-black text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.18)] ${num} transition-all leading-none shrink-0`} dir="ltr">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </Reveal>
                  ))}
                </ol>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    href="/courses"
                    className="py-4 rounded-2xl bg-gradient-to-r from-amber-300 to-amber-500 text-[#0e2c4e] text-sm font-black flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 hover:-translate-y-0.5 transition-transform"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>تصفح الكورسات</span>
                  </Link>
                  <button
                    onClick={() => openCvModal('overview')}
                    className="py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-black flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>السيرة الذاتية والشهادات</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Frame & Floating Corporate Experience Chips */}
          <div className="lg:col-span-6">
            <div className="relative glass-emerald rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
              
              {/* Card Header Tag */}
              <div className="flex items-center justify-between">
                <span className="glass-pill px-3.5 py-1 text-xs font-bold text-teal-700">
                  Herr Khaled El-Halawany
                </span>
                <span className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  مباشر عبر الإنترنت & الفروع
                </span>
              </div>

              {/* Herr Khaled Photo Frame with Full Face Visibility */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-slate-100 border border-teal-500/30 group shadow-inner">
                <img
                  src="/assets/images/herr_khaled_1.jpg"
                  alt="الأستاذ خالد - Herr Khaled"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating Chips Overlay */}
                <div 
                  onClick={() => openCvModal('overview')}
                  className="absolute bottom-3 right-3 glass-pill px-3 py-1.5 rounded-xl text-[11px] font-bold text-amber-300 flex items-center gap-1.5 cursor-pointer shadow-xl border border-amber-400/40 hover:scale-105 transition-transform"
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>شراكة Concentrix & Vodafone DE</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => openCvModal('overview')}
                className="w-full glass-pill-active py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>عرض السيرة الذاتية الرسمية والشهادات المعتمدة 📄✨</span>
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
