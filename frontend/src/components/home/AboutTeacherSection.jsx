'use client';

import React, { useState } from 'react';
import { TEACHER_CV_DATA } from '@/constants/siteContent';
import { useModal } from '@/context/ModalContext';
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

export default function AboutTeacherSection() {
  const { openCvModal } = useModal();
  const [activeTab, setActiveTab] = useState('experience');

  return (
    <section id="about-teacher" className="py-24 bg-gradient-to-b from-white via-slate-50 to-white border-t border-slate-200/80 relative z-10 overflow-hidden">
      
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2.5s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Right Column (in RTL): Teacher Portrait & Stats Stage (lg:col-span-5) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-gradient-to-br from-white via-slate-50 to-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xl space-y-6">
              
              {/* Photo Frame with 3D Depth */}
              <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden border-2 border-slate-200/80 bg-slate-900 shadow-xl group">
                <img
                  src="/assets/images/herr_khaled_2.jpg"
                  alt="الأستاذ خالد - Herr Khaled"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Top Badge: Verified German Master */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-slate-900/90 text-amber-400 border border-amber-400/40 shadow-lg backdrop-blur-md">
                  <span>🇩🇪</span>
                  <span>خبير ومحاضر ألماني معتمد</span>
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                </div>

                {/* Bottom Floating Name Glass Plate */}
                <div className="absolute bottom-4 inset-x-4 p-4 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/80 shadow-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-black text-lg">الأستاذ خالد (Herr Khaled)</h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <p className="text-xs text-amber-400 font-extrabold flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>كبير محاضري اللغة الألمانية • خريج كلية الألسن</span>
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
                  <span className="text-[10px] sm:text-[11px] text-slate-700 font-black block leading-tight">طالب تم تدريبهم</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-200/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-600" />
                    <span className="block text-amber-700 font-black text-xl font-mono">98.4%</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-700 font-black block leading-tight">نسبة نجاح جوته</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-50 to-white border border-cyan-200/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-3.5 h-3.5 text-cyan-600" />
                    <span className="block text-cyan-700 font-black text-xl font-mono">+10</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-700 font-black block leading-tight">سنوات خبرة</span>
                </div>
              </div>

              {/* Big CV Modal Trigger Button */}
              <button
                type="button"
                onClick={() => openCvModal('overview')}
                className="w-full relative group/btn py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer overflow-hidden"
              >
                <span className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-12 -translate-x-full group-hover/btn:translate-x-[300%] transition-transform duration-1000 ease-in-out" />
                <FileText className="w-4 h-4 text-slate-950" />
                <span>استعرض الـ CV والشهادات والاعتمادات كاملاً 📄</span>
                <ChevronLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
              </button>

            </div>
          </div>

          {/* Left Column (in RTL): Interactive CV & Educational Vision (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-teal-500/15 via-amber-500/15 to-teal-500/15 border border-teal-500/30 text-teal-800 shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                <span>المُحاضِر والخبِير التربَوي المعتمد</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                السيرة الذاتية{' '}
                <span className="bg-gradient-to-r from-teal-600 via-sky-600 to-amber-600 bg-clip-text text-transparent">
                  ورؤية التدريس
                </span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                خبرة ممتدة في تدريس وتأسيس آلاف الطلاب والمهندسين والأطباء من الصفر حتى اجتياز امتحانات جوته وتيلك الدولية والالتحاق بسوق العمل في كبرى الشركات الألمانية.
              </p>
            </div>

            {/* Nav Tabs */}
            <div className="flex flex-wrap gap-2 pt-2 border-b border-slate-200 pb-3">
              {[
                { key: 'experience', label: 'الخبرات العملية', icon: Briefcase },
                { key: 'education', label: 'المؤهلات والاعتمادات', icon: GraduationCap },
                { key: 'quote', label: 'فلسفة التدريس', icon: Quote }
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all duration-300 transform active:scale-95 cursor-pointer shadow-xs ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-teal-500/25 shadow-md scale-105'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-teal-400'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Pane Content Box */}
            <div className="min-h-[240px] bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-md">
              
              {activeTab === 'experience' && (
                <div className="space-y-4 animate-fadeIn">
                  {TEACHER_CV_DATA.experience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="group flex items-start gap-4 p-4 rounded-2xl bg-white hover:bg-teal-50/40 border border-slate-200/80 hover:border-teal-400/50 shadow-xs hover:shadow-md transition-all duration-300"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-teal-500/20 group-hover:scale-110 transition-transform">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-slate-900 font-black text-base">{exp.title}</h4>
                          <span className="text-xs font-mono font-black text-amber-800 bg-amber-100/90 px-3 py-0.5 rounded-full border border-amber-300 shadow-xs">
                            {exp.period}
                          </span>
                        </div>
                        <span className="text-xs text-teal-700 font-extrabold flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{exp.org}</span>
                        </span>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pt-1">
                          {exp.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-4 animate-fadeIn">
                  {TEACHER_CV_DATA.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="group flex items-start gap-4 p-4 rounded-2xl bg-white hover:bg-cyan-50/40 border border-slate-200/80 hover:border-cyan-400/50 shadow-xs hover:shadow-md transition-all duration-300"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-slate-900 font-black text-base">{edu.title}</h4>
                          <span className="text-xs font-bold text-teal-800 bg-teal-100/90 px-3 py-0.5 rounded-full border border-teal-300 shadow-xs">
                            {edu.period}
                          </span>
                        </div>
                        <span className="text-xs text-cyan-700 font-extrabold flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" />
                          <span>{edu.org}</span>
                        </span>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pt-1">
                          {edu.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'quote' && (
                <div className="flex flex-col items-center text-center space-y-5 py-6 px-4 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 shadow-sm">
                    <Quote className="w-7 h-7" />
                  </div>
                  <p className="text-base sm:text-xl text-slate-900 leading-relaxed font-black max-w-xl italic">
                    "{TEACHER_CV_DATA.quote}"
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="h-px w-8 bg-amber-400" />
                    <span className="text-xs text-amber-900 font-black bg-amber-100 px-4 py-1 rounded-full border border-amber-300">
                      هير خالد الحلواني • Deutsche Welt
                    </span>
                    <span className="h-px w-8 bg-amber-400" />
                  </div>
                </div>
              )}

            </div>

            {/* Secondary CV Trigger Full-Width */}
            <button
              type="button"
              onClick={() => openCvModal('overview')}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 border border-teal-300/80 text-teal-950 font-black text-xs sm:text-sm flex items-center justify-between transition-all shadow-sm hover:shadow-md group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-teal-700 group-hover:scale-110 transition-transform" />
                <span>شاهد تفاصيل المهارات والاعتمادات والشهادات الدولية الرسمية بالكامل</span>
              </div>
              <span className="text-teal-700 font-extrabold flex items-center gap-1 group-hover:-translate-x-1 transition-transform">
                <span>عرض الـ CV الكامل</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </span>
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}
