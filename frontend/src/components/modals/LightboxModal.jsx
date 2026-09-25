'use client';

import React from 'react';
import { useModal } from '@/context/ModalContext';
import { X } from 'lucide-react';

export default function LightboxModal() {
  const { activeModal, modalData, closeModal } = useModal();
  const imageSrc = modalData?.imageSrc;
  const counterText = modalData?.counterText || 'عرض الصورة بالحجم الكامل';

  if (activeModal !== 'lightbox' || !imageSrc) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl flex flex-col items-center">
        
        <button
          onClick={closeModal}
          className="absolute top-4 left-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <img
          src={imageSrc}
          alt={counterText}
          className="max-h-[80vh] w-auto object-contain rounded-2xl border border-slate-800 shadow-xl"
        />

        <span className="text-xs text-slate-400 mt-3 font-medium bg-slate-950 px-4 py-1.5 rounded-full border border-slate-800">
          {counterText}
        </span>

      </div>
    </div>
  );
}
