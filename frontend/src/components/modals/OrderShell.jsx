'use client';

import React from 'react';
import { PAYMENT_INFO } from '@/constants/siteContent';
import { X, CheckCircle2, Wallet, Zap, Store } from 'lucide-react';

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
            className="absolute top-5 left-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative flex items-center gap-4 pl-12">
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

export const PAY_OPTIONS = [
  { value: 'فودافون كاش', label: 'فودافون كاش', icon: Wallet, on: 'border-rose-400 bg-rose-50 text-rose-700' },
  { value: 'إنستا باي', label: 'إنستا باي', icon: Zap, on: 'border-violet-400 bg-violet-50 text-violet-700' },
  { value: 'دفع نقدي بالفرع', label: 'نقدي بالفرع', icon: Store, on: 'border-amber-400 bg-amber-50 text-amber-700' },
];

export function PayMethodPicker({ value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-black text-slate-600 mb-2">طريقة الدفع</label>
      <div className="grid grid-cols-3 gap-2">
        {PAY_OPTIONS.map((o) => {
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
              {o.label}
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

export function SentState({ text, onClose }) {
  return (
    <div className="text-center py-10 space-y-4 max-w-md mx-auto">
      <span className="relative inline-flex">
        <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping" />
        <CheckCircle2 className="relative w-20 h-20 text-emerald-500" />
      </span>
      <h4 className="text-2xl font-black text-[#0e2c4e]">تم تجهيز طلبك على واتساب</h4>
      <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
      <p className="text-sm text-slate-600">
        رقم التحويل: <strong className="text-[#0e2c4e]" dir="ltr">{PAYMENT_INFO.number}</strong>
      </p>
      <button onClick={onClose} className="mt-2 bg-[#0e2c4e] hover:bg-teal-700 text-white font-black text-sm px-8 py-3 rounded-2xl transition-colors">
        تمام
      </button>
    </div>
  );
}
