'use client';

import React from 'react';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';
import BookCover, { toneFor } from '@/components/book/BookCover';
import Reveal from '@/components/common/Reveal';
import { Lock, Unlock, AlertCircle, RefreshCw, LogIn, CheckCircle2, ChevronLeft, Layers } from 'lucide-react';

/**
 * Shared list screen (levels / books): dark hero + "unlocked for you" and "locked" groups.
 * renderCard(item) renders one card; each item needs `id` and `hasAccess`.
 */
export default function AccessGroups({
  title, subtitle, icon: Icon = Layers, unit, items, loading, error, requiresLogin, isGuest, reload, renderCard, emptyText,
  gridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
}) {
  const { openAuthModal } = useModal();
  const unlocked = items.filter((i) => i.hasAccess);
  const locked = items.filter((i) => !i.hasAccess);
  const ready = !loading && !requiresLogin && !error && items.length > 0;

  return (
    <div className="min-h-[70vh] pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_90%_0%,rgba(20,184,166,0.45),transparent_60%),radial-gradient(ellipse_50%_70%_at_0%_100%,rgba(245,158,11,0.2),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.08] [mask-image:linear-gradient(to_bottom,black,transparent)]"
          style={{
            backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <Icon aria-hidden className="absolute -left-10 -bottom-16 w-80 h-80 text-white/[0.04] -rotate-12" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20 sm:pb-24 space-y-5">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 text-slate-950 shadow-xl shadow-teal-500/30">
            <Icon className="w-7 h-7" />
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-l from-white via-white to-teal-200 bg-clip-text text-transparent pb-1">
            {title}
          </h1>
          {subtitle && <p className="text-sm sm:text-lg text-slate-300 max-w-2xl leading-relaxed">{subtitle}</p>}
          {ready && (
            <div className="flex flex-wrap gap-2.5 pt-1">
              <Chip icon={Icon} value={items.length} label={unit} />
              {!isGuest && <Chip icon={CheckCircle2} value={unlocked.length} label="مفعّل لك" accent />}
              {!isGuest && locked.length > 0 && <Chip icon={Lock} value={locked.length} label="متاح للاشتراك" />}
            </div>
          )}
        </div>
      </section>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 space-y-10">
        {loading && items.length === 0 ? (
          <div className={`grid ${gridClass} gap-6 animate-pulse`}>
            {[0, 1, 2].map((i) => <div key={i} className="h-96 rounded-[2rem] bg-white shadow-xl shadow-slate-900/5" />)}
          </div>
        ) : requiresLogin ? (
          <Box icon={Lock} text="سجّل الدخول عشان تشوف المفعّل لك والمتاح للاشتراك.">
            <LoginBtn onClick={() => openAuthModal('login')} />
          </Box>
        ) : error ? (
          <Box icon={AlertCircle} text={error}>
            <button onClick={reload} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-full text-sm font-black">
              <RefreshCw className="w-4 h-4" /> إعادة المحاولة
            </button>
          </Box>
        ) : items.length === 0 ? (
          <Box icon={Icon} text={emptyText} />
        ) : isGuest ? (
          // Visitors see the full real catalog; access status needs an account.
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 shadow-xl shadow-slate-900/5 rounded-3xl p-4 sm:px-6">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
                <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center"><Lock className="w-4 h-4" /></span>
                سجّل الدخول عشان تعرف المفعّل لك وتشترك.
              </span>
              <LoginBtn onClick={() => openAuthModal('login')} />
            </div>
            <div className={`grid ${gridClass} gap-6`}>
              {items.map((i, n) => <Staggered key={i.id} n={n}>{renderCard(i)}</Staggered>)}
            </div>
          </section>
        ) : (
          <>
            <Group icon={Unlock} tone="emerald" label="مفعّلة لك" count={unlocked.length} empty="لسه مفيش حاجة متفعّلة على حسابك." gridClass={gridClass}>
              {unlocked.map((i, n) => <Staggered key={i.id} n={n}>{renderCard(i)}</Staggered>)}
            </Group>
            {locked.length > 0 && (
              <Group icon={Lock} tone="amber" label="متاحة للاشتراك" count={locked.length} gridClass={gridClass}>
                {locked.map((i, n) => <Staggered key={i.id} n={n}>{renderCard(i)}</Staggered>)}
              </Group>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** Cards rise in one after another (per row of 3). */
function Staggered({ n, children }) {
  return (
    <Reveal delay={(n % 3) * 130} className="h-full [&>*]:h-full">
      {children}
    </Reveal>
  );
}

function Chip({ icon: Icon, value, label, accent }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border backdrop-blur px-4 py-2 ${accent ? 'bg-emerald-400/10 border-emerald-300/25' : 'bg-white/[0.07] border-white/10'}`}>
      <Icon className={`w-4 h-4 ${accent ? 'text-emerald-300' : 'text-teal-300'}`} />
      <span className="text-sm font-black">{value}</span>
      {label && <span className="text-xs font-bold text-slate-400">{label}</span>}
    </span>
  );
}

function LoginBtn({ onClick }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 bg-slate-950 hover:bg-teal-700 text-white px-6 py-2.5 rounded-full text-sm font-black transition-colors">
      <LogIn className="w-4 h-4" /> تسجيل الدخول
    </button>
  );
}

function Group({ icon: Icon, tone, label, count, empty, gridClass, children }) {
  const colors = tone === 'emerald' ? 'from-emerald-500 to-teal-600 shadow-emerald-600/25' : 'from-amber-400 to-amber-500 shadow-amber-500/25';
  return (
    <section className="space-y-5 first:pt-0">
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-2xl w-fit pl-5 pr-2 py-2 shadow-sm border border-slate-200/70">
        <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colors} text-white flex items-center justify-center shadow-lg`}>
          <Icon className="w-4 h-4" />
        </span>
        <h2 className="text-base sm:text-lg font-black text-slate-900">{label}</h2>
        <span className="min-w-7 h-7 px-2 rounded-full bg-slate-100 text-slate-600 text-xs font-black flex items-center justify-center">{count}</span>
      </div>
      {count === 0 ? (
        <p className="text-sm text-slate-500 bg-white border border-dashed border-slate-300 rounded-3xl p-8 text-center">{empty}</p>
      ) : (
        <div className={`grid ${gridClass} gap-6`}>{children}</div>
      )}
    </section>
  );
}

function Box({ icon: Icon, text, children }) {
  return (
    <div className="max-w-md mx-auto text-center bg-white border border-slate-200 rounded-[2rem] p-10 space-y-4 text-slate-700 shadow-xl shadow-slate-900/5">
      <span className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
        <Icon className="w-7 h-7 text-slate-500" />
      </span>
      <p className="text-sm font-semibold">{text}</p>
      {children}
    </div>
  );
}

function StatusPill({ hasAccess, guest, dark }) {
  if (guest) return null;
  return hasAccess ? (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
      <CheckCircle2 className="w-3.5 h-3.5" /> مفعّل لك
    </span>
  ) : (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black ${dark ? 'bg-white/10 text-slate-200 border border-white/15' : 'bg-white/90 text-slate-600 border border-slate-200'}`}>
      <Lock className="w-3.5 h-3.5" /> غير مفعّل
    </span>
  );
}

function PriceTag({ price }) {
  if (!price) return <span />;
  return (
    <span className="flex items-baseline gap-1">
      <span className="text-2xl font-black text-slate-900 tracking-tight" dir="ltr">{price}</span>
      <span className="text-xs font-black text-slate-500">ج.م</span>
    </span>
  );
}

function ActionBtn({ hasAccess, label }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs sm:text-sm font-black px-4 py-2.5 rounded-xl transition-all group-hover:gap-2 ${
        hasAccess ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25' : 'bg-slate-950 text-white group-hover:bg-teal-700'
      }`}
    >
      {label}
      <ChevronLeft className="w-4 h-4" />
    </span>
  );
}

/** Book card: 3D cover on a tinted stage. */
export function BookCard({ id, href, name, level, price, hasAccess, guest, actionLabel }) {
  const tone = toneFor(level);
  return (
    <Link
      href={href}
      className={`group flex flex-col bg-white rounded-[2rem] overflow-hidden border shadow-xl shadow-slate-900/[0.05] hover:shadow-2xl hover:shadow-slate-900/10 hover:-translate-y-1.5 transition-all duration-300 ${
        hasAccess ? 'border-emerald-300' : 'border-slate-200/80'
      }`}
    >
      <div className={`relative h-64 bg-gradient-to-b ${tone.stage} flex items-center justify-center overflow-hidden`}>
        <div className={`absolute w-40 h-40 rounded-full ${tone.glow} blur-3xl group-hover:scale-125 transition-transform duration-500`} />
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.08) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
        />
        <div className="absolute top-4 right-4 z-10"><StatusPill hasAccess={hasAccess} guest={guest} /></div>
        <div className="relative group-hover:scale-105 transition-transform duration-500">
          <BookCover id={id} name={name} level={level} size="md" />
        </div>
        <div className="absolute bottom-5 inset-x-16 h-3 rounded-[50%] bg-slate-900/20 blur-md" />
      </div>
      <div className="flex-1 flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex-1 space-y-2">
          <span className={`inline-flex px-2.5 py-0.5 rounded-lg border text-[11px] font-black ${tone.chip}`}>مستوى {level}</span>
          <h3 className="font-black text-lg text-slate-900 group-hover:text-teal-800 leading-snug line-clamp-2" dir="auto">{name}</h3>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {hasAccess ? <span className="text-xs font-black text-emerald-700">جاهز للقراءة</span> : <PriceTag price={price} />}
          <ActionBtn hasAccess={hasAccess} label={actionLabel} />
        </div>
      </div>
    </Link>
  );
}

/** Level card: dark header with big level code. */
export function LevelCard({ href, code, title, subtitle, price, hasAccess, guest, actionLabel }) {
  return (
    <Link
      href={href}
      className={`group flex flex-col bg-white rounded-[2rem] overflow-hidden border shadow-xl shadow-slate-900/[0.05] hover:shadow-2xl hover:shadow-slate-900/10 hover:-translate-y-1.5 transition-all duration-300 ${
        hasAccess ? 'border-emerald-300' : 'border-slate-200/80'
      }`}
    >
      <div className="relative h-44 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.5),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.25),transparent_55%)] group-hover:scale-110 transition-transform duration-700" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }}
        />
        <span
          className="absolute -bottom-8 left-4 text-[8.5rem] font-black leading-none text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.14)] group-hover:[-webkit-text-stroke:2px_rgba(94,234,212,0.35)] transition-all select-none"
          dir="ltr"
        >
          {code}
        </span>
        <div className="absolute top-4 right-4"><StatusPill hasAccess={hasAccess} guest={guest} dark /></div>
        <span className="absolute bottom-4 right-4 px-4 py-2 rounded-2xl bg-gradient-to-br from-teal-300 to-emerald-400 text-slate-950 text-2xl font-black shadow-xl shadow-teal-500/30" dir="ltr">
          {code}
        </span>
      </div>
      <div className="flex-1 flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex-1 space-y-1">
          <h3 className="font-black text-xl text-slate-900 group-hover:text-teal-800 leading-snug" dir="auto">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 font-bold" dir="auto">{subtitle}</p>}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {hasAccess ? <span className="text-xs font-black text-emerald-700">المحاضرات متاحة</span> : <PriceTag price={price} />}
          <ActionBtn hasAccess={hasAccess} label={actionLabel} />
        </div>
      </div>
    </Link>
  );
}
