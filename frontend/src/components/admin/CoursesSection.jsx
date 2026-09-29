'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/admin.service';
import { getErrorMessage } from '@/services/api';
import { formatDuration } from '@/services/courses.service';
import {
  Card, Btn, Input, Textarea, Field, Switch, Modal, Drawer, LevelChip, StatusBadge, SectionHeader, Segmented,
  Skeleton, Empty, ErrorBox, Avatar, money, timeAgo, useToast, useConfirm,
} from './ui';
import {
  Layers, Plus, Pencil, Trash2, Users, PlayCircle, FileText, Clock3, RefreshCw, ArrowUp, ArrowDown, Upload, Eye, Film, Save,
} from 'lucide-react';

export default function CoursesSection({ onChanged, legacy }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [levels, setLevels] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // level object, or {} for new
  const [contentOf, setContentOf] = useState(null);

  const load = useCallback(() => {
    setError('');
    adminService.getLevels().then(setLevels).catch((e) => setError(getErrorMessage(e, 'تعذر تحميل المستويات.')));
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(load, [load]);

  const togglePublish = async (l) => {
    try {
      await adminService.updateLevel(l.id, { is_active: !l.is_active });
      toast('ok', l.is_active ? `تم إخفاء ${l.name} من الموقع.` : `تم نشر ${l.name} على الموقع.`);
      load();
    } catch (e) {
      toast('err', getErrorMessage(e));
    }
  };

  const remove = async (l) => {
    if (!(await confirm({
      title: `حذف المستوى ${l.name}؟`,
      text: `هيتمسح المستوى ومحتواه واشتراكات ${l.subscribers} طالب. لو عايز تخفيه بس استخدم «إخفاء».`,
      confirmText: 'حذف نهائي',
    }))) return;
    try {
      toast('ok', (await adminService.deleteLevel(l.id)).detail);
      load();
      onChanged();
    } catch (e) {
      toast('err', getErrorMessage(e));
    }
  };

  const totalSubs = (levels || []).reduce((a, x) => a + (x.subscribers || 0), 0);

  const refreshCache = async (l) => {
    try {
      toast('ok', (await adminService.refreshVideoCache(l.id)).detail);
    } catch (e) {
      toast('err', getErrorMessage(e));
    }
  };

  return (
    <div>
      <SectionHeader
        icon={Layers}
        title="الكورسات والمحاضرات"
        subtitle="المستويات وأسعارها ومحاضراتها وملفاتها — أي تعديل بيظهر في الموقع على طول"
        actions={<Btn variant="gold" icon={Plus} onClick={() => setEditing({})}>مستوى جديد</Btn>}
      />

      {error ? (
        <ErrorBox message={error} onRetry={load} />
      ) : !levels ? (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-72 !rounded-3xl" />)}</div>
      ) : levels.length === 0 ? (
        <Card><Empty icon={Layers} title="مفيش مستويات لسه" action={<Btn icon={Plus} onClick={() => setEditing({})}>أضف أول مستوى</Btn>} /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
          {levels.map((l) => (
            <Card key={l.id} className={`relative overflow-hidden flex flex-col ${!l.is_active ? 'opacity-80' : ''}`}>
              <div className="relative overflow-hidden p-5 pb-4 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                <span className="absolute -left-3 -bottom-6 text-8xl font-black text-slate-900/[0.04] select-none" dir="ltr">{l.name}</span>
                <div className="relative flex items-start gap-3">
                  <LevelChip code={l.name} size="lg" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-black text-slate-900 leading-snug" dir="auto">{l.title}</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xl font-black text-teal-700" dir="ltr">{money(l.price)}</span>
                      <span className="text-xs font-black text-slate-400">ج.م</span>
                      {l.old_price && Number(l.old_price) > Number(l.price) && (
                        <span className="text-xs font-bold text-slate-400 line-through" dir="ltr">{money(l.old_price)}</span>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={l.is_active ? 'published' : 'hidden'} />
                </div>
              </div>

              {legacy ? (
                <SubscribersStrip level={l} total={totalSubs} />
              ) : (
                <div className="grid grid-cols-4 divide-x divide-x-reverse divide-slate-100 border-b border-slate-100">
                  <Stat icon={Users} value={l.subscribers} label="مشترك" />
                  <Stat icon={PlayCircle} value={l.videos_count} label="محاضرة" />
                  <Stat icon={FileText} value={l.files_count} label="ملف" />
                  <Stat icon={Clock3} value={l.pending} label="طلب" highlight={l.pending > 0} />
                </div>
              )}

              {l.description && <p className="px-5 pt-4 text-xs text-slate-500 leading-relaxed line-clamp-2">{l.description}</p>}

              <div className="mt-auto p-4 flex flex-wrap gap-2">
                {!legacy && <Btn size="sm" icon={Film} onClick={() => setContentOf(l)}>المحاضرات والملفات</Btn>}
                <Link href={`/courses/${l.id}`} target="_blank" className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50">
                  <PlayCircle className="w-4 h-4" /> افتح المحاضرات
                </Link>
                <Btn size="sm" variant="ghost" icon={Pencil} onClick={() => setEditing(l)}>تعديل</Btn>
                <Btn size="sm" variant="ghost" icon={Eye} onClick={() => togglePublish(l)}>{l.is_active ? 'إخفاء' : 'نشر'}</Btn>
                <div className="mr-auto flex gap-1">
                  <Btn size="icon" variant="ghost" title="تحديث كاش الفيديوهات" onClick={() => refreshCache(l)}><RefreshCw className="w-4 h-4" /></Btn>
                  <Btn size="icon" variant="ghost" title="حذف" onClick={() => remove(l)}><Trash2 className="w-4 h-4 text-rose-500" /></Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && <LevelForm level={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
      {contentOf && <ContentDrawer level={contentOf} onClose={() => { setContentOf(null); load(); }} />}
    </div>
  );
}

/** Subscriber faces, share of all subscriptions and the latest one. */
function SubscribersStrip({ level, total }) {
  const share = total ? Math.round((level.subscribers / total) * 100) : 0;
  const recent = level.recent_subscribers || [];
  return (
    <div className="px-5 py-4 border-b border-slate-100 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 space-x-reverse">
            {recent.slice(0, 4).map((r, i) => (
              <span key={i} className="ring-2 ring-white rounded-xl"><Avatar name={r.name} size="sm" /></span>
            ))}
            {level.subscribers > 4 && (
              <span className="w-8 h-8 rounded-xl ring-2 ring-white bg-slate-100 text-slate-600 text-[10px] font-black flex items-center justify-center">+{level.subscribers - 4}</span>
            )}
            {recent.length === 0 && <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center"><Users className="w-4 h-4" /></span>}
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 leading-none">{level.subscribers}</p>
            <p className="text-[10px] font-bold text-slate-400">مشترك مفعّل</p>
          </div>
        </div>
        <div className="text-left">
          <p className="text-lg font-black text-teal-700 leading-none">{share}%</p>
          <p className="text-[10px] font-bold text-slate-400">من كل الاشتراكات</p>
        </div>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-l from-teal-400 to-[#0e2c4e] transition-all duration-700" style={{ width: `${Math.max(share, 2)}%` }} />
      </div>
      {recent[0] && (
        <p className="text-[11px] font-bold text-slate-500 truncate">
          آخر اشتراك: <span className="text-slate-800">{recent[0].name}</span>{recent[0].granted_at ? ` • ${timeAgo(recent[0].granted_at)}` : ''}
        </p>
      )}
    </div>
  );
}

function Stat({ icon: Icon, value, label, highlight }) {
  return (
    <div className={`py-3 text-center ${highlight ? 'bg-amber-50' : ''}`}>
      <Icon className={`w-4 h-4 mx-auto mb-1 ${highlight ? 'text-amber-600' : 'text-slate-400'}`} />
      <p className={`text-base font-black ${highlight ? 'text-amber-700' : 'text-slate-900'}`}>{value ?? 0}</p>
      <p className="text-[10px] font-bold text-slate-400">{label}</p>
    </div>
  );
}

function LevelForm({ level, onClose, onSaved }) {
  const toast = useToast();
  const isNew = !level.id;
  const [form, setForm] = useState({
    name: level.name || '', title: level.title || '', description: level.description || '',
    price: level.price ?? '', old_price: level.old_price ?? '', order: level.order ?? '',
    bunny_collection_id: level.bunny_collection_id || '', is_active: level.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fields = { ...form, old_price: form.old_price === '' ? null : form.old_price };
    if (fields.order === '') delete fields.order;
    try {
      if (isNew) await adminService.createLevel(fields);
      else await adminService.updateLevel(level.id, fields);
      toast('ok', isNew ? 'تم إضافة المستوى.' : 'تم حفظ التعديلات.');
      onSaved();
    } catch (err) {
      toast('err', getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={isNew ? 'مستوى جديد' : `تعديل ${level.name}`} icon={Layers} size="lg">
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-6 gap-4">
        <Field label="كود المستوى" hint="مثلاً A1 أو B2" className="sm:col-span-2">
          <Input required dir="ltr" value={form.name} onChange={set('name')} maxLength={10} className="uppercase" />
        </Field>
        <Field label="العنوان" className="sm:col-span-4"><Input required dir="auto" value={form.title} onChange={set('title')} /></Field>
        <Field label="الوصف" className="sm:col-span-6"><Textarea rows={3} value={form.description} onChange={set('description')} /></Field>
        <Field label="السعر (ج.م)" className="sm:col-span-2"><Input required type="number" min="0" step="0.01" dir="ltr" value={form.price} onChange={set('price')} /></Field>
        <Field label="السعر قبل الخصم" hint="اختياري" className="sm:col-span-2"><Input type="number" min="0" step="0.01" dir="ltr" value={form.old_price} onChange={set('old_price')} /></Field>
        <Field label="ترتيب العرض" className="sm:col-span-2"><Input type="number" min="1" dir="ltr" value={form.order} onChange={set('order')} /></Field>
        <Field label="Bunny Collection ID" hint="اختياري — معرّف مجموعة الفيديوهات على Bunny Stream" className="sm:col-span-6">
          <Input dir="ltr" value={form.bunny_collection_id} onChange={set('bunny_collection_id')} />
        </Field>
        <div className="sm:col-span-6"><Switch checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="منشور وظاهر في الموقع" /></div>
        <div className="sm:col-span-6 flex justify-end gap-2 pt-2">
          <Btn type="button" variant="ghost" onClick={onClose}>إلغاء</Btn>
          <Btn type="submit" icon={Save} loading={saving}>{isNew ? 'إضافة المستوى' : 'حفظ'}</Btn>
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Videos & files of one level                                         */
/* ------------------------------------------------------------------ */

function ContentDrawer({ level, onClose }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [tab, setTab] = useState('videos');
  const [content, setContent] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);

  const load = useCallback(() => {
    adminService.getLevelContent(level.id).then(setContent).catch((e) => toast('err', getErrorMessage(e)));
  }, [level.id, toast]);
  useEffect(load, [load]);

  const run = async (promise, okText) => {
    try {
      const res = await promise;
      toast('ok', okText || res?.detail || 'تم.');
      load();
    } catch (e) {
      toast('err', getErrorMessage(e));
    }
  };

  const move = (v, dir) => {
    const list = content.videos;
    const idx = list.findIndex((x) => x.id === v.id);
    const other = list[idx + dir];
    if (other) run(adminService.updateVideo(v.id, { order: other.order }), 'تم تغيير الترتيب.');
  };

  const videos = content?.videos || [];
  const files = content?.files || [];

  return (
    <Drawer open onClose={onClose} title={`محتوى ${level.name}`} subtitle={level.title}>
      <div className="flex items-center justify-between gap-3">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[{ value: 'videos', label: `المحاضرات (${videos.length})` }, { value: 'files', label: `الملفات (${files.length})` }]}
        />
        <Link href={`/courses/${level.id}`} target="_blank" className="text-xs font-black text-teal-700 hover:underline">افتح المستوى في الموقع</Link>
      </div>

      {!content ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : tab === 'videos' ? (
        <>
          <AddVideo levelId={level.id} onAdded={load} />
          {videos.length === 0 ? <Card><Empty icon={PlayCircle} title="مفيش محاضرات" text="ضيف أول محاضرة بمعرّف الفيديو من Bunny Stream." /></Card> : (
            <Card className="divide-y divide-slate-100 overflow-hidden">
              {videos.map((v, i) => (
                <div key={v.id} className={`flex items-center gap-3 px-4 py-3 ${!v.is_active ? 'bg-slate-50 opacity-70' : ''}`}>
                  <span className="w-8 h-8 rounded-xl bg-[#0e2c4e] text-white text-xs font-black flex items-center justify-center shrink-0">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-slate-800 truncate" dir="auto">{v.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 truncate" dir="ltr">{formatDuration(v.length)} • {v.bunny_video_id}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Btn size="icon" variant="ghost" disabled={i === 0} onClick={() => move(v, -1)} title="لفوق"><ArrowUp className="w-4 h-4" /></Btn>
                    <Btn size="icon" variant="ghost" disabled={i === videos.length - 1} onClick={() => move(v, 1)} title="لتحت"><ArrowDown className="w-4 h-4" /></Btn>
                    <Switch checked={v.is_active} onChange={(on) => run(adminService.updateVideo(v.id, { is_active: on }), on ? 'المحاضرة ظاهرة.' : 'المحاضرة اتخفت.')} />
                    <Btn size="icon" variant="ghost" onClick={() => setEditingVideo(v)} title="تعديل"><Pencil className="w-4 h-4" /></Btn>
                    <Btn
                      size="icon"
                      variant="ghost"
                      title="حذف"
                      onClick={async () => { if (await confirm({ title: 'حذف المحاضرة؟', text: v.title, confirmText: 'حذف' })) run(adminService.deleteVideo(v.id)); }}
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </Btn>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </>
      ) : (
        <>
          <AddFile levelId={level.id} onAdded={load} />
          {files.length === 0 ? <Card><Empty icon={FileText} title="مفيش ملفات" text="ارفع ملازم أو امتحانات PDF / Word للمستوى." /></Card> : (
            <Card className="divide-y divide-slate-100 overflow-hidden">
              {files.map((f) => (
                <div key={f.id} className={`flex items-center gap-3 px-4 py-3 ${!f.is_active ? 'bg-slate-50 opacity-70' : ''}`}>
                  <span className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0"><FileText className="w-4 h-4" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-slate-800 truncate" dir="auto">{f.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 truncate" dir="ltr">{f.file_name}</p>
                  </div>
                  <Switch checked={f.is_active} onChange={(on) => run(adminService.updateFile(f.id, { is_active: on }), on ? 'الملف ظاهر.' : 'الملف اتخفى.')} />
                  <Btn
                    size="icon"
                    variant="ghost"
                    title="حذف"
                    onClick={async () => { if (await confirm({ title: 'حذف الملف؟', text: f.name, confirmText: 'حذف' })) run(adminService.deleteFile(f.id)); }}
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </Btn>
                </div>
              ))}
            </Card>
          )}
        </>
      )}

      {editingVideo && (
        <EditVideo video={editingVideo} onClose={() => setEditingVideo(null)} onSaved={() => { setEditingVideo(null); load(); }} />
      )}
    </Drawer>
  );
}

/** "12:30" or "750" → seconds */
function parseDuration(text) {
  const t = String(text || '').trim();
  if (!t) return 0;
  const parts = t.split(':').map((p) => Number(p) || 0);
  return parts.reduce((acc, p) => acc * 60 + p, 0);
}

function AddVideo({ levelId, onAdded }) {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', bunny_video_id: '', length: '' });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.addVideo(levelId, { ...form, length: parseDuration(form.length) });
      toast('ok', 'تم إضافة المحاضرة.');
      setForm({ title: '', bunny_video_id: '', length: '' });
      onAdded();
    } catch (err) {
      toast('err', getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
        <Field label="عنوان المحاضرة" className="sm:col-span-6"><Input required dir="auto" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="معرّف الفيديو (Bunny)" className="sm:col-span-4"><Input required dir="ltr" value={form.bunny_video_id} onChange={(e) => setForm({ ...form, bunny_video_id: e.target.value })} placeholder="xxxxxxxx-xxxx-..." /></Field>
        <Field label="المدة" className="sm:col-span-2"><Input dir="ltr" value={form.length} onChange={(e) => setForm({ ...form, length: e.target.value })} placeholder="45:30" /></Field>
        <Btn type="submit" icon={Plus} loading={saving} className="sm:col-span-6">إضافة محاضرة</Btn>
      </form>
    </Card>
  );
}

function EditVideo({ video, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState({ title: video.title, bunny_video_id: video.bunny_video_id, length: formatDuration(video.length) });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.updateVideo(video.id, { ...form, length: parseDuration(form.length) });
      toast('ok', 'تم حفظ المحاضرة.');
      onSaved();
    } catch (err) {
      toast('err', getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="تعديل المحاضرة" icon={PlayCircle}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="العنوان"><Input required dir="auto" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="معرّف الفيديو (Bunny)"><Input required dir="ltr" value={form.bunny_video_id} onChange={(e) => setForm({ ...form, bunny_video_id: e.target.value })} /></Field>
        <Field label="المدة"><Input dir="ltr" value={form.length} onChange={(e) => setForm({ ...form, length: e.target.value })} /></Field>
        <div className="flex justify-end gap-2">
          <Btn type="button" variant="ghost" onClick={onClose}>إلغاء</Btn>
          <Btn type="submit" icon={Save} loading={saving}>حفظ</Btn>
        </div>
      </form>
    </Modal>
  );
}

function AddFile({ levelId, onAdded }) {
  const toast = useToast();
  const fileRef = useRef(null);
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return toast('err', 'اختار الملف الأول.');
    setSaving(true);
    try {
      await adminService.addFile(levelId, { name: name || file.name.replace(/\.[^.]+$/, ''), file });
      toast('ok', 'تم رفع الملف.');
      setName('');
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      onAdded();
    } catch (err) {
      toast('err', getErrorMessage(err));
    } finally {
      setSaving(false);
    }
    return undefined;
  };

  return (
    <Card className="p-4">
      <form onSubmit={submit} className="space-y-3">
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={`w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-5 text-sm font-black transition-colors ${
            file ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-300 text-slate-500 hover:border-teal-400 hover:text-teal-700'
          }`}
        >
          <Upload className="w-5 h-5" /> <span className="truncate max-w-[16rem]" dir="auto">{file ? file.name : 'اختار ملف PDF أو Word'}</span>
        </button>
        <div className="flex gap-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم الملف اللي هيظهر للطلاب (اختياري)" dir="auto" />
          <Btn type="submit" icon={Upload} loading={saving}>رفع</Btn>
        </div>
      </form>
    </Card>
  );
}
