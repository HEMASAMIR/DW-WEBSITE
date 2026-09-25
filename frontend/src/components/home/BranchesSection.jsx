'use client';

import React from 'react';
import { BRANCHES_DATA } from '@/constants/mockData';
import { MapPin, Phone, Clock, Building2, ExternalLink } from 'lucide-react';

export default function BranchesSection() {
  return (
    <section id="branches" className="py-20 bg-slate-900/50 border-t border-slate-800 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3.5 py-1.5 rounded-full">
            <Building2 className="w-4 h-4" />
            <span>الحضور الفعلي والتواصل المباشر</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            فروع الأكاديمية المقرية
          </h2>
          <p className="text-slate-400 text-sm">
            يمكنكم زيارتنا والتسجيل المباشر في الفروع التالية بمحافظات القاهرة والجيزة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {BRANCHES_DATA.map((branch) => (
            <div
              key={branch.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl space-y-5 hover:border-amber-500/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30">
                  {branch.badge}
                </span>
                <MapPin className="w-6 h-6 text-red-500" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{branch.name}</h3>
                <p className="text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                  <span>{branch.address}</span>
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>مواعيد العمل: {branch.times}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>هاتف الفرع: {branch.phone}</span>
                </div>
              </div>

              <a
                href={`https://wa.me/201099887766?text=${encodeURIComponent(`استفسار عن موقع ${branch.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-3 rounded-xl border border-slate-700 transition-all"
              >
                <span>الموقع على الخريطة والتواصل</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
