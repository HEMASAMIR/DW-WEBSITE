'use client';

import React, { useState } from 'react';
import { PAYMENT_INFO } from '@/constants/siteContent';
import { Wallet, Zap, Copy, Check, Send, ShieldCheck } from 'lucide-react';

const METHOD_STYLE = {
  wallet: { icon: Wallet, tile: 'from-red-500 to-rose-600 shadow-rose-500/30', ring: 'border-rose-200 bg-rose-50/60' },
  instapay: { icon: Zap, tile: 'from-violet-500 to-indigo-600 shadow-violet-500/30', ring: 'border-violet-200 bg-violet-50/60' },
};

/**
 * Payment methods card (wallet + InstaPay) with the transfer number and a copy button.
 * `amount` (already formatted) is optional; `compact` hides the steps.
 */
export default function PaymentInfo({ amount, compact = false, className = '' }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_INFO.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the number is still visible */
    }
  };

  return (
    <div className={`rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-900/[0.05] overflow-hidden text-slate-900 ${className}`}>
      <div className="flex h-1" dir="ltr">
        <span className="flex-1 bg-slate-900" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-black text-base sm:text-lg text-[#0e2c4e]">طرق الدفع</h4>
          {amount && (
            <span className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm font-black">
              المبلغ: <span dir="ltr">{amount}</span> ج.م
            </span>
          )}
        </div>

        {/* Methods */}
        <div className="grid grid-cols-2 gap-3">
          {PAYMENT_INFO.methods.map((m) => {
            const s = METHOD_STYLE[m.id] || METHOD_STYLE.wallet;
            const Icon = s.icon;
            return (
              <div key={m.id} className={`group rounded-2xl border p-3.5 flex flex-col items-center text-center gap-2 ${s.ring}`}>
                <span className={`dw-wiggle w-11 h-11 rounded-xl bg-gradient-to-br ${s.tile} text-white flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-sm font-black">{m.label}</span>
                <span className="text-[11px] text-slate-500 font-semibold leading-snug">{m.hint}</span>
              </div>
            );
          })}
        </div>

        {/* Number */}
        <div className="rounded-2xl bg-[#0e2c4e] text-white p-4 flex items-center justify-between gap-3">
          <div>
            <span className="block text-[11px] text-teal-200 font-bold mb-0.5">حوّل على الرقم</span>
            <span className="text-2xl sm:text-3xl font-black tracking-wider" dir="ltr">{PAYMENT_INFO.number}</span>
          </div>
          <button
            type="button"
            onClick={copy}
            className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-colors ${
              copied ? 'bg-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20 border border-white/20'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'اتنسخ' : 'نسخ الرقم'}
          </button>
        </div>

        {!compact && (
          <ol className="space-y-2.5">
            {[
              'حوّل المبلغ على الرقم بفودافون كاش أو إنستا باي.',
              'ابعت طلبك وصورة التحويل على واتساب من الزرار اللي تحت.',
              'بعد تأكيد الدفع هيتفعّل على حسابك في الموقع.',
            ].map((step, i) => (
              <li key={step} className="flex items-start gap-3 text-sm text-slate-600 font-semibold">
                <span className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-black flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="leading-relaxed pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        )}

        {compact && (
          <p className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <Send className="w-3.5 h-3.5 text-emerald-600" />
            بعد التحويل ابعت صورة التحويل على واتساب لتفعيل حسابك.
          </p>
        )}

        <p className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          التفعيل بيتم يدوياً من الإدارة بعد مراجعة التحويل.
        </p>
      </div>
    </div>
  );
}
