'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCourses } from '@/hooks/useCourses';
import { useModal } from '@/context/ModalContext';
import { formatPrice } from '@/services/courses.service';
import LevelView from '@/components/course/LevelView';
import { ArrowRight, CheckCircle2, Unlock, Lock, Loader2, AlertCircle, RefreshCw, LogIn } from 'lucide-react';

export default function CoursePage() {
  const { id } = useParams();
  const { allCourses, loading, error, requiresLogin, isGuest, reload } = useCourses();
  const { openAuthModal } = useModal();

  const level = allCourses.find((c) => String(c.id) === String(id));
  const price = level ? formatPrice(level.price) : null;
  const oldPrice = level?.oldPrice && level.oldPrice > (level.price || 0) ? formatPrice(level.oldPrice) : null;

  return (
    <div className="min-h-[70vh] bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-900">
          <ArrowRight className="w-4 h-4" />
          كل المستويات
        </Link>

        {loading && !level ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-9 h-9 text-teal-600 animate-spin" />
          </div>
        ) : requiresLogin ? (
          <Notice icon={Lock} text="سجّل الدخول لعرض تفاصيل المستوى ومحاضراته.">
            <button onClick={() => openAuthModal('login')} className="inline-flex items-center gap-2 glass-pill-gold px-6 py-2.5 rounded-full text-sm font-black">
              <LogIn className="w-4 h-4" />
              تسجيل الدخول
            </button>
          </Notice>
        ) : error ? (
          <Notice icon={AlertCircle} text={error} tone="rose">
            <button onClick={reload} className="inline-flex items-center gap-2 glass-pill-gold px-6 py-2.5 rounded-full text-sm font-black">
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </button>
          </Notice>
        ) : !level ? (
          <Notice icon={AlertCircle} text="المستوى غير موجود." />
        ) : (
          <>
            {/* Level header */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-6">
              <span className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-600 text-white font-black text-3xl flex items-center justify-center shadow-lg shrink-0">
                {level.code}
              </span>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {level.hasAccess ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center gap-1">
                      <Unlock className="w-3.5 h-3.5" /> مفعّل لك
                    </span>
                  ) : isGuest ? null : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-300 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> غير مشترك
                    </span>
                  )}
                  {level.badge && <span className="glass-pill px-3 py-1 text-xs font-bold text-amber-700">{level.badge}</span>}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a]">{level.title}</h1>
                {level.subName && <p className="text-sm text-amber-700 font-semibold">{level.subName}</p>}
                {level.description && <p className="text-sm text-slate-600 leading-relaxed">{level.description}</p>}
                {level.features.length > 0 && (
                  <ul className="flex flex-wrap gap-x-5 gap-y-1.5 pt-1">
                    {level.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {price && (
                <div className="md:text-left shrink-0">
                  <span className="text-3xl font-black text-[#0d9488] block">{price} ج.م</span>
                  {oldPrice && <span className="text-sm text-slate-400 line-through">{oldPrice} ج.م</span>}
                </div>
              )}
            </div>

            <LevelView level={level} />
          </>
        )}
      </div>
    </div>
  );
}

function Notice({ icon: Icon, text, tone = 'teal', children }) {
  const colors = tone === 'rose' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-slate-200 text-slate-700';
  return (
    <div className={`max-w-md mx-auto text-center border rounded-3xl p-10 space-y-4 ${colors}`}>
      <Icon className="w-10 h-10 mx-auto opacity-70" />
      <p className="text-sm font-semibold">{text}</p>
      {children}
    </div>
  );
}
