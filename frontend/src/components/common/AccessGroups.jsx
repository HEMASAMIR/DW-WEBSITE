'use client';

import React from 'react';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';
import { Lock, Unlock, Loader2, AlertCircle, RefreshCw, LogIn } from 'lucide-react';

/**
 * Shared list screen: splits items into "unlocked for you" and "locked" groups (app-style).
 * renderCard(item) renders one card; each item needs `id` and `hasAccess`.
 */
export default function AccessGroups({ title, subtitle, items, loading, error, requiresLogin, reload, renderCard, emptyText }) {
  const { openAuthModal } = useModal();
  const unlocked = items.filter((i) => i.hasAccess);
  const locked = items.filter((i) => !i.hasAccess);

  return (
    <div className="min-h-[70vh] bg-slate-50 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-[#0f172a]">{title}</h1>
          {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        </div>

        {loading && items.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-9 h-9 text-teal-600 animate-spin" />
          </div>
        ) : requiresLogin ? (
          <Box icon={Lock} text="سجّل الدخول عشان تشوف المفعّل لك والمتاح للاشتراك.">
            <button onClick={() => openAuthModal('login')} className="inline-flex items-center gap-2 glass-pill-gold px-6 py-2.5 rounded-full text-sm font-black">
              <LogIn className="w-4 h-4" /> تسجيل الدخول
            </button>
          </Box>
        ) : error ? (
          <Box icon={AlertCircle} text={error}>
            <button onClick={reload} className="inline-flex items-center gap-2 glass-pill-gold px-6 py-2.5 rounded-full text-sm font-black">
              <RefreshCw className="w-4 h-4" /> إعادة المحاولة
            </button>
          </Box>
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-slate-500">{emptyText}</p>
        ) : (
          <>
            <Group icon={Unlock} tone="emerald" label="مفعّلة لك" count={unlocked.length} empty="لسه مفيش حاجة متفعّلة على حسابك.">
              {unlocked.map((i) => <React.Fragment key={i.id}>{renderCard(i)}</React.Fragment>)}
            </Group>
            <Group icon={Lock} tone="slate" label="غير مفعّلة — متاحة للاشتراك" count={locked.length} empty="كل حاجة متفعّلة لك 🎉">
              {locked.map((i) => <React.Fragment key={i.id}>{renderCard(i)}</React.Fragment>)}
            </Group>
          </>
        )}
      </div>
    </div>
  );
}

function Group({ icon: Icon, tone, label, count, empty, children }) {
  const colors = tone === 'emerald' ? 'text-emerald-700 bg-emerald-100 border-emerald-300' : 'text-slate-700 bg-slate-200 border-slate-300';
  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-black text-[#0f172a]">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border ${colors}`}>
          <Icon className="w-4 h-4" />
          {label}
        </span>
        <span className="text-sm text-slate-500 font-bold">({count})</span>
      </h2>
      {count === 0 ? (
        <p className="text-sm text-slate-500 bg-white border border-dashed border-slate-300 rounded-2xl p-6 text-center">{empty}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{children}</div>
      )}
    </section>
  );
}

function Box({ icon: Icon, text, children }) {
  return (
    <div className="max-w-md mx-auto text-center bg-white border border-slate-200 rounded-3xl p-10 space-y-4 text-slate-700">
      <Icon className="w-10 h-10 mx-auto opacity-70" />
      <p className="text-sm font-semibold">{text}</p>
      {children}
    </div>
  );
}

/** Card used by both lists. */
export function AccessCard({ href, code, title, subtitle, price, hasAccess, actionLabel }) {
  return (
    <Link
      href={href}
      className={`bg-white rounded-3xl p-5 border shadow-sm hover:shadow-xl transition-all flex flex-col gap-4 group ${
        hasAccess ? 'border-emerald-400/70' : 'border-slate-200 hover:border-teal-400'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white font-black text-lg flex items-center justify-center">
          {code}
        </span>
        {hasAccess ? (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
            <Unlock className="w-3.5 h-3.5" /> مفعّل
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> غير مفعّل
          </span>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-black text-[#0f172a] group-hover:text-teal-700 leading-snug">{title}</h3>
        {subtitle && <p className="text-xs text-amber-700 font-semibold mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        {price ? <span className="text-lg font-black text-[#0d9488]">{price} ج.م</span> : <span />}
        <span className={`text-xs font-black px-3 py-1.5 rounded-full ${hasAccess ? 'bg-emerald-600 text-white' : 'bg-amber-400 text-slate-950'}`}>
          {actionLabel}
        </span>
      </div>
    </Link>
  );
}
