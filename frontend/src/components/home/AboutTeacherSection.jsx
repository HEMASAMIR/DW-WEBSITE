'use client';

import React, { useState } from 'react';
import { TEACHER_CV_DATA } from '@/constants/mockData';
import { 
  UserCheck, 
  Briefcase, 
  GraduationCap, 
  Trophy, 
  Quote, 
  CheckCircle,
  Award
} from 'lucide-react';

export default function AboutTeacherSection() {
  const [activeTab, setActiveTab] = useState('experience');

  return (
    <section id="about-teacher" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Teacher Image / Portrait Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-6 border border-slate-700 shadow-2xl">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 border border-slate-700 bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
                  alt="Herr Khaled - الأستاذ خالد"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 right-4 left-4 p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700">
                  <h4 className="text-white font-extrabold text-base">الأستاذ خالد (Herr Khaled)</h4>
                  <p className="text-xs text-amber-400 font-semibold">محاضر لغة ألمانية معتمد • الألسن</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                {TEACHER_CV_DATA.milestones.map((m, idx) => (
                  <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span className="block text-amber-400 font-black text-lg font-mono">{m.number}</span>
                    <span className="text-[10px] text-slate-400">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive CV Content */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3.5 py-1.5 rounded-full">
                <UserCheck className="w-4 h-4" />
                <span>المُحاضِر والخبِير التربَوي</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                السيرة الذاتية ورؤية التدريس
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                خبرة متميزة في تدريس اللغة الألمانية لمئات الطلاب والمهندسين والأطباء وتأهيلهم لاجتياز الامتحانات الدولية الرسمية بأعلى المعدلات.
              </p>
            </div>

            {/* Nav Tabs */}
            <div className="flex flex-wrap gap-2 pt-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('experience')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'experience'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>الخبرات العملية</span>
              </button>

              <button
                onClick={() => setActiveTab('education')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'education'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>المؤهلات والاعتمادات</span>
              </button>

              <button
                onClick={() => setActiveTab('quote')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'quote'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Quote className="w-4 h-4" />
                <span>فلسفة التدريس</span>
              </button>
            </div>

            {/* Tab Pane Content */}
            <div className="min-h-[180px] bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              {activeTab === 'experience' && (
                <div className="space-y-4">
                  {TEACHER_CV_DATA.experience.map((exp, idx) => (
                    <div key={idx} className="flex items-start gap-4 pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-1">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-bold text-base">{exp.title}</h4>
                          <span className="text-xs text-amber-400 font-mono font-medium">{exp.period}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">{exp.org}</span>
                        <p className="text-xs text-slate-300 mt-1">{exp.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-4">
                  {TEACHER_CV_DATA.education.map((edu, idx) => (
                    <div key={idx} className="flex items-start gap-4 pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                      <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-1">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-bold text-base">{edu.title}</h4>
                          <span className="text-xs text-red-400 font-semibold">{edu.period}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">{edu.org}</span>
                        <p className="text-xs text-slate-300 mt-1">{edu.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'quote' && (
                <div className="flex flex-col items-center text-center space-y-4 py-4">
                  <Quote className="w-10 h-10 text-amber-400 opacity-60" />
                  <p className="text-base sm:text-lg text-slate-200 italic leading-relaxed font-medium">
                    {TEACHER_CV_DATA.quote}
                  </p>
                  <span className="text-xs text-amber-400 font-bold">— الأستاذ خالد</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
