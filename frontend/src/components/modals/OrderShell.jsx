'use client';

import React from 'react';
import { useContactInfo, activeMethods, CASH_METHOD } from '@/lib/contactInfo';
import { X, CheckCircle2, Wallet, Zap, Landmark, CreditCard, Store } from 'lucide-react';

import { t } from '@/lib/i18n';
/** Shared frame for the subscribe / book-order modals: navy header + two-column body. */
export function OrderShell({ icon: Icon, title, subtitle, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-4xl bg-slate-50 rounded-[2rem] shadow-2xl max-h-[94vh] overflow-y-auto">
        <div className="relative overflow-hidden bg-[#0e2c4e] text-white px-6 sm:px-8 py-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.45),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.25),transparent_55%)]" />
          <div className="absolute top-0 inset-x-0 flex h-1" dir="ltr">
            <span className="flex-1 bg-slate-950" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
          </div>
          <button
            onClick={onClose}
            className="absolute top-5 end-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label={t('إغلاق')}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative flex items-center gap-4 pe-12">
            <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-[#0e2c4e] flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
              <Icon className="w-7 h-7" />
            </span>
            <div className="min-w-0">
              <h3 className="text-xl sm:text-2xl font-black leading-tight">{title}</h3>
              {subtitle && <p className="text-sm text-teal-200 font-bold mt-1 truncate" dir="auto">{subtitle}</p>}
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

const PICKER_STYLE = {
  wallet: { icon: Wallet, on: 'border-rose-400 bg-rose-50 text-rose-700' },
  instapay: { icon: Zap, on: 'border-violet-400 bg-violet-50 text-violet-700' },
  bank: { icon: Landmark, on: 'border-sky-400 bg-sky-50 text-sky-700' },
  other: { icon: CreditCard, on: 'border-teal-400 bg-teal-50 text-teal-700' },
};

/** Payment choices from the admin's contact & payment settings (+ cash at a branch when allowed). */
export function usePayOptions() {
  const info = useContactInfo();
  const options = activeMethods(info).map((m) => ({ value: m.label, label: m.label, ...(PICKER_STYLE[m.type] || PICKER_STYLE.other) }));
  if (info.payment?.cash_at_branch !== false) {
    options.push({ value: CASH_METHOD, label: t('نقدي بالفرع'), icon: Store, on: 'border-amber-400 bg-amber-50 text-amber-700' });
  }
  return options;
}

export function PayMethodPicker({ value, onChange }) {
  const options = usePayOptions();
  return (
    <div>
      <label className="block text-xs font-black text-slate-600 mb-2">{t('طريقة الدفع')}</label>
      <div className={`grid gap-2 ${options.length >= 3 ? 'grid-cols-3' : options.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {options.map((o) => {
          const Icon = o.icon;
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 text-xs font-black transition-all ${
                active ? `${o.on} shadow-md` : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              {t(o.label)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-black text-slate-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export const inputCls =
  'w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-teal-500 transition-colors';

export function SentState({ text, onClose, title = t('تم تجهيز طلبك على واتساب'), showNumber = true, number }) {
  const info = useContactInfo();
  const transferNumber = number || activeMethods(info)[0]?.number;
  return (
    <div className="text-center py-10 space-y-4 max-w-md mx-auto">
      <span className="relative inline-flex">
        <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping" />
        <CheckCircle2 className="relative w-20 h-20 text-emerald-500" />
      </span>
      <h4 className="text-2xl font-black text-[#0e2c4e]">{title}</h4>
      <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
      {showNumber && transferNumber && (
        <p className="text-sm text-slate-600">
          {t('رقم التحويل:')} <strong className="text-[#0e2c4e]" dir="ltr">{transferNumber}</strong>
        </p>
      )}
      <button onClick={onClose} className="mt-2 bg-[#0e2c4e] hover:bg-teal-700 text-white font-black text-sm px-8 py-3 rounded-2xl transition-colors">
        {t('تمام')}
      </button>
    </div>
  );
}
