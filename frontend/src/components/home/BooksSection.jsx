'use client';

import React from 'react';
import { useBooks } from '@/hooks/useBooks';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { 
  BookOpen, 
  Eye, 
  ShoppingCart, 
  FileText, 
  Truck,
  Lock
} from 'lucide-react';

export default function BooksSection() {
  const { books } = useBooks();
  const { openBookOrderModal, openBookPreviewModal, openAuthModal } = useModal();
  const { isAuthenticated } = useAuth();

  const handleOrderClick = (book) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    openBookOrderModal(book);
  };

  return (
    <section id="books-store" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-3.5 py-1.5 rounded-full">
            <BookOpen className="w-4 h-4" />
            <span>متجر المطبوعات الرسمية للأكاديمية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            سلسلة كتب دويتشه فيلت المعتمدة
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            كتب الشرح والتطبيقات ونماذج الامتحانات الشاملة مع خدمة التوصيل لجميع محافظات مصر.
          </p>
        </div>

        {/* Books Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-amber-500/40 transition-all group"
            >
              {/* Top Book Cover Card */}
              <div className={`p-8 bg-gradient-to-br ${book.coverBg || 'from-slate-800 to-slate-900'} relative flex flex-col justify-between min-h-[200px]`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white bg-black/40 px-3 py-1 rounded-full border border-white/20">
                    مستوى {book.level}
                  </span>
                  <span className="text-xs text-amber-200 flex items-center gap-1 font-medium bg-black/30 px-2.5 py-1 rounded-full">
                    <Truck className="w-3.5 h-3.5" />
                    توصيل محافظات
                  </span>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-black text-white leading-tight drop-shadow-md">
                    {book.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-200 mt-2">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-amber-300" />
                      {book.pages} صفحة
                    </span>
                    <span>•</span>
                    <span>{book.type}</span>
                  </div>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-sm text-slate-300 leading-relaxed">
                  {book.description}
                </p>

                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-amber-400">{book.price} ج.م</span>
                      {book.oldPrice && (
                        <span className="text-xs text-slate-500 line-through">{book.oldPrice} ج.م</span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded">
                      شامل الشحن والضمان
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => openBookPreviewModal(book)}
                      className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 rounded-xl border border-slate-700 transition-all"
                    >
                      <Eye className="w-4 h-4 text-amber-400" />
                      <span>معاينة العينات</span>
                    </button>

                    <button
                      onClick={() => handleOrderClick(book)}
                      className="flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold py-2.5 rounded-xl shadow-md transition-all"
                    >
                      {!isAuthenticated ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>دخول للشراء</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>اطلب النسخة</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
