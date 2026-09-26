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
  Loader2,
  CheckCircle2,
  Headphones,
  FileText,
  Award,
  Clock,
  ChevronLeft,
} from 'lucide-react';

const BOOK_DETAILS = {
  A1: {
    subName: 'Grundstufe A1 - تأسيس المبتدئين من الصفر',
    badge: 'مطبوع + الصوتيات التفاعلية 🎧',
    features: [
      'شرح القواعد والتمارين باللغة العربية والألمانية معاً',
      'أكثر من 500 مفردة وجملة محادثة يومية مترجمة ومصورة',
      'ملفات صوتية لممارسة وتدريب مهارة الاستماع (Hören)',
      'نماذج امتحانات Goethe A1 رسمية متكاملة بالإجابات النموذجية',
    ],
  },
  A2: {
    subName: 'Aufbaukurs A2 - المستوى الثاني والمحادثة',
    badge: 'تمارين ومحادثات تفاعلية 📗',
    features: [
      'تأسيس القواعد المعقدة والجمل الجانبية (Nebensätze)',
      'حصيلة لغوية تفاعلية للمواقف اليومية والتعاملات الرسمية',
      'قسم خاص لمهارة الكتابة (Schreiben) والنصوص النموذجية',
      'تدريبات مكثفة على قواعد التعبير الشفهي (Sprechen)',
    ],
  },
  B1: {
    subName: 'Mittelstufe B1 - دليل التأهيل للسفر والعمل',
    badge: 'شامل امتحانات Goethe / Telc 📘',
    features: [
      'تأهيل كامل لأقسام الامتحان الأربعة (Lesen, Hören, Schreiben, Sprechen)',
      'نماذج امتحانات رسمية سابقة من معهد جوته وتيلك محلولة بالتفصيل',
      'أقوى المصطلحات والتعابير المؤهلة لشركات الكول سنتر (Concentrix & Vodafone)',
      'استراتيجيات وحيل الحل السريع لاجتياز الامتحان من أول محاولة',
    ],
  },
  B2: {
    subName: 'Oberstufe & Medizin B2 - الكفاءة والترجمة المتقدمة',
    badge: 'إعداد وتجهيز حصري ⏳',
    features: [
      'مصطلحات طبية وهندسية تخصصية لسوق العمل الألماني',
      'الترجمة الأكاديمية والنقاشات المتقدمة والتعبير المعقد',
      'التحضير الشامل لامتحانات Telc B2 & ÖSD',
    ],
    unavailableNotice:
      '✨ نعمل على إعداد وتجهيز كتاب B2 بعناية فائقة ليكون مرجعك المثالي ونقلتك نحو إتقان اللغة الألمانية والطلاقة فيها للأطباء والمهندسين والراغبين بالسفر.. انتظرونا قريباً ⏳🇩🇪',
  },
};

export default function BooksSection() {
  const { books, loading, error, requiresLogin, reload } = useBooks();
  const { openBookOrderModal, openAuthModal, openLoginPromptModal, openFileViewer } = useModal();
  const { isAuthenticated } = useAuth();

  const handleView = (book) =>
    openFileViewer({ title: book.name, load: (onProgress) => booksService.viewBook(book, onProgress) });

  const handleOrder = (book) => {
    if (!isAuthenticated) {
      openLoginPromptModal({
        type: 'book',
        name: book.name,
        price: formatPrice(book.price),
        item: book,
      });
      return;
    }
    openBookOrderModal(book);
  };

  return (
    <section id="books-store" className="py-20 bg-slate-50 border-t border-slate-200 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full text-xs font-bold">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>مكتبة الكتب والمذكرات الأكاديمية</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0f172a]">
            سلسلة كتب <span className="text-gradient-cyan">Deutsche Welt</span> المعتمدة
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            مناهج شاملة للشرح، القواعد، الصوتيات، ونماذج الامتحانات المعتمدة — اشترك في الكتاب وحمّله فوراً بصيغة PDF.
          </p>
        </div>

        {loading && books.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-3xl overflow-hidden border border-slate-200 bg-white animate-pulse">
                <div className="h-44 bg-slate-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-2/3" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-4/5" />
                  <div className="h-10 bg-slate-200 rounded-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && books.length === 0 && (
          <div className="max-w-md mx-auto text-center bg-rose-50 border border-rose-200 rounded-3xl p-8 space-y-4">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-sm text-rose-700 font-semibold">{error}</p>
            <button
              onClick={reload}
              className="inline-flex items-center gap-2 glass-pill-gold px-5 py-2.5 rounded-full text-xs font-black"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        )}

        {!loading && requiresLogin && (
          <div className="max-w-md mx-auto text-center bg-teal-50 border border-teal-200 rounded-3xl p-8 space-y-4">
            <Lock className="w-10 h-10 text-teal-600 mx-auto" />
            <p className="text-sm text-teal-900 font-semibold">سجّل الدخول لعرض الكتب المتاحة وأسعارها.</p>
            <button
              onClick={() => openAuthModal('login')}
              className="inline-flex items-center gap-2 glass-pill-gold px-5 py-2.5 rounded-full text-xs font-black"
            >
              <span>تسجيل الدخول</span>
            </button>
          </div>
        )}

        {!loading && !error && !requiresLogin && books.length === 0 && (
          <p className="text-center text-sm text-slate-500">لا توجد كتب متاحة حالياً.</p>
        )}

        {books.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
            {books.map((book) => {
              const price = formatPrice(book.price);
              const details = BOOK_DETAILS[book.level?.toUpperCase()] || {
                subName: `كتاب تأسيس المهارات - المستوى ${book.level}`,
                badge: 'منهج معتمد 📚',
                features: [
                  'شرح القواعد والتمارين بالتفصيل',
                  'حصيلة مفردات وجمل مترجمة',
                  'نماذج امتحانات وتدريبات محلولة',
                ],
              };
              const isB2 = book.level?.toUpperCase() === 'B2';

              return (
                <div
                  key={book.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative"
                >
                  {/* Card Header Gradient banner */}
                  <div className="p-7 sm:p-8 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white relative overflow-hidden flex flex-col justify-between min-h-[170px]">
                    <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black shadow-sm">
                          مستوى {book.level}
                        </span>
                        <span className="bg-white/10 backdrop-blur-md text-teal-200 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-bold">
                          {details.badge}
                        </span>
                      </div>

                      {book.hasAccess && (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md px-3 py-1 rounded-full text-xs flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          متاح لك 🔓
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-start gap-3 z-10">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400/20 to-teal-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <Link href={`/books/${book.id}`}>
                          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md group-hover:text-amber-300 transition-colors">
                            {book.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-teal-200/90 font-medium mt-1">
                          {details.subName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                    
                    {/* B2 Unavailable Notice Banner */}
                    {isB2 && details.unavailableNotice && (
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold leading-relaxed flex items-start gap-2.5">
                        <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{details.unavailableNotice}</span>
                      </div>
                    )}

                    {/* Features & Contents List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-teal-600" />
                        <span>محتويات ومميزات الكتاب الشاملة:</span>
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {details.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs font-bold text-slate-700 leading-snug">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price and Action Row */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      {price !== null && (
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-xs text-slate-400 block font-medium">سعر النسخة الكاملة:</span>
                            <span className="text-3xl font-black text-gradient-gold">{price} ج.م</span>
                          </div>
                          <span className="text-xs text-teal-700 font-bold bg-teal-50 border border-teal-200 px-3 py-1 rounded-full flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-teal-600" />
                            <span>عرض أونلاين PDF</span>
                          </span>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Link
                          href={`/books/${book.id}`}
                          className="w-full py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700/80 shadow-sm"
                        >
                          <BookOpen className="w-4 h-4 text-amber-400" />
                          <span>تفاصيل الكتاب</span>
                        </Link>

                        {book.hasAccess ? (
                          <button
                            onClick={() => handleView(book)}
                            className="w-full glass-pill-active py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-md"
                          >
                            <Eye className="w-4 h-4" />
                            <span>عرض الكتاب</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOrder(book)}
                            className="w-full glass-pill-gold py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                          >
                            {isAuthenticated ? <ShoppingCart className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            <span>{isAuthenticated ? 'اطلب الكتاب الآن' : 'سجّل الدخول لشراء الكتاب 🛒'}</span>
                          </button>
                        )}
                      </div>

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
