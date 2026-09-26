'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCourses } from '@/hooks/useCourses';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/services/courses.service';
import {
  CheckCircle2,
  ArrowLeft,
  Lock,
  Unlock,
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
      openLoginPromptModal({
        type: 'course',
        title: course.title,
        price: formatPrice(course.price),
        item: course,
      });
      return;
    }
    if (course.hasAccess) {
      router.push(`/courses/${course.id}`);
      return;
    }
    openEnrollModal(course);
  };

  return (
    <section id="online-courses" className="py-20 bg-white border-t border-slate-200 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full text-xs font-bold">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>برامج التأسيس والتأهيل الأكاديمي</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0f172a]">
            الكورسات الأونلاين{' '}
            {allCourses.length > 0 && (
              <span className="text-gradient-cyan">
                ({allCourses[0].code} - {allCourses[allCourses.length - 1].code})
              </span>
            )}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            محاضرات مسجلة بجودة عالية، ملفات PDF لكل مستوى، ومناقشة مباشرة على كل محاضرة.
          </p>

          {allCourses.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all ${
                    activeTab === t.key ? 'glass-pill-gold' : 'glass-pill'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && courses.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl border border-slate-200 p-6 space-y-4 animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-slate-200" />
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
                <div className="h-8 bg-slate-200 rounded-full w-1/2 mt-6" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && courses.length === 0 && (
          <div className="max-w-md mx-auto text-center bg-rose-50 border border-rose-200 rounded-3xl p-8 space-y-4">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-sm text-rose-700 font-semibold">{error}</p>
            <button
              onClick={reload}
              className="inline-flex items-center gap-2 glass-pill-gold px-5 py-2.5 rounded-full text-xs font-black"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        )}

        {!loading && requiresLogin && (
          <div className="max-w-md mx-auto text-center bg-teal-50 border border-teal-200 rounded-3xl p-8 space-y-4">
            <Lock className="w-10 h-10 text-teal-600 mx-auto" />
            <p className="text-sm text-teal-900 font-semibold">سجّل الدخول أو أنشئ حساباً مجانياً لعرض المستويات والأسعار.</p>
            <button
              onClick={() => openAuthModal('register')}
              className="inline-flex items-center gap-2 glass-pill-gold px-5 py-2.5 rounded-full text-xs font-black"
            >
              <span>إنشاء حساب / دخول</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {!loading && !error && !requiresLogin && allCourses.length === 0 && (
          <p className="text-center text-sm text-slate-500">لا توجد مستويات متاحة حالياً.</p>
        )}

        {/* Courses Grid */}
        {courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => {
              const price = formatPrice(course.price);
              const oldPrice = course.oldPrice && course.oldPrice > (course.price || 0) ? formatPrice(course.oldPrice) : null;
              const discount = oldPrice ? Math.round((1 - course.price / course.oldPrice) * 100) : 0;

              return (
                <div
                  key={course.id}
                  className={`bg-white rounded-3xl p-6 border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                    course.hasAccess ? 'border-emerald-400/60' : 'border-slate-200 hover:border-teal-500/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 gap-2">
                      <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
                        {course.code}
                      </span>
                      {course.hasAccess ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center gap-1">
                          <Unlock className="w-3.5 h-3.5" />
                          مفعّل لك
                        </span>
                      ) : course.badge ? (
                        <span className="glass-pill px-3 py-1 text-[11px] font-bold text-amber-700 border border-amber-500/30 text-center">
                          {course.badge}
                        </span>
                      ) : null}
                    </div>

                    <Link href={`/courses/${course.id}`}>
                      <h3 className="text-lg font-extrabold text-[#0f172a] mb-1 group-hover:text-teal-700 transition-colors">
                        {course.title}
                      </h3>
                    </Link>
                    {course.subName && <p className="text-xs text-amber-700 font-semibold mb-3">{course.subName}</p>}
                    {course.description && (
                      <p className="text-sm text-slate-600 mb-5 leading-relaxed">{course.description}</p>
                    )}

                    {course.features.length > 0 && (
                      <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                        {course.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    {price !== null && (
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-2xl font-black text-[#0d9488]">{price} ج.م</span>
                        {oldPrice && (
                          <>
                            <span className="text-xs text-slate-400 line-through">{oldPrice} ج.م</span>
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                              خصم {discount}%
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Link
                        href={`/courses/${course.id}`}
                        className="w-full py-2.5 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-700/80 shadow-sm"
                      >
                        <PlayCircle className="w-4 h-4 text-amber-400" />
                        <span>{course.hasAccess ? 'ادخل للمحاضرات' : 'تفاصيل المستوى والمحاضرات'}</span>
                      </Link>

                      <button
                        onClick={() => handleAction(course)}
                        className={`w-full px-5 py-2.5 rounded-full text-xs font-black flex items-center justify-center gap-1.5 transition-transform transform hover:scale-[1.02] ${
                          course.hasAccess ? 'glass-pill-active' : 'glass-pill-gold'
                        }`}
                      >
                        {!isAuthenticated ? (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>اشترك الآن</span>
                          </>
                        ) : course.hasAccess ? (
                          <>
                            <Unlock className="w-4 h-4" />
                            <span>الكورس مفعّل لك — ابدأ المشاهدة</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>اشترك في الكورس الآن</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
