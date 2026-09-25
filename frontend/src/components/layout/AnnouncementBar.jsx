'use client';

import React, { useState, useEffect } from 'react';
import { useModal } from '@/context/ModalContext';
import { Flame, Clock, ArrowLeft } from 'lucide-react';

export default function AnnouncementBar() {
  const { openEnrollModal } = useModal();
  const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-white text-xs sm:text-sm py-2 px-4 shadow-md border-b border-red-800/40 relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-right">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-600/60 text-amber-300 animate-pulse">
            <Flame className="w-3.5 h-3.5" />
          </span>
          <span>
            خصم حصري <strong className="text-amber-300 font-bold">25%</strong> بمناسبة افتتاح الدفعة الجديدة للمستويات A1 & B1
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 dir-ltr text-amber-200 font-mono text-xs bg-black/40 px-2.5 py-1 rounded-full border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 text-amber-400 mr-1" />
            <span>{formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}</span>
          </div>
          <button
            onClick={() => openEnrollModal({ name: 'المستوى الأساسي A1', code: 'A1', price: 1200 })}
            className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-full text-xs transition-all shadow-sm transform hover:scale-105"
          >
            <span>احجز خصمك الآن</span>
            <ArrowLeft className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
