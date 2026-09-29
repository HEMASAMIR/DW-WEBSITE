'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { getErrorMessage } from '@/services/api';
import {
  Card, Btn, Input, Select, Field, Modal, LevelChip, SectionHeader, Skeleton, Empty, ErrorBox, Avatar,
  timeAgo, fullDate, useToast, useConfirm,
} from './ui';
import { GraduationCap, BookMarked, Search, UserPlus, UserMinus, Check, Loader2, StickyNote } from 'lucide-react';
import { translate as t } from './prefs';

/**
 * Live backend (no requests API): who each level / book is unlocked for, one tab per level,
 * with "activate for a student" and "revoke". kind: 'level' | 'book'
 */
export default function SubscriptionsSection({ kind, onChanged }) {
  const toast = useToast();
  const confirm = useConfirm();
  const isLevel = kind === 'level';
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [level, setLevel] = useState('');
  const [search, setSearch] = useState('');
  const [granting, setGranting] = useState(false);
  const [busy, setBusy] = useState(null);

  const load = useCallback((force = false) => {
    setError('');
    adminService.getAccessList(kind, force).then(setData).catch((e) => setError(getErrorMessage(e, t('تعذر تحميل الاشتراكات.'))));
  }, [kind]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => load(true), [load]);

  const codes = useMemo(() => [...new Set((data?.items || []).map((i) => i.level_code))], [data]);
  const countBy = useMemo(() => {
    const m = {};
    (data?.rows || []).forEach((r) => { m[r.level_code] = (m[r.level_code] || 0) + 1; });
    return m;
  }, [data]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data?.rows || []).filter((r) =>
      (!level || r.level_code === level) &&
      (!q || [r.name, r.email_masked, r.item_name].some((v) => String(v || '').toLowerCase().includes(q))));
  }, [data, level, search]);

  const revoke = async (r) => {
    if (!(await confirm({
      title: t('إلغاء تفعيل «{name}»؟', { name: r.item_name }),
      text: isLevel ? t('{name} مش هيقدر يشوف محاضرات المستوى تاني.', { name: r.name }) : t('{name} مش هيقدر يفتح الكتاب تاني.', { name: r.name }),
      confirmText: t('إلغاء التفعيل'),
    }))) return;
    setBusy(`${r.item_id}-${r.user_id}`);
    try {
      toast('ok', (await adminService.setUserAccess(r.user_id, kind, r.item_id, false)).detail);
      load(true);
      onChanged();
    } catch (e) {
      toast('err', getErrorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <SectionHeader
        icon={isLevel ? GraduationCap : BookMarked}
        title={isLevel ? t('اشتراكات الكورسات') : t('اشتراكات الكتب')}
        subtitle={isLevel ? t('كل الطلاب المفعّل لهم كل مستوى — فعّل أو الغِ في ثانية') : t('كل الطلاب المفعّل لهم كل كتاب — فعّل أو الغِ في ثانية')}
        actions={<Btn variant="gold" icon={UserPlus} onClick={() => setGranting(true)}>{t('تفعيل لطالب')}</Btn>}
      />

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        <Tab active={level === ''} onClick={() => setLevel('')} label={t('كل المستويات')} count={data?.rows.length || 0} />
        {codes.map((c) => (
          <Tab key={c} active={level === c} onClick={() => setLevel(c)} code={c} count={countBy[c] || 0} />
        ))}
      </div>

      <Card className="p-3 sm:p-4 mb-5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute start-4 top-1/2 -translate-y-1/2" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('دوّر باسم الطالب')} className="ps-10" />
        </div>
      </Card>

      {error ? (
        <ErrorBox message={error} onRetry={() => load(true)} />
      ) : !data ? (
        <Card className="p-4 space-y-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}</Card>
      ) : rows.length === 0 ? (
        <Card>
          <Empty
            icon={isLevel ? GraduationCap : BookMarked}
            title={t('مفيش طلاب مفعّل لهم هنا')}
            text={t('لما طالب يدفع، دوس «تفعيل لطالب» واختاره وهيتفتحله فوراً.')}
            action={<Btn icon={UserPlus} onClick={() => setGranting(true)}>{t('تفعيل لطالب')}</Btn>}
          />
        </Card>
      ) : (
        <Card className="divide-y divide-slate-100 overflow-hidden">
          {rows.map((r) => (
            <div key={`${r.item_id}-${r.user_id}`} className="flex flex-wrap sm:flex-nowrap items-center gap-3 px-4 sm:px-5 py-3.5 hover:bg-slate-50/70">
              <Avatar name={r.name} />
              <div className="min-w-0 flex-1">
                <p className="font-black text-slate-900 truncate">{r.name}</p>
                <p className="text-[11px] text-slate-400 font-bold" dir="ltr">{r.email_masked}</p>
              </div>
              <div className="flex items-center gap-2 min-w-0 sm:w-[38%]">
                <LevelChip code={r.level_code} size="sm" />
                <span className="text-xs font-bold text-slate-600 truncate" dir="auto">{r.item_name}</span>
              </div>
              <div className="hidden md:block w-40 text-end">
                <p className="text-xs font-bold text-slate-500" title={fullDate(r.granted_at)}>{r.granted_at ? t('اتفعّل {when}', { when: timeAgo(r.granted_at) }) : '—'}</p>
                {r.notes && <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 justify-end" title={r.notes}><StickyNote className="w-3 h-3" /> {r.notes}</p>}
              </div>
              <Btn variant="dangerSoft" size="sm" icon={UserMinus} loading={busy === `${r.item_id}-${r.user_id}`} onClick={() => revoke(r)}>
                {t('إلغاء')}
              </Btn>
            </div>
          ))}
        </Card>
      )}

      {granting && data && (
        <GrantModal
          kind={kind}
          items={data.items}
          defaultCode={level}
          onClose={() => setGranting(false)}
          onDone={() => { setGranting(false); load(true); onChanged(); }}
        />
      )}
    </div>
  );
}

function Tab({ active, onClick, code, label, count }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`group relative shrink-0 inline-flex items-center gap-2.5 h-12 px-4 rounded-2xl border transition-all duration-200 active:scale-95 ${
        active
          ? 'bg-gradient-to-r from-[#0a2340] to-teal-900 border-[#0a2340] text-white shadow-lg shadow-[#0a2340]/25 ring-2 ring-teal-400/40'
          : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50/30'
      }`}
    >
      {code ? (
        <LevelChip code={code} size="sm" />
      ) : (
        <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${active ? 'bg-white/15 text-amber-300' : 'bg-slate-100 text-slate-500'}`}>☰</span>
      )}
      <span className="text-xs sm:text-sm font-black">{label || (code === 'General' ? t('عام') : t('مستوى {code}', { code }))}</span>
      <span className={`min-w-5 h-5 px-1.5 rounded-full text-[10px] font-black flex items-center justify-center ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{count}</span>
    </button>
  );
}

/** Pick an item + find a student, then unlock it for them. */
function GrantModal({ kind, items, defaultCode, onClose, onDone }) {
  const toast = useToast();
  const first = items.find((i) => i.level_code === defaultCode) || items[0];
  const [itemId, setItemId] = useState(first?.id ?? '');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return undefined;
    let cancelled = false;
    const id = setTimeout(() => {
      setSearching(true);
      adminService.getUsers({ search: q })
        .then((d) => !cancelled && setResults(d.results))
        .catch(() => !cancelled && setResults([]))
        .finally(() => !cancelled && setSearching(false));
    }, 350);
    return () => { cancelled = true; clearTimeout(id); };
  }, [query]);

  // Results only count while the query is long enough to search.
  const shown = query.trim().length >= 2 ? results : null;
  const item = items.find((i) => String(i.id) === String(itemId));
  const hasIt = (u) => (kind === 'level' ? u.levels.includes(item?.level_code) : false);

  const grant = async (u) => {
    setBusy(u.id);
    try {
      await adminService.setUserAccess(u.id, kind, Number(itemId), true);
      toast('ok', t('تم تفعيل «{item}» لـ {name}.', { item: item?.name, name: u.name }));
      onDone();
    } catch (e) {
      toast('err', getErrorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  return (
    <Modal open onClose={onClose} title={kind === 'level' ? t('تفعيل مستوى لطالب') : t('تفعيل كتاب لطالب')} icon={UserPlus}>
      <div className="space-y-4">
        <Field label={kind === 'level' ? t('المستوى') : t('الكتاب')}>
          <Select value={itemId} onChange={(e) => setItemId(e.target.value)}>
            {items.map((i) => <option key={i.id} value={i.id}>{i.level_code} — {i.name}</option>)}
          </Select>
        </Field>
        <Field label={t('الطالب')} hint={t('اكتب حرفين على الأقل من الاسم أو الإيميل')}>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute start-4 top-1/2 -translate-y-1/2" />
            <Input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('مثلاً: أحمد أو ahmed@')} className="ps-10" />
            {searching && <Loader2 className="w-4 h-4 text-teal-600 animate-spin absolute end-4 top-1/2 -translate-y-1/2" />}
          </div>
        </Field>

        {shown && (
          shown.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">{t('مفيش حساب بالبحث ده.')}</p>
          ) : (
            <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {shown.map((u) => (
                <div key={u.id} className="flex items-center gap-3 px-4 py-3">
                  <Avatar name={u.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-slate-800 truncate">{u.name}</p>
                    <p className="text-[11px] text-slate-400 font-bold" dir="ltr">{u.email_masked}</p>
                  </div>
                  {hasIt(u) ? (
                    <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700"><Check className="w-4 h-4" />{' '}{t('مفعّل')}</span>
                  ) : (
                    <Btn size="sm" variant="success" icon={Check} loading={busy === u.id} disabled={!itemId} onClick={() => grant(u)}>{t('تفعيل')}</Btn>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </Modal>
  );
}
