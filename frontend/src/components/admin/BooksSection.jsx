'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';
import { getErrorMessage } from '@/services/api';
import BookCover from '@/components/book/BookCover';
import {
  Card, Btn, Input, Select, Field, Switch, Modal, StatusBadge, SectionHeader, Segmented, Skeleton, Empty, ErrorBox,
  money, useToast, useConfirm,
} from './ui';
import { BookOpen, Plus, Pencil, Trash2, Upload, Eye, Users, Clock3, Save, ExternalLink } from 'lucide-react';
import { translate as t } from './prefs';

const BOOK_LEVELS = [
  { value: 'A1', label: 'A1' }, { value: 'A2', label: 'A2' }, { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' }, { value: 'General', label: t('عام') },
];

export default function BooksSection({ onChanged }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [books, setBooks] = useState(null);
  const [error, setError] = useState('');
  const [level, setLevel] = useState('');
  const [editing, setEditing] = useState(null);

  const load = useCallback(() => {
    setError('');
    adminService.getBooks().then(setBooks).catch((e) => setError(getErrorMessage(e, t('تعذر تحميل الكتب.'))));
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(load, [load]);

  const shown = useMemo(() => (books || []).filter((b) => !level || b.level === level), [books, level]);

  const togglePublish = async (b) => {
    try {
      await adminService.updateBook(b.id, { is_active: !b.is_active });
      toast('ok', b.is_active ? t('الكتاب اتخفى من الموقع.') : t('الكتاب اتنشر على الموقع.'));
      load();
    } catch (e) {
      toast('err', getErrorMessage(e));
    }
  };

  const remove = async (b) => {
    if (!(await confirm({ title: t('حذف «{name}»؟', { name: b.name }), text: t('الكتاب وملفه وصلاحيات {n} طالب هيتمسحوا نهائياً.', { n: b.readers }), confirmText: t('حذف نهائي') }))) return;
    try {
      toast('ok', (await adminService.deleteBook(b.id)).detail);
      load();
      onChanged();
    } catch (e) {
      toast('err', getErrorMessage(e));
    }
  };

  return (
    <div>
      <SectionHeader
        icon={BookOpen}
        title={t('الكتب')}
        subtitle={t('كتب كل مستوى — ارفع كتاب جديد أو عدّل السعر أو اخفيه')}
        actions={<Btn variant="gold" icon={Plus} onClick={() => setEditing({})}>{t('كتاب جديد')}</Btn>}
      />

      <div className="mb-5">
        <Segmented
          value={level}
          onChange={setLevel}
          options={[
            { value: '', label: t('كل الكتب') },
            ...BOOK_LEVELS.map((l) => ({ value: l.value, label: l.value === 'General' ? t('عام') : t('مستوى {code}', { code: l.label }), count: (books || []).filter((b) => b.level === l.value && b.pending).reduce((a, b) => a + b.pending, 0) })),
          ]}
        />
      </div>

      {error ? (
        <ErrorBox message={error} onRetry={load} />
      ) : !books ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-60 !rounded-3xl" />)}</div>
      ) : shown.length === 0 ? (
        <Card><Empty icon={BookOpen} title={t('مفيش كتب هنا')} action={<Btn icon={Plus} onClick={() => setEditing({ level: level || 'A1' })}>{t('أضف كتاب')}</Btn>} /></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {shown.map((b) => (
            <Card key={b.id} className={`group overflow-hidden flex flex-col ${!b.is_active ? 'opacity-80' : ''}`}>
              <div className="relative flex items-center gap-5 p-5 bg-gradient-to-br from-slate-100 via-slate-50 to-white">
                <BookCover id={b.id} name={b.name} level={b.level} size="md" />
                <div className="min-w-0 flex-1 space-y-2">
                  <StatusBadge status={b.is_active ? 'published' : 'hidden'} />
                  <h3 className="text-base font-black text-slate-900 leading-snug line-clamp-3" dir="auto">{b.name}</h3>
                  <p className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-teal-700" dir="ltr">{money(b.price)}</span>
                    <span className="text-xs font-black text-slate-400">{t('ج.م')}</span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-x-reverse divide-slate-100 border-y border-slate-100">
                <div className="py-3 text-center">
                  <Users className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                  <p className="text-base font-black text-slate-900">{b.readers ?? 0}</p>
                  <p className="text-[10px] font-bold text-slate-400">{t('طالب مفعّل له')}</p>
                </div>
                <div className={`py-3 text-center ${b.pending ? 'bg-amber-50' : ''}`}>
                  <Clock3 className={`w-4 h-4 mx-auto mb-1 ${b.pending ? 'text-amber-600' : 'text-slate-400'}`} />
                  <p className={`text-base font-black ${b.pending ? 'text-amber-700' : 'text-slate-900'}`}>{b.pending ?? 0}</p>
                  <p className="text-[10px] font-bold text-slate-400">{t('طلب مستني')}</p>
                </div>
              </div>
              <div className="mt-auto p-4 flex flex-wrap gap-2">
                <Btn size="sm" variant="ghost" icon={Pencil} onClick={() => setEditing(b)}>{t('تعديل')}</Btn>
                <Btn size="sm" variant="ghost" icon={Eye} onClick={() => togglePublish(b)}>{b.is_active ? t('إخفاء') : t('نشر')}</Btn>
                <div className="ms-auto flex gap-1">
                  <Link href={`/books/${b.id}/read`} target="_blank" className="h-9 w-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center" title={t('افتح الكتاب')}>
                    <ExternalLink className="w-4 h-4 text-slate-600" />
                  </Link>
                  <Btn size="icon" variant="ghost" title={t('حذف')} onClick={() => remove(b)}><Trash2 className="w-4 h-4 text-rose-500" /></Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && <BookForm book={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function BookForm({ book, onClose, onSaved }) {
  const toast = useToast();
  const isNew = !book.id;
  const fileRef = useRef(null);
  const [form, setForm] = useState({ name: book.name || '', level: book.level || 'A1', price: book.price ?? '', is_active: book.is_active ?? true });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (isNew && !file) return toast('err', t('ارفع ملف الكتاب PDF.'));
    setSaving(true);
    try {
      const fields = { ...form, ...(file ? { file } : {}) };
      if (isNew) await adminService.createBook(fields);
      else await adminService.updateBook(book.id, fields);
      toast('ok', isNew ? t('تم إضافة الكتاب.') : t('تم حفظ الكتاب.'));
      onSaved();
    } catch (err) {
      toast('err', getErrorMessage(err));
    } finally {
      setSaving(false);
    }
    return undefined;
  };

  return (
    <Modal open onClose={onClose} title={isNew ? t('كتاب جديد') : t('تعديل الكتاب')} subtitle={book.name} icon={BookOpen}>
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={t('اسم الكتاب')} className="sm:col-span-2"><Input required dir="auto" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label={t('المستوى')}>
          <Select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
            {BOOK_LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </Select>
        </Field>
        <Field label={t('السعر (ج.م)')}><Input required type="number" min="0" step="0.01" dir="ltr" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></Field>
        <Field label={isNew ? t('ملف الكتاب (PDF)') : t('استبدال ملف الكتاب (اختياري)')} className="sm:col-span-2">
          <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={`w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-5 text-sm font-black transition-colors ${
              file ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-300 text-slate-500 hover:border-teal-400 hover:text-teal-700'
            }`}
          >
            <Upload className="w-5 h-5" /> <span className="truncate max-w-[18rem]" dir="auto">{file ? file.name : book.file_name || t('اختار ملف PDF')}</span>
          </button>
        </Field>
        <div className="sm:col-span-2"><Switch checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label={t('منشور وظاهر في الموقع')} /></div>
        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
          <Btn type="button" variant="ghost" onClick={onClose}>{t('إلغاء')}</Btn>
          <Btn type="submit" icon={Save} loading={saving}>{isNew ? t('إضافة الكتاب') : t('حفظ')}</Btn>
        </div>
      </form>
    </Modal>
  );
}
