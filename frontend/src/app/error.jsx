'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Log error for diagnostics
    console.error('[AppError]', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50 text-slate-900 select-none" dir="rtl">
      <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-3xl p-8 text-center shadow-xl shadow-slate-900/[0.04] space-y-6">
        <div className="mx-auto w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-inner">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-[#0e2c4e]">
            حدث خطأ أثناء تحميل الصفحة
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            تم تسجيل الخطأ تلقائياً. يمكنك الضغط على إعادة المحاولة أو العودة إلى الصفحة الرئيسية.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset ? reset() : window.location.reload()}
            className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-sm shadow-md shadow-teal-600/20 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة المحاولة</span>
          </button>

          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm transition-colors border border-slate-200/80"
          >
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
