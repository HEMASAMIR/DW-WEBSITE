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
                  {/* gradient frame */}
                  <div
                    className={`group relative rounded-[2rem] p-[2px] bg-gradient-to-br ${tone.edge} shadow-xl shadow-slate-900/[0.06] hover:shadow-2xl ${tone.shadow} hover:-translate-y-2 transition-all duration-500`}
                  >
                  <div className="dw-shine relative h-full overflow-hidden rounded-[calc(2rem-2px)] bg-white flex flex-col">
                    {/* Header band */}
                    <div className={`relative h-40 bg-gradient-to-br ${tone.badge} overflow-hidden`}>
                      <div
                        className="absolute inset-0 opacity-25"
                        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1.5px)', backgroundSize: '14px 14px' }}
                      />
                      <span className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/15 group-hover:scale-125 transition-transform duration-700" />
                      <span className="absolute top-8 left-16 w-16 h-16 rounded-full border-2 border-white/30 group-hover:translate-x-3 group-hover:-translate-y-2 transition-transform duration-700" />
                      <span className="absolute -bottom-12 right-10 w-28 h-28 rounded-full bg-black/10 group-hover:scale-110 transition-transform duration-700" />

                      <div className="relative h-full flex items-end justify-between p-5">
                        <div className="text-white">
                          <span className="block text-[11px] font-black tracking-[0.2em] text-white/80 mb-1">المستوى</span>
                          <span
                            className="block text-6xl font-black leading-none tracking-tight drop-shadow-[0_6px_16px_rgba(0,0,0,0.18)] group-hover:scale-110 origin-bottom-right transition-transform duration-500"
                            dir="ltr"
                          >
                            {course.code}
                          </span>
                        </div>
                        <span className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur border border-white/30 text-white flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                          <PlayCircle className="w-6 h-6" />
                        </span>
                      </div>

                      {course.hasAccess && (
                        <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[11px] font-black bg-white text-emerald-700 flex items-center gap-1 shadow-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          مفعّل لك
                        </span>
                      )}
                      {/* curved bottom */}
                      <svg className="absolute -bottom-px inset-x-0 w-full h-6 text-white" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden>
                        <path d="M0 24 C 120 0, 280 0, 400 24 Z" fill="currentColor" />
                      </svg>
                    </div>

                    <div className="relative flex-1 flex flex-col px-6 pb-6 pt-3">
                      <Link href={`/courses/${course.id}`}>
                        <h3 className="text-xl font-black text-[#0e2c4e] leading-snug" dir="auto">{course.title}</h3>
                      </Link>
                      <span className={`block h-1 w-10 rounded-full mt-3 ${tone.bar} group-hover:w-20 transition-all duration-500`} />
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

                      {price !== null && !course.hasAccess && (
                        <div className="mt-6 flex items-center justify-between gap-2 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                          <span className="text-xs font-black text-slate-500">سعر المستوى</span>
                          <span className="flex items-baseline gap-1.5 flex-wrap justify-end">
                            {oldPrice && <span className="text-xs text-slate-400 line-through" dir="ltr">{oldPrice}</span>}
                            <span className={`text-2xl font-black tracking-tight ${tone.price}`} dir="ltr">{price}</span>
                            <span className="text-xs font-black text-slate-500">ج.م</span>
                          </span>
                        </div>
                      )}
                      {oldPrice && !course.hasAccess && (
                        <span className="self-start mt-2 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">خصم {discount}%</span>
                      )}

                      <div className="space-y-2 mt-4">
                        <Link
                          href={`/courses/${course.id}`}
                          className={`w-full py-3.5 px-4 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center justify-between gap-2 shadow-lg transition-all ${course.hasAccess ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25' : tone.btn}`}
                        >
                          <span className="flex items-center gap-2">
                            <PlayCircle className="w-4 h-4" />
                            {course.hasAccess ? 'ادخل للمحاضرات' : 'تفاصيل المستوى'}
                          </span>
                          <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                            <ArrowLeft className="w-4 h-4" />
                          </span>
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
