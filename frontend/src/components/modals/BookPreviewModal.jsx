'use client';

import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { X, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

export default function BookPreviewModal() {
  const { activeModal, modalData, closeModal } = useModal();
  const book = modalData?.book;
  const samplePages = book?.samplePages || [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  if (activeModal !== 'bookPreview') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        
        <button
          onClick={closeModal}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">معاينة صفحات من {book?.title || 'الكتاب'}</h3>
            <p className="text-xs text-slate-400">صفحة {currentIndex + 1} من {samplePages.length}</p>
          </div>
        </div>

        {/* Viewer */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
          <img
            src={samplePages[currentIndex]}
            alt={`Page ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />

          {samplePages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : samplePages.length - 1))}
                className="absolute right-3 p-2 rounded-full bg-slate-900/80 text-white hover:bg-amber-400 hover:text-slate-950 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <button
                onClick={() => setCurrentIndex((prev) => (prev < samplePages.length - 1 ? prev + 1 : 0))}
                className="absolute left-3 p-2 rounded-full bg-slate-900/80 text-white hover:bg-amber-400 hover:text-slate-950 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={closeModal}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-5 py-2 rounded-xl"
          >
            إغلاق المعاينة
          </button>
        </div>

      </div>
    </div>
  );
}
