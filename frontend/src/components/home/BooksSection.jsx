'use client';

import React from 'react';
import Link from 'next/link';
import { useBooks } from '@/hooks/useBooks';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { booksService } from '@/services/books.service';
import { formatPrice } from '@/services/courses.service';
import {
  BookOpen,
  Eye,
  ShoppingCart,
  Lock,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Headphones,
  QrCode,
  Truck,
  ShieldCheck,
  Check,
  Flame,
  ArrowLeft
} from 'lucide-react';

const LEVEL_BOOK_THEMES = {
  A1: {
    gradient: 'from-amber-500/15 via-teal-500/5 to-white',
    borderHover: 'hover:border-amber-400',
    coverBg: 'from-amber-600 via-amber-700 to-amber-900',
    accentColor: 'text-amber-600',
    tag: 'الأكثر طلباً للمبتدئين 🔥',
    subtitle: 'Schritt für Schritt (A1)',
  },
  A2: {
    gradient: 'from-sky-500/15 via-blue-500/5 to-white',
    borderHover: 'hover:border-sky-400',
    coverBg: 'from-sky-600 via-blue-700 to-indigo-950',
    accentColor: 'text-sky-600',
    tag: 'المحادثة والتأسيس الثاني 📖',
    subtitle: 'Schritt für Schritt (A2)',
  },
  B1: {
    gradient: 'from-emerald-500/15 via-teal-500/5 to-white',
    borderHover: 'hover:border-emerald-400',
    coverBg: 'from-emerald-600 via-teal-700 to-slate-950',
    accentColor: 'text-emerald-600',
    tag: 'مؤهل امتحانات جوته وتيلك 🏆',
    subtitle: 'Prüfungstraining (B1)',
  },
  B2: {
    gradient: 'from-purple-500/15 via-indigo-500/5 to-white',
    borderHover: 'hover:border-purple-400',
    coverBg: 'from-purple-600 via-indigo-800 to-slate-950',
    accentColor: 'text-purple-600',
    tag: 'الطلاقة والألماني الطبي 🩺',
    subtitle: 'Fachsprache & Beruf (B2)',
  },
};

export default function BooksSection() {
  const { books, loading, error, requiresLogin, reload } = useBooks();
  const { openBookOrderModal, openAuthModal, openLoginPromptModal, openFileViewer } = useModal();
  const { isAuthenticated, isAdmin } = useAuth();

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
    <section id="books-store" className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-200/80 relative z-10 overflow-hidden">
      
      {/* Background Lighting Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500/15 via-teal-500/15 to-amber-500/15 border border-amber-500/30 text-amber-900 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>سلسلة كتب ومناهج هير خالد الرسمية الحصرية 2026</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            كتب <span className="bg-gradient-to-r from-teal-600 via-sky-600 to-amber-600 bg-clip-text text-transparent">Deutsche Welt</span> المعتمدة
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium max-w-2xl mx-auto">
            مناهج مطبوعة فاخرة ملونة مع باركودات QR للاستماع الصوتي وبنك أسئلة الامتحانات السابقة، وتفعيل القراءة الرقمية أونلاين على حسابك فوراً.
          </p>

          {/* Highlights Row */}
          <div className="flex flex-wrap justify-center items-center gap-3 pt-2 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
              <Truck className="w-3.5 h-3.5 text-teal-600" />
              <span>شحن سريع لجميع محافظات مصر</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
              <QrCode className="w-3.5 h-3.5 text-amber-600" />
              <span>صوتيات النطق عبر الباركود</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>المرجع الشامل لامتحانات جوته وتيلك</span>
            </span>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && books.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 animate-pulse shadow-md">
                <div className="h-56 bg-slate-200 rounded-2xl" />
                <div className="h-6 bg-slate-200 rounded w-2/3" />
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-10 bg-slate-200 rounded-2xl mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && books.length === 0 && (
          <div className="max-w-md mx-auto text-center bg-rose-50 border border-rose-200 rounded-3xl p-8 space-y-4 shadow-lg">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-sm text-rose-700 font-semibold">{error}</p>
            <button onClick={reload} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-600 text-white text-xs font-black shadow-md hover:bg-rose-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        )}

        {/* Requires Login */}
        {!loading && requiresLogin && (
          <div className="max-w-md mx-auto text-center bg-teal-50 border border-teal-200 rounded-3xl p-8 space-y-4 shadow-lg">
            <Lock className="w-10 h-10 text-teal-600 mx-auto" />
            <p className="text-sm text-teal-900 font-semibold">سجّل الدخول لعرض الكتب المتاحة وأسعارها.</p>
            <button onClick={() => openAuthModal('login')} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-teal-600 text-white text-xs font-black shadow-md hover:bg-teal-700 transition-colors">
              <span>تسجيل الدخول</span>
            </button>
          </div>
        )}

        {!loading && !error && !requiresLogin && books.length === 0 && (
          <p className="text-center text-sm text-slate-500 py-12">لا توجد كتب متاحة حالياً.</p>
        )}

        {/* Books Grid */}
        {books.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => {
              const price = formatPrice(book.price) || '500';
              const theme = LEVEL_BOOK_THEMES[book.level] || LEVEL_BOOK_THEMES.A1;
              const hasAccess = book.hasAccess || isAdmin;

              return (
                <div
                  key={book.id}
                  className={`group relative rounded-3xl bg-gradient-to-br ${theme.gradient} backdrop-blur-xl border border-slate-200/90 ${theme.borderHover} p-6 sm:p-7 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2.5 flex flex-col justify-between overflow-hidden`}
                >
                  
                  <div>
                    {/* Top Row: Level Tag + Stock/Access Status */}
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-slate-900 text-amber-400 border border-amber-400/30 shadow-xs">
                        <span>مستوى {book.level}</span>
                      </span>

                      {hasAccess ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{isAdmin ? 'متاح بالكامل أونلاين (أدمن) 👑' : 'مفعّل بحسابك ✅'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Truck className="w-3.5 h-3.5 text-amber-600" />
                          <span>متاح الشحن فوراً</span>
                        </span>
                      )}
                    </div>

                    {/* Realistic 3D Hardcover Book Showcase Stage */}
                    <div className="relative py-4 px-2 flex justify-center mb-6">
                      <div className="relative w-48 h-64 rounded-r-2xl rounded-l-md bg-gradient-to-tr ${theme.coverBg} p-5 text-white shadow-2xl transform group-hover:scale-105 group-hover:-rotate-2 transition-all duration-500 border-r-4 border-amber-400/60 flex flex-col justify-between overflow-hidden">
                        
                        {/* Book Spine Shadow Left */}
                        <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />
                        
                        {/* Shiny Book Glare */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />

                        {/* Cover Top Crest */}
                        <div className="flex items-center justify-between border-b border-white/20 pb-2">
                          <span className="text-[10px] font-black tracking-widest text-amber-300 uppercase">DEUTSCHE WELT</span>
                          <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                            {book.level}
                          </span>
                        </div>

                        {/* Cover Center Content */}
                        <div className="text-center my-auto space-y-1">
                          <BookOpen className="w-8 h-8 mx-auto text-amber-300 mb-2 drop-shadow" />
                          <h4 className="text-sm font-black tracking-tight text-white leading-tight">
                            {book.name}
                          </h4>
                          <span className="text-[10px] text-slate-200 block font-mono">
                            {theme.subtitle}
                          </span>
                        </div>

                        {/* Cover Footer */}
                        <div className="text-center pt-2 border-t border-white/20">
                          <span className="text-[10px] font-extrabold text-amber-300 block">
                            Herr Khaled El-Halawany
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Title & Features List */}
                    <div className="space-y-3 mb-6">
                      <Link href={`/books/${book.id}`}>
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                          {book.name}
                        </h3>
                      </Link>

                      <div className="space-y-1.5 text-xs font-bold text-slate-600">
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>شرح القواعد بالعربية + تدريبات نطق يومية</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Headphones className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>QR كود للاستماع الصوتي والنطق السليم</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>نماذج امتحانات وتأهيل Goethe / Telc</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Block & Action Buttons */}
                  <div className="space-y-4 pt-4 border-t border-slate-200/80 mt-auto">
                    
                    {/* Price Tag with Discount */}
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-slate-400 line-through font-mono ml-2">750 ج.م</span>
                        <span className="text-3xl font-black text-slate-950 font-mono">
                          {price} <small className="text-xs font-sans text-slate-600">جنيه مصري</small>
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-700 border border-rose-200">
                        خصم 33% لفترة محدودة
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {hasAccess ? (
                        <button
                          type="button"
                          onClick={() => handleView(book)}
                          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>عرض وقراءة الكتاب أونلاين 📖</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOrder(book)}
                          className="w-full relative group/btn py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-95 overflow-hidden cursor-pointer"
                        >
                          <span className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-12 -translate-x-full group-hover/btn:translate-x-[300%] transition-transform duration-1000 ease-in-out" />
                          <ShoppingCart className="w-4 h-4 fill-slate-950" />
                          <span>اطلب نسختك المطبوعة الآن 🛒</span>
                        </button>
                      )}

                      <Link
                        href={`/books/${book.id}`}
                        className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center gap-2 border border-slate-300/80 transition-colors"
                      >
                        <span>استعراض الفهرس وتفاصيل الكتاب</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
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
