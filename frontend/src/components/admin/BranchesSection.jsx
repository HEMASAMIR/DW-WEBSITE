'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { getErrorMessage } from '@/services/api';
import { MapArt } from '@/components/home/BranchesSection';
import { BRANCH_TONES, BRANCH_COLOR_KEYS, branchTone } from '@/constants/branchTones';
import {
  Card, Btn, Input, Textarea, Field, Switch, Modal, StatusBadge, SectionHeader, Skeleton, Empty, ErrorBox,
  useToast, useConfirm,
} from './ui';
import { MapPin, Plus, Pencil, Trash2, Phone, Navigation, Save, ArrowUp, ArrowDown, Eye, EyeOff, Check } from 'lucide-react';
import { translate as t } from './prefs';

export default function BranchesSection() {
  const toast = useToast();
  const confirm = useConfirm();
  const [branches, setBranches] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = useCallback(() => {
    setError('');
    adminService.getBranches().then(setBranches).catch((e) => setError(getErrorMessage(e, t('تعذر تحميل الفروع.'))));
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(load, [load]);

  const run = async (key, promise, okText) => {
    setBusy(key);
    try {
      const res = await promise;
      toast('ok', okText || res?.detail || t('تم.'));
      load();
    } catch (e) {
      toast('err', getErrorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  const visible = (branches || []).filter((b) => b.is_active !== false).length;

  return (
    <div>
      <SectionHeader
        icon={MapPin}
        title={t('الفروع')}
        subtitle={branches ? t('{n} فرع • {v} ظاهر في الموقع — كل فرع بلونه واللوكيشن بتاعه', { n: branches.length, v: visible }) : t('الفروع اللي بتظهر في الصفحة الرئيسية')}
        actions={<Btn variant="gold" icon={Plus} onClick={() => setEditing({})}>{t('فرع جديد')}</Btn>}
      />

      {error ? (
        <ErrorBox message={error} onRetry={load} />
      ) : !branches ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{[0, 1].map((i) => <Skeleton key={i} className="h-80 !rounded-[2rem]" />)}</div>
      ) : branches.length === 0 ? (
        <Card><Empty icon={MapPin} title={t('مفيش فروع')} action={<Btn icon={Plus} onClick={() => setEditing({})}>{t('أضف أول فرع')}</Btn>} /></Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {branches.map((b, i) => {
            const tone = branchTone(b.color, i);
            const hidden = b.is_active === false;
            return (
              <article
                key={b.id}
                className={`group relative flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-200/80 ${tone.border} shadow-xl shadow-slate-900/[0.05] hover:shadow-2xl hover:-translate-y-1 transition-all ${hidden ? 'opacity-70 grayscale-[35%]' : ''}`}
              >
                <BranchArt tone={tone} index={i} branch={b} />

                <div className="flex-1 flex flex-col p-5 sm:p-6 gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1.5">
                      <h3 className="text-xl font-black text-[#0e2c4e] truncate">{b.name}</h3>
                      <span className={`block h-1 w-12 rounded-full ${tone.bar} group-hover:w-24 transition-all duration-500`} />
                    </div>
                    <StatusBadge status={hidden ? 'hidden' : 'published'} label={hidden ? t('مخفي') : t('ظاهر في الموقع')} />
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed flex items-start gap-2">
                    <MapPin className={`w-4 h-4 ${tone.icon} shrink-0 mt-0.5`} /> {b.address}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-black">
                    <a href={`tel:${b.phone}`} className={`inline-flex items-center gap-1.5 px-3 h-9 rounded-xl bg-slate-100 border border-slate-200 ${tone.phone} text-[#0e2c4e]`}>
                      <Phone className={`w-3.5 h-3.5 ${tone.icon}`} /> <span dir="ltr">{b.phone}</span>
                    </a>
                    {b.map_url && (
                      <a href={b.map_url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 px-3 h-9 rounded-xl bg-[#0e2c4e] ${tone.mapBtn} text-white`}>
                        <Navigation className="w-3.5 h-3.5" /> {t('اللوكيشن')}
                      </a>
                    )}
                  </div>
                </div>

                <div className="px-5 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-wrap items-center gap-2">
                  <Btn size="sm" icon={Pencil} onClick={() => setEditing(b)}>{t('تعديل')}</Btn>
                  <Btn
                    size="sm"
                    variant="ghost"
                    icon={hidden ? Eye : EyeOff}
                    loading={busy === `vis-${b.id}`}
                    onClick={() => run(`vis-${b.id}`, adminService.updateBranch(b.id, { is_active: hidden }), hidden ? t('الفرع ظاهر في الموقع.') : t('الفرع اتخفى من الموقع.'))}
                  >
                    {hidden ? t('إظهار') : t('إخفاء')}
                  </Btn>
                  <div className="ms-auto flex gap-1">
                    <Btn size="icon" variant="ghost" disabled={i === 0 || !!busy} onClick={() => run(`mv-${b.id}`, adminService.moveBranch(b.id, -1, branches), t('تم تغيير الترتيب.'))} title={t('قبله')}><ArrowUp className="w-4 h-4" /></Btn>
                    <Btn size="icon" variant="ghost" disabled={i === branches.length - 1 || !!busy} onClick={() => run(`mv-${b.id}`, adminService.moveBranch(b.id, 1, branches), t('تم تغيير الترتيب.'))} title={t('بعده')}><ArrowDown className="w-4 h-4" /></Btn>
                    <Btn
                      size="icon"
                      variant="ghost"
                      title={t('حذف')}
                      onClick={async () => {
                        if (await confirm({ title: t('حذف {name}؟', { name: b.name }), text: t('الفرع هيختفي من الموقع نهائياً.'), confirmText: t('حذف') })) {
                          run(`del-${b.id}`, adminService.deleteBranch(b.id), t('تم حذف الفرع.'));
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </Btn>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {editing && (
        <BranchForm
          branch={editing}
          index={editing.id ? branches.findIndex((b) => b.id === editing.id) : (branches?.length || 0)}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

/** Illustrated map header, same as the branch cards on the site. */
function BranchArt({ tone, index, branch, compact }) {
  return (
    <div className={`dw-keep-light dw-shine relative ${compact ? 'h-32' : 'h-40'} bg-gradient-to-br ${tone.mapBg} overflow-hidden`}>
      <MapArt accent={tone.accent} soft={tone.soft} seed={index} />
      <div className="absolute top-0 inset-x-0 h-1 flex" dir="ltr">
        <span className="flex-1 bg-slate-900" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
      </div>
      <span className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2">
        <span className="dw-float block relative">
          <span className={`absolute inset-0 rounded-full ${tone.ping} animate-ping`} />
          <span className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${tone.pin} ring-4 ring-white flex items-center justify-center shadow-xl`}>
            <MapPin className="w-6 h-6" />
          </span>
        </span>
      </span>
      {branch.badge && (
        <span className="absolute top-4 start-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur shadow-sm text-[#0e2c4e] text-[11px] font-black">{branch.badge}</span>
      )}
      {branch.city && branch.city !== branch.badge && (
        <span className="absolute bottom-3 start-4 px-3 py-1 rounded-full bg-white/80 backdrop-blur text-[#0e2c4e] text-[11px] font-black">{branch.city}</span>
      )}
      <span className="absolute bottom-2 end-4 text-5xl font-black leading-none select-none" style={{ color: tone.accent, opacity: 0.2 }} dir="ltr">
        {String(index + 1).padStart(2, '0')}
      </span>
    </div>
  );
}

function BranchForm({ branch, index, onClose, onSaved }) {
  const toast = useToast();
  const isNew = !branch.id;
  const [form, setForm] = useState({
    name: branch.name || '', city: branch.city || '', address: branch.address || '', phone: branch.phone || '',
    map_url: branch.map_url || '', badge: branch.badge || '', is_active: branch.is_active ?? true,
    color: branch.color || BRANCH_COLOR_KEYS[index % BRANCH_COLOR_KEYS.length],
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const tone = branchTone(form.color, index);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) await adminService.createBranch(form);
      else await adminService.updateBranch(branch.id, form);
      toast('ok', isNew ? t('تم إضافة الفرع وظهر في الموقع.') : t('تم حفظ الفرع.'));
      onSaved();
    } catch (err) {
      toast('err', getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={isNew ? t('فرع جديد') : t('تعديل {name}', { name: branch.name })} subtitle={t('المعاينة بتتحدّث وانت بتكتب')} icon={MapPin} size="lg">
      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
          <Field label={t('اسم الفرع')}><Input required value={form.name} onChange={set('name')} placeholder={t('فرع طنطا')} /></Field>
          <Field label={t('المدينة / المحافظة')}><Input required value={form.city} onChange={set('city')} placeholder={t('الغربية')} /></Field>
          <Field label={t('العنوان بالتفصيل')} className="sm:col-span-2"><Textarea required rows={2} value={form.address} onChange={set('address')} /></Field>
          <Field label={t('تليفون الفرع')}><Input required dir="ltr" inputMode="tel" value={form.phone} onChange={set('phone')} placeholder="010xxxxxxxx" /></Field>
          <Field label={t('الشارة')} hint={t('مثلاً: فرع رئيسي')}><Input value={form.badge} onChange={set('badge')} /></Field>
          <Field label={t('لينك جوجل ماب')} className="sm:col-span-2"><Input dir="ltr" value={form.map_url} onChange={set('map_url')} placeholder="https://maps.app.goo.gl/..." /></Field>

          <div className="sm:col-span-2">
            <span className="block text-xs font-black text-slate-600 mb-2">{t('لون الفرع')}</span>
            <div className="flex flex-wrap gap-2.5">
              {BRANCH_COLOR_KEYS.map((key) => {
                const bt = BRANCH_TONES[key];
                const on = form.color === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm({ ...form, color: key })}
                    className={`flex items-center gap-2 h-11 pe-4 ps-1.5 rounded-2xl border-2 text-xs font-black transition-all ${
                      on ? 'border-[#0e2c4e] bg-slate-50 text-[#0e2c4e] shadow-md' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-inner" style={{ background: `linear-gradient(135deg, ${bt.soft}, ${bt.accent})` }}>
                      {on && <Check className="w-4 h-4" />}
                    </span>
                    {t(bt.label)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sm:col-span-2"><Switch checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label={t('ظاهر في الموقع')} /></div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-xs font-black text-slate-500 mb-2">{t('معاينة زي ما هتظهر في الموقع')}</p>
          <div className={`rounded-[1.75rem] overflow-hidden border border-slate-200 shadow-xl bg-white ${form.is_active ? '' : 'opacity-60'}`}>
            <BranchArt tone={tone} index={index} branch={form} compact />
            <div className="p-4 space-y-2">
              <h4 className="text-lg font-black text-[#0e2c4e]">{form.name || t('اسم الفرع')}</h4>
              <span className={`block h-1 w-10 rounded-full ${tone.bar}`} />
              <p className="text-xs text-slate-600 flex items-start gap-1.5"><MapPin className={`w-3.5 h-3.5 ${tone.icon} shrink-0 mt-0.5`} /> {form.address || t('العنوان بالتفصيل')}</p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <span className="flex items-center justify-center gap-1.5 h-9 rounded-xl bg-slate-100 text-[11px] font-black text-[#0e2c4e]"><Phone className={`w-3.5 h-3.5 ${tone.icon}`} /> <span dir="ltr">{form.phone || '—'}</span></span>
                <span className="flex items-center justify-center gap-1.5 h-9 rounded-xl bg-[#0e2c4e] text-[11px] font-black text-white"><Navigation className="w-3.5 h-3.5" />{' '}{t('الخريطة')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Btn type="button" variant="ghost" onClick={onClose}>{t('إلغاء')}</Btn>
          <Btn type="submit" icon={Save} loading={saving}>{isNew ? t('إضافة الفرع') : t('حفظ')}</Btn>
        </div>
      </form>
    </Modal>
  );
}
