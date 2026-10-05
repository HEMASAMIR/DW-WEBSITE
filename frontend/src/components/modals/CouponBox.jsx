'use client';

import React, { useEffect, useState } from 'react';
import { couponsService } from '@/services/requests.service';
import { getErrorMessage } from '@/services/api';
import { Ticket, Loader2, X, Check, Sparkles, AlertCircle } from 'lucide-react';

import { t } from '@/lib/i18n';

const egp = (n) => Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });

/**
 * "Got a coupon?" inside the subscribe form. Each student has one coupon, ever — if it's used,
 * this shows that instead of the field. applied = the check result ({ code, discount, final, … }) or null.
 */
export default function CouponBox({ kind, itemId, applied, onChange }) {
  const [used, setUsed] = useState(undefined); // undefined = loading, null = free, object = used
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(0);

  useEffect(() => {
    let cancelled = false;
    couponsService.mine()
      .then((d) => !cancelled && setUsed(d?.used || null))
      .catch(() => !cancelled && setUsed(null));
    return () => { cancelled = true; };
  }, []);

  const apply = async () => {
    if (!code.trim()) return;
    setChecking(true);
    setError('');
    try {
      onChange(await couponsService.check(code.trim(), kind, itemId));
    } catch (err) {
      setError(getErrorMessage(err, t('تعذر التحقق من الكوبون، حاول تاني.')));
      setShake((n) => n + 1);
    } finally {
      setChecking(false);
    }
  };

  if (used === undefined) return null;

  // The student's one coupon is already used.
  if (used) {
    return (
      <div className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3">
        <span className="w-9 h-9 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
          <Ticket className="w-4 h-4" />
        </span>
        <p className="text-xs font-bold text-slate-600 leading-relaxed">
          {t('استخدمت الكوبون بتاعك قبل كده')}{' '}
          <span className="font-black text-slate-800" dir="ltr">{used.code}</span>
          <span className="block text-[11px] text-slate-400 mt-0.5">{t('كل طالب ليه كوبون خصم واحد بس.')}</span>
        </p>
      </div>
    );
  }

  // Applied: a little ticket with the saving.
  if (applied) {
    return (
      <div className="dw-pop relative overflow-hidden rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50">
        <span className="absolute top-1/2 -translate-y-1/2 -start-2.5 w-5 h-5 rounded-full bg-white border-2 border-emerald-300" />
        <span className="absolute top-1/2 -translate-y-1/2 -end-2.5 w-5 h-5 rounded-full bg-white border-2 border-emerald-300" />
        <div className="flex items-center gap-3 px-5 py-3.5">
          <span className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
            <Ticket className="w-5 h-5" />
            <span className="absolute -bottom-1 -end-1 w-5 h-5 rounded-full bg-amber-400 ring-2 ring-white flex items-center justify-center">
              <Check className="w-3 h-3 text-slate-950" strokeWidth={3.5} />
            </span>
          </span>
          <div className="flex-1 min-w-0">
            <p className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-800 text-xs font-black tracking-wider" dir="ltr">{applied.code}</span>
              <span className="text-xs font-black text-emerald-700">
                {applied.type === 'percent' ? t('خصم {n}%', { n: applied.value }) : t('خصم {n} ج.م', { n: egp(applied.value) })}
              </span>
            </p>
            <p className="text-sm font-black text-slate-900 mt-1">{t('وفّرت {n} ج.م', { n: egp(applied.discount) })}</p>
            <p className="text-[11px] font-bold text-slate-500">
              {t('هتدفع {final} ج.م بدل {old}', { final: egp(applied.final), old: egp(applied.original) })}
            </p>
          </div>
          <button
            type="button"
            onClick={() => { onChange(null); setCode(''); }}
            className="w-8 h-8 rounded-lg hover:bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0"
            aria-label={t('إزالة')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 hover:bg-amber-50 py-3 text-xs font-black text-amber-800 transition-colors"
      >
        <Ticket className="w-4 h-4 group-hover:-rotate-12 transition-transform" />
        {t('عندك كوبون خصم؟')}
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
      </button>
    );
  }

  return (
    <div key={shake} className={`space-y-2 ${shake ? 'dw-shake' : ''}`}>
      <div className="flex items-stretch gap-2">
        <div className="relative flex-1">
          <Ticket className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-amber-500 pointer-events-none" />
          <input
            autoFocus
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase().replace(/\s+/g, '')); setError(''); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); apply(); } }}
            placeholder={t('اكتب كود الكوبون')}
            dir="ltr"
            maxLength={40}
            className={`w-full h-12 ps-10 pe-3 rounded-2xl border-2 bg-white text-sm font-black tracking-widest uppercase text-start outline-none transition-colors placeholder:tracking-normal placeholder:font-bold placeholder:normal-case ${
              error ? 'border-rose-300 focus:border-rose-400' : 'border-amber-200 focus:border-amber-400'
            }`}
          />
        </div>
        <button
          type="button"
          onClick={apply}
          disabled={checking || !code.trim()}
          className="px-5 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 text-sm font-black shadow-lg shadow-amber-500/25 disabled:opacity-60 inline-flex items-center gap-1.5"
        >
          {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {t('تطبيق')}
        </button>
      </div>
      {error ? (
        <p className="flex items-start gap-1.5 text-xs font-bold text-rose-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {error}
        </p>
      ) : (
        <p className="text-[11px] font-bold text-slate-400">{t('كل طالب ليه كوبون واحد بس — وبيتحسب عليك أول ما تبعت الطلب بيه.')}</p>
      )}
    </div>
  );
}
