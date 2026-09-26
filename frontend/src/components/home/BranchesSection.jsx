'use client';

import React from 'react';
import { BRANCHES_DATA } from '@/constants/siteContent';
import { MapPin, Phone, ExternalLink, Sparkles } from 'lucide-react';

export default function BranchesSection() {
  return (
    <section id="branches" className="py-20 bg-slate-50 border-t border-slate-200 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full text-xs font-bold">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>الحضور الفعلي والتواصل المباشر</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0f172a]">
            فروع <span className="text-gradient-cyan">الأكاديمية</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            يمكنكم زيارتنا والتسجيل المباشر في أحد فروعنا، أو الدراسة أونلاين من أي مكان.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {BRANCHES_DATA.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-3xl p-7 shadow-md hover:shadow-xl border border-slate-200 space-y-5 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="glass-pill px-3.5 py-1 text-xs font-extrabold text-amber-700 border border-amber-500/30">
                  {branch.badge}
                </span>
                <MapPin className="w-6 h-6 text-teal-600" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{branch.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                  <span>{branch.address}</span>
                </p>
              </div>

              <a href={`tel:${branch.phone}`} className="flex items-center gap-2 pt-3 border-t border-teal-500/20 text-xs text-slate-700 hover:text-teal-700">
                <Phone className="w-4 h-4 text-teal-600" />
                <span dir="ltr">{branch.phone}</span>
              </a>

              <a
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 glass-pill py-3 rounded-full text-xs font-bold transition-all"
              >
                <span>الموقع على الخريطة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
