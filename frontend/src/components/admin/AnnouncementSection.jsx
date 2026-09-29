'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { getErrorMessage } from '@/services/api';
import { Card, Btn, Input, Textarea, Field, Switch, SectionHeader, Skeleton, ErrorBox, useToast } from './ui';
import { Megaphone, Save } from 'lucide-react';

/** The promo banner shown at the top of the home page. */
export default function AnnouncementSection() {
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminService.getAnnouncement().then(setForm).catch((e) => setError(getErrorMessage(e, 'تعذر تحميل الإعلان.')));
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      setForm(await adminService.saveAnnouncement(form));
      toast('ok', 'تم تحديث الإعلان على الموقع.');
    } catch (err) {
      toast('err', getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (error) return <ErrorBox message={error} />;

  return (
    <div>
      <SectionHeader icon={Megaphone} title="إعلان الموقع" subtitle="الشريط الترويجي اللي بيظهر أعلى الصفحة الرئيسية" />
      {!form ? <Skeleton className="h-96 !rounded-3xl" /> : (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <Card className="xl:col-span-3 p-5 sm:p-6">
            <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 flex flex-wrap gap-6 rounded-2xl bg-slate-50 px-4 py-3">
                <Switch checked={!!form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="الإعلان ظاهر" />
                <Switch checked={!!form.has_discount} onChange={(v) => setForm({ ...form, has_discount: v })} label="شارة خصم" />
              </div>
              <Field label="الوسم"><Input value={form.tag} onChange={set('tag')} /></Field>
              <Field label="نسبة الخصم"><Input value={form.discount_percent} onChange={set('discount_percent')} disabled={!form.has_discount} /></Field>
              <Field label="العنوان" className="sm:col-span-2"><Input value={form.title} onChange={set('title')} /></Field>
              <Field label="النص" className="sm:col-span-2"><Textarea rows={3} value={form.desc} onChange={set('desc')} /></Field>
              <Field label="نص الزرار"><Input value={form.cta_text} onChange={set('cta_text')} /></Field>
              <Field label="لينك الزرار"><Input dir="ltr" value={form.cta_link} onChange={set('cta_link')} /></Field>
              <div className="sm:col-span-2 flex justify-end"><Btn type="submit" icon={Save} loading={saving}>حفظ ونشر</Btn></div>
            </form>
          </Card>

          <div className="xl:col-span-2 space-y-3">
            <p className="text-xs font-black text-slate-500">معاينة</p>
            <div className={`relative overflow-hidden rounded-3xl bg-[#0e2c4e] text-white p-6 transition-opacity ${form.is_active ? '' : 'opacity-40'}`}>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.45),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.3),transparent_55%)]" />
              <div className="relative space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-black">{form.tag}</span>
                  {form.has_discount && form.discount_percent && (
                    <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black">خصم {form.discount_percent}</span>
                  )}
                </div>
                <h3 className="text-xl font-black">{form.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{form.desc}</p>
                <span className="inline-flex h-10 px-5 items-center rounded-2xl bg-gradient-to-l from-amber-300 to-amber-500 text-slate-950 text-sm font-black">{form.cta_text}</span>
              </div>
            </div>
            {!form.is_active && <p className="text-xs font-bold text-slate-500">الإعلان مخفي حالياً من الموقع.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
