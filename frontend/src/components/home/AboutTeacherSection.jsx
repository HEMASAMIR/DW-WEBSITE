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
  CheckCircle,
  Award,
  Sparkles,
  FileText,
  ChevronLeft
} from 'lucide-react';

export default function AboutTeacherSection() {
  const { openCvModal } = useModal();
  const [activeTab, setActiveTab] = useState('experience');

  return (
    <section id="about-teacher" className="py-20 bg-white border-t border-slate-200 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Teacher Image / Portrait Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6">
              <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                <img
                  src="/assets/images/herr_khaled_2.jpg"
                  alt="الأستاذ خالد - Herr Khaled"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 right-4 left-4 p-3 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-md">
                  <h4 className="text-[#0f172a] font-extrabold text-base">الأستاذ خالد (Herr Khaled)</h4>
                  <p className="text-xs text-amber-700 font-bold">محاضر لغة ألمانية معتمد • الألسن</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                {TEACHER_CV_DATA.milestones.map((m, idx) => (
                  <div key={idx} className="bg-white py-3 px-2 rounded-2xl border border-teal-500/20 shadow-sm">
                    <span className="block text-[#0d9488] font-black text-lg font-mono">{m.number}</span>
                    <span className="text-[10px] text-slate-600 font-bold">{m.label}</span>
                  </div>
                ))}
              </div>

              {/* Big CV Modal Trigger Button */}
              <button
                onClick={() => openCvModal('overview')}
                className="w-full glass-pill-gold py-3.5 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform"
              >
                <FileText className="w-4 h-4 text-slate-900" />
                <span>استعرض الـ CV والشهادات كاملاً 📄</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive CV Content */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full text-xs font-bold">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>المُحاضِر والخبِير التربَوي</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-[#0f172a]">
                السيرة الذاتية <span className="text-gradient-cyan">ورؤية التدريس</span>
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                خبرة متميزة في تدريس اللغة الألمانية لمئات الطلاب والمهندسين والأطباء وتأهيلهم لاجتياز الامتحانات الدولية الرسمية بأعلى المعدلات.
              </p>
            </div>

            {/* Nav Tabs */}
            <div className="flex flex-wrap gap-2 pt-2 border-b border-slate-200 pb-3">
              <button
                onClick={() => setActiveTab('experience')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all ${
                  activeTab === 'experience'
                    ? 'glass-pill-active'
                    : 'glass-pill'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>الخبرات العملية</span>
              </button>

              <button
                onClick={() => setActiveTab('education')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all ${
                  activeTab === 'education'
                    ? 'glass-pill-active'
                    : 'glass-pill'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>المؤهلات والاعتمادات</span>
              </button>

              <button
                onClick={() => setActiveTab('quote')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all ${
                  activeTab === 'quote'
                    ? 'glass-pill-active'
                    : 'glass-pill'
                }`}
              >
                <Quote className="w-4 h-4" />
                <span>فلسفة التدريس</span>
              </button>
            </div>

            {/* Tab Pane Content with CRISP HIGH CONTRAST TEXT */}
            <div className="min-h-[220px] bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-inner">
              {activeTab === 'experience' && (
                <div className="space-y-4">
                  {TEACHER_CV_DATA.experience.map((exp, idx) => (
                    <div key={idx} className="flex items-start gap-4 pb-4 border-b border-slate-200 last:border-0 last:pb-0">
                      <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-900 flex items-center justify-center shrink-0 mt-1 border border-teal-300 shadow-sm">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-[#0f172a] font-black text-base">{exp.title}</h4>
                          <span className="text-xs text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full font-mono font-black border border-amber-300">{exp.period}</span>
                        </div>
                        <span className="text-xs text-teal-900 font-extrabold block mt-1">{exp.org}</span>
                        <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1 leading-relaxed">{exp.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-4">
                  {TEACHER_CV_DATA.education.map((edu, idx) => (
                    <div key={idx} className="flex items-start gap-4 pb-4 border-b border-slate-200 last:border-0 last:pb-0">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-900 flex items-center justify-center shrink-0 mt-1 border border-cyan-300 shadow-sm">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-[#0f172a] font-black text-base">{edu.title}</h4>
                          <span className="text-xs text-teal-900 bg-teal-100/90 px-2.5 py-0.5 rounded-full font-bold border border-teal-300">{edu.period}</span>
                        </div>
                        <span className="text-xs text-teal-900 font-extrabold block mt-1">{edu.org}</span>
                        <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1 leading-relaxed">{edu.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'quote' && (
                <div className="flex flex-col items-center text-center space-y-4 py-4">
                  <Quote className="w-10 h-10 text-amber-600 opacity-90" />
                  <p className="text-base sm:text-lg text-[#0f172a] italic leading-relaxed font-extrabold">
                    {TEACHER_CV_DATA.quote}
                  </p>
                  <span className="text-xs text-amber-900 font-black bg-amber-100 px-3 py-1 rounded-full border border-amber-300">— الأستاذ خالد</span>
                </div>
              )}
            </div>

            {/* Secondary CV Trigger */}
            <button
              onClick={() => openCvModal('overview')}
              className="w-full bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-900 font-extrabold py-3 px-6 rounded-2xl text-xs flex items-center justify-between transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-700" />
                <span>شاهد تفاصيل المهارات والاعتمادات والشهادات الدولية الرسمية</span>
              </div>
              <span className="text-teal-700 font-bold">عرض الـ CV الكامل ←</span>
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}
