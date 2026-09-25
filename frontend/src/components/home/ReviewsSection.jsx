'use client';

import React from 'react';
import { STUDENT_REVIEWS_DATA } from '@/constants/mockData';
import { useModal } from '@/context/ModalContext';
import { Star, MessageSquare, Maximize2, Award } from 'lucide-react';

export default function ReviewsSection() {
  const { openLightboxModal } = useModal();

  return (
    <section id="reviews" className="py-20 bg-slate-900/60 border-t border-slate-800 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3.5 py-1.5 rounded-full">
            <MessageSquare className="w-4 h-4" />
            <span>قصص نجاح حقيقية وموثقة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            آراء وتجارب طلبتنا الأبطال
          </h2>
          <p className="text-slate-400 text-sm">
            نعتز بثقة آلاف الطلاب في مراحل الثانوي والجامعة واجتياز الامتحانات الدولية للسفر لألمانيا.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STUDENT_REVIEWS_DATA.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all"
            >
              <div className="space-y-4">
                {/* Header Profile */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.avatar}
                      alt={rev.studentName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/40"
                    />
                    <div>
                      <h4 className="text-white font-bold text-sm">{rev.studentName}</h4>
                      <span className="text-xs text-amber-300">{rev.level}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  "{rev.comment}"
                </p>
              </div>

              {/* Review Image Attachment Preview Button */}
              {rev.imageReview && (
                <div className="pt-2">
                  <button
                    onClick={() => openLightboxModal(rev.imageReview, `شهادة الطالب ${rev.studentName}`)}
                    className="w-full flex items-center justify-between bg-slate-800/90 hover:bg-slate-700 p-2.5 rounded-xl border border-slate-700 text-xs text-amber-300 font-medium group transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>عرض الصورة الموثقة لنتيجة الامتحان</span>
                    </span>
                    <Maximize2 className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
