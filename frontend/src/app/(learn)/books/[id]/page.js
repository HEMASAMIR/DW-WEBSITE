'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useBooks } from '@/hooks/useBooks';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { formatPrice, formatPriceLatin } from '@/services/courses.service';
import BookCover, { toneFor, bookCoverUrl } from '@/components/book/BookCover';
import PaymentInfo from '@/components/common/PaymentInfo';
import {
  ArrowRight, CheckCircle2, BookOpenText, ShoppingCart, Lock, LogIn, AlertCircle, RefreshCw, ChevronLeft, BookOpen,
  Wallet, Zap, ShieldCheck,
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
            <div id="payment" className="max-w-2xl scroll-mt-24">
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
                  <BookCover id={b.id} name={b.name} level={b.level} size="sm" />
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
  const tone = toneFor(book.level);

  const order = () =>
    isAuthenticated
      ? openBookOrderModal(book)
      : openLoginPromptModal({ type: 'book', name: book.name, price: formatPrice(book.price), item: book });

  return (
    <section className="relative overflow-hidden bg-[#071427] text-white">
      <CoverBackdrop id={book.id} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_85%_10%,rgba(20,184,166,0.35),transparent_60%),radial-gradient(ellipse_50%_60%_at_10%_90%,rgba(245,158,11,0.25),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.06] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        style={{
          backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div className="absolute top-0 inset-x-0 flex h-1" dir="ltr">
        <span className="flex-1 bg-slate-950" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-28 sm:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Info */}
        <div className="lg:col-span-7 space-y-7 order-2 lg:order-1">
          <nav className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
            <Link href="/books" className="hover:text-teal-300 transition-colors">الكتب</Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-teal-300">مستوى {book.level}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3.5 py-1.5 rounded-full bg-gradient-to-r ${tone.badge} text-white text-xs font-black shadow-lg`}>
              مستوى {book.level}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-black text-slate-200">
              <BookOpen className="w-3.5 h-3.5" /> كتاب رقمي • يُقرأ أونلاين
            </span>
            {isAuthenticated && (book.hasAccess ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-300/30 text-xs font-black text-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> مفعّل لك
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-black text-slate-300">
                <Lock className="w-3.5 h-3.5" /> غير مفعّل على حسابك
              </span>
            ))}
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.12] tracking-tight" dir="auto">
              {book.name}
            </h1>
            <div className="flex h-1.5 w-28 rounded-full overflow-hidden" dir="ltr">
              <span className="flex-1 bg-slate-950 ring-1 ring-white/20" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
            </div>
          </div>

          {book.hasAccess ? (
            <div className="flex flex-wrap items-center gap-4">
              <Link href={`/books/${book.id}/read`} className={primaryBtn}>
                <BookOpenText className="w-5 h-5" />
                اقرأ الكتاب
              </Link>
              <span className="text-xs font-bold text-slate-400">بيتفتح جوه الموقع</span>
            </div>
          ) : (
            <div className="relative max-w-xl">
              <div className="absolute -inset-px rounded-[1.75rem] bg-gradient-to-l from-amber-300/60 via-white/10 to-teal-300/40" />
              <div className="relative rounded-[1.7rem] bg-[#0b1d33]/90 backdrop-blur-xl p-5 sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-5">
                  {price && (
                    <div>
                      <span className="block text-xs font-bold text-slate-400 mb-1">سعر الكتاب</span>
                      <span className="flex items-baseline gap-2">
                        <span className="text-5xl sm:text-6xl font-black tracking-tight bg-gradient-to-b from-amber-200 to-amber-400 bg-clip-text text-transparent" dir="ltr">
                          {price}
                        </span>
                        <span className="text-base font-black text-slate-300">ج.م</span>
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                    <button onClick={order} className={`${primaryBtn} justify-center`}>
                      {isAuthenticated ? <ShoppingCart className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                      {isAuthenticated ? 'اطلب الكتاب' : 'سجّل دخول للطلب'}
                    </button>
                    <a
                      href="#payment"
                      className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-sm font-black transition-colors"
                    >
                      <Wallet className="w-4 h-4 text-amber-300" />
                      طرق الدفع
                    </a>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] sm:text-xs font-bold text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5 text-rose-300" /> فودافون كاش</span>
                  <span className="inline-flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-violet-300" /> إنستا باي</span>
                  <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> تفعيل على حسابك بعد تأكيد الدفع</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Book */}
        <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
          <HeroBook book={book} tone={tone} />
        </div>
      </div>

      {/* curved bottom into the page */}
      <svg className="absolute -bottom-px inset-x-0 w-full h-10 sm:h-14 text-slate-50" viewBox="0 0 1440 56" preserveAspectRatio="none" aria-hidden>
        <path d="M0 56 C 360 0, 1080 0, 1440 56 Z" fill="currentColor" />
      </svg>
    </section>
  );
}

/** Floating 3D book: real cover + page block + spine; falls back to the drawn cover. */
function HeroBook({ book, tone }) {
  const [failed, setFailed] = useState(false);
  const src = !failed ? bookCoverUrl(book.id) : null;

  return (
    <div className="group relative py-6">
      {/* glow in the level colour + warm light */}
      <div className={`absolute inset-0 m-auto w-80 h-80 rounded-full ${tone.glow} blur-[80px] opacity-80`} />
      <div className="absolute inset-0 m-auto w-56 h-56 translate-x-20 translate-y-20 rounded-full bg-amber-400/25 blur-[70px]" />

      <div className="relative dw-float">
        {src ? (
          <div className="[perspective:1600px]">
            <div className="relative w-60 sm:w-72 aspect-[1/1.414] [transform:rotateY(-18deg)_rotateX(3deg)] group-hover:[transform:rotateY(-4deg)_rotateX(0deg)] transition-transform duration-700 ease-out">
              {/* page block (thickness) */}
              <div
                className="absolute top-[1.5%] bottom-[1.5%] -right-3 w-4 rounded-r-md shadow-inner"
                style={{ background: 'repeating-linear-gradient(to bottom, #f8fafc 0, #f8fafc 2px, #dbe2ea 2px, #dbe2ea 3px)' }}
              />
              {/* cover */}
              <div className="absolute inset-0 rounded-l-md rounded-r-xl overflow-hidden shadow-[0_40px_70px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element -- static pre-rendered cover */}
                <img src={src} alt={book.name} onError={() => setFailed(true)} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/50 via-black/15 to-transparent" />
                <div className="absolute inset-y-0 left-6 w-px bg-white/40" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/35 mix-blend-soft-light" />
                <div className="absolute -inset-y-10 -left-1/2 w-1/3 rotate-12 bg-white/20 blur-md -translate-x-full group-hover:translate-x-[420%] transition-transform duration-[1200ms]" />
              </div>
              {/* level ribbon */}
              <span className={`absolute -top-3 -left-3 px-3 py-1.5 rounded-xl bg-gradient-to-br ${tone.badge} text-white text-sm font-black shadow-lg`} dir="ltr">
                {book.level}
              </span>
            </div>
          </div>
        ) : (
          <BookCover id={null} name={book.name} level={book.level} size="lg" />
        )}
      </div>
      {/* floor shadow */}
      <div className="absolute -bottom-1 inset-x-12 h-6 rounded-[50%] bg-black/60 blur-xl" />
    </div>
  );
}

/** The book's own first page, blurred, behind the hero (hidden if the book has no cover image). */
function CoverBackdrop({ id }) {
  const [failed, setFailed] = useState(false);
  if (failed || !bookCoverUrl(id)) return null;
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- static pre-rendered cover */}
      <img
        src={bookCoverUrl(id)}
        alt=""
        aria-hidden
        onError={() => setFailed(true)}
        className="absolute inset-0 w-full h-full object-cover scale-125 blur-3xl opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-[#071427] via-[#071427]/85 to-[#071427]/45" />
    </>
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
