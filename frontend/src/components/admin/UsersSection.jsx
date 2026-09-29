'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { getErrorMessage } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import {
  Card, Btn, Input, Select, Field, Switch, Modal, Drawer, LevelChip, StatusBadge, Segmented, SectionHeader,
  Skeleton, Empty, ErrorBox, Avatar, PhoneActions, timeAgo, fullDate, money, useToast, useConfirm,
} from './ui';
import {
  Users, UserPlus, Search, ChevronLeft, ChevronRight, ShieldCheck, Trash2, Save, KeyRound, X, BookOpen, Layers, History, Crown,
} from 'lucide-react';
import { translate as t } from './prefs';

export default function UsersSection({ onChanged }) {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('');
  const [state, setState] = useState('');
  const [level, setLevel] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [levels, setLevels] = useState([]);
  const [books, setBooks] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    adminService.getLevels().then(setLevels).catch(() => {});
    adminService.getBooks().then(setBooks).catch(() => {});
  }, []);

  useEffect(() => {
    const id = setTimeout(() => { setQuery(search.trim()); setPage(1); }, 350);
    return () => clearTimeout(id);
  }, [search]);

  const load = useCallback(() => {
    setError('');
    adminService
      .getUsers({ search: query || undefined, role: role || undefined, status: state || undefined, level: level || undefined, page })
      .then(setData)
      .catch((e) => setError(getErrorMessage(e, t('تعذر تحميل الحسابات.'))));
  }, [query, role, state, level, page]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(load, [load]);

  const filter = (setter) => (v) => { setter(v); setPage(1); };
  // Stable: the drawer reloads its data when this identity changes.
  const closeDrawer = useCallback(() => setOpenId(null), []);

  return (
    <div>
      <SectionHeader
        icon={Users}
        title={t('الطلاب والحسابات')}
        subtitle={data ? t('{n} حساب مسجل على المنصة', { n: data.count.toLocaleString('en-US') }) : t('كل الحسابات المسجلة على المنصة')}
        actions={<Btn variant="gold" icon={UserPlus} onClick={() => setCreating(true)}>{t('إضافة حساب')}</Btn>}
      />

      <Card className="p-3 sm:p-4 mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[14rem]">
          <Search className="w-4 h-4 text-slate-400 absolute start-4 top-1/2 -translate-y-1/2" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('دوّر بالاسم أو الإيميل أو الموبايل')} className="ps-10" />
        </div>
        <Segmented
          value={role}
          onChange={filter(setRole)}
          options={[{ value: '', label: t('الكل') }, { value: 'student', label: t('طلاب') }, { value: 'admin', label: t('إدارة') }]}
        />
        <Select value={level} onChange={(e) => filter(setLevel)(e.target.value)} className="!w-auto">
          <option value="">{t('كل المستويات')}</option>
          {levels.map((l) => <option key={l.id} value={l.name}>{t('مشترك في')}{' '}{l.name}</option>)}
        </Select>
        <Select value={state} onChange={(e) => filter(setState)(e.target.value)} className="!w-auto">
          <option value="">{t('كل الحالات')}</option>
          <option value="active">{t('نشط')}</option>
          <option value="inactive">{t('موقوف')}</option>
        </Select>
      </Card>

      {error ? (
        <ErrorBox message={error} onRetry={load} />
      ) : !data ? (
        <Card className="p-4 space-y-3">{[0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16" />)}</Card>
      ) : data.results.length === 0 ? (
        <Card><Empty icon={Users} title={t('مفيش حسابات بالبحث ده')} text={t('جرّب كلمة تانية أو شيل الفلاتر.')} /></Card>
      ) : (
        <Card className="overflow-hidden">
          {/* Desktop table */}
          <table className="hidden md:table w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-black text-slate-500 border-b border-slate-100">
                <th className="text-start px-5 py-3">{t('الحساب')}</th>
                <th className="text-start px-3 py-3">{t('الموبايل')}</th>
                <th className="text-start px-3 py-3">{t('المستويات المفعّلة')}</th>
                <th className="text-start px-3 py-3">{t('الكتب')}</th>
                <th className="text-start px-3 py-3">{t('الحالة')}</th>
                <th className="text-start px-3 py-3">{t('انضم')}</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.results.map((u) => (
                <tr key={u.id} onClick={() => setOpenId(u.id)} className="hover:bg-teal-50/40 cursor-pointer transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} />
                      <div className="min-w-0">
                        <p className="font-black text-slate-900 truncate flex items-center gap-1.5">
                          {u.name}
                          {u.is_admin && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                        </p>
                        <p className="text-[11px] text-slate-400 font-bold" dir="ltr">{u.email_masked}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                    {u.phone ? <span className="flex items-center gap-2"><span dir="ltr" className="font-bold text-slate-700">{u.phone}</span><PhoneActions phone={u.phone} /></span> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {u.is_admin ? <span className="text-[11px] font-black text-amber-700">{t('كل المحتوى مفتوح')}</span>
                        : u.levels.length ? u.levels.map((c) => <LevelChip key={c} code={c} size="sm" />) : <span className="text-slate-300">—</span>}
                    </div>
                  </td>
                  <td className="px-3 py-3.5 font-black text-slate-700">{u.books_count || <span className="text-slate-300">—</span>}</td>
                  <td className="px-3 py-3.5">
                    <div className="flex flex-col items-start gap-1">
                      <StatusBadge status={u.is_active ? 'active' : 'inactive'} />
                      {u.pending_count > 0 && <StatusBadge status="pending" label={t('{n} طلب', { n: u.pending_count })} />}
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-xs font-bold text-slate-500 whitespace-nowrap">{timeAgo(u.date_joined)}</td>
                  <td className="px-3 py-3.5"><ChevronLeft className="w-4 h-4 text-slate-300 ltr:-scale-x-100" /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <ul className="md:hidden divide-y divide-slate-100">
            {data.results.map((u) => (
              <li key={u.id}>
                <button onClick={() => setOpenId(u.id)} className="w-full text-start flex items-center gap-3 px-4 py-3.5">
                  <Avatar name={u.name} />
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-slate-900 truncate flex items-center gap-1.5">{u.name}{u.is_admin && <Crown className="w-3.5 h-3.5 text-amber-500" />}</p>
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      {u.levels.map((c) => <LevelChip key={c} code={c} size="sm" />)}
                      {!u.is_active && <StatusBadge status="inactive" />}
                      {u.pending_count > 0 && <StatusBadge status="pending" label={t('{n} طلب', { n: u.pending_count })} />}
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-300 ltr:-scale-x-100" />
                </button>
              </li>
            ))}
          </ul>

          {data.pages > 1 && (
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-slate-100 bg-slate-50/60">
              <span className="text-xs font-bold text-slate-500">{t('صفحة {p} من {n}', { p: data.page, n: data.pages })}</span>
              <div className="flex gap-2">
                <Btn variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronRight className="w-4 h-4 ltr:-scale-x-100" /> {t('السابق')}</Btn>
                <Btn variant="ghost" size="sm" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>{t('التالي')}{' '}<ChevronLeft className="w-4 h-4 ltr:-scale-x-100" /></Btn>
              </div>
            </div>
          )}
        </Card>
      )}

      {openId && (
        <UserDrawer
          userId={openId}
          levels={levels}
          books={books}
          onClose={closeDrawer}
          onChanged={() => { load(); onChanged(); }}
        />
      )}
      <CreateUserModal open={creating} onClose={() => setCreating(false)} onCreated={(id) => { setCreating(false); load(); setOpenId(id); }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function UserDrawer({ userId, levels, books, onClose, onChanged }) {
  const toast = useToast();
  const confirm = useConfirm();
  const { user: me } = useAuth();
  const [u, setU] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(null);

  const load = useCallback(() => {
    adminService.getUser(userId).then((d) => {
      setU(d);
      setForm({ first_name: d.first_name, last_name: d.last_name, email: d.email, password: '' });
    }).catch((e) => { toast('err', getErrorMessage(e)); onClose(); });
  }, [userId, toast, onClose]);
  useEffect(load, [load]);

  const isMe = me?.id === userId;

  const patch = async (fields, okText) => {
    try {
      const res = await adminService.updateUser(userId, fields);
      toast('ok', okText || res.detail);
      load();
      onChanged();
      return true;
    } catch (e) {
      toast('err', getErrorMessage(e));
      return false;
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fields = { first_name: form.first_name, last_name: form.last_name, email: form.email };
    if (form.password) fields.password = form.password;
    await patch(fields, form.password ? t('تم حفظ البيانات وتغيير كلمة المرور.') : t('تم حفظ البيانات.'));
    setSaving(false);
  };

  const toggleAccess = async (kind, itemId, grant) => {
    setToggling(`${kind}-${itemId}`);
    try {
      toast('ok', (await adminService.setUserAccess(userId, kind, itemId, grant)).detail);
      load();
      onChanged();
    } catch (e) {
      toast('err', getErrorMessage(e));
    } finally {
      setToggling(null);
    }
  };

  const remove = async () => {
    if (!(await confirm({ title: t('حذف حساب {name}؟', { name: u.name }), text: t('الحساب وكل اشتراكاته وطلباته هيتمسحوا نهائياً ومينفعش ترجعهم.'), confirmText: t('حذف نهائي') }))) return;
    try {
      toast('ok', (await adminService.deleteUser(userId)).detail);
      onChanged();
      onClose();
    } catch (e) {
      toast('err', getErrorMessage(e));
    }
  };

  const levelIds = new Set((u?.level_access || []).map((a) => a.level_id));
  const bookIds = new Set((u?.book_access || []).map((a) => a.book_id));

  const header = (
    <div className="relative overflow-hidden bg-[#0a2340] text-white px-6 pt-6 pb-5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(20,184,166,0.4),transparent_60%)]" />
      <button onClick={onClose} className="absolute top-5 end-5 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center" aria-label={t('إغلاق')}>
        <X className="w-5 h-5" />
      </button>
      {u ? (
        <div className="relative flex items-center gap-4 pe-12">
          <Avatar name={u.name} size="lg" />
          <div className="min-w-0">
            <h3 className="text-xl font-black truncate flex items-center gap-2">{u.name}{u.is_admin && <Crown className="w-4 h-4 text-amber-300" />}</h3>
            <p className="text-xs text-teal-200 font-bold mt-0.5">{t('حساب #{id} • انضم {when}', { id: u.id, when: timeAgo(u.date_joined) })}</p>
            <p className="text-[11px] text-slate-400 font-bold mt-0.5">{t('آخر دخول:')}{' '}{u.last_login ? timeAgo(u.last_login) : t('لم يسجل دخول')}</p>
          </div>
        </div>
      ) : (
        <Skeleton className="h-16 !bg-white/10" />
      )}
    </div>
  );

  return (
    <Drawer open onClose={onClose} header={header}>
      {!u || !form ? (
        <div className="space-y-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-32 !rounded-3xl" />)}</div>
      ) : (
        <>
          <Card className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-black text-slate-800">{t('الحساب نشط')}</p>
                <p className="text-[11px] text-slate-500">{t('الموقوف مايقدرش يدخل')}</p>
              </div>
              <Switch checked={u.is_active} disabled={isMe} onChange={(v) => patch({ is_active: v }, v ? t('تم تفعيل الحساب.') : t('تم إيقاف الحساب.'))} />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-amber-50/60 px-4 py-3">
              <div>
                <p className="text-sm font-black text-slate-800 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-amber-600" />{' '}{t('صلاحية أدمن')}</p>
                <p className="text-[11px] text-slate-500">{t('كل المحتوى + لوحة التحكم')}</p>
              </div>
              <Switch
                checked={u.is_admin}
                disabled={isMe || u.is_superuser}
                onChange={async (v) => {
                  if (v && !(await confirm({ title: t('تدي الحساب ده صلاحية أدمن؟'), text: t('هيقدر يدخل لوحة التحكم ويقبل الطلبات ويعدّل كل حاجة.'), confirmText: t('أيوه، خليه أدمن'), danger: false }))) return;
                  patch({ is_admin: v }, v ? t('الحساب بقى أدمن.') : t('اتشالت صلاحية الأدمن.'));
                }}
              />
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="text-sm font-black text-slate-900 mb-4">{t('بيانات الحساب')}</h4>
            <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={t('الاسم الأول')}><Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /></Field>
              <Field label={t('اسم العائلة')}><Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></Field>
              <Field label={t('البريد الإلكتروني')} className="sm:col-span-2"><Input type="email" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
              <Field label={t('كلمة مرور جديدة')} hint={t('سيبها فاضية لو مش عايز تغيّرها')} className="sm:col-span-2">
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute start-4 top-1/2 -translate-y-1/2" />
                  <Input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={t('8 حروف على الأقل')} className="ps-10" autoComplete="new-password" />
                </div>
              </Field>
              {u.phone && (
                <div className="sm:col-span-2 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-xs font-bold text-slate-500">{t('آخر موبايل في طلباته:')}{' '}<span dir="ltr" className="font-black text-slate-800">{u.phone}</span></span>
                  <PhoneActions phone={u.phone} />
                </div>
              )}
              <div className="sm:col-span-2 flex justify-end">
                <Btn type="submit" icon={Save} loading={saving}>{t('حفظ التعديلات')}</Btn>
              </div>
            </form>
          </Card>

          <Card className="p-5">
            <h4 className="text-sm font-black text-slate-900 mb-1 flex items-center gap-2"><Layers className="w-4 h-4 text-teal-600" />{' '}{t('المستويات (الكورسات)')}</h4>
            <p className="text-[11px] text-slate-500 mb-4">{u.is_admin ? t('الأدمن شايف كل المستويات تلقائياً.') : t('فعّل أو اقفل أي مستوى للطالب على طول.')}</p>
            <div className="space-y-2">
              {levels.map((l) => (
                <div key={l.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 px-3 py-2.5">
                  <LevelChip code={l.name} />
                  <p className="flex-1 min-w-0 text-sm font-bold text-slate-800 truncate">{l.title}</p>
                  <Switch
                    checked={u.is_admin || levelIds.has(l.id)}
                    disabled={u.is_admin || toggling === `level-${l.id}`}
                    onChange={(v) => toggleAccess('level', l.id, v)}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4 text-sky-600" />{' '}{t('الكتب')}</h4>
            {books.length === 0 ? <p className="text-xs text-slate-400">{t('مفيش كتب.')}</p> : (
              <div className="space-y-2">
                {books.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 px-3 py-2.5">
                    <LevelChip code={b.level} />
                    <p className="flex-1 min-w-0 text-sm font-bold text-slate-800 truncate" dir="auto">{b.name}</p>
                    <Switch
                      checked={u.is_admin || bookIds.has(b.id)}
                      disabled={u.is_admin || toggling === `book-${b.id}`}
                      onChange={(v) => toggleAccess('book', b.id, v)}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h4 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2"><History className="w-4 h-4 text-violet-600" />{' '}{t('سجل الطلبات')}</h4>
            {u.requests.length === 0 ? <p className="text-xs text-slate-400">{t('مابعتش أي طلبات.')}</p> : (
              <ul className="space-y-2">
                {u.requests.map((r) => (
                  <li key={r.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2.5">
                    <LevelChip code={r.level_code} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-slate-800 truncate">{r.kind === 'level' ? t('كورس') : t('كتاب')}: {r.item_name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{fullDate(r.created_at)} • {money(r.amount)}{' '}{t('ج.م')}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {!isMe && !u.is_superuser && (
            <Card className="p-5 border-rose-200 bg-rose-50/30 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-rose-700">{t('حذف الحساب')}</p>
                <p className="text-[11px] text-rose-600/80">{t('نهائي، ومعاه كل الاشتراكات والطلبات.')}</p>
              </div>
              <Btn variant="danger" size="sm" icon={Trash2} onClick={remove}>{t('حذف الحساب')}</Btn>
            </Card>
          )}
        </>
      )}
    </Drawer>
  );
}

function CreateUserModal({ open, onClose, onCreated }) {
  const toast = useToast();
  const empty = { first_name: '', last_name: '', email: '', password: '', is_admin: false };
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminService.createUser(form);
      toast('ok', res.detail);
      setForm(empty);
      onCreated(res.id);
    } catch (err) {
      toast('err', getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={t('إضافة حساب جديد')} subtitle={t('للطلاب اللي بيسجلوا من الفرع مثلاً')} icon={UserPlus}>
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={t('الاسم الأول')}><Input required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /></Field>
        <Field label={t('اسم العائلة')}><Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></Field>
        <Field label={t('البريد الإلكتروني')} className="sm:col-span-2"><Input required type="email" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label={t('كلمة المرور')} hint={t('ابعتها للطالب وهو يقدر يغيّرها بعدين')} className="sm:col-span-2">
          <Input required minLength={8} type="text" dir="ltr" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" />
        </Field>
        <div className="sm:col-span-2"><Switch checked={form.is_admin} onChange={(v) => setForm({ ...form, is_admin: v })} label={t('حساب إدارة (أدمن)')} /></div>
        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
          <Btn type="button" variant="ghost" onClick={onClose}>{t('إلغاء')}</Btn>
          <Btn type="submit" icon={UserPlus} loading={saving}>{t('إنشاء الحساب')}</Btn>
        </div>
      </form>
    </Modal>
  );
}
