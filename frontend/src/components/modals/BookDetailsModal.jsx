'use client';

import React from 'react';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { booksService } from '@/services/books.service';
import { formatPrice } from '@/services/courses.service';
import { X, BookOpen, Download, ShoppingCart, CheckCircle2, Lock, Sparkles, FileText, Headphones, Award } from 'lucide-react';

export default function BookDetailsModal() {
  const { activeModal, modalData, closeModal, openBookOrderModal, openLoginPromptModal } = useModal();
  const { isAuthenticated } = useAuth();

  if (activeModal !== 'bookDetails' || !modalData?.book) return null;
  const book = modalData.book;
  const price = formatPrice(book.price);

  const handleOrderClick = () => {
    closeModal();
    if (!isAuthenticated) {
      openLoginPromptModal({
        type: 'book',
        name: book.name,
        price,
        item: book,
      });
      return;
    }
    openBookOrderModal(book);
  };

  const sampleDownload = async () => {
    try {
      await booksService.downloadBook(book);
    } catch {
      alert('تعذر تحميل عينة الكتاب حالياً.');
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-all border border-slate-700/50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 pr-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500/20 via-teal-400/10 to-amber-500/20 border border-teal-500/40 flex items-center justify-center text-amber-300 shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[11px] font-black">
                مستوى {book.level}
              </span>
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                منهج معتمد 📚
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {book.name}
            </h3>
          </div>
        </div>

        {/* Table of Contents & Details */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>فهرس أبواب ومحتويات الكتاب:</span>
          </h4>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <h5 className="text-xs font-bold text-white">الباب الأول: شرح القواعد النحوية بالتفصيل والأمثلة</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">تأسيس نطق الحروف، الأفعال، أدوات الإعراب والتراكيب الجملية.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <h5 className="text-xs font-bold text-white">الباب الثاني: قاموس المفردات والمحادثات المصورة</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">أكثر من 500 مفردة مترجمة ومصنفة حسب مواقف الحياة اليومية.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center shrink-0">3</span>
              <div>
                <h5 className="text-xs font-bold text-white">الباب الثالث: نماذج امتحانات رسمية وإجاباتها</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">نماذج امتحانات Goethe وتيلك المعتمدة مع توضيح الإجابات النموذجية.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">🎧</span>
              <div>
                <h5 className="text-xs font-bold text-white">الملفات الصوتية والتسجيلات الملحقة</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">تسجيلات صوتية بجودة عالية لممارسة مهارة الاستماع والمحادثة (Hören).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="space-y-3 pt-2">
          {price && (
            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-slate-400">سعر النسخة الكاملة PDF:</span>
              <span className="text-2xl font-black text-amber-400">{price} ج.م</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={sampleDownload}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700"
            >
              <FileText className="w-4 h-4 text-teal-400" />
              <span>تحميل عينة مجانية (PDF)</span>
            </button>

            <button
              onClick={handleOrderClick}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>اطلب الكتاب PDF الكامل</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
