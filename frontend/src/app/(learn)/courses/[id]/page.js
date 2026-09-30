'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCourses } from '@/hooks/useCourses';
import { useModal } from '@/context/ModalContext';
import LevelView from '@/components/course/LevelView';
import { ArrowRight, Lock, AlertCircle, RefreshCw, LogIn } from 'lucide-react';

import { t } from '@/lib/i18n';
export default function CoursePage() {
  const { id } = useParams();
  const { allCourses, loading, error, requiresLogin, reload } = useCourses();
  const { openAuthModal } = useModal();

  const level = allCourses.find((c) => String(c.id) === String(id));

  if (level) return <LevelView level={level} levels={allCourses} />;

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-slate-100 to-slate-50 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-48 rounded-[2rem] bg-slate-300/70" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 aspect-video rounded-3xl bg-slate-200" />
              <div className="lg:col-span-4 h-96 rounded-3xl bg-slate-200" />
            </div>
          </div>
        ) : requiresLogin ? (
          <Notice icon={Lock} text={t('سجّل الدخول لعرض تفاصيل المستوى ومحاضراته.')}>
            <button onClick={() => openAuthModal('login')} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-full text-sm font-black">
              <LogIn className="w-4 h-4" />
              {t('تسجيل الدخول')}
            </button>
          </Notice>
        ) : error ? (
          <Notice icon={AlertCircle} text={error}>
            <button onClick={reload} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-full text-sm font-black">
              <RefreshCw className="w-4 h-4" />
              {t('إعادة المحاولة')}
            </button>
          </Notice>
        ) : (
          <Notice icon={AlertCircle} text={t('المستوى غير موجود.')}>
            <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm font-black text-teal-700">
              <ArrowRight className="w-4 h-4 ltr:-scale-x-100" />
              {t('كل المستويات')}
            </Link>
          </Notice>
        )}
      </div>
    </div>
  );
}

function Notice({ icon: Icon, text, children }) {
  return (
    <div className="max-w-md mx-auto text-center bg-white border border-slate-200 rounded-3xl p-10 space-y-4 text-slate-700 shadow-sm">
      <Icon className="w-10 h-10 mx-auto opacity-70" />
      <p className="text-sm font-semibold">{text}</p>
      {children}
    </div>
  );
}
