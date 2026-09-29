'use client';

import React, { useState } from 'react';
import { useContactInfo, activeMethods } from '@/lib/contactInfo';
import { Wallet, Zap, Landmark, CreditCard, Store, Copy, Check, Send, ShieldCheck } from 'lucide-react';

export const METHOD_STYLE = {
  wallet: { icon: Wallet, tile: 'from-red-500 to-rose-600 shadow-rose-500/30', ring: 'border-rose-200 bg-rose-50/60' },
  instapay: { icon: Zap, tile: 'from-violet-500 to-indigo-600 shadow-violet-500/30', ring: 'border-violet-200 bg-violet-50/60' },
  bank: { icon: Landmark, tile: 'from-sky-500 to-blue-600 shadow-sky-500/30', ring: 'border-sky-200 bg-sky-50/60' },
  other: { icon: CreditCard, tile: 'from-teal-500 to-emerald-600 shadow-teal-500/30', ring: 'border-teal-200 bg-teal-50/60' },
};

const BADGE_TONE = { wallet: 'text-rose-300', instapay: 'text-violet-300', bank: 'text-sky-300', other: 'text-teal-300' };

/** The active payment methods as small inline labels (for dark banners). */
export function PayMethodBadges() {
  const info = useContactInfo();
  return (
    <>
      {activeMethods(info).map((m) => {
        const Icon = (METHOD_STYLE[m.type] || METHOD_STYLE.other).icon;
        return (
          <span key={m.id} className="inline-flex items-center gap-1.5">
            <Icon className={`w-3.5 h-3.5 ${BADGE_TONE[m.type] || BADGE_TONE.other}`} /> {m.label}
          </span>
        );
      })}
      {info.payment?.cash_at_branch !== false && (
        <span className="inline-flex items-center gap-1.5"><Store className="w-3.5 h-3.5 text-amber-300" /> نقدي في الفرع</span>
      )}
    </>
  );
}

/**
 * Payment methods card (as set in the admin dashboard) with the transfer numbers and copy buttons.
 * `amount` (already formatted) is optional; `compact` hides the steps; `info` overrides the saved
 * contact info (the dashboard's live preview).
 */
export default function PaymentInfo({ amount, compact = false, className = '', info: override }) {
  const saved = useContactInfo();
  const info = override || saved;
  const methods = activeMethods(info);
  const cash = info.payment?.cash_at_branch !== false;
  const [copied, setCopied] = useState(null);

  // One number block per distinct number, naming its methods when there's more than one number.
  const numbers = methods.reduce((acc, m) => {
    const hit = acc.find((n) => n.number === m.number);
    if (hit) hit.labels.push(m.label);
    else acc.push({ number: m.number, labels: [m.label] });
    return acc;
  }, []);

  const copy = async (number) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(number);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard blocked — the number is still visible */
    }
  };

  const labels = methods.map((m) => m.label);
  const howTo = labels.length
    ? `حوّل المبلغ بـ ${labels.join(' أو ')}${cash ? '، أو ادفع نقدي في الفرع' : ''}.`
    : 'ادفع المبلغ نقدي في أقرب فرع.';

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
        {(methods.length > 0 || cash) && (
          <div className={`grid gap-3 ${methods.length + (cash ? 1 : 0) > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {methods.map((m) => {
              const s = METHOD_STYLE[m.type] || METHOD_STYLE.other;
              const Icon = s.icon;
              return (
                <div key={m.id} className={`group rounded-2xl border p-3.5 flex flex-col items-center text-center gap-2 ${s.ring}`}>
                  <span className={`dw-wiggle w-11 h-11 rounded-xl bg-gradient-to-br ${s.tile} text-white flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-sm font-black">{m.label}</span>
                  {m.hint && <span className="text-[11px] text-slate-500 font-semibold leading-snug">{m.hint}</span>}
                </div>
              );
            })}
            {cash && (
              <div className="group rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 flex flex-col items-center text-center gap-2">
                <span className="dw-wiggle w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Store className="w-5 h-5" />
                </span>
                <span className="text-sm font-black">نقدي في الفرع</span>
                <span className="text-[11px] text-slate-500 font-semibold leading-snug">ادفع في أي فرع من فروعنا</span>
              </div>
            )}
          </div>
        )}

        {/* Numbers */}
        {numbers.map((n) => (
          <div key={n.number} className="rounded-2xl bg-[#0e2c4e] text-white p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="block text-[11px] text-teal-200 font-bold mb-0.5">
                حوّل على الرقم{numbers.length > 1 ? ` (${n.labels.join(' / ')})` : ''}
              </span>
              <span className={`block font-black break-all ${n.number.length > 14 ? 'text-lg sm:text-xl tracking-wide' : 'text-2xl sm:text-3xl tracking-wider'}`} dir="ltr">{n.number}</span>
            </div>
            <button
              type="button"
              onClick={() => copy(n.number)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-colors ${
                copied === n.number ? 'bg-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20 border border-white/20'
              }`}
            >
              {copied === n.number ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied === n.number ? 'اتنسخ' : 'نسخ الرقم'}
            </button>
          </div>
        ))}

        {!compact && (
          <ol className="space-y-2.5">
            {[
              howTo,
              'ابعت طلب الاشتراك من الموقع وارفع معاه صورة التحويل.',
              'أول ما الإدارة تقبل الطلب هيتفعّل على حسابك فوراً.',
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
            بعد التحويل ابعت الطلب وارفع صورة التحويل من الفورم.
          </p>
        )}

        <p className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          التفعيل بيتم من الإدارة بعد مراجعة التحويل، وبيظهرلك على طول.
        </p>
      </div>
    </div>
  );
}
