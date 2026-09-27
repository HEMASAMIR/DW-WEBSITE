'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useBooks } from '@/hooks/useBooks';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { formatPrice } from '@/services/courses.service';
import {
  ArrowRight, BookOpen, CheckCircle2, BookOpenText, ShoppingCart, Lock, LogIn, AlertCircle, RefreshCw, ChevronLeft,
} from 'lucide-react';

/** Book overview page. Reading happens on its own page: /books/<id>/read. All data from the backend. */
export default function BookPage() {
  const { id } = useParams();
  const { books, loading, error, requiresLogin, reload } = useBooks();
  const { openAuthModal } = useModal();

  const book = books.find((b) => String(b.id) === String(id));
  const otherBooks = books.filter((b) => b.id !== book?.id);

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-slate-100 to-slate-50 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {loading && !book ? (
          <div className="h-80 rounded-[2rem] bg-slate-300/70 animate-pulse" />
        ) : requiresLogin ? (
          <Notice icon={Lock} text="سجّل الدخول لعرض تفاصيل الكتاب.">
            <button onClick={() => openAuthModal('login')} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-full text-sm font-black">
              <LogIn className="w-4 h-4" /> تسجيل الدخول
            </button>
          </Notice>
        ) : error ? (
          <Notice icon={AlertCircle} text={error}>
            <button onClick={reload} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-full text-sm font-black">
              <RefreshCw className="w-4 h-4" /> إعادة المحاولة
            </button>
          </Notice>
        ) : !book ? (
          <Notice icon={AlertCircle} text="الكتاب غير موجود.">
            <Link href="/books" className="inline-flex items-center gap-1.5 text-sm font-black text-teal-700">
              <ArrowRight className="w-4 h-4" /> كل الكتب
            </Link>
          </Notice>
        ) : (
          <>
            <BookHero book={book} />
            {otherBooks.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-black text-slate-900">كتب أخرى</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {otherBooks.map((b) => (
                    <Link
                      key={b.id}
                      href={`/books/${b.id}`}
                      className="group bg-white rounded-3xl border border-slate-200 p-4 flex items-center gap-4 hover:border-teal-300 hover:shadow-lg transition-all"
                    >
                      <MiniCover level={b.level} />
                      <div className="flex-1 min-w-0">
                        <span className="block text-sm font-black text-slate-900 leading-snug line-clamp-2 group-hover:text-teal-800" dir="auto">{b.name}</span>
                        <span className="block text-xs font-bold text-slate-500 mt-1">مستوى {b.level}</span>
                        <span className="block text-base font-black text-teal-700 mt-1">{formatPrice(b.price)} ج.م</span>
                      </div>
                      <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-teal-600 shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BookHero({ book }) {
  const { isAuthenticated } = useAuth();
  const { openBookOrderModal, openLoginPromptModal } = useModal();
  const price = formatPrice(book.price);

  const order = () =>
    isAuthenticated ? openBookOrderModal(book) : openLoginPromptModal({ type: 'book', name: book.name, price, item: book });

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-900/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.35),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.2),transparent_50%)]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '22px 22px' }}
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-10 p-6 sm:p-10 items-center">
        <div className="lg:col-span-3 space-y-5">
          <Link href="/books" className="inline-flex items-center gap-1 text-xs font-bold text-teal-200/80 hover:text-white">
            <ArrowRight className="w-3.5 h-3.5" />
            كل الكتب
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black">
              مستوى {book.level}
            </span>
            {isAuthenticated && (book.hasAccess ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-300/30 text-xs font-black text-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> مفعّل لك
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-black text-slate-200">
                <Lock className="w-3.5 h-3.5" /> غير مفعّل
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight" dir="auto">{book.name}</h1>

          {book.hasAccess ? (
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href={`/books/${book.id}/read`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-sm font-black shadow-lg shadow-amber-500/25 transition-transform hover:scale-[1.03]"
              >
                <BookOpenText className="w-4 h-4" />
                اقرأ الكتاب
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-5 pt-1">
              {price && (
                <div>
                  <span className="block text-xs font-bold text-slate-400">سعر الكتاب</span>
                  <span className="text-4xl font-black">{price}</span>
                  <span className="text-sm font-black text-slate-400 mr-1">ج.م</span>
                </div>
              )}
              <button
                onClick={order}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-sm font-black shadow-lg shadow-amber-500/25 transition-transform hover:scale-[1.03]"
              >
                <ShoppingCart className="w-4 h-4" />
                اطلب الكتاب
              </button>
            </div>
          )}
          {!book.hasAccess && isAuthenticated && (
            <p className="text-xs text-slate-400">بعد تأكيد الدفع هيتفعّل الكتاب على حسابك وتقدر تقراه من هنا.</p>
          )}
        </div>

        <div className="lg:col-span-2 flex justify-center">
          <Cover book={book} />
        </div>
      </div>
    </section>
  );
}

/** Decorative book cover built from the backend name + level (no images needed). */
function Cover({ book }) {
  return (
    <div className="relative [perspective:1200px]">
      <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-l-md rounded-r-2xl bg-gradient-to-br from-teal-600 via-teal-800 to-slate-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] [transform:rotateY(-14deg)] transition-transform duration-500 hover:[transform:rotateY(0deg)] overflow-hidden border-r-4 border-amber-400/70">
        <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20" />
        <div className="relative h-full p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <span className="text-[10px] font-black tracking-[0.2em] text-amber-300" dir="ltr">DEUTSCHE WELT</span>
            <span className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center">{book.level}</span>
          </div>
          <div className="text-center space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-amber-300" />
            <p className="text-base font-black leading-snug text-white text-center" dir="auto">{book.name}</p>
          </div>
          <div className="h-1 w-16 mx-auto rounded-full bg-amber-400/70" />
        </div>
      </div>
    </div>
  );
}

function MiniCover({ level }) {
  return (
    <span className="w-14 h-[4.5rem] rounded-l-sm rounded-r-lg bg-gradient-to-br from-teal-600 to-slate-900 border-r-2 border-amber-400/70 text-white font-black text-sm flex items-center justify-center shadow-md shrink-0">
      {level}
    </span>
  );
}

function Notice({ icon: Icon, text, children }) {
  return (
    <div className="max-w-md mx-auto text-center bg-white border border-slate-200 rounded-3xl p-10 space-y-4 text-slate-700 shadow-sm">
      <Icon className="w-10 h-10 mx-auto opacity-70" />
      <p className="text-sm font-semibold">{text}</p>
      {children}
    </div>
  );
}
