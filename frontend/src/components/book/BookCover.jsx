import React from 'react';
import { BookOpen } from 'lucide-react';

/** Per-level colour palette (pure design — the level code itself comes from the backend). */
export const LEVEL_TONES = {
  A1: { cover: 'from-teal-500 via-teal-700 to-slate-900', stage: 'from-teal-100 via-teal-50 to-white', glow: 'bg-teal-400/40', text: 'text-teal-700', chip: 'bg-teal-50 text-teal-700 border-teal-200' },
  A2: { cover: 'from-emerald-500 via-emerald-700 to-slate-900', stage: 'from-emerald-100 via-emerald-50 to-white', glow: 'bg-emerald-400/40', text: 'text-emerald-700', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  B1: { cover: 'from-sky-500 via-sky-700 to-slate-900', stage: 'from-sky-100 via-sky-50 to-white', glow: 'bg-sky-400/40', text: 'text-sky-700', chip: 'bg-sky-50 text-sky-700 border-sky-200' },
  B2: { cover: 'from-indigo-500 via-indigo-700 to-slate-900', stage: 'from-indigo-100 via-indigo-50 to-white', glow: 'bg-indigo-400/40', text: 'text-indigo-700', chip: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  C1: { cover: 'from-violet-500 via-violet-700 to-slate-900', stage: 'from-violet-100 via-violet-50 to-white', glow: 'bg-violet-400/40', text: 'text-violet-700', chip: 'bg-violet-50 text-violet-700 border-violet-200' },
  C2: { cover: 'from-rose-500 via-rose-700 to-slate-900', stage: 'from-rose-100 via-rose-50 to-white', glow: 'bg-rose-400/40', text: 'text-rose-700', chip: 'bg-rose-50 text-rose-700 border-rose-200' },
};
export const toneFor = (code) => LEVEL_TONES[String(code || '').toUpperCase()] || LEVEL_TONES.A1;

const SIZES = {
  sm: { box: 'w-14 h-[4.5rem]', pad: 'p-1.5', title: 'hidden', brand: 'hidden', icon: 'hidden', badge: 'text-sm' },
  md: { box: 'w-36 h-48', pad: 'p-3.5', title: 'text-[11px]', brand: 'text-[7px]', icon: 'w-6 h-6', badge: 'w-7 h-7 text-[11px]' },
  lg: { box: 'w-56 h-72 sm:w-64 sm:h-80', pad: 'p-6', title: 'text-base', brand: 'text-[10px]', icon: 'w-10 h-10', badge: 'w-9 h-9 text-sm' },
};

/**
 * Decorative 3D book cover built from the backend name + level (no images needed).
 * `tilt` leans the book; inside a `group` it straightens on hover.
 */
export default function BookCover({ name, level, size = 'md', tilt = true }) {
  const s = SIZES[size];
  const tone = toneFor(level);

  if (size === 'sm') {
    return (
      <span className={`${s.box} rounded-l-sm rounded-r-lg bg-gradient-to-br ${tone.cover} border-r-2 border-amber-400/70 text-white font-black ${s.badge} flex items-center justify-center shadow-md shrink-0`}>
        {level}
      </span>
    );
  }

  return (
    <div className="[perspective:1200px]">
      <div
        className={`relative ${s.box} rounded-l-md rounded-r-2xl bg-gradient-to-br ${tone.cover} shadow-[0_30px_50px_-15px_rgba(0,0,0,0.55)] overflow-hidden border-r-4 border-amber-400/80 transition-transform duration-500 ${
          tilt ? '[transform:rotateY(-16deg)_rotateZ(-1deg)] group-hover:[transform:rotateY(0deg)] hover:[transform:rotateY(0deg)]' : ''
        }`}
      >
        {/* spine shadow, sheen, pattern */}
        <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/25" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '12px 12px' }}
        />
        <div className={`relative h-full ${s.pad} flex flex-col justify-between`}>
          <div className="flex items-center justify-between border-b border-white/20 pb-2">
            <span className={`${s.brand} font-black tracking-[0.2em] text-amber-300`} dir="ltr">DEUTSCHE WELT</span>
            <span className={`${s.badge} rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center`}>{level}</span>
          </div>
          <div className="text-center space-y-2">
            <BookOpen className={`${s.icon} mx-auto text-amber-300`} />
            <p className={`${s.title} font-black leading-snug text-white text-center line-clamp-4`} dir="auto">{name}</p>
          </div>
          <div className="h-1 w-1/3 mx-auto rounded-full bg-amber-400/70" />
        </div>
      </div>
    </div>
  );
}
