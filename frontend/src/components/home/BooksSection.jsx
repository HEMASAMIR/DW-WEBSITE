'use client';

import React from 'react';
import Link from 'next/link';
import { useBooks } from '@/hooks/useBooks';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatPriceLatin } from '@/services/courses.service';
import { toneFor } from '@/constants/levelTones';
import BookCover from '@/components/book/BookCover';
import Reveal from '@/components/common/Reveal';
import { Eye, ShoppingCart, Lock, Sparkles, RefreshCw, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';

// Every value on a book card comes from the backend (name, level, price, has_access).
// Do not add hard-coded descriptions/features here.
export default function BooksSection() {
  const { books, loading, error, requiresLogin, reload } = useBooks();
  const { openBookOrderModal, openAuthModal, openLoginPromptModal } = useModal();
  const { isAuthenticated } = useAuth();

  const handleOrder = (book) => {
    if (!isAuthenticated) {
      openLoginPromptModal({ type: 'book', name: book.name, price: formatPrice(book.price), item: book });
      return;
    }
    openBookOrderModal(book);
  };

  return (
    <section id="books-store" className="py-24 bg-slate-50 border-t border-slate-200 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Reveal className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-4 py-1.5 rounded-full text-xs font-black text-[#0e2c4e]">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>كتب الأكاديمية</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0e2c4e]">
            كتب <span className="text-teal-600" dir="ltr">Deutsche Welt</span>
          </h2>
          <div className="flex h-1.5 w-24 mx-auto rounded-full overflow-hidden" dir="ltr">
            <span className="flex-1 bg-slate-900" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
          </div>
          <p className="text-slate-600 text-sm sm:text-base">
            بعد تفعيل الكتاب على حسابك تقدر تعرضه أونلاين من الموقع مباشرة.
          </p>
        </Reveal>

        {loading && books.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-[2rem] overflow-hidden border border-slate-200 bg-white animate-pulse">
                <div className="h-60 bg-slate-200" />
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
            <button onClick={reload} className="inline-flex items-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-full text-xs font-black">
              <RefreshCw className="w-4 h-4" />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        )}

        {!loading && requiresLogin && (
          <div className="max-w-md mx-auto text-center bg-teal-50 border border-teal-200 rounded-3xl p-8 space-y-4">
            <Lock className="w-10 h-10 text-teal-600 mx-auto" />
            <p className="text-sm text-teal-900 font-semibold">سجّل الدخول لعرض الكتب المتاحة وأسعارها.</p>
            <button onClick={() => openAuthModal('login')} className="inline-flex items-center gap-2 bg-[#0e2c4e] text-white px-5 py-2.5 rounded-full text-xs font-black">
              <span>تسجيل الدخول</span>
            </button>
          </div>
        )}

        {!loading && !error && !requiresLogin && books.length === 0 && (
          <p className="text-center text-sm text-slate-500">لا توجد كتب متاحة حالياً.</p>
        )}

        {books.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book, idx) => {
              const tone = toneFor(book.level, idx);
              const price = formatPriceLatin(book.price);
              return (
                <Reveal key={book.id} delay={(idx % 3) * 140} from="zoom" className="h-full [&>*]:h-full">
                  <div
                    className={`group relative flex flex-col bg-white rounded-[2rem] overflow-hidden border ${tone.border} shadow-lg shadow-slate-900/[0.04] hover:shadow-2xl ${tone.shadow} hover:-translate-y-2 transition-all duration-500`}
                  >
                    {/* Stage with 3D cover */}
                    <Link href={`/books/${book.id}`} className={`dw-shine relative h-64 bg-gradient-to-b ${tone.stage} flex items-center justify-center overflow-hidden`}>
                      <span className={`absolute w-44 h-44 rounded-full ${tone.glow} blur-3xl group-hover:scale-150 transition-transform duration-700`} />
                      <span
                        className="absolute inset-0 opacity-40"
                        style={{ backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.08) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                      />
                      <span className="absolute top-4 right-4 z-10 flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full border text-[11px] font-black bg-white/90 ${tone.chip}`}>مستوى {book.level}</span>
                      </span>
                      {isAuthenticated && (
                        <span className="absolute top-4 left-4 z-10">
                          {book.hasAccess ? (
                            <span className="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500 text-white flex items-center gap-1 shadow-md shadow-emerald-500/30">
                              <CheckCircle2 className="w-3.5 h-3.5" /> مفعّل لك
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-[11px] font-black bg-white/90 text-slate-600 border border-slate-200 flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5" /> غير مفعّل
                            </span>
                          )}
                        </span>
                      )}
                      <span className="relative group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-500">
                        <BookCover name={book.name} level={book.level} size="md" />
                      </span>
                      <span className="absolute bottom-5 inset-x-20 h-3 rounded-[50%] bg-slate-900/20 blur-md" />
                    </Link>

                    <div className="flex-1 flex flex-col p-6 gap-4">
                      <Link href={`/books/${book.id}`} className="flex-1">
                        <h3 className="text-lg font-black text-[#0e2c4e] leading-snug line-clamp-2" dir="auto">{book.name}</h3>
                        <span className={`block h-1 w-10 rounded-full mt-3 ${tone.bar} group-hover:w-24 transition-all duration-500`} />
                      </Link>

                      <div className="flex items-end justify-between gap-3">
                        {book.hasAccess ? (
                          <span className="text-sm font-black text-emerald-600">جاهز للقراءة</span>
                        ) : price !== null ? (
                          <span className="flex items-baseline gap-1.5">
                            <span className={`text-3xl font-black tracking-tight ${tone.price}`} dir="ltr">{price}</span>
                            <span className="text-sm font-black text-slate-500">ج.م</span>
                          </span>
                        ) : <span />}
                        <Link href={`/books/${book.id}`} className={`inline-flex items-center gap-1 text-xs font-black ${tone.text} group-hover:gap-2 transition-all`}>
                          التفاصيل
                          <ChevronLeft className="w-4 h-4" />
                        </Link>
                      </div>

                      {book.hasAccess ? (
                        <Link
                          href={`/books/${book.id}/read`}
                          className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>اقرأ الكتاب</span>
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleOrder(book)}
                          className={`w-full py-3.5 rounded-2xl text-white text-sm font-black flex items-center justify-center gap-2 shadow-lg transition-colors ${tone.btn}`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>اطلب الكتاب</span>
                        </button>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
