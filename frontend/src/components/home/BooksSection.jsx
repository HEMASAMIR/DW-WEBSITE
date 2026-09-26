'use client';

import React from 'react';
import Link from 'next/link';
import { useBooks } from '@/hooks/useBooks';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { booksService } from '@/services/books.service';
import { formatPrice } from '@/services/courses.service';
import { BookOpen, Eye, ShoppingCart, Lock, Sparkles, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

// Every value on a book card comes from the backend (name, level, price, has_access).
// Do not add hard-coded descriptions/features here.
export default function BooksSection() {
  const { books, loading, error, requiresLogin, reload } = useBooks();
  const { openBookOrderModal, openAuthModal, openLoginPromptModal, openFileViewer } = useModal();
  const { isAuthenticated } = useAuth();

  const handleView = (book) =>
    openFileViewer({ title: book.name, load: (onProgress) => booksService.viewBook(book, onProgress) });

  const handleOrder = (book) => {
    if (!isAuthenticated) {
      openLoginPromptModal({ type: 'book', name: book.name, price: formatPrice(book.price), item: book });
      return;
    }
    openBookOrderModal(book);
  };

  return (
    <section id="books-store" className="py-20 bg-slate-50 border-t border-slate-200 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full text-xs font-bold">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>كتب الأكاديمية</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0f172a]">
            كتب <span className="text-gradient-cyan">Deutsche Welt</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            بعد تفعيل الكتاب على حسابك تقدر تعرضه أونلاين من الموقع مباشرة.
          </p>
        </div>

        {loading && books.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-3xl overflow-hidden border border-slate-200 bg-white animate-pulse">
                <div className="h-40 bg-slate-200" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-1/3" />
                  <div className="h-10 bg-slate-100 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && books.length === 0 && (
          <div className="max-w-md mx-auto text-center bg-rose-50 border border-rose-200 rounded-3xl p-8 space-y-4">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-sm text-rose-700 font-semibold">{error}</p>
            <button onClick={reload} className="inline-flex items-center gap-2 glass-pill-gold px-5 py-2.5 rounded-full text-xs font-black">
              <RefreshCw className="w-4 h-4" />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        )}

        {!loading && requiresLogin && (
          <div className="max-w-md mx-auto text-center bg-teal-50 border border-teal-200 rounded-3xl p-8 space-y-4">
            <Lock className="w-10 h-10 text-teal-600 mx-auto" />
            <p className="text-sm text-teal-900 font-semibold">سجّل الدخول لعرض الكتب المتاحة وأسعارها.</p>
            <button onClick={() => openAuthModal('login')} className="inline-flex items-center gap-2 glass-pill-gold px-5 py-2.5 rounded-full text-xs font-black">
              <span>تسجيل الدخول</span>
            </button>
          </div>
        )}

        {!loading && !error && !requiresLogin && books.length === 0 && (
          <p className="text-center text-sm text-slate-500">لا توجد كتب متاحة حالياً.</p>
        )}

        {books.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => {
              const price = formatPrice(book.price);
              return (
                <div
                  key={book.id}
                  className={`bg-white rounded-3xl overflow-hidden border shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group ${
                    book.hasAccess ? 'border-emerald-400/70' : 'border-slate-200/80'
                  }`}
                >
                  <div className="p-7 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white flex flex-col justify-between min-h-[170px]">
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black">
                        مستوى {book.level}
                      </span>
                      {!isAuthenticated ? null : book.hasAccess ? (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          مفعّل لك
                        </span>
                      ) : (
                        <span className="bg-white/10 text-slate-300 border border-white/20 px-3 py-1 rounded-full text-xs flex items-center gap-1 font-bold">
                          <Lock className="w-3.5 h-3.5" />
                          غير مفعّل
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <Link href={`/books/${book.id}`}>
                        <h3 className="text-xl font-black text-white leading-tight group-hover:text-amber-300 transition-colors">
                          {book.name}
                        </h3>
                      </Link>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 mt-auto">
                    {price !== null && (
                      <span className="block text-3xl font-black text-gradient-gold">{price} ج.م</span>
                    )}

                    <div className="space-y-2">
                      {book.hasAccess ? (
                        <button
                          onClick={() => handleView(book)}
                          className="w-full glass-pill-active py-3 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-md"
                        >
                          <Eye className="w-4 h-4" />
                          <span>عرض الكتاب</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOrder(book)}
                          className="w-full glass-pill-gold py-3 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-lg"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>اطلب الكتاب</span>
                        </button>
                      )}
                      <Link
                        href={`/books/${book.id}`}
                        className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2"
                      >
                        تفاصيل الكتاب
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
