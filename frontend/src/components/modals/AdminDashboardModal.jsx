'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useModal } from '@/context/ModalContext';
import { adminService } from '@/services/admin.service';
import { getErrorMessage } from '@/services/api';
import { formatPrice, coursesService } from '@/services/courses.service';
import {
  X,
  ShieldCheck,
  Users,
  BookOpen,
  Layers,
  RefreshCw,
  UserPlus,
  UserMinus,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  UserCog,
} from 'lucide-react';

const inputClass =
  'bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400';

export default function AdminDashboardModal() {
  const { activeModal, closeModal } = useModal();
  if (activeModal !== 'adminDashboard') return null;
  return <AdminDashboard onClose={closeModal} />;
}

function AdminDashboard({ onClose }) {
  const [tab, setTab] = useState('levels');
  const [levels, setLevels] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [levelsError, setLevelsError] = useState(null); // { status, message }
  const [booksError, setBooksError] = useState(null);
  const [levelNames, setLevelNames] = useState([]);
  // Regular levels list — shown read-only when the server refuses the level-admin endpoints (403).
  const [catalogLevels, setCatalogLevels] = useState([]);
  const [toast, setToast] = useState({ type: '', text: '' });

  const notify = useCallback((type, text) => setToast({ type, text }), []);

  const [reloadKey, setReloadKey] = useState(0);

  const loadAll = useCallback(() => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  // Levels and books are loaded independently: an account may be allowed to manage books but not
  // levels (backend returns 403), and one failing section must not hide the other.
  useEffect(() => {
    let cancelled = false;
    const asError = (err, fallback) => ({ status: err.response?.status, message: getErrorMessage(err, fallback) });
    Promise.allSettled([adminService.getLevels(), adminService.getBooks(), coursesService.getLevels()])
      .then(([lv, bk, studentLevels]) => {
        if (cancelled) return;
        // Level names for the book form: admin list if allowed, otherwise the regular levels list.
        const names = (lv.status === 'fulfilled' ? lv.value.map((l) => l.name)
          : studentLevels.status === 'fulfilled' ? studentLevels.value.map((l) => l.code) : []);
        setLevelNames(names);
        setCatalogLevels(studentLevels.status === 'fulfilled' ? studentLevels.value : []);
        if (lv.status === 'fulfilled') {
          setLevels([...lv.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
          setLevelsError(null);
        } else {
          setLevels([]);
          setLevelsError(asError(lv.reason, 'تعذر تحميل المستويات.'));
        }
        if (bk.status === 'fulfilled') {
          setBooks(bk.value);
          setBooksError(null);
        } else {
          setBooks([]);
          setBooksError(asError(bk.reason, 'تعذر تحميل الكتب.'));
        }
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const totalSubscriptions = levels.reduce((sum, l) => sum + (Number(l.access_count) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 max-h-[94vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pl-12">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">لوحة الإدارة</h3>
            <p className="text-xs text-purple-300 font-medium">إدارة المستويات والكتب وصلاحيات الطلاب</p>
          </div>
          <button onClick={loadAll} className="mr-auto p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white" title="تحديث">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat icon={Layers} label="المستويات" value={levelsError ? (catalogLevels.length || '—') : levels.length} color="text-amber-400" />
          <Stat icon={Users} label="اشتراكات المستويات المفعلة" value={levelsError ? '—' : totalSubscriptions} color="text-emerald-400" />
          <Stat icon={BookOpen} label="الكتب" value={booksError ? '—' : books.length} color="text-sky-400" />
          <Stat icon={BookOpen} label="الكتب المنشورة" value={booksError ? '—' : books.filter((b) => b.is_active).length} color="text-purple-400" />
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {[
            { key: 'levels', label: 'المستويات والاشتراكات' },
            { key: 'books', label: 'الكتب' },
            { key: 'roles', label: 'صلاحيات المستخدمين' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === t.key ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {toast.text && (
          <div
            className={`p-3 rounded-xl text-xs border flex justify-between items-center ${
              toast.type === 'ok' ? 'bg-emerald-950/80 border-emerald-800/60 text-emerald-300' : 'bg-red-950/80 border-red-800/60 text-red-300'
            }`}
          >
            <span>{toast.text}</span>
            <button onClick={() => setToast({ type: '', text: '' })}><X className="w-3.5 h-3.5" /></button>
          </div>
        )}

        {loading && levels.length === 0 && books.length === 0 ? (
          <div className="flex justify-center py-12"><Loader2 className="w-7 h-7 text-purple-400 animate-spin" /></div>
        ) : tab === 'levels' && levelsError?.status === 403 && catalogLevels.length > 0 ? (
          <LevelsReadOnly levels={catalogLevels} onClose={onClose} />
        ) : tab === 'levels' && levelsError ? (
          <SectionError error={levelsError} what="المستويات وتفعيلها للطلاب" />
        ) : tab === 'books' && booksError ? (
          <SectionError error={booksError} what="الكتب" />
        ) : tab === 'levels' ? (
          <div className="space-y-3">
            {levels.map((level) => (
              <LevelRow key={level.id} level={level} notify={notify} onChanged={loadAll} />
            ))}
            {levels.length === 0 && <p className="text-xs text-slate-500 text-center py-6">لا توجد مستويات.</p>}
          </div>
        ) : tab === 'books' ? (
          <BooksAdmin books={books} levelNames={levelNames} notify={notify} onChanged={loadAll} />
        ) : (
          <RolesAdmin notify={notify} />
        )}
      </div>
    </div>
  );
}

function SectionError({ error, what }) {
  const forbidden = error.status === 403;
  return (
    <div className="text-center py-10 space-y-3 max-w-lg mx-auto">
      <AlertCircle className={`w-10 h-10 mx-auto ${forbidden ? 'text-amber-400' : 'text-rose-400'}`} />
      {forbidden ? (
        <>
          <p className="text-sm text-amber-200 font-bold">حسابك مش عنده صلاحية إدارة {what} على السيرفر.</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            السيرفر رجّع 403 لحسابك في القسم ده. المطلوب من مطوّر الباك إند يخلّي صلاحيات القسم ده
            تتحدد بجروب &quot;Admin&quot; زي قسم الكتب، وبعدها القسم ده هيشتغل تلقائياً.
          </p>
        </>
      ) : (
        <p className="text-sm text-rose-300">{error.message}</p>
      )}
    </div>
  );
}

/**
 * Shown while the server still refuses level management for the "Admin" group (403):
 * the real levels list (read-only) + a short note, instead of a big error.
 */
function LevelsReadOnly({ levels, onClose }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-100 leading-relaxed">
          <strong className="text-amber-300">تفعيل المستويات للطلاب من هنا</strong> هيشتغل أول ما يتحدّث السيرفر
          (صلاحية جروب Admin لقسم المستويات). لحد ده، المستويات معروضة للاطلاع، وإدارة الكتب شغالة عادي.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {levels.map((l) => (
          <div key={l.id} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0" dir="ltr">
              {l.code}
            </span>
            <div className="flex-1 min-w-0">
              <span className="block text-sm font-bold text-white truncate" dir="auto">{l.title}</span>
              {formatPrice(l.price) && <span className="text-xs text-emerald-400 font-bold">{formatPrice(l.price)} ج.م</span>}
            </div>
            <a
              href={`/courses/${l.id}`}
              onClick={onClose}
              className="shrink-0 px-3 py-2 rounded-xl bg-slate-800 hover:bg-purple-600 text-xs font-bold text-slate-200 hover:text-white transition-colors"
            >
              عرض المحاضرات
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
      <div className="flex items-center justify-between text-slate-400">
        <span className="text-xs">{label}</span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <span className="block text-2xl font-black text-white font-mono">{value}</span>
    </div>
  );
}

/* ----------------------------- Levels ----------------------------- */

function LevelRow({ level, notify, onChanged }) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState('');

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      setUsers(await adminService.getLevelUsers(level.id));
    } catch (err) {
      notify('err', getErrorMessage(err, 'تعذر تحميل المشتركين.'));
    } finally {
      setUsersLoading(false);
    }
  }, [level.id, notify]);

  const toggle = () => {
    if (!open) loadUsers();
    setOpen(!open);
  };

  const act = async (key, fn) => {
    setBusy(key);
    try {
      const res = await fn();
      notify('ok', res?.detail || 'تمت العملية بنجاح.');
      return true;
    } catch (err) {
      notify('err', getErrorMessage(err));
      return false;
    } finally {
      setBusy('');
    }
  };

  const grant = async (e) => {
    e.preventDefault();
    const ok = await act('grant', () => adminService.grantLevelAccess(level.id, userId, notes));
    if (ok) {
      setUserId('');
      setNotes('');
      loadUsers();
      onChanged();
    }
  };

  const revoke = async (uid, label) => {
    if (!window.confirm(`إلغاء اشتراك ${label} من المستوى ${level.name}؟`)) return;
    if (await act(`revoke-${uid}`, () => adminService.revokeLevelAccess(level.id, uid))) {
      loadUsers();
      onChanged();
    }
  };

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800">
      <div className="p-4 flex flex-wrap items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-purple-600/30 text-purple-200 font-black flex items-center justify-center shrink-0">
          {level.name}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-white truncate">{level.title}</h4>
          <p className="text-[11px] text-slate-400">
            {formatPrice(Number(level.price)) ?? '—'} ج.م
            {level.old_price ? <span className="line-through mr-2 text-slate-600">{formatPrice(Number(level.old_price))}</span> : null}
            {' • '}
            <span className={level.is_active === false ? 'text-rose-400' : 'text-emerald-400'}>
              {level.is_active === false ? 'غير منشور' : 'منشور'}
            </span>
          </p>
        </div>
        <span className="text-xs text-emerald-300 bg-emerald-950 px-3 py-1 rounded-full font-bold">
          {level.access_count ?? 0} مشترك
        </span>
        <button
          onClick={() => act('cache', () => adminService.refreshVideoCache(level.id))}
          disabled={busy === 'cache'}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1 disabled:opacity-50"
          title="بعد رفع فيديوهات جديدة على Bunny"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${busy === 'cache' ? 'animate-spin' : ''}`} />
          تحديث الفيديوهات
        </button>
        <button onClick={toggle} className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-xl flex items-center gap-1">
          إدارة المشتركين
          {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-800 p-4 space-y-4">
          <form onSubmit={grant} className="flex flex-wrap gap-2 items-end">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">رقم حساب الطالب (ID)</label>
              <input required type="number" min="1" value={userId} onChange={(e) => setUserId(e.target.value)} className={`${inputClass} w-32`} dir="ltr" />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-[11px] text-slate-400 mb-1">ملاحظات (طريقة الدفع / التاريخ)</label>
              <input value={notes} onChange={(e) => setNotes(e.target.value)} className={`${inputClass} w-full`} />
            </div>
            <button type="submit" disabled={busy === 'grant'} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 disabled:opacity-50">
              {busy === 'grant' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
              تفعيل المستوى
            </button>
          </form>

          {usersLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 text-purple-400 animate-spin" /></div>
          ) : users.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-3">لا يوجد مشتركون في هذا المستوى بعد.</p>
          ) : (
            <AccessTable rows={users} busy={busy} onRevoke={revoke} />
          )}
        </div>
      )}
    </div>
  );
}

function AccessTable({ rows, busy, onRevoke }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-right">
        <thead className="text-slate-500">
          <tr>
            <th className="py-2 px-2 font-medium">ID</th>
            <th className="py-2 px-2 font-medium">الطالب</th>
            <th className="py-2 px-2 font-medium">البريد</th>
            <th className="py-2 px-2 font-medium">تاريخ التفعيل</th>
            <th className="py-2 px-2 font-medium">ملاحظات</th>
            <th className="py-2 px-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const uid = r.user ?? r.user_id ?? r.id;
            const name = [r.user_first_name, r.user_last_name].filter(Boolean).join(' ') || r.first_name || '—';
            const email = r.user_email || r.email || '—';
            return (
              <tr key={r.id ?? uid} className="border-t border-slate-800 text-slate-200">
                <td className="py-2 px-2 font-mono">{uid}</td>
                <td className="py-2 px-2">{name}</td>
                <td className="py-2 px-2" dir="ltr">{email}</td>
                <td className="py-2 px-2 text-slate-400">{r.granted_at ? new Date(r.granted_at).toLocaleDateString('ar-EG') : '—'}</td>
                <td className="py-2 px-2 text-slate-400 max-w-[200px] truncate" title={r.notes}>{r.notes || '—'}</td>
                <td className="py-2 px-2">
                  <button
                    onClick={() => onRevoke(uid, email !== '—' ? email : `#${uid}`)}
                    disabled={busy === `revoke-${uid}`}
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1 disabled:opacity-50"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                    إلغاء
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------------------- Books ----------------------------- */

// Level choices come from the backend's level list (admin levels endpoint), never a hard-coded list.
function BooksAdmin({ books, levelNames, notify, onChanged }) {
  const emptyBook = () => ({ name: '', level: levelNames[0] || '', price: '', is_active: true, file: null });
  const [editing, setEditing] = useState(null); // null | 'new' | book
  const [form, setForm] = useState(emptyBook);
  const [saving, setSaving] = useState(false);

  // Keep a book's current level selectable even if it is not in the levels list.
  const levelOptions = form.level && !levelNames.includes(form.level) ? [...levelNames, form.level] : levelNames;

  const startNew = () => {
    setForm(emptyBook());
    setEditing('new');
  };

  const startEdit = (book) => {
    setForm({ name: book.name, level: book.level, price: book.price ?? '', is_active: !!book.is_active, file: null });
    setEditing(book);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fields = { name: form.name.trim(), level: form.level, price: form.price, is_active: form.is_active, file: form.file };
      const res = editing === 'new' ? await adminService.createBook(fields) : await adminService.updateBook(editing.id, fields);
      notify('ok', res?.detail || 'تم حفظ الكتاب.');
      setEditing(null);
      onChanged();
    } catch (err) {
      notify('err', getErrorMessage(err, 'تعذر حفظ الكتاب.'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (book) => {
    if (!window.confirm(`حذف الكتاب "${book.name}" نهائياً؟`)) return;
    try {
      const res = await adminService.deleteBook(book.id);
      notify('ok', res?.detail || 'تم حذف الكتاب.');
      onChanged();
    } catch (err) {
      notify('err', getErrorMessage(err, 'تعذر حذف الكتاب.'));
    }
  };

  return (
    <div className="space-y-3">
      {editing ? (
        <form onSubmit={save} className="bg-slate-950 border border-purple-700/50 rounded-2xl p-4 space-y-3">
          <h4 className="text-sm font-bold text-white">{editing === 'new' ? 'إضافة كتاب جديد' : `تعديل: ${editing.name}`}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] text-slate-400 mb-1">اسم الكتاب</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`${inputClass} w-full`} />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">المستوى</label>
              <select required value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className={`${inputClass} w-full`}>
                {levelOptions.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">السعر (ج.م)</label>
              <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={`${inputClass} w-full`} dir="ltr" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-xs text-slate-300 flex items-center gap-2">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
              منشور للطلاب
            </label>
            <label className="text-xs text-slate-300 flex items-center gap-2">
              ملف PDF {editing !== 'new' && <span className="text-slate-500">(اختياري لاستبدال الملف)</span>}
              <input
                type="file"
                accept="application/pdf"
                required={editing === 'new'}
                onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
                className="text-[11px] text-slate-400"
              />
            </label>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setEditing(null)} className="text-xs bg-slate-800 text-slate-300 px-4 py-2 rounded-xl">إلغاء</button>
            <button type="submit" disabled={saving} className="text-xs bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1 disabled:opacity-50">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              حفظ
            </button>
          </div>
        </form>
      ) : (
        <button onClick={startNew} className="text-xs bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" />
          إضافة كتاب
        </button>
      )}

      {books.length === 0 && <p className="text-xs text-slate-500 text-center py-6">لا توجد كتب بعد.</p>}

      {books.map((book) => (
        <BookRow
          key={book.id}
          book={book}
          onEdit={() => startEdit(book)}
          onDelete={() => remove(book)}
          notify={notify}
        />
      ))}
    </div>
  );
}

function BookRow({ book, onEdit, onDelete, notify }) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [busy, setBusy] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await adminService.getBookUsers(book.id));
    } catch (err) {
      notify('err', getErrorMessage(err, 'تعذر تحميل المشتركين.'));
    } finally {
      setLoading(false);
    }
  }, [book.id, notify]);

  const onToggle = () => {
    if (!open) loadUsers();
    setOpen(!open);
  };

  const act = async (key, fn) => {
    setBusy(key);
    try {
      const res = await fn();
      notify('ok', res?.detail || 'تمت العملية بنجاح.');
      loadUsers();
      return true;
    } catch (err) {
      notify('err', getErrorMessage(err));
      return false;
    } finally {
      setBusy('');
    }
  };

  const grant = async (e) => {
    e.preventDefault();
    if (await act('grant', () => adminService.grantBookAccess(book.id, userId))) setUserId('');
  };

  const revoke = (uid, label) => {
    if (!window.confirm(`إلغاء وصول ${label} إلى الكتاب؟`)) return;
    act(`revoke-${uid}`, () => adminService.revokeBookAccess(book.id, uid));
  };

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800">
      <div className="p-4 flex flex-wrap items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-sky-600/30 text-sky-200 font-black flex items-center justify-center shrink-0 text-xs">
          {book.level}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-white truncate">{book.name}</h4>
          <p className="text-[11px] text-slate-400">
            {formatPrice(Number(book.price)) ?? '—'} ج.م {' • '}
            <span className={book.is_active ? 'text-emerald-400' : 'text-rose-400'}>{book.is_active ? 'منشور' : 'مخفي'}</span>
          </p>
        </div>
        <button onClick={onEdit} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
          <Pencil className="w-3.5 h-3.5" /> تعديل
        </button>
        <button onClick={onDelete} className="text-xs bg-rose-950 hover:bg-rose-900 text-rose-300 px-3 py-1.5 rounded-xl flex items-center gap-1">
          <Trash2 className="w-3.5 h-3.5" /> حذف
        </button>
        <button onClick={onToggle} className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-xl flex items-center gap-1">
          المشتركين {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-800 p-4 space-y-4">
          <form onSubmit={grant} className="flex flex-wrap gap-2 items-end">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">رقم حساب الطالب (ID)</label>
              <input required type="number" min="1" value={userId} onChange={(e) => setUserId(e.target.value)} className={`${inputClass} w-32`} dir="ltr" />
            </div>
            <button type="submit" disabled={busy === 'grant'} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 disabled:opacity-50">
              {busy === 'grant' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
              تفعيل الكتاب
            </button>
          </form>
          {loading ? (
            <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 text-purple-400 animate-spin" /></div>
          ) : users.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-3">لا يوجد مشتركون في هذا الكتاب بعد.</p>
          ) : (
            <AccessTable rows={users} busy={busy} onRevoke={revoke} />
          )}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Roles ----------------------------- */

// The only role names the backend accepts on POST /api/users/<id>/groups/ (per the API guide);
// the API has no endpoint that lists them.
const ROLES = [
  { value: 'Admin', label: 'مدير (Admin)' },
  { value: 'Moderator', label: 'مشرف (Moderator)' },
  { value: 'Student', label: 'طالب (Student)' },
];

function RolesAdmin({ notify }) {
  const [userId, setUserId] = useState('');
  const [groups, setGroups] = useState([]);
  const [busy, setBusy] = useState(false);

  const toggleGroup = (g) => setGroups((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const submit = async (e) => {
    e.preventDefault();
    if (groups.length === 0) {
      notify('err', 'اختر صلاحية واحدة على الأقل.');
      return;
    }
    setBusy(true);
    try {
      const res = await adminService.setUserGroups(userId, groups);
      notify('ok', res?.detail || 'تم تحديث الصلاحيات.');
    } catch (err) {
      notify('err', getErrorMessage(err, 'تعذر تحديث الصلاحيات.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 max-w-lg">
      <div className="flex items-center gap-2 text-white font-bold text-sm">
        <UserCog className="w-4 h-4 text-purple-400" />
        تعيين دور لمستخدم
      </div>
      <div>
        <label className="block text-[11px] text-slate-400 mb-1">رقم حساب المستخدم (ID)</label>
        <input required type="number" min="1" value={userId} onChange={(e) => setUserId(e.target.value)} className={`${inputClass} w-40`} dir="ltr" />
      </div>
      <div className="flex flex-wrap gap-2">
        {ROLES.map((r) => (
          <label
            key={r.value}
            className={`text-xs px-3 py-2 rounded-xl border cursor-pointer ${
              groups.includes(r.value) ? 'bg-purple-600/30 border-purple-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <input type="checkbox" className="hidden" checked={groups.includes(r.value)} onChange={() => toggleGroup(r.value)} />
            {r.label}
          </label>
        ))}
      </div>
      <p className="text-[11px] text-slate-500">يتطلب أن يكون حسابك لديه صلاحية إدارة المجموعات.</p>
      <button type="submit" disabled={busy} className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-1 disabled:opacity-50">
        {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        حفظ الصلاحيات
      </button>
    </form>
  );
}
