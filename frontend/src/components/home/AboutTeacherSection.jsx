'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { TEACHER_CV_DATA } from '@/constants/siteContent';
import { useModal } from '@/context/ModalContext';
import Reveal from '@/components/common/Reveal';
import {
  UserCheck,
  Briefcase,
  GraduationCap,
  Trophy,
  Quote,
  CheckCircle2,
  Award,
  Sparkles,
  FileText,
  ChevronLeft,
  Star,
  Users,
  Calendar,
  Building2,
  Check,
  Flame,
  ArrowLeft
} from 'lucide-react';

import { t, tRich } from '@/lib/i18n';
// One colour per item (Tailwind needs the full class names written out).
const EXP_TONES = [
  { dot: 'border-teal-500', ping: 'bg-teal-400', side: 'border-s-teal-500', hover: 'hover:border-teal-300', icon: 'from-teal-500 to-emerald-600 shadow-teal-600/25', text: 'text-teal-700' },
  { dot: 'border-amber-500', ping: 'bg-amber-400', side: 'border-s-amber-500', hover: 'hover:border-amber-300', icon: 'from-amber-400 to-orange-500 shadow-amber-500/25', text: 'text-amber-700' },
  { dot: 'border-rose-500', ping: 'bg-rose-400', side: 'border-s-rose-500', hover: 'hover:border-rose-300', icon: 'from-rose-500 to-red-600 shadow-rose-600/25', text: 'text-rose-700' },
];
const EDU_TONES = [
  { side: 'border-t-sky-500', blob: 'bg-sky-100', icon: 'from-sky-500 to-[#0e2c4e] shadow-sky-600/25', text: 'text-sky-700', chip: 'bg-sky-50 text-sky-800' },
  { side: 'border-t-violet-500', blob: 'bg-violet-100', icon: 'from-violet-500 to-indigo-700 shadow-violet-600/25', text: 'text-violet-700', chip: 'bg-violet-50 text-violet-800' },
];

export default function AboutTeacherSection() {
  const { openCvModal } = useModal();
  const [activeTab, setActiveTab] = useState('experience');

  return (
    <section id="about-teacher" className="py-24 bg-gradient-to-b from-white via-slate-50 to-white border-t border-slate-200/80 relative z-10 overflow-hidden">
      
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-20 start-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 end-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2.5s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Right Column (in RTL): Teacher Portrait & Stats Stage (lg:col-span-5) */}
          <Reveal from="zoom" className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-gradient-to-br from-white via-slate-50 to-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xl space-y-6">
              
              {/* Photo Frame with 3D Depth */}
              <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden border-2 border-slate-200/80 bg-slate-900 shadow-xl group">
                <Image
                  src="/assets/images/herr_khaled_2.jpg"
                  alt={t('هير خالد الحلواني - Herr Khaled')}
                  fill
                  sizes="(min-width: 640px) 26rem, 88vw"
                  quality={85}
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Top Badge: Verified German Master */}
                <div className="absolute top-4 start-4 z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-slate-900/90 text-amber-400 border border-amber-400/40 shadow-lg backdrop-blur-md">
                  <span>🇩🇪</span>
                  <span>{t('خبير ومحاضر ألماني معتمد')}</span>
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                </div>

                {/* Bottom Floating Name Glass Plate */}
                <div className="absolute bottom-4 inset-x-4 p-4 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/80 shadow-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-black text-lg">{t('هير خالد الحلواني (Herr Khaled)')}</h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <p className="text-xs text-amber-400 font-extrabold flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>{t('كبير محاضري اللغة الألمانية • خريج كلية الألسن')}</span>
                  </p>
                </div>
              </div>

              {/* 3 High-Impact Milestone Stat Cards */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-50 to-white border border-teal-200/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    <span className="block text-teal-700 font-black text-xl font-mono">+15,000</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-700 font-black block leading-tight">{t('طالب تم تدريبهم')}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-200/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-600" />
                    <span className="block text-amber-700 font-black text-xl font-mono">98.4%</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-700 font-black block leading-tight">{t('نسبة نجاح جوته')}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-50 to-white border border-cyan-200/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-3.5 h-3.5 text-cyan-600" />
                    <span className="block text-cyan-700 font-black text-xl font-mono">+10</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-700 font-black block leading-tight">{t('سنوات خبرة')}</span>
                </div>
              </div>

              {/* Big CV Modal Trigger Button */}
              <button
                type="button"
                onClick={() => openCvModal('overview')}
                className="w-full relative py-4 px-5 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:from-teal-600 hover:to-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-teal-900/25 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-white" />
                <span>{t('استعرض الـ CV والشهادات والاعتمادات كاملاً 📄')}</span>
                <ChevronLeft className="w-4 h-4 ltr:-scale-x-100" />
              </button>

            </div>
          </Reveal>

          {/* Left Column (in RTL): Interactive CV & Educational Vision (lg:col-span-7) */}
          <Reveal from="left" delay={150} className="lg:col-span-7 space-y-6">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-teal-500/15 via-amber-500/15 to-teal-500/15 border border-teal-500/30 text-teal-800 shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                <span>{t('المُحاضِر والخبِير التربَوي المعتمد')}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-[#0e2c4e] tracking-tight leading-tight">
                {tRich('السيرة الذاتية <b>ورؤية التدريس</b>', { b: (s) => <span className="text-teal-600">{s}</span> })}
              </h2>
              <div className="flex h-1.5 w-24 rounded-full overflow-hidden">
                <span className="flex-1 bg-slate-900" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                {t('خبرة ممتدة في تدريس وتأسيس آلاف الطلاب والمهندسين والأطباء من الصفر حتى اجتياز امتحانات جوته وتيلك الدولية والالتحاق بسوق العمل في كبرى الشركات الألمانية.')}
              </p>
            </div>

            {/* Nav Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80">
              {[
                { key: 'experience', label: t('الخبرات العملية'), icon: Briefcase },
                { key: 'education', label: t('المؤهلات والاعتمادات'), icon: GraduationCap },
                { key: 'quote', label: t('فلسفة التدريس'), icon: Quote }
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 px-2 py-3 rounded-xl text-[11px] sm:text-sm font-black transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-[#0e2c4e] text-white shadow-lg shadow-[#0e2c4e]/25'
                        : 'text-slate-600 hover:text-[#0e2c4e] hover:bg-white'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber-300' : ''}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Pane Content Box */}
            <div className="min-h-[260px]">

              {activeTab === 'experience' && (
                <ol className="relative space-y-5 ps-7 animate-fadeIn before:absolute before:top-3 before:bottom-3 before:start-[11px] before:w-0.5 before:bg-gradient-to-b before:from-teal-500 before:via-amber-400 before:to-transparent">
                  {TEACHER_CV_DATA.experience.map((exp, idx) => {
                    const tn = EXP_TONES[idx % EXP_TONES.length];
                    return (
                    <Reveal as="li" key={idx} from="left" delay={idx * 180} className="relative">
                      <span className={`absolute -start-7 top-5 w-6 h-6 rounded-full bg-white border-4 ${tn.dot}`}>
                        <span className={`absolute inset-0 rounded-full ${tn.ping} animate-ping opacity-40`} />
                      </span>
                      <div className={`dw-shine group p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 border-s-4 ${tn.side} shadow-lg shadow-slate-900/[0.04] hover:shadow-xl ${tn.hover} transition-all duration-300 hover:-translate-x-1`}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className={`dw-wiggle w-12 h-12 rounded-2xl bg-gradient-to-br ${tn.icon} text-white flex items-center justify-center shrink-0 shadow-lg`}>
                              <Briefcase className="w-5 h-5" />
                            </span>
                            <div>
                              <h4 className="text-[#0e2c4e] font-black text-base sm:text-lg leading-snug">{t(exp.title)}</h4>
                              <span className={`text-xs ${tn.text} font-extrabold flex items-center gap-1.5 mt-0.5`}>
                                <Building2 className="w-3.5 h-3.5" />
                                <span>{t(exp.org)}</span>
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-black text-[#0e2c4e] bg-amber-100 px-3 py-1 rounded-lg border border-amber-300/70 inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-600" />
                            {t(exp.period)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed mt-4 pt-4 border-t border-slate-100">{t(exp.desc)}</p>
                      </div>
                    </Reveal>
                    );
                  })}
                </ol>
              )}

              {activeTab === 'education' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fadeIn">
                  {TEACHER_CV_DATA.education.map((edu, idx) => {
                    const tn = EDU_TONES[idx % EDU_TONES.length];
                    return (
                    <Reveal
                      key={idx}
                      from="zoom"
                      delay={idx * 180}
                      className={`dw-shine group relative overflow-hidden p-6 rounded-3xl bg-white border border-slate-200/80 border-t-4 ${tn.side} shadow-lg shadow-slate-900/[0.04] hover:shadow-xl hover:-translate-y-1 space-y-3`}
                    >
                      <span className={`absolute -top-10 -end-10 w-32 h-32 rounded-full ${tn.blob} group-hover:scale-125 transition-transform duration-500`} />
                      <span className={`dw-wiggle relative w-12 h-12 rounded-2xl bg-gradient-to-br ${tn.icon} text-white flex items-center justify-center shadow-lg`}>
                        <GraduationCap className="w-6 h-6" />
                      </span>
                      <h4 className="relative text-[#0e2c4e] font-black text-base leading-snug">{t(edu.title)}</h4>
                      <span className={`relative text-xs ${tn.text} font-extrabold flex items-center gap-1.5`}>
                        <Award className="w-3.5 h-3.5" />
                        <span>{t(edu.org)}</span>
                      </span>
                      <span className={`relative inline-block text-[11px] font-black px-3 py-1 rounded-lg ${tn.chip}`}>{t(edu.period)}</span>
                      <p className="relative text-sm text-slate-600 font-medium leading-relaxed">{t(edu.desc)}</p>
                    </Reveal>
                    );
                  })}
                </div>
              )}

              {activeTab === 'quote' && (
                <div className="relative overflow-hidden rounded-3xl bg-[#0e2c4e] text-white p-8 sm:p-12 text-center animate-fadeIn shadow-2xl shadow-[#0e2c4e]/25">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.35),transparent_60%)]" />
                  <Quote className="absolute top-4 start-6 w-24 h-24 text-white/[0.06]" />
                  <div className="relative space-y-6">
                    <p className="text-lg sm:text-2xl leading-relaxed font-black max-w-xl mx-auto">
                      {t(TEACHER_CV_DATA.quote).replace(/^"|"$/g, '')}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <span className="flex h-1 w-10 rounded-full overflow-hidden"><span className="flex-1 bg-slate-950" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" /></span>
                      <span className="text-xs sm:text-sm text-amber-300 font-black">{t('هير خالد الحلواني • Deutsche Welt')}</span>
                      <span className="flex h-1 w-10 rounded-full overflow-hidden"><span className="flex-1 bg-amber-400" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-slate-950" /></span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Secondary CV Trigger Full-Width */}
            <button
              type="button"
              onClick={() => openCvModal('overview')}
              className="w-full p-2 ps-5 rounded-2xl bg-white border border-slate-200 hover:border-[#0e2c4e]/30 text-[#0e2c4e] font-black text-xs sm:text-sm flex items-center justify-between gap-3 transition-all shadow-lg shadow-slate-900/[0.04] hover:shadow-xl group cursor-pointer"
            >
              <span className="flex items-center gap-2.5 text-start">
                <FileText className="w-5 h-5 text-teal-600 shrink-0" />
                <span>{t('شاهد تفاصيل المهارات والاعتمادات والشهادات الدولية الرسمية بالكامل')}</span>
              </span>
              <span className="shrink-0 bg-[#0e2c4e] text-white px-4 py-3 rounded-xl flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                <span>{t('عرض الـ CV الكامل')}</span>
                <ArrowLeft className="w-4 h-4 ltr:-scale-x-100" />
              </span>
            </button>

          </Reveal>

        </div>

      </div>
    </section>
  );
}
