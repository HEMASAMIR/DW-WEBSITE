'use client';

import React from 'react';
import { BRANCHES_DATA } from '@/constants/siteContent';
import { MapPin, Phone, Navigation, Sparkles } from 'lucide-react';

export default function BranchesSection() {
  return (
    <section id="branches" className="py-24 bg-gradient-to-b from-slate-50 to-white border-t border-slate-200 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-6xl mx-auto">
          {BRANCHES_DATA.map((branch, idx) => (
            <article
              key={branch.id}
              className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-200/80 shadow-xl shadow-slate-900/[0.05] hover:shadow-2xl hover:shadow-[#0e2c4e]/10 hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Map-style header */}
              <div className="relative h-36 bg-[#0e2c4e] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.45),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.25),transparent_55%)] group-hover:scale-110 transition-transform duration-700" />
                <div
                  className="absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                  }}
                />
                <div className="absolute top-0 inset-x-0 h-1 flex">
                  <span className="flex-1 bg-slate-950" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
                </div>
                <span className="absolute -bottom-6 left-5 text-[6.5rem] font-black leading-none text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.12)] select-none" dir="ltr">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                {/* Pin */}
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping" />
                  <span className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-[#0e2c4e] flex items-center justify-center shadow-xl shadow-amber-500/40 group-hover:scale-110 transition-transform">
                    <MapPin className="w-7 h-7" />
                  </span>
                </span>

                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white text-[11px] font-black">
                  {branch.badge}
                </span>
                {branch.city !== branch.badge && (
                  <span className="absolute bottom-4 right-4 text-teal-200 text-xs font-black">{branch.city}</span>
                )}
              </div>

              <div className="flex-1 flex flex-col p-6 sm:p-7 gap-5">
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-[#0e2c4e]">{branch.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${branch.phone}`}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-[#0e2c4e] text-xs sm:text-sm font-black transition-colors"
                  >
                    <Phone className="w-4 h-4 text-teal-600" />
                    <span dir="ltr">{branch.phone}</span>
                  </a>
                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0e2c4e] hover:bg-teal-700 text-white text-xs sm:text-sm font-black transition-colors shadow-lg shadow-[#0e2c4e]/20"
                  >
                    <Navigation className="w-4 h-4 text-amber-300" />
                    <span>الموقع على الخريطة</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
