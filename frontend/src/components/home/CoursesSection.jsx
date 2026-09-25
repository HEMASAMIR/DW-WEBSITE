'use client';

import React from 'react';
import { useCourses } from '@/hooks/useCourses';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  GraduationCap,
  Lock
} from 'lucide-react';

export default function CoursesSection() {
  const { courses, activeTab, setActiveTab } = useCourses();
  const { openEnrollModal, openAuthModal } = useModal();
  const { isAuthenticated } = useAuth();

  const tabs = [
    { key: 'ALL', label: 'جميع المستويات' },
    { key: 'A1', label: 'المستوى A1' },
    { key: 'A2', label: 'المستوى A2' },
    { key: 'B1', label: 'المستوى B1' },
    { key: 'B2', label: 'المستوى B2' },
    { key: 'C1', label: 'المستوى C1' },
  ];

  const handleEnrollClick = (course) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    openEnrollModal(course);
  };

  return (
    <section id="online-courses" className="py-20 bg-slate-900/60 relative z-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3.5 py-1.5 rounded-full">
            <BookOpen className="w-4 h-4" />
            <span>برامج التأسيس والتأهيل الأكاديمي</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            الكورسات الأونلاين للمستويات (A1 - C1)
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            مناهج منظمة تشمل الشرح المفصل، التدريبات التفاعلية، ومتابعة الواجبات واختبارات قياس المستوى.
          </p>

          {/* Level Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === t.key
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:-translate-y-1"
            >
              <div>
                {/* Level Code & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                    {course.code}
                  </span>
                  {course.badge && (
                    <span className="bg-red-950/80 text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-800/40">
                      {course.badge}
                    </span>
                  )}
                </div>

                {/* Course Title */}
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                  {course.name}
                </h3>
                <p className="text-xs text-amber-300 font-medium mb-3">{course.subName}</p>
                <p className="text-sm text-slate-400 mb-5 leading-relaxed">{course.description}</p>

                {/* Hours & Duration Info */}
                <div className="flex items-center gap-4 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl mb-5 border border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-red-400" />
                    <span>{course.hours}</span>
                  </div>
                </div>

                {/* Features list */}
                <ul className="space-y-2 text-xs text-slate-300 mb-6">
                  {course.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price & Action */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-400">{course.price} ج.م</span>
                    {course.oldPrice && (
                      <span className="text-xs text-slate-500 line-through">{course.oldPrice} ج.م</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">يلزم تسجيل الدخول للحجز</span>
                </div>

                <button
                  onClick={() => handleEnrollClick(course)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all transform hover:scale-105"
                >
                  {!isAuthenticated && <Lock className="w-3.5 h-3.5 text-amber-300" />}
                  <span>{isAuthenticated ? 'سجل الآن' : 'دخول وحجز'}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
