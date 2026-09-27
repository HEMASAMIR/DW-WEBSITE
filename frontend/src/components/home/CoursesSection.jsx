'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCourses } from '@/hooks/useCourses';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatPriceLatin } from '@/services/courses.service';
import { toneFor } from '@/constants/levelTones';
import Reveal from '@/components/common/Reveal';
import {
  CheckCircle2,
  ArrowLeft,
  Lock,
  PlayCircle,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

export default function CoursesSection() {
  const { courses, allCourses, loading, error, requiresLogin, reload, activeTab, setActiveTab } = useCourses();
  const { openEnrollModal, openAuthModal, openLoginPromptModal } = useModal();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const tabs = [
    { key: 'ALL', label: 'جميع المستويات' },
    ...allCourses.map((c) => ({ key: c.code, label: `المستوى ${c.code}` })),
  ];

  const handleAction = (course) => {
    if (!isAuthenticated) {
      openLoginPromptModal({ type: 'course', title: course.title, price: formatPrice(course.price), item: course });
      return;
    }
    if (course.hasAccess) {
      router.push(`/courses/${course.id}`);
      return;
    }
    openEnrollModal(course);
  };

  return (
    <section id="online-courses" className="py-24 bg-white border-t border-slate-200 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <Reveal className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-4 py-1.5 rounded-full text-xs font-black text-[#0e2c4e]">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>برامج التأسيس والتأهيل الأكاديمي</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0e2c4e]">
            الكورسات الأونلاين{' '}
            {allCourses.length > 0 && (
              <span className="text-teal-600" dir="ltr">
                ({allCourses[0].code} - {allCourses[allCourses.length - 1].code})
              </span>
            )}
          </h2>
          <div className="flex h-1.5 w-24 mx-auto rounded-full overflow-hidden" dir="ltr">
            <span className="flex-1 bg-slate-900" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
          </div>
          <p className="text-slate-600 text-sm sm:text-base">
            محاضرات مسجلة بجودة عالية، ملفات PDF لكل مستوى، ومناقشة مباشرة على كل محاضرة.
          </p>

          {allCourses.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 pt-3">
              {tabs.map((t, i) => {
                const active = activeTab === t.key;
                const tone = t.key === 'ALL' ? null : toneFor(t.key, i - 1);
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`px-5 py-2 rounded-full text-xs font-black border transition-all duration-300 ${
                      active
                        ? tone ? `${tone.btn} text-white border-transparent shadow-lg` : 'bg-[#0e2c4e] text-white border-transparent shadow-lg'
                        : tone ? `${tone.btnSoft}` : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          )}
        </Reveal>

        {/* Loading skeleton */}
        {loading && courses.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-[2rem] border border-slate-200 p-6 space-y-4 animate-pulse">
                <div className="w-14 h-14 rounded-2xl bg-slate-200" />
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-8 bg-slate-200 rounded-full w-1/2 mt-6" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && courses.length === 0 && (
          <div className="max-w-md mx-auto text-center bg-rose-50 border border-rose-200 rounded-3xl p-8 space-y-4">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-sm text-rose-700 font-semibold">{error}</p>
            <button onClick={reload} className="inline-flex items-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-full text-xs font-black">
              <RefreshCw className="w-4 h-4" />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        )}

        {!loading && requiresLogin && (
          <div className="max-w-md mx-auto text-center bg-teal-50 border border-teal-200 rounded-3xl p-8 space-y-4">
            <Lock className="w-10 h-10 text-teal-600 mx-auto" />
            <p className="text-sm text-teal-900 font-semibold">سجّل الدخول أو أنشئ حساباً مجانياً لعرض المستويات والأسعار.</p>
            <button onClick={() => openAuthModal('register')} className="inline-flex items-center gap-2 bg-[#0e2c4e] text-white px-5 py-2.5 rounded-full text-xs font-black">
              <span>إنشاء حساب / دخول</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {!loading && !error && !requiresLogin && allCourses.length === 0 && (
          <p className="text-center text-sm text-slate-500">لا توجد مستويات متاحة حالياً.</p>
        )}

        {/* Courses grid */}
        {courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, idx) => {
              const tone = toneFor(course.code, idx);
              const price = formatPriceLatin(course.price);
              const oldPrice = course.oldPrice && course.oldPrice > (course.price || 0) ? formatPriceLatin(course.oldPrice) : null;
              const discount = oldPrice ? Math.round((1 - course.price / course.oldPrice) * 100) : 0;

              return (
                <Reveal key={course.id} delay={(idx % 4) * 130} className="h-full [&>*]:h-full">
                  <div
                    className={`dw-shine group relative overflow-hidden rounded-[2rem] bg-gradient-to-b ${tone.soft} border ${tone.border} shadow-lg shadow-slate-900/[0.04] hover:shadow-2xl ${tone.shadow} hover:-translate-y-2 transition-all duration-500 flex flex-col`}
                  >
                    {/* decoration */}
                    <span className={`absolute top-0 right-0 h-1.5 w-1/3 rounded-bl-full ${tone.bar} group-hover:w-full transition-all duration-700`} />
                    <span className={`absolute -top-16 -left-16 w-48 h-48 rounded-full ${tone.glow} blur-2xl group-hover:scale-150 transition-transform duration-700`} />
                    <span
                      className={`absolute -bottom-8 -left-2 text-[7.5rem] font-black leading-none text-transparent ${tone.stroke} group-hover:-translate-y-3 transition-transform duration-700 select-none`}
                      dir="ltr"
                    >
                      {course.code}
                    </span>

                    <div className="relative flex-1 flex flex-col p-6">
                      <div className="flex items-center justify-between gap-2 mb-5">
                        <span className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tone.badge} text-white font-black text-xl flex items-center justify-center shadow-lg group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500`}>
                          {course.code}
                        </span>
                        {course.hasAccess && (
                          <span className="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500 text-white flex items-center gap-1 shadow-md shadow-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            مفعّل لك
                          </span>
                        )}
                      </div>

                      <Link href={`/courses/${course.id}`}>
                        <h3 className="text-xl font-black text-[#0e2c4e] leading-snug" dir="auto">{course.title}</h3>
                      </Link>
                      {course.subName && <p className={`text-xs font-bold mt-1 ${tone.text}`}>{course.subName}</p>}
                      {course.description && (
                        <p className="text-sm text-slate-600 mt-3 leading-relaxed line-clamp-3" dir="auto">{course.description}</p>
                      )}
                      {course.features.length > 0 && (
                        <ul className="space-y-2 text-xs text-slate-700 mt-4">
                          {course.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${tone.text}`} />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="flex-1" />

                      {price !== null && (
                        <div className="flex items-baseline gap-2 flex-wrap mt-6">
                          <span className={`text-3xl font-black tracking-tight ${tone.price}`} dir="ltr">{price}</span>
                          <span className="text-sm font-black text-slate-500">ج.م</span>
                          {oldPrice && (
                            <>
                              <span className="text-xs text-slate-400 line-through" dir="ltr">{oldPrice}</span>
                              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">خصم {discount}%</span>
                            </>
                          )}
                        </div>
                      )}

                      <div className="space-y-2 mt-5">
                        <Link
                          href={`/courses/${course.id}`}
                          className={`w-full py-3 px-4 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all group-hover:gap-3 ${course.hasAccess ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25' : tone.btn}`}
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>{course.hasAccess ? 'ادخل للمحاضرات' : 'تفاصيل المستوى والمحاضرات'}</span>
                        </Link>

                        {!course.hasAccess && (
                          <button
                            onClick={() => handleAction(course)}
                            className={`w-full py-3 px-4 rounded-2xl border font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors ${tone.btnSoft}`}
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>{isAuthenticated ? 'اشترك في الكورس الآن' : 'اشترك الآن'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
