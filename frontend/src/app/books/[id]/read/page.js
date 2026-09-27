'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useBooks } from '@/hooks/useBooks';
import { useModal } from '@/context/ModalContext';
import { booksService } from '@/services/books.service';
import { FileContent } from '@/components/modals/FileViewerModal';
import { ArrowRight, Lock, LogIn, AlertCircle } from 'lucide-react';

/** Standalone reader: /books/<id>/read — the book fills the page. Access is checked by the backend. */
export default function ReadBookPage() {
  const { id } = useParams();
  const { books, loading, requiresLogin } = useBooks();
  const { openAuthModal } = useModal();
  const book = books.find((b) => String(b.id) === String(id));

  const load = useCallback((onProgress) => booksService.viewBook({ id, name: book?.name }, onProgress), [id, book?.name]);

  if (loading && !book) {
    return <div className="h-[80vh] m-4 sm:m-8 rounded-3xl bg-slate-200 animate-pulse" />;
  }

  if (requiresLogin || !book || !book.hasAccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-white border border-slate-200 rounded-3xl p-10 space-y-4 text-slate-700 shadow-sm">
          {book ? <Lock className="w-10 h-10 mx-auto opacity-70" /> : <AlertCircle className="w-10 h-10 mx-auto opacity-70" />}
          <p className="text-sm font-semibold">
            {requiresLogin ? 'سجّل الدخول لقراءة الكتاب.' : !book ? 'الكتاب غير موجود.' : 'الكتاب ده مش مفعّل على حسابك.'}
          </p>
          {requiresLogin ? (
            <button onClick={() => openAuthModal('login')} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-full text-sm font-black">
              <LogIn className="w-4 h-4" /> تسجيل الدخول
            </button>
          ) : (
            <Link href={book ? `/books/${book.id}` : '/books'} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-full text-sm font-black">
              {book ? 'تفاصيل الكتاب والطلب' : 'كل الكتب'}
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 flex flex-col" style={{ height: 'calc(100vh - 5rem)' }}>
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-slate-900 border-b border-slate-800 text-white">
        <Link href={`/books/${book.id}`} className="inline-flex items-center gap-2 min-w-0 text-sm font-black hover:text-amber-300">
          <ArrowRight className="w-4 h-4 shrink-0" />
          <span className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center shrink-0">{book.level}</span>
          <span className="truncate" dir="auto">{book.name}</span>
        </Link>
        <span className="text-xs font-bold text-slate-400 shrink-0 hidden sm:inline">وضع القراءة</span>
      </div>
      <FileContent title={book.name} load={load} />
    </div>
  );
}
