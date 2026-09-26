'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useBooks } from '@/hooks/useBooks';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { booksService } from '@/services/books.service';
import { formatPrice } from '@/services/courses.service';
import {
  ArrowRight, BookOpen, CheckCircle2, Eye, ShoppingCart, Lock, LogIn, Loader2, AlertCircle, RefreshCw, FileText,
} from 'lucide-react';

export default function BookPage() {
  const { id } = useParams();
  const { books, loading, error, requiresLogin, reload } = useBooks();
  const { isAuthenticated } = useAuth();
  const { openAuthModal, openBookOrderModal, openFileViewer, openLoginPromptModal } = useModal();

  const book = books.find((b) => String(b.id) === String(id));
  const price = book ? formatPrice(book.price) : null;
  const otherBooks = books.filter((b) => b.id !== book?.id);

  const viewBook = () =>
    openFileViewer({ title: book.name, load: (onProgress) => booksService.viewBook(book, onProgress) });

  return (
    <div className="min-h-[70vh] bg-slate-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link href="/books" className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-900">
          <ArrowRight className="w-4 h-4" />
          كل الكتب
        </Link>

        {loading && !book ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-9 h-9 text-teal-600 animate-spin" />
          </div>
        ) : requiresLogin ? (
          <Notice icon={Lock} text="سجّل الدخول لعرض تفاصيل الكتاب.">
            <button onClick={() => openAuthModal('login')} className="inline-flex items-center gap-2 glass-pill-gold px-6 py-2.5 rounded-full text-sm font-black">
              <LogIn className="w-4 h-4" /> تسجيل الدخول
            </button>
          </Notice>
        ) : error ? (
          <Notice icon={AlertCircle} text={error}>
            <button onClick={reload} className="inline-flex items-center gap-2 glass-pill-gold px-6 py-2.5 rounded-full text-sm font-black">
              <RefreshCw className="w-4 h-4" /> إعادة المحاولة
            </button>
          </Notice>
        ) : !book ? (
          <Notice icon={AlertCircle} text="الكتاب غير موجود." />
        ) : (
          <>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-5">
              {/* Cover */}
              <div className="md:col-span-2 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[260px]">
                <span className="bg-amber-400 text-slate-950 px-4 py-1 rounded-full text-sm font-black">مستوى {book.level}</span>
                <BookOpen className="w-20 h-20 text-amber-300" />
                <span className="text-white font-black text-lg leading-snug">{book.name}</span>
              </div>

              {/* Details */}
              <div className="md:col-span-3 p-6 sm:p-8 space-y-5">
                <div className="space-y-1">
                  {book.hasAccess && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" /> متاح لك
                    </span>
                  )}
                  <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a]">{book.name}</h1>
                  <p className="text-sm text-slate-500 font-semibold">مستوى {book.level}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  {price && (
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-gradient-gold">{price} ج.م</span>
                      <span className="text-xs text-teal-700 font-bold bg-teal-50 border border-teal-200 px-3 py-1 rounded-full flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> عرض أونلاين
                      </span>
                    </div>
                  )}

                  {book.hasAccess ? (
                    <button
                      onClick={viewBook}
                      className="w-full glass-pill-active py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      عرض الكتاب
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        isAuthenticated
                          ? openBookOrderModal(book)
                          : openLoginPromptModal({ type: 'book', name: book.name, price, item: book })
                      }
                      className="w-full glass-pill-gold py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {isAuthenticated ? 'اطلب الكتاب عبر واتساب' : 'اطلب الكتاب'}
                    </button>
                  )}
                  {!book.hasAccess && isAuthenticated && (
                    <p className="text-[11px] text-slate-500 text-center">بعد تأكيد الدفع يتفعّل الكتاب على حسابك ويظهر زرار العرض هنا.</p>
                  )}
                </div>
              </div>
            </div>

            {otherBooks.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-black text-[#0f172a]">كتب أخرى</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {otherBooks.map((b) => (
                    <Link
                      key={b.id}
                      href={`/books/${b.id}`}
                      className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 hover:border-teal-400 hover:shadow-md transition-all"
                    >
                      <span className="w-11 h-11 rounded-xl bg-teal-700 text-white font-black text-sm flex items-center justify-center shrink-0">{b.level}</span>
                      <div className="min-w-0">
                        <span className="block text-sm font-bold text-slate-900 truncate">{b.name}</span>
                        <span className="text-xs text-teal-700 font-bold">{formatPrice(b.price)} ج.م</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Notice({ icon: Icon, text, children }) {
  return (
    <div className="max-w-md mx-auto text-center bg-white border border-slate-200 rounded-3xl p-10 space-y-4 text-slate-700">
      <Icon className="w-10 h-10 mx-auto opacity-70" />
      <p className="text-sm font-semibold">{text}</p>
      {children}
    </div>
  );
}
