'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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

import { t, tRich } from '@/lib/i18n';
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
    <section id="hero" className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden z-10 bg-gradient-to-b from-[#effcfa] via-white to-[#fffaf0] border-b border-slate-200/70">

      {/* Background: soft light + fading grid */}
      <div className="absolute -top-32 right-[10%] w-[520px] h-[520px] bg-teal-300/25 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-40 left-[5%] w-[420px] h-[420px] bg-amber-300/20 blur-[120px] rounded-full pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(14,44,78,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(14,44,78,0.06) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Top Hero Section Header Content */}
        <Reveal className="text-center max-w-4xl mx-auto space-y-7">

          {/* Top Capsule Badge */}
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur border border-teal-200 shadow-md shadow-teal-900/5 px-5 py-2 rounded-full text-xs sm:text-sm font-black text-teal-800">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>{t('منصة تأسيس واستكمال اللغة الألمانية الأولى في مصر والوطن العربي')}</span>
          </div>

          {/* Headline */}
          <h1 className="text-[2rem] sm:text-5xl lg:text-6xl font-black text-[#0e2c4e] leading-[1.25] tracking-tight">
            <span className="block">
              {tRich('تعلم الألمانية مع <b>هير خالد الحلواني</b>', {
                b: (s) => (
                  <span className="relative inline-block text-teal-600">
                    {s}
                    <span className="absolute -bottom-1 sm:-bottom-2 inset-x-0 flex h-1.5 sm:h-2 rounded-full overflow-hidden" dir="ltr">
                      <span className="flex-1 bg-slate-900" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
                    </span>
                  </span>
                ),
              })}
            </span>
            <span className="block mt-3 sm:mt-4 text-2xl sm:text-4xl lg:text-5xl">
              {tRich('لكل مرحلة تستحق التوثيق <b>والتميز</b>', { b: (s) => <span className="text-amber-500">{s}</span> })}
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('خبرة أكثر من 10 سنوات في إعداد وتهيئة الطلاب للامتحانات الدولية والالتحاق بالجامعات وسوق العمل بألمانيا.')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 -mt-2" dir="ltr">
            {[
              { name: 'Goethe', cls: 'bg-teal-50 text-teal-700 border-teal-200' },
              { name: 'telc', cls: 'bg-sky-50 text-sky-700 border-sky-200' },
              { name: 'ÖSD', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
            ].map((x) => (
              <span key={x.name} className={`px-4 py-1.5 rounded-full border text-sm font-black ${x.cls}`}>{x.name}</span>
            ))}
          </div>

          {/* Search Capsule Bar */}
          <form onSubmit={handleSearchSubmit}>
            <div className="relative max-w-2xl mx-auto rounded-2xl bg-white border-2 border-slate-200 focus-within:border-teal-400 p-2 flex items-center shadow-xl shadow-slate-900/[0.06] transition-colors">
              <div className="ps-3 text-teal-600">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('ابحث باسم الكورس (A1, A2, B1, B2) أو الثانوية العامة...')}
                className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-semibold focus:outline-none px-2 py-2"
              />
              <button
                type="submit"
                className="dw-shine bg-[#0e2c4e] hover:bg-teal-700 text-white px-4 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <span>{t('استعرض الكورسات')}</span>
                <ArrowLeft className="w-4 h-4 ltr:-scale-x-100" />
              </button>
            </div>
          </form>

          {/* CV bar */}
          <button
            type="button"
            onClick={() => openCvModal('overview')}
            className="group w-full max-w-3xl mx-auto flex items-center justify-between gap-3 p-2 ps-3 rounded-2xl bg-white/90 backdrop-blur border border-slate-200 hover:border-amber-300 shadow-md hover:shadow-xl transition-all text-start"
          >
            <span className="flex items-center gap-3 min-w-0">
              <span className="dw-wiggle w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-[#0e2c4e] flex items-center justify-center shrink-0 shadow-md shadow-amber-500/25">
                <FileText className="w-5 h-5" />
              </span>
              <span className="text-xs sm:text-sm font-black text-[#0e2c4e] leading-snug">
                {t('الملف المهني والشهادات المعتمدة لهير خالد الحلواني')}
                <span className="block text-[11px] sm:text-xs font-bold text-slate-500 mt-0.5" dir="ltr">Concentrix &amp; Vodafone DE</span>
              </span>
            </span>
            <span className="shrink-0 bg-amber-400 group-hover:bg-amber-300 text-[#0e2c4e] px-3 sm:px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1 transition-colors">
              <span>{t('استعرض الـ CV')}</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform ltr:-scale-x-100" />
            </span>
          </button>

          {/* Feature pills — one calm colour each */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm">
            {[
              { icon: Users, text: t('+15,000 طالب محترف'), cls: 'bg-teal-50 border-teal-200 text-teal-800', ic: 'text-teal-600' },
              { icon: ShieldCheck, text: t('شهادات معتمدة 100%'), cls: 'bg-amber-50 border-amber-200 text-amber-800', ic: 'text-amber-600' },
              { icon: BookOpen, text: t('كتب ومناهج أونلاين'), cls: 'bg-sky-50 border-sky-200 text-sky-800', ic: 'text-sky-600' },
              { icon: Zap, text: t('استجابة وتصحيح يومي'), cls: 'bg-violet-50 border-violet-200 text-violet-800', ic: 'text-violet-600' },
            ].map(({ icon: Icon, text, cls, ic }, i) => (
              <Reveal key={text} from="zoom" delay={300 + i * 100} className={`group px-4 py-2 rounded-full border font-bold flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-md ${cls}`}>
                <Icon className={`dw-wiggle w-4 h-4 ${ic}`} />
                <span>{text}</span>
              </Reveal>
            ))}
          </div>

        </Reveal>

        {/* Bottom Hero Grid Details & Photo Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Key Benefits & CV Stats */}
          <Reveal from="right" delay={150} className="lg:col-span-6">
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
                  <span>{t('لماذا تشترك في أكاديمية')}{' '}<span className="text-amber-300" dir="ltr">Deutsche Welt</span>{t('؟')}</span>
                </h3>

                <ol className="space-y-3">
                  {[
                    {
                      icon: MessagesSquare, title: t('شرح مبسط وتأسيس قوي في الجرامر والـ Sprechen'), desc: t('أساليب حديثة تعتمد على التحدث والتدريب العملي المستمر.'),
                      bar: 'bg-teal-400', icon_: 'bg-teal-400/15 border-teal-300/30 text-teal-300 group-hover:bg-teal-400', border: 'hover:border-teal-300/50', num: 'group-hover:[-webkit-text-stroke:1px_rgba(45,212,191,0.7)]',
                    },
                    {
                      icon: MonitorPlay, title: t('منصة تفاعلية مخصصة لكل طالب'), desc: t('محاضرات مسجلة ومباشرة مع متابعة التقييم والواجبات أونلاين.'),
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
                      <span className={`absolute start-0 top-4 bottom-4 w-1 rounded-e-full ${bar} opacity-70 group-hover:opacity-100 transition-opacity`} />
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
                    <span>{t('تصفح الكورسات')}</span>
                  </Link>
                  <button
                    onClick={() => openCvModal('overview')}
                    className="py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-black flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{t('السيرة الذاتية والشهادات')}</span>
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Photo Frame & Floating Corporate Experience Chips */}
          <Reveal from="left" delay={300} className="lg:col-span-6">
            <div className="relative glass-emerald rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
              
              {/* Card Header Tag */}
              <div className="flex items-center justify-between">
                <span className="glass-pill px-3.5 py-1 text-xs font-bold text-teal-700">
                  Herr Khaled El-Halawany
                </span>
                <span className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  {t('مباشر عبر الإنترنت & الفروع')}
                </span>
              </div>

              {/* Herr Khaled Photo Frame with Full Face Visibility */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-slate-100 border border-teal-500/30 group shadow-inner">
                <Image
                  src="/assets/images/herr_khaled_1.jpg"
                  alt={t('هير خالد الحلواني - Herr Khaled')}
                  fill
                  sizes="(min-width: 1024px) 34vw, 92vw"
                  quality={85}
                  loading="eager"
                  fetchPriority="high"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating Chips Overlay */}
                <div 
                  onClick={() => openCvModal('overview')}
                  className="absolute bottom-3 start-3 glass-pill px-3 py-1.5 rounded-xl text-[11px] font-bold text-amber-300 flex items-center gap-1.5 cursor-pointer shadow-xl border border-amber-400/40 hover:scale-105 transition-transform"
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('شراكة Concentrix & Vodafone DE')}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => openCvModal('overview')}
                className="w-full glass-pill-active py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>{t('عرض السيرة الذاتية الرسمية والشهادات المعتمدة 📄✨')}</span>
              </button>

            </div>
          </Reveal>

        </div>

      </div>
    </section>
  );
}
