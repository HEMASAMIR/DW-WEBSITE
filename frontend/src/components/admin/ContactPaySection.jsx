'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { getErrorMessage } from '@/services/api';
import { setContactInfo, whatsappHref, waNumber } from '@/lib/contactInfo';
import PaymentInfo from '@/components/common/PaymentInfo';
import {
  Card, Btn, Input, Field, Switch, Modal, SectionHeader, Skeleton, ErrorBox, LevelChip, useToast, useConfirm,
} from './ui';
import {
  PhoneCall, Phone, MessageCircle, Plus, Pencil, Trash2, ArrowUp, ArrowDown, Copy, ExternalLink, Star, Wallet, Zap,
  Landmark, CreditCard, Store, Users, Eye, EyeOff, Save, Link2, Check, MonitorSmartphone, ShieldCheck,
} from 'lucide-react';
import { translate as t } from './prefs';

/* ------------------------------------------------------------------ */
/* Look & defaults                                                     */
/* ------------------------------------------------------------------ */

const METHOD_TYPES = [
  { value: 'wallet', label: 'محفظة', hint: 'فودافون كاش، اتصالات كاش…', defaultLabel: 'فودافون كاش', icon: Wallet, grad: 'from-rose-500 via-red-500 to-orange-500', soft: 'bg-rose-50 text-rose-600 border-rose-200' },
  { value: 'instapay', label: 'إنستا باي', hint: 'تحويل لحظي على رقم الموبايل', defaultLabel: 'إنستا باي', icon: Zap, grad: 'from-violet-500 via-purple-500 to-indigo-600', soft: 'bg-violet-50 text-violet-600 border-violet-200' },
  { value: 'bank', label: 'تحويل بنكي', hint: 'رقم حساب أو IBAN', defaultLabel: 'تحويل بنكي', icon: Landmark, grad: 'from-sky-500 via-blue-500 to-indigo-500', soft: 'bg-sky-50 text-sky-600 border-sky-200' },
  { value: 'other', label: 'طريقة تانية', hint: 'أي طريقة دفع تانية', defaultLabel: '', icon: CreditCard, grad: 'from-teal-500 via-emerald-500 to-green-500', soft: 'bg-teal-50 text-teal-600 border-teal-200' },
];
const typeOf = (value) => METHOD_TYPES.find((m) => m.value === value) || METHOD_TYPES[3];

const TABS = [
  { key: 'contacts', label: 'أرقام التواصل', icon: Phone },
  { key: 'payment', label: 'طرق الدفع', icon: Wallet },
  { key: 'groups', label: 'جروبات المستويات', icon: Users },
];

const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
const digitsOnly = (v) => String(v || '').replace(/[^\d+]/g, '');
const swap = (list, i, dir) => {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

/** Contact numbers, payment methods and level WhatsApp groups — each change is saved and live right away. */
export default function ContactPaySection() {
  const toast = useToast();
  const confirm = useConfirm();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('contacts');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(null); // { kind: 'whatsapp' | 'phone' | 'method' | 'group', index: number | null }
  const [preview, setPreview] = useState(false);

  const load = useCallback(() => {
    setError('');
    adminService.getContact().then(setData).catch((e) => setError(getErrorMessage(e, t('تعذر تحميل البيانات.'))));
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(load, [load]);

  /** Saves the whole document; the UI updates first and rolls back if the server refuses. */
  const commit = async (next, okText) => {
    const before = data;
    setData(next);
    setBusy(true);
    try {
      const saved = await adminService.saveContact(next);
      setData(saved);
      setContactInfo(saved);
      toast('ok', okText);
      return true;
    } catch (e) {
      setData(before);
      toast('err', getErrorMessage(e));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast('ok', t('اتنسخ: {text}', { text }));
    } catch {
      toast('err', t('المتصفح منع النسخ.'));
    }
  };

  if (error) return <ErrorBox message={error} onRetry={load} />;

  const phones = data?.phones || [];
  const methods = data?.payment?.methods || [];
  const groups = data?.groups || [];
  const cash = data?.payment?.cash_at_branch !== false;
  const setMethods = (list) => ({ ...data, payment: { ...data.payment, methods: list } });

  const removeItem = async (kind, index, name) => {
    const ok = await confirm({ title: t('حذف «{name}»؟', { name }), text: t('هيختفي من الموقع على طول.'), confirmText: t('حذف') });
    if (!ok) return;
    if (kind === 'phone') commit({ ...data, phones: phones.filter((_, i) => i !== index) }, t('تم الحذف.'));
    if (kind === 'method') commit(setMethods(methods.filter((_, i) => i !== index)), t('تم الحذف.'));
    if (kind === 'group') commit({ ...data, groups: groups.filter((_, i) => i !== index) }, t('تم الحذف.'));
  };

  const addLabel = { contacts: 'إضافة رقم', payment: 'إضافة طريقة دفع', groups: 'إضافة جروب' }[tab];
  const openAdd = () => setEditing({ kind: { contacts: 'phone', payment: 'method', groups: 'group' }[tab], index: null });
  const counts = { contacts: phones.length + 1, payment: methods.length + (cash ? 1 : 0), groups: groups.length };

  return (
    <div>
      <SectionHeader
        icon={PhoneCall}
        title={t('التواصل والدفع')}
        subtitle={t('كل إضافة أو تعديل أو حذف بيتحفظ ويظهر للطلاب في الموقع على طول')}
        actions={data && (
          <>
            <button
              type="button"
              onClick={() => setPreview(true)}
              className="inline-flex items-center gap-2 h-11 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-black transition-colors"
            >
              <MonitorSmartphone className="w-4 h-4" /> {t('معاينة زي الطالب')}
            </button>
            <Btn variant="gold" icon={Plus} onClick={openAdd}>{t(addLabel)}</Btn>
          </>
        )}
      />

      {!data ? (
        <div className="space-y-5">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28 !rounded-3xl" />)}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-56 !rounded-3xl" />)}</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatTile icon={MessageCircle} tone="from-emerald-400 to-teal-600" label={t('واتساب الأكاديمية')} value={<span dir="ltr">{data.whatsapp || '—'}</span>} onClick={() => setTab('contacts')} />
            <StatTile icon={Phone} tone="from-sky-400 to-blue-600" label={t('أرقام الاتصال')} value={phones.length} onClick={() => setTab('contacts')} />
            <StatTile icon={Wallet} tone="from-rose-400 to-orange-500" label={t('طرق الدفع الظاهرة')} value={<span dir="ltr">{methods.filter((m) => m.is_active !== false).length + (cash ? 1 : 0)} / {methods.length + 1}</span>} onClick={() => setTab('payment')} />
            <StatTile icon={Users} tone="from-violet-400 to-purple-600" label={t('جروبات المستويات')} value={groups.length} onClick={() => setTab('groups')} />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="tablist">
            {TABS.map(({ key, label, icon: Icon }) => {
              const active = tab === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(key)}
                  className={`shrink-0 inline-flex items-center gap-2.5 h-12 px-5 rounded-2xl border text-sm font-black transition-all active:scale-95 ${
                    active
                      ? 'bg-gradient-to-r from-[#0a2340] to-teal-900 border-[#0a2340] text-white shadow-lg shadow-[#0a2340]/25 ring-2 ring-teal-400/40'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50/30'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-amber-300' : 'text-slate-400'}`} />
                  {t(label)}
                  <span className={`min-w-5 h-5 px-1.5 rounded-full text-[10px] flex items-center justify-center ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{counts[key]}</span>
                </button>
              );
            })}
          </div>

          {/* Contacts */}
          {tab === 'contacts' && (
            <div className="space-y-5 animate-fadeIn">
              <WhatsAppHero number={data.whatsapp} busy={busy} onEdit={() => setEditing({ kind: 'whatsapp', index: null })} onCopy={() => copy(data.whatsapp)} />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {phones.map((p, i) => (
                  <PhoneCard
                    key={p.id}
                    phone={p}
                    primary={i === 0}
                    first={i === 0}
                    last={i === phones.length - 1}
                    busy={busy}
                    onEdit={() => setEditing({ kind: 'phone', index: i })}
                    onCopy={() => copy(p.number)}
                    onPrimary={() => commit({ ...data, phones: [p, ...phones.filter((_, x) => x !== i)] }, t('بقى الرقم الرئيسي.'))}
                    onMove={(dir) => commit({ ...data, phones: swap(phones, i, dir) }, t('تم تغيير الترتيب.'))}
                    onDelete={() => removeItem('phone', i, p.label || p.number)}
                  />
                ))}
                <AddCard label={t('إضافة رقم')} text={t('خط تاني، رقم فرع، أو خدمة العملاء')} onClick={() => setEditing({ kind: 'phone', index: null })} />
              </div>
            </div>
          )}

          {/* Payment */}
          {tab === 'payment' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-fadeIn">
              {methods.map((m, i) => (
                <MethodCard
                  key={m.id}
                  method={m}
                  first={i === 0}
                  last={i === methods.length - 1}
                  busy={busy}
                  onEdit={() => setEditing({ kind: 'method', index: i })}
                  onCopy={() => copy(m.number)}
                  onToggle={() => commit(setMethods(methods.map((x, j) => (j === i ? { ...x, is_active: x.is_active === false } : x))), m.is_active === false ? t('الطريقة بقت ظاهرة للطلاب.') : t('الطريقة اتخفت من الموقع.'))}
                  onMove={(dir) => commit(setMethods(swap(methods, i, dir)), t('تم تغيير الترتيب.'))}
                  onDelete={() => removeItem('method', i, m.label)}
                />
              ))}
              <CashCard
                on={cash}
                busy={busy}
                onToggle={(v) => commit({ ...data, payment: { ...data.payment, cash_at_branch: v } }, v ? t('الدفع نقدي في الفرع بقى متاح.') : t('الدفع نقدي في الفرع اتقفل.'))}
              />
              <AddCard label={t('إضافة طريقة دفع')} text={t('محفظة، إنستا باي، تحويل بنكي أو غيرها')} onClick={() => setEditing({ kind: 'method', index: null })} />
            </div>
          )}

          {/* Groups */}
          {tab === 'groups' && (
            <div className="space-y-4 animate-fadeIn">
              <p className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                {t('اللينك بيظهر للطالب بعد ما المستوى يتفعّل له بس')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {groups.map((g, i) => (
                  <GroupCard
                    key={`${g.code}-${i}`}
                    group={g}
                    busy={busy}
                    onEdit={() => setEditing({ kind: 'group', index: i })}
                    onCopy={() => copy(g.url)}
                    onDelete={() => removeItem('group', i, g.code)}
                  />
                ))}
                <AddCard label={t('إضافة جروب')} text={t('جروب واتساب لمستوى معيّن')} onClick={() => setEditing({ kind: 'group', index: null })} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Forms */}
      {editing?.kind === 'whatsapp' && (
        <WhatsAppForm
          value={data.whatsapp}
          onClose={() => setEditing(null)}
          onSave={async (whatsapp) => (await commit({ ...data, whatsapp }, t('تم تحديث رقم الواتساب.'))) && setEditing(null)}
        />
      )}
      {editing?.kind === 'phone' && (
        <PhoneForm
          phone={editing.index === null ? null : phones[editing.index]}
          isPrimary={editing.index === 0}
          onClose={() => setEditing(null)}
          onSave={async (p, makePrimary) => {
            let list = editing.index === null ? [...phones, p] : phones.map((x, i) => (i === editing.index ? p : x));
            if (makePrimary) list = [p, ...list.filter((x) => x.id !== p.id)];
            if (await commit({ ...data, phones: list }, editing.index === null ? t('تم إضافة الرقم.') : t('تم حفظ الرقم.'))) setEditing(null);
          }}
        />
      )}
      {editing?.kind === 'method' && (
        <MethodForm
          method={editing.index === null ? null : methods[editing.index]}
          onClose={() => setEditing(null)}
          onSave={async (m) => {
            const list = editing.index === null ? [...methods, m] : methods.map((x, i) => (i === editing.index ? m : x));
            if (await commit(setMethods(list), editing.index === null ? t('تم إضافة طريقة الدفع.') : t('تم حفظ طريقة الدفع.'))) setEditing(null);
          }}
        />
      )}
      {editing?.kind === 'group' && (
        <GroupForm
          group={editing.index === null ? null : groups[editing.index]}
          taken={groups.filter((_, i) => i !== editing.index).map((g) => g.code)}
          onClose={() => setEditing(null)}
          onSave={async (g) => {
            const list = editing.index === null ? [...groups, g] : groups.map((x, i) => (i === editing.index ? g : x));
            if (await commit({ ...data, groups: list }, editing.index === null ? t('تم إضافة الجروب.') : t('تم حفظ الجروب.'))) setEditing(null);
          }}
        />
      )}
      {preview && data && <PreviewModal data={data} onClose={() => setPreview(false)} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

function StatTile({ icon: Icon, tone, label, value, onClick }) {
  return (
    <button type="button" onClick={onClick} className="group text-start w-full">
      <Card className="relative overflow-hidden p-5 h-full group-hover:-translate-y-0.5 group-hover:shadow-xl transition-all">
        <div className={`absolute -end-8 -top-8 w-28 h-28 rounded-full bg-gradient-to-br ${tone} opacity-[0.1] group-hover:scale-125 transition-transform duration-500`} />
        <span className={`relative w-11 h-11 rounded-2xl bg-gradient-to-br ${tone} text-white flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5" />
        </span>
        <p className="mt-3 text-xs font-bold text-slate-500">{label}</p>
        <p className="mt-0.5 text-xl sm:text-2xl font-black text-slate-900 truncate">{value}</p>
      </Card>
    </button>
  );
}

function CardFooter({ children }) {
  return <div className="mt-auto flex flex-wrap items-center gap-1.5 px-4 py-3 border-t border-slate-100 bg-slate-50/60">{children}</div>;
}

function OrderButtons({ first, last, busy, onMove }) {
  return (
    <>
      <Btn type="button" size="icon" variant="ghost" disabled={first || busy} onClick={() => onMove(-1)} title={t('لفوق')}><ArrowUp className="w-4 h-4" /></Btn>
      <Btn type="button" size="icon" variant="ghost" disabled={last || busy} onClick={() => onMove(1)} title={t('لتحت')}><ArrowDown className="w-4 h-4" /></Btn>
    </>
  );
}

function WhatsAppHero({ number, busy, onEdit, onCopy }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-500 via-teal-600 to-[#0e2c4e] text-white p-6 sm:p-7 shadow-xl shadow-emerald-900/20">
      <div className="absolute -end-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '22px 22px' }} />
      <div className="relative flex flex-col lg:flex-row lg:items-center gap-5">
        <span className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
          <MessageCircle className="w-8 h-8 fill-white" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black text-emerald-100">{t('رقم الواتساب الرئيسي')}</p>
          <p className="text-3xl sm:text-4xl font-black tracking-wider mt-1" dir="ltr">{number || '—'}</p>
          <p className="text-xs text-emerald-100/80 font-bold mt-1.5">{t('كل زراير «واتساب» في الموقع بتفتح على الرقم ده')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onEdit} disabled={busy} className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-white text-[#0e2c4e] text-sm font-black hover:bg-emerald-50 transition-colors disabled:opacity-60">
            <Pencil className="w-4 h-4" /> {t('تعديل')}
          </button>
          <a href={whatsappHref({ whatsapp: number })} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 h-11 px-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-sm font-black transition-colors">
            <ExternalLink className="w-4 h-4" /> {t('جرّب')}
          </a>
          <button type="button" onClick={onCopy} className="inline-flex items-center gap-2 h-11 px-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-sm font-black transition-colors">
            <Copy className="w-4 h-4" /> {t('نسخ')}
          </button>
        </div>
      </div>
    </div>
  );
}

function PhoneCard({ phone, primary, first, last, busy, onEdit, onCopy, onPrimary, onMove, onDelete }) {
  return (
    <Card className={`group relative overflow-hidden flex flex-col hover:-translate-y-0.5 hover:shadow-xl transition-all ${primary ? 'ring-2 ring-amber-300/70' : ''}`}>
      <div className={`h-1.5 ${primary ? 'bg-gradient-to-r from-amber-300 to-orange-400' : 'bg-gradient-to-r from-sky-400 to-teal-400'}`} />
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <span className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${primary ? 'bg-amber-50 text-amber-500' : 'bg-sky-50 text-sky-600'}`}>
            {primary ? <Star className="w-5 h-5 fill-current" /> : <Phone className="w-5 h-5" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-slate-900 truncate">{phone.label || t('رقم بدون اسم')}</p>
            {primary
              ? <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-black text-amber-700">{t('الرئيسي — بيظهر في زراير الاتصال')}</span>
              : <span className="inline-block mt-1 text-[11px] font-bold text-slate-400">{t('رقم إضافي')}</span>}
          </div>
        </div>
        <p className="text-2xl font-black tracking-wider text-slate-900" dir="ltr">{phone.number}</p>
        <div className="flex gap-2">
          <a href={`tel:${phone.number}`} className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-700 text-xs font-black transition-colors">
            <Phone className="w-3.5 h-3.5" /> {t('اتصال')}
          </a>
          <a href={`https://wa.me/${waNumber(phone.number)}`} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black transition-colors">
            <MessageCircle className="w-3.5 h-3.5" /> {t('واتساب')}
          </a>
          <button type="button" onClick={onCopy} className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center" title={t('نسخ')}>
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
      <CardFooter>
        <Btn type="button" size="sm" icon={Pencil} onClick={onEdit} disabled={busy}>{t('تعديل')}</Btn>
        {!primary && <Btn type="button" size="sm" variant="soft" icon={Star} onClick={onPrimary} disabled={busy}>{t('خليه الرئيسي')}</Btn>}
        <div className="ms-auto flex gap-1">
          <OrderButtons first={first} last={last} busy={busy} onMove={onMove} />
          <Btn type="button" size="icon" variant="ghost" onClick={onDelete} disabled={busy} title={t('حذف')}><Trash2 className="w-4 h-4 text-rose-500" /></Btn>
        </div>
      </CardFooter>
    </Card>
  );
}

function MethodCard({ method, first, last, busy, onEdit, onCopy, onToggle, onMove, onDelete }) {
  const type = typeOf(method.type);
  const Icon = type.icon;
  const hidden = method.is_active === false;
  return (
    <Card className={`group overflow-hidden flex flex-col hover:-translate-y-0.5 hover:shadow-xl transition-all ${hidden ? 'opacity-70' : ''}`}>
      <div className={`relative overflow-hidden bg-gradient-to-br ${type.grad} text-white p-5 ${hidden ? 'grayscale-[60%]' : ''}`}>
        <div className="absolute -end-10 -bottom-10 w-36 h-36 rounded-full bg-white/15 group-hover:scale-125 transition-transform duration-500" />
        <div className="relative flex items-start gap-3">
          <span className="w-12 h-12 rounded-2xl bg-white/20 border border-white/25 flex items-center justify-center shrink-0 shadow-inner">
            <Icon className="w-6 h-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-black leading-tight truncate">{method.label}</p>
            <p className="text-[11px] font-bold text-white/80">{t(type.label)}</p>
          </div>
          <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${hidden ? 'bg-black/25' : 'bg-white/25'}`}>
            {hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {hidden ? t('مخفية') : t('ظاهرة')}
          </span>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <p className="text-[11px] font-black text-slate-400">{method.type === 'bank' ? t('رقم الحساب / IBAN') : t('رقم التحويل')}</p>
        <div className="flex items-center gap-2">
          <p className={`flex-1 min-w-0 font-black text-slate-900 break-all ${method.number.length > 14 ? 'text-lg' : 'text-2xl tracking-wider'}`} dir="ltr">{method.number}</p>
          <button type="button" onClick={onCopy} className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0" title={t('نسخ')}>
            <Copy className="w-4 h-4" />
          </button>
        </div>
        {method.hint && <p className="text-xs text-slate-500 font-semibold leading-relaxed">{method.hint}</p>}
      </div>
      <CardFooter>
        <Btn type="button" size="sm" icon={Pencil} onClick={onEdit} disabled={busy}>{t('تعديل')}</Btn>
        <Btn type="button" size="sm" variant="ghost" icon={hidden ? Eye : EyeOff} onClick={onToggle} disabled={busy}>{hidden ? t('إظهار') : t('إخفاء')}</Btn>
        <div className="ms-auto flex gap-1">
          <OrderButtons first={first} last={last} busy={busy} onMove={onMove} />
          <Btn type="button" size="icon" variant="ghost" onClick={onDelete} disabled={busy} title={t('حذف')}><Trash2 className="w-4 h-4 text-rose-500" /></Btn>
        </div>
      </CardFooter>
    </Card>
  );
}

function CashCard({ on, busy, onToggle }) {
  return (
    <Card className={`overflow-hidden flex flex-col ${on ? '' : 'opacity-70'}`}>
      <div className={`relative overflow-hidden bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-slate-950 p-5 ${on ? '' : 'grayscale-[60%]'}`}>
        <div className="absolute -end-10 -bottom-10 w-36 h-36 rounded-full bg-white/20" />
        <div className="relative flex items-start gap-3">
          <span className="w-12 h-12 rounded-2xl bg-white/30 border border-white/40 flex items-center justify-center shrink-0">
            <Store className="w-6 h-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-black leading-tight">{t('نقدي في الفرع')}</p>
            <p className="text-[11px] font-bold text-slate-900/70">{t('من غير تحويل')}</p>
          </div>
        </div>
      </div>
      <div className="p-5 flex-1">
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">{t('بيظهر للطالب اختيار «نقدي بالفرع» في فورم الاشتراك، ومش محتاج يرفع صورة تحويل.')}</p>
      </div>
      <CardFooter>
        <Switch checked={on} disabled={busy} onChange={onToggle} label={on ? t('متاح للطلاب') : t('مقفول')} />
      </CardFooter>
    </Card>
  );
}

function GroupCard({ group, busy, onEdit, onCopy, onDelete }) {
  return (
    <Card className="group overflow-hidden flex flex-col hover:-translate-y-0.5 hover:shadow-xl transition-all">
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <LevelChip code={group.code} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-slate-900">{t('جروب مستوى {code}', { code: group.code })}</p>
            <p className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600"><MessageCircle className="w-3.5 h-3.5" /> WhatsApp</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-100 px-3 py-2.5">
          <Link2 className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="flex-1 min-w-0 truncate text-xs font-bold text-slate-600" dir="ltr">{group.url.replace(/^https:\/\//, '')}</span>
        </div>
        <div className="flex gap-2">
          <a href={group.url} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> {t('افتح الجروب')}
          </a>
          <button type="button" onClick={onCopy} className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-colors">
            <Copy className="w-3.5 h-3.5" /> {t('نسخ اللينك')}
          </button>
        </div>
      </div>
      <CardFooter>
        <Btn type="button" size="sm" icon={Pencil} onClick={onEdit} disabled={busy}>{t('تعديل')}</Btn>
        <div className="ms-auto">
          <Btn type="button" size="icon" variant="ghost" onClick={onDelete} disabled={busy} title={t('حذف')}><Trash2 className="w-4 h-4 text-rose-500" /></Btn>
        </div>
      </CardFooter>
    </Card>
  );
}

function AddCard({ label, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group min-h-[14rem] rounded-3xl border-2 border-dashed border-slate-300 hover:border-teal-400 hover:bg-teal-50/40 flex flex-col items-center justify-center gap-3 p-6 text-center transition-all"
    >
      <span className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center transition-colors group-hover:scale-110 duration-300">
        <Plus className="w-7 h-7" />
      </span>
      <span className="text-sm font-black text-slate-700 group-hover:text-teal-700">{label}</span>
      <span className="text-xs font-bold text-slate-400">{text}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Forms                                                               */
/* ------------------------------------------------------------------ */

function FormActions({ saving, onClose, isNew }) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Btn type="button" variant="ghost" onClick={onClose}>{t('إلغاء')}</Btn>
      <Btn type="submit" icon={isNew ? Plus : Save} loading={saving}>{isNew ? t('إضافة') : t('حفظ')}</Btn>
    </div>
  );
}

function useSubmit(onSave) {
  const [saving, setSaving] = useState(false);
  const run = async (...args) => {
    setSaving(true);
    try { await onSave(...args); } finally { setSaving(false); }
  };
  return [saving, run];
}

function WhatsAppForm({ value, onClose, onSave }) {
  const toast = useToast();
  const [number, setNumber] = useState(value || '');
  const [saving, run] = useSubmit(onSave);
  const submit = (e) => {
    e.preventDefault();
    if (digitsOnly(number).replace('+', '').length < 10) return toast('err', t('اكتب رقم واتساب صحيح.'));
    return run(digitsOnly(number));
  };
  return (
    <Modal open onClose={onClose} title={t('رقم الواتساب الرئيسي')} subtitle={t('كل زراير «واتساب» في الموقع بتفتح على الرقم ده')} icon={MessageCircle} size="sm">
      <form onSubmit={submit} className="space-y-4">
        <Field label={t('الرقم')} hint={t('مصري (010…) أو دولي (2010…)')}>
          <Input required autoFocus dir="ltr" inputMode="tel" value={number} onChange={(e) => setNumber(digitsOnly(e.target.value))} placeholder="010xxxxxxxx" className="text-start text-lg tracking-wider" />
        </Field>
        <a href={whatsappHref({ whatsapp: number })} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 hover:underline">
          <ExternalLink className="w-3.5 h-3.5" /> {t('جرّب الرقم قبل الحفظ')}
        </a>
        <FormActions saving={saving} onClose={onClose} />
      </form>
    </Modal>
  );
}

function PhoneForm({ phone, isPrimary, onClose, onSave }) {
  const toast = useToast();
  const isNew = !phone;
  const [form, setForm] = useState({ id: phone?.id || newId('p'), label: phone?.label || '', number: phone?.number || '' });
  const [primary, setPrimary] = useState(isPrimary);
  const [saving, run] = useSubmit(onSave);
  const submit = (e) => {
    e.preventDefault();
    if (digitsOnly(form.number).replace('+', '').length < 8) return toast('err', t('اكتب رقم صحيح.'));
    return run({ ...form, label: form.label.trim(), number: digitsOnly(form.number) }, primary && !isPrimary);
  };
  return (
    <Modal open onClose={onClose} title={isNew ? t('إضافة رقم') : t('تعديل الرقم')} icon={Phone} size="sm">
      <form onSubmit={submit} className="space-y-4">
        <Field label={t('الاسم اللي بيظهر')} hint={t('مثلاً: الخط الرئيسي، فرع طنطا، خدمة العملاء')}>
          <Input autoFocus value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder={t('مثلاً: الخط الرئيسي')} />
        </Field>
        <Field label={t('الرقم')}>
          <Input required dir="ltr" inputMode="tel" value={form.number} onChange={(e) => setForm({ ...form, number: digitsOnly(e.target.value) })} placeholder="010xxxxxxxx" className="text-start text-lg tracking-wider" />
        </Field>
        {!isPrimary && (
          <div className="rounded-2xl bg-amber-50/60 border border-amber-100 px-4 py-3">
            <Switch checked={primary} onChange={setPrimary} label={t('خليه الرقم الرئيسي (بيظهر في زراير الاتصال)')} />
          </div>
        )}
        <FormActions saving={saving} onClose={onClose} isNew={isNew} />
      </form>
    </Modal>
  );
}

function MethodForm({ method, onClose, onSave }) {
  const toast = useToast();
  const isNew = !method;
  const [form, setForm] = useState({
    id: method?.id || newId('m'), type: method?.type || 'wallet', label: method?.label || typeOf('wallet').defaultLabel,
    number: method?.number || '', hint: method?.hint || '', is_active: method?.is_active !== false,
  });
  const [saving, run] = useSubmit(onSave);
  const bank = form.type === 'bank';
  const type = typeOf(form.type);

  const pickType = (value) => {
    const keepLabel = form.label && form.label !== typeOf(form.type).defaultLabel;
    setForm({
      ...form,
      type: value,
      label: keepLabel ? form.label : typeOf(value).defaultLabel,
      number: value === 'bank' || form.type === 'bank' ? form.number : digitsOnly(form.number),
    });
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.label.trim()) return toast('err', t('اكتب اسم طريقة الدفع.'));
    if (!form.number.trim()) return toast('err', bank ? t('اكتب رقم الحساب.') : t('اكتب رقم التحويل.'));
    return run({ ...form, label: form.label.trim(), number: bank ? form.number.trim() : digitsOnly(form.number), hint: form.hint.trim() });
  };

  const Icon = type.icon;
  return (
    <Modal open onClose={onClose} title={isNew ? t('إضافة طريقة دفع') : t('تعديل طريقة الدفع')} icon={Wallet} size="lg">
      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div>
            <span className="block text-xs font-black text-slate-600 mb-2">{t('النوع')}</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {METHOD_TYPES.map((m) => {
                const TIcon = m.icon;
                const on = form.type === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => pickType(m.value)}
                    className={`relative flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-center transition-all ${
                      on ? `${m.soft} shadow-md` : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {on && <Check className="absolute top-1.5 end-1.5 w-3.5 h-3.5" />}
                    <TIcon className="w-5 h-5" />
                    <span className="text-xs font-black">{t(m.label)}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[11px] font-bold text-slate-400">{t(type.hint)}</p>
          </div>
          <Field label={t('الاسم اللي بيظهر للطالب')}>
            <Input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder={t('مثلاً: فودافون كاش')} />
          </Field>
          <Field label={bank ? t('رقم الحساب / IBAN') : t('رقم التحويل')}>
            <Input
              required
              dir="ltr"
              inputMode={bank ? 'text' : 'tel'}
              value={form.number}
              onChange={(e) => setForm({ ...form, number: bank ? e.target.value : digitsOnly(e.target.value) })}
              placeholder={bank ? 'EG00 0000 0000 ...' : '010xxxxxxxx'}
              className="text-start text-lg tracking-wider"
            />
          </Field>
          <Field label={t('ملاحظة صغيرة (اختياري)')} hint={t('بتظهر تحت الاسم في صفحة الدفع')}>
            <Input value={form.hint} onChange={(e) => setForm({ ...form, hint: e.target.value })} placeholder={t('مثلاً: تحويل على الرقم')} />
          </Field>
          <Switch checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label={t('ظاهرة للطلاب')} />
        </div>

        {/* Live card */}
        <div className="lg:col-span-2">
          <p className="text-xs font-black text-slate-500 mb-2">{t('معاينة')}</p>
          <div className={`rounded-3xl overflow-hidden border border-slate-200 shadow-xl ${form.is_active ? '' : 'opacity-60'}`}>
            <div className={`relative overflow-hidden bg-gradient-to-br ${type.grad} text-white p-5`}>
              <div className="absolute -end-10 -bottom-10 w-36 h-36 rounded-full bg-white/15" />
              <div className="relative flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-white/20 border border-white/25 flex items-center justify-center"><Icon className="w-6 h-6" /></span>
                <div className="min-w-0">
                  <p className="text-lg font-black truncate">{form.label || '—'}</p>
                  <p className="text-[11px] font-bold text-white/80">{t(type.label)}</p>
                </div>
              </div>
            </div>
            <div className="p-5 bg-white">
              <p className="text-[11px] font-black text-slate-400">{bank ? t('رقم الحساب / IBAN') : t('رقم التحويل')}</p>
              <p className="mt-1 text-xl font-black text-slate-900 break-all" dir="ltr">{form.number || '—'}</p>
              {form.hint && <p className="mt-2 text-xs text-slate-500 font-semibold">{form.hint}</p>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 border-t border-slate-100">
          <FormActions saving={saving} onClose={onClose} isNew={isNew} />
        </div>
      </form>
    </Modal>
  );
}

function GroupForm({ group, taken, onClose, onSave }) {
  const toast = useToast();
  const isNew = !group;
  const [form, setForm] = useState({ code: group?.code || '', url: group?.url || '' });
  const [levels, setLevels] = useState([]);
  const [saving, run] = useSubmit(onSave);

  useEffect(() => {
    adminService.getLevels().then((ls) => setLevels(ls.map((l) => l.name))).catch(() => {});
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const code = form.code.trim().toUpperCase();
    if (!code) return toast('err', t('اختار المستوى.'));
    if (taken.includes(code)) return toast('err', t('المستوى ده ليه جروب بالفعل.'));
    if (!/^https:\/\/\S+$/i.test(form.url.trim())) return toast('err', t('اللينك لازم يبدأ بـ https://'));
    return run({ code, url: form.url.trim() });
  };

  const suggestions = [...new Set([...levels, 'A1', 'A2', 'B1', 'B2'])].filter((c) => !taken.includes(c));

  return (
    <Modal open onClose={onClose} title={isNew ? t('إضافة جروب') : t('تعديل الجروب')} icon={Users} size="sm">
      <form onSubmit={submit} className="space-y-4">
        <Field label={t('المستوى')}>
          <div className="flex flex-wrap gap-2 mb-2">
            {suggestions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm({ ...form, code: c })}
                className={`rounded-xl transition-transform ${form.code === c ? 'ring-4 ring-teal-400/50 scale-105' : 'opacity-70 hover:opacity-100'}`}
              >
                <LevelChip code={c} />
              </button>
            ))}
          </div>
          <Input dir="ltr" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().slice(0, 10) })} placeholder="A1" className="text-start font-black" />
        </Field>
        <Field label={t('لينك الجروب')} hint={t('من واتساب: معلومات الجروب ← دعوة عبر رابط')}>
          <Input required dir="ltr" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://chat.whatsapp.com/..." className="text-start" />
        </Field>
        <FormActions saving={saving} onClose={onClose} isNew={isNew} />
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Preview                                                             */
/* ------------------------------------------------------------------ */

function PreviewModal({ data, onClose }) {
  const phones = (data.phones || []).filter((p) => p.number);
  return (
    <Modal open onClose={onClose} title={t('معاينة زي الطالب')} subtitle={t('ده اللي الطالب بيشوفه في صفحة الدفع وقسم التواصل')} icon={MonitorSmartphone} size="lg">
      <div className="dw-keep-light grid grid-cols-1 lg:grid-cols-2 gap-5" dir="rtl">
        <PaymentInfo info={data} amount="500" />
        <div className="space-y-4">
          <div className="rounded-3xl bg-[#0e2c4e] text-white p-5 space-y-3">
            <p className="text-sm font-black">تواصل معنا</p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-xs font-black">
                <MessageCircle className="w-4 h-4 fill-white" /> واتساب <span dir="ltr" className="opacity-80">{data.whatsapp || '—'}</span>
              </span>
              {phones.map((p) => (
                <span key={p.id} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs font-black">
                  <Phone className="w-4 h-4 text-amber-300" />
                  {p.label && <span className="text-slate-300">{p.label}</span>}
                  <span dir="ltr">{p.number}</span>
                </span>
              ))}
            </div>
          </div>
          {(data.groups || []).length > 0 && (
            <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-3 text-slate-900">
              <p className="text-sm font-black">جروبات الواتساب (بتظهر للمشتركين بس)</p>
              <div className="flex flex-wrap gap-2">
                {data.groups.map((g) => (
                  <span key={g.code} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-black text-emerald-700">
                    <MessageCircle className="w-3.5 h-3.5" /> {g.code}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
