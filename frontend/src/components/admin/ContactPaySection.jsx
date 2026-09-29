'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { getErrorMessage } from '@/services/api';
import { setContactInfo, whatsappHref } from '@/lib/contactInfo';
import PaymentInfo, { METHOD_STYLE } from '@/components/common/PaymentInfo';
import { Card, Btn, Input, Select, Field, Switch, SectionHeader, Skeleton, ErrorBox, useToast } from './ui';
import {
  PhoneCall, MessageCircle, Phone, Plus, Trash2, ArrowUp, ArrowDown, Save, Wallet, Store, Users, ExternalLink, Star, CheckCircle2,
} from 'lucide-react';
import { translate as t } from './prefs';

const METHOD_TYPES = [
  { value: 'wallet', label: 'محفظة (فودافون كاش وغيرها)', defaultLabel: 'فودافون كاش' },
  { value: 'instapay', label: 'إنستا باي', defaultLabel: 'إنستا باي' },
  { value: 'bank', label: 'تحويل بنكي', defaultLabel: 'تحويل بنكي' },
  { value: 'other', label: 'طريقة تانية', defaultLabel: '' },
];
const defaultLabel = (type) => METHOD_TYPES.find((m) => m.value === type)?.defaultLabel || '';

const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
const digits = (v) => v.replace(/[^\d+]/g, '');

/** Contact numbers, payment methods and level WhatsApp groups shown on the site. */
export default function ContactPaySection() {
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminService.getContact()
      .then((d) => { setForm(d); setSaved(d); })
      .catch((e) => setError(getErrorMessage(e, t('تعذر تحميل البيانات.'))));
  }, []);

  const dirty = useMemo(() => form && saved && JSON.stringify(form) !== JSON.stringify(saved), [form, saved]);

  if (error) return <ErrorBox message={error} />;

  const setPayment = (patch) => setForm((f) => ({ ...f, payment: { ...f.payment, ...patch } }));
  const updateList = (key, index, patch) => setForm((f) => ({ ...f, [key]: f[key].map((x, i) => (i === index ? { ...x, ...patch } : x)) }));
  const removeFrom = (key, index) => setForm((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== index) }));
  const move = (list, index, dir) => {
    const next = [...list];
    const j = index + dir;
    if (j < 0 || j >= next.length) return list;
    [next[index], next[j]] = [next[j], next[index]];
    return next;
  };
  const methods = form?.payment?.methods || [];
  const updateMethod = (index, patch) => setPayment({ methods: methods.map((m, i) => (i === index ? { ...m, ...patch } : m)) });

  const save = async (e) => {
    e?.preventDefault();
    if (!digits(form.whatsapp || '')) return toast('err', t('رقم الواتساب مطلوب.'));
    if (methods.some((m) => !m.label.trim() || !m.number.trim())) return toast('err', t('كل طريقة دفع محتاجة اسم ورقم.'));
    setSaving(true);
    try {
      const data = await adminService.saveContact(form);
      setForm(data);
      setSaved(data);
      setContactInfo(data);
      toast('ok', t('تم الحفظ وظهر في الموقع.'));
    } catch (err) {
      toast('err', getErrorMessage(err));
    } finally {
      setSaving(false);
    }
    return undefined;
  };

  return (
    <div>
      <SectionHeader
        icon={PhoneCall}
        title={t('التواصل والدفع')}
        subtitle={t('أرقام التواصل وطرق الدفع اللي بتظهر للطلاب في الموقع — أي تعديل بيظهر على طول')}
        actions={form && (
          <>
            {dirty && <span className="px-3 h-9 inline-flex items-center rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-200 text-xs font-black">{t('في تعديلات مش محفوظة')}</span>}
            <Btn variant="gold" icon={Save} loading={saving} disabled={!dirty} onClick={save}>{t('حفظ ونشر')}</Btn>
          </>
        )}
      />

      {!form ? (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <Skeleton className="xl:col-span-3 h-[32rem] !rounded-3xl" />
          <Skeleton className="xl:col-span-2 h-96 !rounded-3xl" />
        </div>
      ) : (
        <form onSubmit={save} className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
          <div className="xl:col-span-3 space-y-6">
            {/* Contact numbers */}
            <Card className="p-5 sm:p-6 space-y-5">
              <CardHead icon={Phone} tone="bg-teal-50 text-teal-600" title={t('أرقام التواصل')} sub={t('بتظهر في الموقع في زراير الاتصال والواتساب والفوتر')} />

              <Field label={t('رقم الواتساب')} hint={t('كل زراير «واتساب» في الموقع بتفتح على الرقم ده')}>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MessageCircle className="w-4 h-4 text-emerald-500 absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input required dir="ltr" inputMode="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: digits(e.target.value) })} placeholder="010xxxxxxxx" className="ps-10 text-start" />
                  </div>
                  <a
                    href={whatsappHref(form)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={t('جرّب الرقم')}
                    className="shrink-0 inline-flex items-center gap-1.5 h-[46px] px-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-black"
                  >
                    <ExternalLink className="w-4 h-4" /> {t('جرّب')}
                  </a>
                </div>
              </Field>

              <div className="space-y-2.5">
                <p className="text-xs font-black text-slate-600">{t('أرقام الاتصال')}</p>
                {form.phones.length === 0 && <p className="text-xs text-slate-400 font-bold">{t('مفيش أرقام اتصال — ضيف رقم.')}</p>}
                {form.phones.map((p, i) => (
                  <div key={p.id} className="flex flex-wrap sm:flex-nowrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-2.5">
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`} title={i === 0 ? t('الرقم الرئيسي') : undefined}>
                      {i === 0 ? <Star className="w-4 h-4 fill-current" /> : <Phone className="w-4 h-4" />}
                    </span>
                    <Input value={p.label} onChange={(e) => updateList('phones', i, { label: e.target.value })} placeholder={t('مثلاً: الخط الرئيسي')} className="sm:!w-44" />
                    <Input dir="ltr" inputMode="tel" value={p.number} onChange={(e) => updateList('phones', i, { number: digits(e.target.value) })} placeholder="010xxxxxxxx" className="flex-1 text-start" />
                    <div className="flex gap-1 shrink-0">
                      <Btn type="button" size="icon" variant="ghost" disabled={i === 0} onClick={() => setForm({ ...form, phones: move(form.phones, i, -1) })} title={t('لفوق')}><ArrowUp className="w-4 h-4" /></Btn>
                      <Btn type="button" size="icon" variant="ghost" disabled={i === form.phones.length - 1} onClick={() => setForm({ ...form, phones: move(form.phones, i, 1) })} title={t('لتحت')}><ArrowDown className="w-4 h-4" /></Btn>
                      <Btn type="button" size="icon" variant="ghost" onClick={() => removeFrom('phones', i)} title={t('حذف')}><Trash2 className="w-4 h-4 text-rose-500" /></Btn>
                    </div>
                  </div>
                ))}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <Btn type="button" size="sm" variant="soft" icon={Plus} onClick={() => setForm({ ...form, phones: [...form.phones, { id: newId('p'), label: '', number: '' }] })}>
                    {t('إضافة رقم')}
                  </Btn>
                  <span className="text-[11px] text-slate-400 font-bold">{t('الرقم الأول ⭐ هو اللي بيظهر في زراير «اتصال».')}</span>
                </div>
              </div>
            </Card>

            {/* Payment methods */}
            <Card className="p-5 sm:p-6 space-y-5">
              <CardHead icon={Wallet} tone="bg-rose-50 text-rose-600" title={t('طرق الدفع')} sub={t('بتظهر للطالب وهو بيشترك في مستوى أو بيشتري كتاب')} />

              {methods.length === 0 && <p className="text-xs text-slate-400 font-bold">{t('مفيش طرق تحويل — الطلاب هيقدروا يدفعوا نقدي في الفرع بس.')}</p>}
              <div className="space-y-3">
                {methods.map((m, i) => {
                  const Icon = (METHOD_STYLE[m.type] || METHOD_STYLE.other).icon;
                  return (
                    <div key={m.id} className={`rounded-2xl border p-4 space-y-3 transition-opacity ${m.is_active === false ? 'opacity-60 border-dashed border-slate-300' : 'border-slate-200 bg-slate-50/60'}`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${(METHOD_STYLE[m.type] || METHOD_STYLE.other).tile} text-white flex items-center justify-center shadow-md shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </span>
                        <p className="flex-1 min-w-0 text-sm font-black text-slate-900 truncate">{m.label || t('طريقة دفع جديدة')}</p>
                        <Switch checked={m.is_active !== false} onChange={(v) => updateMethod(i, { is_active: v })} label={m.is_active !== false ? t('ظاهرة') : t('مخفية')} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label={t('النوع')}>
                          <Select
                            value={m.type}
                            onChange={(e) => {
                              const type = e.target.value;
                              const keepLabel = m.label && m.label !== defaultLabel(m.type);
                              updateMethod(i, { type, label: keepLabel ? m.label : defaultLabel(type) });
                            }}
                          >
                            {METHOD_TYPES.map((o) => <option key={o.value} value={o.value}>{t(o.label)}</option>)}
                          </Select>
                        </Field>
                        <Field label={t('الاسم اللي بيظهر للطالب')}>
                          <Input required value={m.label} onChange={(e) => updateMethod(i, { label: e.target.value })} placeholder={t('مثلاً: فودافون كاش')} />
                        </Field>
                        <Field label={m.type === 'bank' ? t('رقم الحساب / IBAN') : t('رقم التحويل')}>
                          <Input
                            required
                            dir="ltr"
                            inputMode={m.type === 'bank' ? 'text' : 'tel'}
                            value={m.number}
                            onChange={(e) => updateMethod(i, { number: m.type === 'bank' ? e.target.value : digits(e.target.value) })}
                            placeholder={m.type === 'bank' ? 'EG00 0000 ...' : '010xxxxxxxx'}
                            className="text-start"
                          />
                        </Field>
                        <Field label={t('ملاحظة صغيرة (اختياري)')}>
                          <Input value={m.hint} onChange={(e) => updateMethod(i, { hint: e.target.value })} placeholder={t('مثلاً: تحويل على الرقم')} />
                        </Field>
                      </div>
                      <div className="flex justify-end gap-1">
                        <Btn type="button" size="icon" variant="ghost" disabled={i === 0} onClick={() => setPayment({ methods: move(methods, i, -1) })} title={t('لفوق')}><ArrowUp className="w-4 h-4" /></Btn>
                        <Btn type="button" size="icon" variant="ghost" disabled={i === methods.length - 1} onClick={() => setPayment({ methods: move(methods, i, 1) })} title={t('لتحت')}><ArrowDown className="w-4 h-4" /></Btn>
                        <Btn type="button" size="icon" variant="ghost" onClick={() => setPayment({ methods: methods.filter((_, x) => x !== i) })} title={t('حذف')}><Trash2 className="w-4 h-4 text-rose-500" /></Btn>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Btn type="button" size="sm" variant="soft" icon={Plus} onClick={() => setPayment({ methods: [...methods, { id: newId('m'), type: 'wallet', label: defaultLabel('wallet'), number: '', hint: '', is_active: true }] })}>
                {t('إضافة طريقة دفع')}
              </Btn>

              <div className="flex items-center justify-between gap-3 rounded-2xl bg-amber-50/60 border border-amber-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center"><Store className="w-4 h-4" /></span>
                  <div>
                    <p className="text-sm font-black text-slate-800">{t('الدفع نقدي في الفرع')}</p>
                    <p className="text-[11px] text-slate-500 font-bold">{t('اختيار «نقدي بالفرع» في فورم الاشتراك')}</p>
                  </div>
                </div>
                <Switch checked={form.payment.cash_at_branch !== false} onChange={(v) => setPayment({ cash_at_branch: v })} />
              </div>
            </Card>

            {/* Level WhatsApp groups */}
            <Card className="p-5 sm:p-6 space-y-4">
              <CardHead icon={Users} tone="bg-emerald-50 text-emerald-600" title={t('جروبات الواتساب للمستويات')} sub={t('اللينك بيظهر للطالب بعد ما المستوى يتفعّل له بس')} />
              {form.groups.map((g, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input dir="ltr" value={g.code} onChange={(e) => updateList('groups', i, { code: e.target.value.toUpperCase().slice(0, 10) })} placeholder="A1" className="!w-20 text-center font-black" />
                  <Input dir="ltr" value={g.url} onChange={(e) => updateList('groups', i, { url: e.target.value.trim() })} placeholder="https://chat.whatsapp.com/..." className="flex-1 text-start" />
                  <Btn type="button" size="icon" variant="ghost" onClick={() => removeFrom('groups', i)} title={t('حذف')}><Trash2 className="w-4 h-4 text-rose-500" /></Btn>
                </div>
              ))}
              <Btn type="button" size="sm" variant="soft" icon={Plus} onClick={() => setForm({ ...form, groups: [...form.groups, { code: '', url: '' }] })}>
                {t('إضافة جروب')}
              </Btn>
            </Card>
          </div>

          {/* Live preview */}
          <div className="xl:col-span-2 space-y-4 xl:sticky xl:top-24">
            <p className="text-xs font-black text-slate-500 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t('معاينة زي ما هتظهر للطالب')}</p>
            <div className="dw-keep-light" dir="rtl">
              <PaymentInfo info={form} amount="500" />
            </div>
            <div className="dw-keep-light rounded-3xl bg-[#0e2c4e] text-white p-5 space-y-3" dir="rtl">
              <p className="text-sm font-black">تواصل معنا</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-xs font-black">
                  <MessageCircle className="w-4 h-4 fill-white" /> واتساب
                  <span dir="ltr" className="opacity-80">{form.whatsapp || '—'}</span>
                </span>
                {form.phones.filter((p) => p.number).map((p) => (
                  <span key={p.id} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs font-black">
                    <Phone className="w-4 h-4 text-amber-300" />
                    {p.label && <span className="text-slate-300">{p.label}</span>}
                    <span dir="ltr">{p.number}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

function CardHead({ icon: Icon, tone, title, sub }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${tone}`}><Icon className="w-5 h-5" /></span>
      <div>
        <h3 className="text-base font-black text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 font-bold">{sub}</p>
      </div>
    </div>
  );
}
