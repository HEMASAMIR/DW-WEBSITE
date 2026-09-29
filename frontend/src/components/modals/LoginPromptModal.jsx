'use client';

import React from 'react';
import { useModal } from '@/context/ModalContext';
import { Lock, LogIn, UserPlus, X, ShieldAlert, Sparkles, BookOpen, GraduationCap } from 'lucide-react';

import { t, tRich } from '@/lib/i18n';
export default function LoginPromptModal() {
  const { activeModal, modalData, closeModal, openAuthModal } = useModal();

  if (activeModal !== 'loginPrompt') return null;

  const itemTitle = modalData?.name || modalData?.title || t('المحتوى المطلوب');
  const itemPrice = modalData?.price ? t('{price} ج.م', { price: modalData.price }) : null;
  const isBook = modalData?.type === 'book';

  const handleLoginClick = () => {
    openAuthModal('login');
  };

  const handleRegisterClick = () => {
    openAuthModal('register');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn">
      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none -top-10" />
      <div className="absolute w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -bottom-10" />

      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden group">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 end-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-all border border-slate-700/50"
          aria-label={t('إغلاق')}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500/20 via-teal-400/10 to-amber-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-inner">
              <Lock className="w-8 h-8 text-teal-400 animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -start-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('تسجيل الدخول مطلوب')}</span>
          </div>

          <h3 className="text-2xl font-black text-white leading-tight drop-shadow-md">
            {t('يلزم تسجيل الدخول لحسابك')}
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
            {tRich('لإتمام الشراء وتفعيل محتوى <b>{item}</b> على حسابك فوراً، يرجى تسجيل الدخول أولاً أو إنشاء حساب جديد.', { b: (s) => <strong className="text-white">{s}</strong> }, { item: itemTitle })}
          </p>

          {/* Target Item Preview Pill */}
          <div className="w-full bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between text-start">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {isBook ? (
                <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
              ) : (
                <GraduationCap className="w-5 h-5 text-teal-400 shrink-0" />
              )}
              <span className="text-xs font-bold text-slate-200 truncate">{itemTitle}</span>
            </div>
            {itemPrice && (
              <span className="text-xs font-black text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg shrink-0">
                {itemPrice}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleLoginClick}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-black text-sm shadow-lg shadow-teal-950/50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn className="w-4 h-4" />
            <span>{t('تسجيل الدخول الآن')}</span>
          </button>

          <button
            onClick={handleRegisterClick}
            className="w-full py-3.5 px-5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white font-bold text-sm border border-slate-700/80 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
          >
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>{t('إنشاء حساب جديد (مجاناً)')}</span>
          </button>

          <button
            onClick={closeModal}
            className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            {t('إلغاء والعودة')}
          </button>
        </div>
      </div>
    </div>
  );
}
