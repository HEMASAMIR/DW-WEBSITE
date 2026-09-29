'use client';

import React from 'react';
import { useBranches } from '@/hooks/useBranches';
import { branchTone } from '@/constants/branchTones';
import { MapPin, Phone, Navigation, Sparkles } from 'lucide-react';
import Reveal from '@/components/common/Reveal';

export default function BranchesSection() {
  const branches = useBranches();
  return (
    <section id="branches" className="py-24 bg-gradient-to-b from-slate-50 to-white border-t border-slate-200 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Reveal className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-4 py-1.5 rounded-full text-xs font-black text-[#0e2c4e]">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>الحضور الفعلي والتواصل المباشر</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0e2c4e]">
            فروع <span className="text-teal-600">الأكاديمية</span>
          </h2>
          <div className="flex h-1.5 w-24 mx-auto rounded-full overflow-hidden">
            <span className="flex-1 bg-slate-900" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
          </div>
          <p className="text-slate-600 text-sm sm:text-base">
            يمكنكم زيارتنا والتسجيل المباشر في أحد فروعنا، أو الدراسة أونلاين من أي مكان.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-6xl mx-auto">
          {branches.map((branch, idx) => {
            const t = branchTone(branch.color, idx);
            return (
            <Reveal
              as="article"
              key={branch.id}
              from={idx % 2 === 0 ? 'left' : 'right'}
              delay={(idx % 2) * 150 + Math.floor(idx / 2) * 100}
              className={`group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-200/80 ${t.border} shadow-xl shadow-slate-900/[0.05] hover:shadow-2xl hover:-translate-y-1.5`}
            >
              {/* Illustrated map header */}
              <div className={`dw-shine relative h-44 bg-gradient-to-br ${t.mapBg} overflow-hidden`}>
                <MapArt accent={t.accent} soft={t.soft} seed={idx} />
                <div className="absolute top-0 inset-x-0 h-1 flex" dir="ltr">
                  <span className="flex-1 bg-slate-900" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
                </div>

                {/* Pin */}
                <span className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2">
                  <span className="dw-float block relative" style={{ animationDelay: `${idx * 0.4}s` }}>
                    <span className={`absolute left-1/2 top-full -translate-x-1/2 mt-1 w-10 h-3 rounded-[50%] ${t.ping} blur-[2px]`} />
                    <span className={`absolute inset-0 rounded-full ${t.ping} animate-ping`} />
                    <span className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${t.pin} ring-4 ring-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                      <MapPin className="w-7 h-7" />
                    </span>
                  </span>
                </span>

                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur shadow-sm text-[#0e2c4e] text-[11px] font-black">
                  {branch.badge}
                </span>
                {branch.city !== branch.badge && (
                  <span className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-white/80 backdrop-blur text-[#0e2c4e] text-[11px] font-black">{branch.city}</span>
                )}
                <span className="absolute bottom-3 left-4 text-5xl font-black leading-none select-none" style={{ color: t.accent, opacity: 0.18 }} dir="ltr">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="flex-1 flex flex-col p-6 sm:p-7 gap-5">
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-[#0e2c4e]">{branch.name}</h3>
                  <span className={`block h-1 w-12 rounded-full ${t.bar} group-hover:w-24 transition-all duration-500`} />
                  <p className="text-sm text-slate-600 leading-relaxed flex items-start gap-2">
                    <MapPin className={`w-4 h-4 ${t.icon} shrink-0 mt-0.5`} />
                    <span>{branch.address}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${branch.phone}`}
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-100 border border-slate-200 ${t.phone} text-[#0e2c4e] text-xs sm:text-sm font-black transition-colors`}
                  >
                    <Phone className={`w-4 h-4 ${t.icon}`} />
                    <span dir="ltr">{branch.phone}</span>
                  </a>
                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0e2c4e] ${t.mapBtn} text-white text-xs sm:text-sm font-black transition-colors shadow-lg shadow-[#0e2c4e]/20`}
                  >
                    <Navigation className="w-4 h-4" />
                    <span>الموقع على الخريطة</span>
                  </a>
                </div>
              </div>
            </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}

/** Soft illustrated city map (streets, blocks, park, river, dotted route to the pin). */
export function MapArt({ accent, soft, seed }) {
  const flip = seed % 2 === 1;
  return (
    <svg
      className="absolute inset-0 w-full h-full group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
      viewBox="0 0 400 176"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <g transform={flip ? 'translate(400 0) scale(-1 1)' : undefined}>
      {/* river */}
      <path d="M-10 150 C 70 120, 120 170, 200 140 S 330 110, 410 135 L 410 190 L -10 190 Z" fill={soft} opacity="0.9" />
      <path d="M-10 150 C 70 120, 120 170, 200 140 S 330 110, 410 135" fill="none" stroke={accent} strokeOpacity="0.25" strokeWidth="2" />
      {/* park */}
      <ellipse cx="320" cy="48" rx="48" ry="26" fill="#bbf7d0" opacity="0.8" />
      <circle cx="304" cy="44" r="6" fill="#86efac" /><circle cx="330" cy="54" r="7" fill="#86efac" /><circle cx="340" cy="38" r="5" fill="#86efac" />
      {/* blocks */}
      {[
        [20, 18, 60, 34], [92, 18, 54, 34], [20, 64, 44, 40], [76, 64, 70, 40],
        [236, 20, 38, 30], [236, 62, 60, 36], [306, 86, 78, 22], [158, 64, 60, 24],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="6" fill="#ffffff" opacity="0.85" />
      ))}
      {/* streets */}
      <g fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" opacity="0.95">
        <path d="M-10 58 H 410" />
        <path d="M152 -10 V 190" />
        <path d="M228 -10 C 230 60, 250 110, 300 190" />
      </g>
      <g fill="none" stroke={accent} strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="6 6">
        <path d="M-10 58 H 410" />
        <path d="M152 -10 V 190" />
      </g>
      {/* dotted route to the pin */}
      <path d="M40 150 C 90 110, 130 110, 200 80" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeDasharray="1 9" />
      <circle cx="40" cy="150" r="6" fill="#ffffff" stroke={accent} strokeWidth="3" />
      </g>
    </svg>
  );
}
