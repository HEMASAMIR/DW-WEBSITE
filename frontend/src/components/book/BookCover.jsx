'use client';

import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

import { LEVEL_TONES, toneFor } from '@/constants/levelTones';

// One palette for the whole site (constants/levelTones).
export { LEVEL_TONES, toneFor };

/** Real cover = first page of the book PDF, pre-rendered to /public/assets/books/<id>.jpg. */
export const bookCoverUrl = (id) => (id ? `/assets/books/${id}.jpg` : null);

const SIZES = {
  sm: { box: 'w-14 h-[4.9rem]', pad: 'p-1.5', title: 'hidden', brand: 'hidden', icon: 'hidden', badge: 'text-sm' },
  md: { box: 'w-40 h-[14.1rem]', pad: 'p-3.5', title: 'text-[11px]', brand: 'text-[7px]', icon: 'w-6 h-6', badge: 'w-7 h-7 text-[11px]' },
  lg: { box: 'w-56 h-[19.8rem] sm:w-64 sm:h-[22.6rem]', pad: 'p-6', title: 'text-base', brand: 'text-[10px]', icon: 'w-10 h-10', badge: 'w-9 h-9 text-sm' },
};

/**
 * 3D book cover. Shows the book's real first page when `id` has a cover image,
 * otherwise a cover drawn from the backend name + level.
 * `tilt` leans the book; inside a `group` it straightens on hover.
 */
export default function BookCover({ id, name, level, size = 'md', tilt = true }) {
  const s = SIZES[size];
  const tone = toneFor(level);
  const [imgFailed, setImgFailed] = useState(false);
  const src = !imgFailed ? bookCoverUrl(id) : null;

  if (size === 'sm') {
    return src ? (
      // eslint-disable-next-line @next/next/no-img-element -- static pre-rendered cover
      <img
        src={src}
        alt={name || ''}
        onError={() => setImgFailed(true)}
        className={`${s.box} rounded-l-sm rounded-r-lg object-cover object-top shadow-md shrink-0 border-r-2 border-black/20`}
      />
    ) : (
      <span className={`${s.box} rounded-l-sm rounded-r-lg bg-gradient-to-br ${tone.cover} border-r-2 border-amber-400/70 text-white font-black ${s.badge} flex items-center justify-center shadow-md shrink-0`}>
        {level}
      </span>
    );
  }

  const frame = `relative ${s.box} rounded-l-md rounded-r-2xl shadow-[0_30px_50px_-15px_rgba(0,0,0,0.55)] overflow-hidden transition-transform duration-500 ${
    tilt ? '[transform:rotateY(-16deg)_rotateZ(-1deg)] group-hover:[transform:rotateY(0deg)] hover:[transform:rotateY(0deg)]' : ''
  }`;

  if (src) {
    return (
      <div className="[perspective:1200px]">
        <div className={`${frame} bg-slate-100`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static pre-rendered cover */}
          <img
            src={src}
            alt={name || ''}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          {/* spine, page edge and glossy sheen so it reads as a real book */}
          <div className="absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
          <div className="absolute inset-y-0 left-5 w-px bg-white/40" />
          <div className="absolute inset-y-0 right-0 w-1.5 bg-gradient-to-l from-black/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/30 mix-blend-soft-light" />
        </div>
      </div>
    );
  }

  return (
    <div className="[perspective:1200px]">
      <div className={`${frame} bg-gradient-to-br ${tone.cover} border-r-4 border-amber-400/80`}>
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
