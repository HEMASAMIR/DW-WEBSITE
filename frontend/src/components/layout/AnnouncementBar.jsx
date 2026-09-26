'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, ArrowLeft } from 'lucide-react';

const AD_ITEMS = [
  { tag: '🎓 الدفعة الجديدة', text: 'المحاضرات متاحة أونلاين 24/7 من حسابك مع ملفات PDF ومناقشة على كل محاضرة.' },
  { tag: '🏛️ جوته وتيلك', text: 'تأهيل مكثف لامتحانات Goethe & Telc مع هير خالد.' },
  { tag: '📚 كتب المنهج', text: 'كتب دويتشه فيلت متاحة للتحميل PDF فور تفعيلها على حسابك.' },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % AD_ITEMS.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const item = AD_ITEMS[index];

  return (
    <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-emerald-900 text-white text-xs py-2 px-4 shadow-md border-b border-teal-500/30 relative z-30 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">

        <div className="flex items-center gap-2 font-medium shrink-0">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500/30 text-amber-300 border border-teal-400/40">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </span>
          <span className="font-extrabold text-amber-300">جديد:</span>
        </div>

        <div className="w-full overflow-hidden text-center md:text-right px-2">
          <div key={index} className="inline-flex items-center gap-4 animate-fadeIn">
            <span className="glass-pill px-2.5 py-0.5 text-[11px] font-bold text-amber-300 border border-amber-500/30">
              {item.tag}
            </span>
            <span className="text-xs text-slate-200">{item.text}</span>
          </div>
        </div>

        <Link
          href="/#online-courses"
          className="glass-pill-active inline-flex items-center gap-1 px-3.5 py-1 text-xs shrink-0 transition-transform transform hover:scale-105"
        >
          <span>استعرض المستويات والأسعار</span>
          <ArrowLeft className="w-3 h-3" />
        </Link>

      </div>
    </div>
  );
}
