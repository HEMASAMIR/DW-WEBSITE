'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useBooks } from '@/hooks/useBooks';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { formatPrice, formatPriceLatin } from '@/services/courses.service';
import BookCover, { toneFor } from '@/components/book/BookCover';
import PaymentInfo from '@/components/common/PaymentInfo';
import {
  ArrowRight, CheckCircle2, BookOpenText, ShoppingCart, Lock, LogIn, AlertCircle, RefreshCw, ChevronLeft, BookOpen,
} from 'lucide-react';

/** Book overview page. Reading happens on its own page: /books/<id>/read. All data from the backend. */
export default function BookPage() {
  const { id } = useParams();
  const { books, loading, error, requiresLogin, reload } = useBooks();
  const { openAuthModal } = useModal();

  const book = books.find((b) => String(b.id) === String(id));
  const otherBooks = books.filter((b) => b.id !== book?.id);

  if (book) {
    return (
      <div className="pb-16">
        <BookHero book={book} />
        {!book.hasAccess && (
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
            <div className="max-w-2xl">
              <PaymentInfo amount={formatPriceLatin(book.price)} />
            </div>
          </div>
        )}
        {otherBooks.length > 0 && (
          <section className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 ${book.hasAccess ? '-mt-8' : ''}`}>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-2xl w-fit pl-5 pr-2 py-2 shadow-sm border border-slate-200/70">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/25">
                <BookOpen className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">كتب أخرى</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {otherBooks.map((b) => (
                <Link
                  key={b.id}
                  href={`/books/${b.id}`}
                  className="group bg-white rounded-3xl border border-slate-200/80 p-4 flex items-center gap-4 shadow-xl shadow-slate-900/[0.04] hover:border-teal-300 hover:shadow-2xl hover:-translate-y-1 transition-all"
                >
                  <BookCover level={b.level} size="sm" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-black text-slate-900 leading-snug line-clamp-2 group-hover:text-teal-800" dir="auto">{b.name}</span>
                    <span className="flex items-center gap-2 mt-1.5">
                      <span className={`px-2 py-0.5 rounded-md border text-[10px] font-black ${toneFor(b.level).chip}`}>مستوى {b.level}</span>
                      {b.hasAccess ? (
                        <span className="text-xs font-black text-emerald-600">مفعّل لك</span>
                      ) : (
                        formatPriceLatin(b.price) && <span className="text-sm font-black text-slate-900" dir="ltr">{formatPriceLatin(b.price)} <span className="text-[10px] text-slate-500">ج.م</span></span>
                      )}
                    </span>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-teal-600 group-hover:-translate-x-1 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
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
        ) : (
          <Notice icon={AlertCircle} text="الكتاب غير موجود.">
            <Link href="/books" className="inline-flex items-center gap-1.5 text-sm font-black text-teal-700">
              <ArrowRight className="w-4 h-4" /> كل الكتب
            </Link>
          </Notice>
        )}
      </div>
    </div>
  );
}

const primaryBtn =
  'group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-300 to-amber-500 text-slate-950 text-sm sm:text-base font-black shadow-xl shadow-amber-500/30 hover:shadow-amber-400/50 transition-all hover:-translate-y-0.5';

function BookHero({ book }) {
  const { isAuthenticated } = useAuth();
  const { openBookOrderModal, openLoginPromptModal } = useModal();
  const price = formatPriceLatin(book.price);

  const order = () =>
    isAuthenticated
      ? openBookOrderModal(book)
      : openLoginPromptModal({ type: 'book', name: book.name, price: formatPrice(book.price), item: book });

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_90%_0%,rgba(20,184,166,0.45),transparent_60%),radial-gradient(ellipse_50%_70%_at_0%_100%,rgba(245,158,11,0.22),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.08] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        style={{
          backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20 sm:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
          <nav className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
            <Link href="/books" className="hover:text-teal-300 transition-colors">الكتب</Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-teal-300">مستوى {book.level}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/30">
              مستوى {book.level}
            </span>
            {isAuthenticated && (book.hasAccess ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-300/30 text-xs font-black text-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> مفعّل لك
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-black text-slate-200">
                <Lock className="w-3.5 h-3.5" /> غير مفعّل على حسابك
              </span>
            ))}
          </div>

          <h1 className="text-4xl sm:text-6xl font-black leading-[1.1] tracking-tight bg-gradient-to-l from-white via-white to-teal-200 bg-clip-text text-transparent pb-1" dir="auto">
            {book.name}
          </h1>

          {book.hasAccess ? (
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href={`/books/${book.id}/read`} className={primaryBtn}>
                <BookOpenText className="w-5 h-5" />
                اقرأ الكتاب
              </Link>
              <span className="text-xs font-bold text-slate-400">بيتفتح جوه الموقع</span>
            </div>
          ) : (
            <div className="inline-flex flex-wrap items-center gap-6 rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur p-4 pr-6">
              {price && (
                <div>
                  <span className="block text-xs font-bold text-slate-400 mb-1">سعر الكتاب</span>
                  <span className="text-4xl sm:text-5xl font-black tracking-tight" dir="ltr">{price}</span>
                  <span className="text-sm font-black text-slate-400 mr-1.5">ج.م</span>
                </div>
              )}
              <button onClick={order} className={primaryBtn}>
                {isAuthenticated ? <ShoppingCart className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                {isAuthenticated ? 'اطلب الكتاب' : 'سجّل دخول للطلب'}
              </button>
            </div>
          )}
          {!book.hasAccess && isAuthenticated && (
            <p className="text-xs sm:text-sm text-slate-400">بعد تأكيد الدفع هيتفعّل الكتاب على حسابك وتقدر تقراه من هنا.</p>
          )}
        </div>

        <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
          <div className="group relative py-4">
            <div className="absolute inset-0 m-auto w-72 h-72 rounded-full bg-teal-400/30 blur-3xl" />
            <div className="absolute inset-0 m-auto w-48 h-48 translate-x-16 translate-y-16 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="relative">
              <BookCover name={book.name} level={book.level} size="lg" />
            </div>
            <div className="absolute -bottom-2 inset-x-10 h-5 rounded-[50%] bg-black/50 blur-lg" />
          </div>
        </div>
      </div>
    </section>
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
