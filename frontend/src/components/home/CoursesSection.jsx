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
  Clock,
  Video,
  FileText,
  Flame,
  Award,
  Users
} from 'lucide-react';

const LEVEL_THEMES = {
  A1: {
    gradient: 'from-teal-500/10 via-amber-500/5 to-white',
    badgeBg: 'bg-gradient-to-tr from-teal-600 to-emerald-600 text-white',
    borderHover: 'hover:border-teal-400',
    seats: 4,
    germanTag: 'Grundstufe (A1) • للمبتدئين من الصفر',
    perks: ['تأسيس صوتي متقن ومخارج الحروف الألمانية', 'تكوين الجمل والمحادثات اليومية البسيطة', 'محاضرات Live وتدريب عملي على امتحانات A1']
  },
  A2: {
    gradient: 'from-sky-500/10 via-blue-500/5 to-white',
    badgeBg: 'bg-gradient-to-tr from-sky-600 to-blue-700 text-white',
    borderHover: 'hover:border-sky-400',
    seats: 3,
    germanTag: 'Aufbaukurs (A2) • المحادثة والقواعد',
    perks: ['إتقان زمن الماضي والتفريق بين الأفعال', 'كتابة الإيميلات والرسائل الرسمية باحترافية', 'تطوير الطلاقة والتحدث في مواقف الحياة اليومية']
  },
  B1: {
    gradient: 'from-amber-500/10 via-teal-500/5 to-white',
    badgeBg: 'bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950',
    borderHover: 'hover:border-amber-400',
    seats: 2,
    germanTag: 'Mittelstufe (B1) • مؤهل السفر والكول سنتر',
    perks: ['أسرار اجتياز امتحان Goethe / TELC B1 الدولي', 'التأهيل لمقابلات شركات الكول سنتر والـ BPO', 'قواعد B1 المتقدمة والمناظرات والنقاشات الحية']
  },
  B2: {
    gradient: 'from-purple-500/10 via-indigo-500/5 to-white',
    badgeBg: 'bg-gradient-to-tr from-purple-600 to-indigo-700 text-white',
    borderHover: 'hover:border-purple-400',
    seats: 5,
    germanTag: 'Oberstufe (B2) • الطلاقة والألماني الطبي',
    perks: ['مصطلحات Fachsprache Medizin للأطباء والتمريض', 'التفاوض واللغة الألمانية الرفيعة للشركات', 'اجتياز امتحانات B2 والطلاقة التامة بيئة العمل']
  },
  C1: {
    gradient: 'from-amber-500/15 via-rose-500/10 to-white',
    badgeBg: 'bg-gradient-to-tr from-amber-500 via-rose-600 to-amber-600 text-white shadow-amber-500/30',
    borderHover: 'hover:border-amber-400',
    seats: null,
    isComingSoon: true,
    germanTag: 'Fachstufe (C1) • قمة الاحتراف والطلاقة الأكاديمية',
    perks: [
      'الطلاقة التلقائية والتعبير كمتحدث ألماني أصلي (Native Speaker)',
      'المصطلحات التخصصية للأطباء، المهندسين والباحثين وسوق العمل بألمانيا',
      'تأهيل لامتحانات Goethe C1 & Telc C1 Hochschule للأبحاث والجامعات'
    ]
  }
};

export default function CoursesSection() {
  const { courses, allCourses, loading, error, requiresLogin, reload, activeTab, setActiveTab } = useCourses();
  const { openEnrollModal, openAuthModal, openLoginPromptModal } = useModal();
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();

  const tabs = [
    { key: 'ALL', label: 'جميع المستويات' },
    ...allCourses.map((c) => ({ key: c.code, label: `المستوى ${c.code}` })),
    ...(!allCourses.some((c) => c.code === 'C1') ? [{ key: 'C1', label: 'المستوى C1 (قريباً 🚀)' }] : []),
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
    if (course.hasAccess || isAdmin) {
      router.push(`/courses/${course.id}`);
      return;
    }
    openEnrollModal(course);
  };

  return (
    <section id="online-courses" className="py-24 bg-gradient-to-b from-white via-slate-50 to-white border-t border-slate-200/80 relative z-10 overflow-hidden">
      
      {/* Background Lighting Orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-teal-500/15 via-amber-500/15 to-teal-500/15 border border-teal-500/30 text-teal-800 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>برامج التأسيس والتأهيل الأكاديمي المعتمد</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            الكورسات الأونلاين{' '}
            <span className="bg-gradient-to-r from-teal-600 via-sky-600 to-amber-600 bg-clip-text text-transparent">
              (A1 - C1)
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium max-w-2xl mx-auto">
            محاضرات تفاعلية لايف عبر Zoom، تسجيلات فيديو بجودة عالية، ملفات تدريب PDF لكل مستوى، ومناقشة ومتابعة يومية مع هير خالد.
          </p>

          {/* Quick Filter Tabs */}
          {allCourses.length > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2.5 pt-4">
              {tabs.map((t) => {
                const isActive = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all duration-300 transform active:scale-95 shadow-xs cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-teal-500/25 shadow-md scale-105'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-teal-400'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && courses.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 animate-pulse shadow-md">
                <div className="w-14 h-14 rounded-2xl bg-slate-200" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-10 bg-slate-200 rounded-2xl mt-6" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && courses.length === 0 && (
          <div className="max-w-md mx-auto text-center bg-rose-50 border border-rose-200 rounded-3xl p-8 space-y-4 shadow-lg">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-sm text-rose-700 font-semibold">{error}</p>
            <button
              onClick={reload}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-600 text-white text-xs font-black shadow-md hover:bg-rose-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        )}

        {/* Requires Login */}
        {!loading && requiresLogin && (
          <div className="max-w-md mx-auto text-center bg-teal-50 border border-teal-200 rounded-3xl p-8 space-y-4 shadow-lg">
            <Lock className="w-10 h-10 text-teal-600 mx-auto" />
            <p className="text-sm text-teal-900 font-semibold">سجّل الدخول أو أنشئ حساباً مجانياً لعرض المستويات والأسعار.</p>
            <button
              onClick={() => openAuthModal('register')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-teal-600 text-white text-xs font-black shadow-md hover:bg-teal-700 transition-colors"
            >
              <span>إنشاء حساب / دخول</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {!loading && !error && !requiresLogin && allCourses.length === 0 && (
          <p className="text-center text-sm text-slate-500 py-12">لا توجد مستويات متاحة حالياً.</p>
        )}

        {/* Courses Grid */}
        {courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => {
              const price = formatPrice(course.price);
              const oldPrice = course.oldPrice && course.oldPrice > (course.price || 0) ? formatPrice(course.oldPrice) : null;
              const discount = oldPrice ? Math.round((1 - course.price / course.oldPrice) * 100) : 0;
              const theme = LEVEL_THEMES[course.code] || LEVEL_THEMES.A1;
              const perks = theme.perks || course.features || [];
              const hasAccess = course.hasAccess || isAdmin;

              return (
                <div
                  key={course.id}
                  className={`group relative rounded-3xl bg-gradient-to-br ${theme.gradient} backdrop-blur-xl border border-slate-200/90 ${theme.borderHover} p-6 sm:p-7 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between overflow-hidden`}
                >
                  
                  <div>
                    {/* Top Row: Level Code Emblem + Seats Badge */}
                    <div className="flex items-center justify-between mb-5 gap-2">
                      <span className={`w-14 h-14 rounded-2xl ${theme.badgeBg} font-black text-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0`}>
                        {course.code}
                      </span>

                      {hasAccess ? (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-xs">
                          <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{isAdmin ? 'متاح بالكامل (أدمن) 👑' : 'مفعّل بحسابك ✅'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-amber-50 text-amber-900 border border-amber-300/80 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          <span>متبقي {theme.seats} مقاعد فقط 🔥</span>
                        </span>
                      )}
                    </div>

                    {/* Title & German Subtitle */}
                    <div className="space-y-1 mb-4">
                      <Link href={`/courses/${course.id}`}>
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                          {course.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-amber-700 font-extrabold flex items-center gap-1 font-mono">
                        <span>{theme.germanTag}</span>
                      </p>
                    </div>

                    {/* Short Description */}
                    {course.description && (
                      <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed font-medium line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-4 border-t border-slate-200/80 space-y-3 mt-auto">
                    
                    {/* Price Tag */}
                    {price !== null && (
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">
                            {price} <small className="text-xs font-sans text-slate-600">ج.م</small>
                          </span>
                          {oldPrice && (
                            <span className="text-xs text-slate-400 line-through font-mono">{oldPrice} ج.م</span>
                          )}
                        </div>
                        {oldPrice && discount > 0 && (
                          <span className="text-[10px] font-black text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full">
                            خصم {discount}%
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Link
                        href={`/courses/${course.id}`}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-black text-xs flex items-center justify-center gap-2 transition-all border border-slate-700/80 shadow-xs"
                      >
                        <PlayCircle className="w-4 h-4 text-amber-400" />
                        <span>{hasAccess ? 'ادخل للمحاضرات' : 'تفاصيل المستوى والمحاضرات'}</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleAction(course)}
                        className={`w-full relative group/btn py-3 px-5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-md overflow-hidden cursor-pointer ${
                          hasAccess
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/25'
                            : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25'
                        }`}
                      >
                        {!hasAccess && (
                          <span className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-12 -translate-x-full group-hover/btn:translate-x-[300%] transition-transform duration-1000 ease-in-out" />
                        )}

                        {!isAuthenticated ? (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>اشترك في كورس {course.code}</span>
                          </>
                        ) : hasAccess ? (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            <span>{isAdmin ? 'دخول كامل للمحاضرات (أدمن) 👑' : 'الكورس مفعّل لك — ابدأ المشاهدة'}</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>اشترك في كورس {course.code}</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}

            {/* C1 Upcoming Flagship Level Card */}
            {(activeTab === 'ALL' || activeTab === 'C1') && (
              <div className="group relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 backdrop-blur-xl border-2 border-dashed border-amber-400/60 p-6 sm:p-7 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between overflow-hidden">
                {/* Luminous Glow Ambient Light */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/15 rounded-full blur-3xl pointer-events-none -z-10 group-hover:bg-amber-400/25 transition-all" />

                <div>
                  {/* Top Row: Level Code Emblem + Coming Soon Badge */}
                  <div className="flex items-center justify-between mb-5 gap-2">
                    <span className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-600 to-amber-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0">
                      C1
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.25)]">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      <span>🚀 قريباً جداً • Demnächst</span>
                    </span>
                  </div>

                  {/* Title & German Subtitle */}
                  <div className="space-y-1 mb-4">
                    <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                      كورس اللغة الألمانية - المستوى المتقدم C1
                    </h3>
                    <p className="text-xs text-amber-300 font-extrabold flex items-center gap-1 font-mono">
                      <span>Fachstufe (C1) • قمة الطلاقة والألماني المتقدم</span>
                    </p>
                  </div>

                  {/* Slick Captivating Slogan (جملة رايقة أوي) */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-400/30 mb-4 text-xs text-amber-100 font-medium leading-relaxed shadow-inner">
                    « سقف الطلاقة وقمة الاحتراف اللغوي 🇩🇪 — قريباً رحلتك لاجتياز أعقد النقاشات، الأبحاث والمناصب القيادية وسوق العمل المتقدم في ألمانيا بطلاقة المتحدث الأصلي! »
                  </div>
                </div>

                {/* Bottom Action: Waitlist Button */}
                <div className="pt-4 border-t border-slate-800 space-y-3 mt-auto">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300">يتم التجهيز والتصوير حالياً ⏳</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">VIP الدفعة الأولى</span>
                  </div>

                  <a
                    href={`https://wa.me/2010552287454?text=${encodeURIComponent('مرحباً هير خالد، أود تسجيل اسمي في قائمة الانتظار لكورس C1 وحجز الأولوية في أول دفعة فور انطلاقها.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full relative group/btn py-3 px-5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>انضم لقائمة الانتظار وحجز الأولوية 🔔</span>
                  </a>
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
