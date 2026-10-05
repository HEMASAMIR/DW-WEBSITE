'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { getErrorMessage } from '@/services/api';
import {
  Card, Btn, Input, Field, Modal, LevelChip, SectionHeader, Skeleton, Empty, ErrorBox, Switch, Segmented, StatusBadge,
  money, fullDate, dateLocale, useToast, useConfirm,
} from './ui';
import {
  Ticket, Plus, Pencil, Trash2, Copy, Check, Users, MousePointerClick, Send, BadgeCheck, Wand2, Pause, Play,
  CalendarRange, Percent, Banknote, Layers, BookOpen, Sparkles, Eye,
} from 'lucide-react';
import { translate as t } from './prefs';

/**
 * Discount coupons (stored by the website: src/app/site-data/coupons).
 * Each student can use one coupon ever; each coupon has a date window and a student limit.
 */

const STATUS = {
  active: { label: 'ساري', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500 animate-pulse', tone: 'from-emerald-400 to-teal-600' },
  scheduled: { label: 'لسه مبدأش', cls: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500', tone: 'from-sky-400 to-blue-600' },
  full: { label: 'اكتمل العدد', cls: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500', tone: 'from-violet-400 to-purple-600' },
  ended: { label: 'انتهت مدته', cls: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400', tone: 'from-slate-400 to-slate-600' },
  paused: { label: 'متوقف', cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', tone: 'from-amber-300 to-orange-500' },
};

const SCOPES = [
  { value: 'all', label: 'المستويات والكتب', icon: Sparkles },
  { value: 'levels', label: 'المستويات بس', icon: Layers },
  { value: 'books', label: 'الكتب بس', icon: BookOpen },
];

const discountLabel = (c) => (c.type === 'percent' ? `${c.value}%` : `${money(c.value)} ${t('ج.م')}`);
// Coupons run whole days, so the card shows dates without a time.
const dayDate = (iso) => new Date(iso).toLocaleDateString(dateLocale(), { day: 'numeric', month: 'short', year: 'numeric' });
const toInputDate = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : '');
const randomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return `DW${Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')}`;
};

export default function CouponsSection() {
  const toast = useToast();
  const confirm = useConfirm();
  const [coupons, setCoupons] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null); // null | 'new' | coupon
  const [viewing, setViewing] = useState(null);
  const [levels, setLevels] = useState([]);

  const load = useCallback(() => {
    setError('');
    adminService.getCoupons().then(setCoupons).catch((e) => setError(getErrorMessage(e, t('تعذر تحميل الكوبونات.'))));
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);
  useEffect(() => { adminService.getLevels().then((l) => setLevels(l || [])).catch(() => {}); }, []);

  const totals = useMemo(() => {
    const list = coupons || [];
    return {
      active: list.filter((c) => c.status === 'active').length,
      tried: list.reduce((s, c) => s + c.stats.tried, 0),
      benefited: list.reduce((s, c) => s + c.stats.benefited, 0),
      discount: list.reduce((s, c) => s + c.stats.discount_total, 0),
    };
  }, [coupons]);

  const shown = (coupons || []).filter((c) => filter === 'all' || (filter === 'active' ? c.status === 'active' : c.status !== 'active'));

  const save = async (fields) => {
    const saved = editing === 'new' ? await adminService.createCoupon(fields) : await adminService.updateCoupon(editing.id, fields);
    setCoupons((list) => (editing === 'new' ? [saved, ...(list || [])] : (list || []).map((c) => (c.id === saved.id ? saved : c))));
    toast('ok', editing === 'new' ? t('الكوبون اتعمل ✨') : t('اتحفظت التعديلات'));
    setEditing(null);
  };

  const toggle = async (c) => {
    try {
      const saved = await adminService.updateCoupon(c.id, { is_active: !c.is_active });
      setCoupons((list) => list.map((x) => (x.id === saved.id ? saved : x)));
      toast('ok', saved.is_active ? t('الكوبون اشتغل تاني') : t('الكوبون اتوقف'));
    } catch (e) {
      toast('err', getErrorMessage(e, t('تعذر الحفظ.')));
    }
  };

  const remove = async (c) => {
    const ok = await confirm({
      title: t('حذف الكوبون {code}؟', { code: c.code }),
      text: t('الطلبات اللي استخدمته هتفضل محتفظة بالخصم بتاعها.'),
      confirmText: t('حذف'),
    });
    if (!ok) return;
    try {
      await adminService.deleteCoupon(c.id);
      setCoupons((list) => list.filter((x) => x.id !== c.id));
      toast('ok', t('تم حذف الكوبون.'));
    } catch (e) {
      toast('err', getErrorMessage(e, t('تعذر الحذف.')));
    }
  };

  return (
    <div>
      <SectionHeader
        icon={Ticket}
        title={t('الكوبونات')}
        subtitle={t('كوبونات خصم بمدة وعدد محدد — وكل طالب ليه كوبون واحد بس')}
        actions={<Btn variant="gold" icon={Plus} onClick={() => setEditing('new')}>{t('كوبون جديد')}</Btn>}
      />

      {/* Totals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Ticket, label: t('كوبونات سارية'), value: totals.active, cls: 'from-emerald-400 to-teal-600' },
          { icon: MousePointerClick, label: t('دخلوا على الكوبونات'), value: totals.tried, cls: 'from-sky-400 to-blue-600' },
          { icon: BadgeCheck, label: t('استفادوا من الخصم'), value: totals.benefited, cls: 'from-violet-400 to-purple-600' },
          { icon: Banknote, label: t('إجمالي الخصومات (ج.م)'), value: money(totals.discount), cls: 'from-amber-300 to-orange-500' },
        ].map((s) => (
          <Card key={s.label} className="p-4 flex items-center gap-3">
            <span className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.cls} text-white flex items-center justify-center shadow-lg shrink-0`}>
              <s.icon className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xl font-black text-slate-900 leading-tight" dir="ltr">{coupons ? s.value : '—'}</p>
              <p className="text-[11px] font-bold text-slate-500 truncate">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: t('الكل'), count: coupons?.length || 0 },
            { value: 'active', label: t('السارية'), count: totals.active },
            { value: 'closed', label: t('المقفولة'), count: (coupons?.length || 0) - totals.active },
          ]}
        />
      </div>

      {error ? (
        <ErrorBox message={error} onRetry={load} />
      ) : !coupons ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-72 rounded-3xl" />)}</div>
      ) : shown.length === 0 ? (
        <Card>
          <Empty
            icon={Ticket}
            title={coupons.length ? t('مفيش كوبونات هنا') : t('لسه مفيش كوبونات')}
            text={t('اعمل كوبون خصم بمدة محددة وعدد طلاب محدد، وابعت الكود للطلاب.')}
            action={<Btn variant="gold" icon={Plus} onClick={() => setEditing('new')}>{t('كوبون جديد')}</Btn>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {shown.map((c) => (
            <CouponCard key={c.id} coupon={c} onEdit={() => setEditing(c)} onToggle={() => toggle(c)} onDelete={() => remove(c)} onView={() => setViewing(c)} />
          ))}
        </div>
      )}

      <CouponForm open={!!editing} coupon={editing === 'new' ? null : editing} levels={levels} onClose={() => setEditing(null)} onSave={save} />
      <CouponUses coupon={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

function CouponCard({ coupon: c, onEdit, onToggle, onDelete, onView }) {
  const [copied, setCopied] = useState(false);
  const st = STATUS[c.status] || STATUS.ended;
  const start = new Date(c.starts_at).getTime();
  const end = new Date(c.ends_at).getTime();
  const [now] = useState(() => Date.now());
  const timeUsed = Math.min(1, Math.max(0, (now - start) / (end - start || 1)));
  const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));
  const usePct = c.max_uses ? Math.min(1, c.stats.used / c.max_uses) : null;

  const copy = () => {
    navigator.clipboard?.writeText(c.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <Card className="overflow-hidden flex flex-col">
      {/* Ticket head */}
      <div className={`relative bg-gradient-to-br ${st.tone} text-white px-5 pt-5 pb-6`}>
        <Ticket className="absolute -bottom-6 -end-4 w-28 h-28 text-white/10 -rotate-12" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
              <Ticket className="w-3 h-3" /> {t('كوبون خصم')}
            </span>
            <button type="button" onClick={copy} className="group mt-1 flex items-center gap-2" title={t('نسخ الكود')}>
              <span className="text-2xl font-black tracking-widest" dir="ltr">{c.code}</span>
              <span className="w-7 h-7 rounded-lg bg-white/20 group-hover:bg-white/30 flex items-center justify-center">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </span>
            </button>
          </div>
          <span className="dw-keep-light px-3 py-1.5 rounded-xl bg-white text-slate-900 text-lg font-black shadow-lg shrink-0" dir="ltr">
            -{discountLabel(c)}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-black whitespace-nowrap ${st.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
            {t(st.label)}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 h-6 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-black">
            {t((SCOPES.find((s) => s.value === c.scope) || SCOPES[0]).label)}
          </span>
          {c.level_codes?.map((code) => <LevelChip key={code} code={code} size="sm" />)}
        </div>

        {/* Time window */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span className="inline-flex items-center gap-1"><CalendarRange className="w-3.5 h-3.5" /> {dayDate(c.starts_at)} — {dayDate(c.ends_at)}</span>
            {c.status === 'active' && <span className="font-black text-slate-700">{t('باقي {n} يوم', { n: daysLeft })}</span>}
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${st.tone}`} style={{ width: `${Math.round(timeUsed * 100)}%` }} />
          </div>
        </div>

        {/* Seats */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {t('الطلاب المسموحلهم')}</span>
            <span className="font-black text-slate-700" dir="ltr">{c.stats.used} / {c.max_uses ?? '∞'}</span>
          </div>
          {usePct !== null && (
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-purple-600" style={{ width: `${Math.round(usePct * 100)}%` }} />
            </div>
          )}
        </div>

        {/* Funnel */}
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 border border-slate-100 p-2.5">
          {[
            { icon: MousePointerClick, label: t('دخلوا عليه'), value: c.stats.tried, cls: 'text-sky-600' },
            { icon: Send, label: t('استخدموه'), value: c.stats.used, cls: 'text-violet-600' },
            { icon: BadgeCheck, label: t('استفادوا'), value: c.stats.benefited, cls: 'text-emerald-600' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <s.icon className={`w-4 h-4 mx-auto ${s.cls}`} />
              <p className="text-lg font-black text-slate-900 leading-tight mt-1">{s.value}</p>
              <p className="text-[10px] font-bold text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
        {c.stats.discount_total > 0 && (
          <p className="text-xs font-bold text-slate-500">{t('إجمالي الخصم اللي استفادوا بيه:')} <span className="font-black text-slate-800">{money(c.stats.discount_total)} {t('ج.م')}</span></p>
        )}
        {c.note && <p className="text-xs text-slate-500 leading-relaxed">{c.note}</p>}

        <div className="mt-auto pt-2 flex flex-wrap items-center gap-2">
          <Btn size="sm" variant="soft" icon={Eye} onClick={onView}>{t('مين استخدمه')}</Btn>
          <Btn size="sm" variant="ghost" icon={Pencil} onClick={onEdit}>{t('تعديل')}</Btn>
          <Btn size="sm" variant="ghost" icon={c.is_active ? Pause : Play} onClick={onToggle}>{c.is_active ? t('إيقاف') : t('تشغيل')}</Btn>
          <Btn size="icon" variant="dangerSoft" onClick={onDelete} aria-label={t('حذف')}><Trash2 className="w-4 h-4" /></Btn>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Create / edit                                                       */
/* ------------------------------------------------------------------ */

function CouponForm({ open, coupon, levels, onClose, onSave }) {
  const toast = useToast();
  const blank = () => {
    const today = new Date();
    const month = new Date(today.getTime() + 30 * 86400000);
    return {
      code: randomCode(), type: 'percent', value: '', scope: 'all', level_codes: [],
      starts_at: toInputDate(today.toISOString()), ends_at: toInputDate(month.toISOString()), max_uses: '', is_active: true, note: '',
    };
  };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [openedFor, setOpenedFor] = useState(null);

  // Reset the form each time the modal opens (adjusted during render, not in an effect).
  const key = open ? coupon?.id || 'new' : null;
  if (key !== openedFor) {
    setOpenedFor(key);
    if (open) {
      setForm(coupon
        ? {
          ...coupon,
          value: String(coupon.value),
          max_uses: coupon.max_uses ?? '',
          starts_at: toInputDate(coupon.starts_at),
          ends_at: toInputDate(coupon.ends_at),
        }
        : blank());
    }
  }

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleLevel = (code) => setForm((f) => ({ ...f, level_codes: f.level_codes.includes(code) ? f.level_codes.filter((c) => c !== code) : [...f.level_codes, code] }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        code: form.code,
        type: form.type,
        value: Number(form.value),
        scope: form.scope,
        level_codes: form.level_codes,
        // Dates are whole days: from the start of the first day to the end of the last one.
        starts_at: form.starts_at ? new Date(`${form.starts_at}T00:00:00`).toISOString() : null,
        ends_at: form.ends_at ? new Date(`${form.ends_at}T23:59:59`).toISOString() : null,
        max_uses: form.max_uses === '' ? null : Number(form.max_uses),
        is_active: form.is_active,
        note: form.note,
      });
    } catch (err) {
      toast('err', getErrorMessage(err, t('تعذر الحفظ.')));
    } finally {
      setSaving(false);
    }
  };

  const preview = form.value ? (form.type === 'percent' ? `-${form.value}%` : `-${money(Number(form.value))} ${t('ج.م')}`) : '—';

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={Ticket}
      title={coupon ? t('تعديل الكوبون') : t('كوبون جديد')}
      subtitle={t('كل طالب ليه كوبون واحد بس — حتى لو الطلب اترفض')}
      size="lg"
      footer={
        <div className="flex gap-3 justify-end">
          <Btn variant="ghost" onClick={onClose}>{t('إلغاء')}</Btn>
          <Btn variant="gold" icon={Check} loading={saving} type="submit" form="coupon-form">{coupon ? t('حفظ التعديلات') : t('إنشاء الكوبون')}</Btn>
        </div>
      }
    >
      <form id="coupon-form" onSubmit={submit} className="space-y-5">
        {/* Live preview */}
        <div className="dw-keep-light relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0e2c4e] to-teal-700 text-white px-5 py-4 flex items-center justify-between gap-3">
          <Ticket className="absolute -bottom-5 -start-3 w-24 h-24 text-white/10 rotate-12" />
          <div className="relative min-w-0">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-200">{t('معاينة')}</span>
            <p className="text-2xl font-black tracking-widest truncate" dir="ltr">{form.code || '—'}</p>
          </div>
          <span className="relative px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-lg font-black" dir="ltr">{preview}</span>
        </div>

        <Field label={t('كود الكوبون')} hint={t('حروف إنجليزي وأرقام — الطالب هيكتبه زي ما هو.')}>
          <div className="flex gap-2">
            <Input
              required
              value={form.code}
              onChange={(e) => set('code')(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
              dir="ltr"
              maxLength={40}
              className="font-black tracking-widest"
            />
            <Btn type="button" variant="soft" icon={Wand2} onClick={() => set('code')(randomCode())}>{t('توليد')}</Btn>
          </div>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t('نوع الخصم')}>
            <Segmented
              value={form.type}
              onChange={set('type')}
              options={[
                { value: 'percent', label: <span className="inline-flex items-center gap-1"><Percent className="w-3.5 h-3.5" />{t('نسبة')}</span> },
                { value: 'fixed', label: <span className="inline-flex items-center gap-1"><Banknote className="w-3.5 h-3.5" />{t('مبلغ ثابت')}</span> },
              ]}
            />
          </Field>
          <Field label={form.type === 'percent' ? t('النسبة (%)') : t('المبلغ (ج.م)')}>
            <Input required type="number" min="1" max={form.type === 'percent' ? 100 : undefined} step="any" value={form.value} onChange={(e) => set('value')(e.target.value)} dir="ltr" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t('بيبدأ يوم')}>
            <Input required type="date" value={form.starts_at} onChange={(e) => set('starts_at')(e.target.value)} dir="ltr" />
          </Field>
          <Field label={t('بيتقفل لوحده يوم')} hint={t('بعد اليوم ده الكوبون بيقف تلقائي.')}>
            <Input required type="date" value={form.ends_at} min={form.starts_at} onChange={(e) => set('ends_at')(e.target.value)} dir="ltr" />
          </Field>
        </div>

        <Field label={t('عدد الطلاب المسموحلهم')} hint={t('سيبه فاضي لو العدد مفتوح.')}>
          <Input type="number" min="1" step="1" value={form.max_uses} onChange={(e) => set('max_uses')(e.target.value)} dir="ltr" placeholder="∞" />
        </Field>

        <Field label={t('شغال على')}>
          <div className="grid grid-cols-3 gap-2">
            {SCOPES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => set('scope')(s.value)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-2 py-3 text-xs font-black transition-colors ${
                  form.scope === s.value ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <s.icon className="w-4 h-4" />
                {t(s.label)}
              </button>
            ))}
          </div>
        </Field>

        {levels.length > 0 && (
          <Field label={t('مستويات معينة (اختياري)')} hint={t('لو مختارتش حاجة، الكوبون شغال على كل المستويات. الكتب بتتحسب بمستواها.')}>
            <div className="flex flex-wrap gap-2">
              {levels.map((l) => {
                const on = form.level_codes.includes(l.name);
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => toggleLevel(l.name)}
                    className={`inline-flex items-center gap-2 h-10 ps-1.5 pe-3 rounded-full border-2 text-xs font-black transition-colors ${
                      on ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <LevelChip code={l.name} size="sm" />
                    {on && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </Field>
        )}

        <Field label={t('ملاحظة للإدارة (اختياري)')}>
          <Input value={form.note} onChange={(e) => set('note')(e.target.value)} maxLength={300} placeholder={t('مثلاً: عرض بداية الترم')} />
        </Field>

        <Switch checked={form.is_active} onChange={set('is_active')} label={t('الكوبون شغال')} />
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Who used it                                                         */
/* ------------------------------------------------------------------ */

function CouponUses({ coupon, onClose }) {
  const [data, setData] = useState(null);
  const [loadedFor, setLoadedFor] = useState(null);

  useEffect(() => {
    if (!coupon) return undefined;
    let cancelled = false;
    adminService.getCoupon(coupon.id)
      .then((d) => { if (!cancelled) { setData(d); setLoadedFor(coupon.id); } })
      .catch(() => { if (!cancelled) { setData({ uses: [] }); setLoadedFor(coupon.id); } });
    return () => { cancelled = true; };
  }, [coupon]);

  const ready = coupon && loadedFor === coupon.id;
  const uses = ready ? data?.uses || [] : [];

  return (
    <Modal
      open={!!coupon}
      onClose={onClose}
      icon={Users}
      title={coupon ? t('مين استخدم {code}', { code: coupon.code }) : ''}
      subtitle={coupon ? t('{n} طالب استخدموه • {m} استفادوا', { n: coupon.stats.used, m: coupon.stats.benefited }) : ''}
      size="lg"
    >
      {!ready ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>
      ) : uses.length === 0 ? (
        <Empty icon={Ticket} title={t('لسه محدش استخدمه')} text={t('أول ما طالب يبعت طلب بالكوبون ده هيظهر هنا.')} />
      ) : (
        <ul className="space-y-2">
          {uses.map((u) => (
            <li key={u.request_id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 p-3">
              <LevelChip code={u.level_code} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 truncate">{u.name}</p>
                <p className="text-[11px] font-bold text-slate-500 truncate" dir="auto">{u.item_name} • <span dir="ltr">{u.phone}</span></p>
              </div>
              <div className="text-end">
                <p className="text-sm font-black text-slate-900">{money(u.amount)}</p>
                <p className="text-[11px] font-bold text-emerald-600">-{money(u.discount)}</p>
              </div>
              <StatusBadge status={u.status} />
              <span className="w-full sm:w-auto text-[11px] font-bold text-slate-400">{fullDate(u.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
