'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { getErrorMessage } from '@/services/api';
import { useModal } from '@/context/ModalContext';
import {
  Card, Btn, Input, LevelChip, StatusBadge, Segmented, SectionHeader, Skeleton, Empty, ErrorBox, PhoneActions,
  money, timeAgo, fullDate, useToast, useConfirm,
} from './ui';
import { GraduationCap, BookMarked, Search, Check, X, Receipt, Trash2, Wallet, StickyNote, UserRound, RotateCcw } from 'lucide-react';

const BOOK_LEVELS = ['A1', 'A2', 'B1', 'B2', 'General'];

/** Course (kind="level") or book (kind="book") requests, split into one tab per level. */
export default function RequestsSection({ kind, onChanged }) {
  const toast = useToast();
  const confirm = useConfirm();
  const { openFileViewer } = useModal();
  const isLevel = kind === 'level';

  const [levelCodes, setLevelCodes] = useState([]);
  const [level, setLevel] = useState('');
  const [status, setStatus] = useState('pending');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null);

  // Tabs: the real level codes (courses) / the book levels in use.
  useEffect(() => {
    const load = isLevel
      ? adminService.getLevels().then((ls) => ls.map((l) => l.name))
      : adminService.getBooks().then((bs) => BOOK_LEVELS.filter((c) => bs.some((b) => b.level === c)));
    load.then(setLevelCodes).catch(() => setLevelCodes(isLevel ? [] : BOOK_LEVELS));
  }, [isLevel]);

  useEffect(() => {
    const id = setTimeout(() => setQuery(search.trim()), 350);
    return () => clearTimeout(id);
  }, [search]);

  const load = useCallback(() => {
    setError('');
    adminService
      .getRequests({ kind, status: status === 'all' ? undefined : status, level: level || undefined, search: query || undefined })
      .then(setData)
      .catch((e) => setError(getErrorMessage(e, 'تعذر تحميل الطلبات.')));
  }, [kind, status, level, query]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(load, [load]);

  const counts = data?.counts || { by_status: {}, pending_by_level: {} };
  const totalPending = counts.by_status.pending || 0;
  // Levels that have pending requests but no longer exist in the list still get a tab.
  const tabs = useMemo(
    () => [...new Set([...levelCodes, ...Object.keys(counts.pending_by_level)])],
    [levelCodes, counts.pending_by_level]
  );

  const approve = async (r) => {
    setBusy(r.id);
    try {
      toast('ok', (await adminService.approveRequest(r.id)).detail);
      load();
      onChanged();
    } catch (e) {
      toast('err', getErrorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  const reject = async (r) => {
    const res = await confirm({
      title: `رفض طلب ${r.full_name}؟`,
      text: 'اكتب سبب الرفض (هيظهر للطالب) — اختياري.',
      input: true,
      inputPlaceholder: 'مثلاً: التحويل ماوصلش',
      confirmText: 'رفض الطلب',
    });
    if (!res) return;
    setBusy(r.id);
    try {
      toast('ok', (await adminService.rejectRequest(r.id, res.value)).detail);
      load();
      onChanged();
    } catch (e) {
      toast('err', getErrorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  const remove = async (r) => {
    if (!(await confirm({ title: 'حذف الطلب نهائياً؟', text: 'الطلب هيتشال من السجل. الصلاحية المفعّلة (لو اتقبل) مش هتتلغي.', confirmText: 'حذف' }))) return;
    try {
      toast('ok', (await adminService.deleteRequest(r.id)).detail);
      load();
      onChanged();
    } catch (e) {
      toast('err', getErrorMessage(e));
    }
  };

  const showReceipt = (r) =>
    openFileViewer({ title: `إيصال تحويل — ${r.full_name}`, load: (onProgress) => adminService.viewReceipt(r.id, onProgress) });

  return (
    <div>
      <SectionHeader
        icon={isLevel ? GraduationCap : BookMarked}
        title={isLevel ? 'طلبات الكورسات' : 'طلبات الكتب'}
        subtitle={isLevel
          ? 'طلبات الاشتراك في المستويات — القبول بيفعّل المستوى على حساب الطالب فوراً'
          : 'طلبات شراء الكتب — القبول بيفتح الكتاب للطالب فوراً'}
      />

      {/* Level tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        <LevelTab active={level === ''} onClick={() => setLevel('')} label="كل المستويات" count={totalPending} />
        {tabs.map((code) => (
          <LevelTab key={code} active={level === code} onClick={() => setLevel(code)} code={code} count={counts.pending_by_level[code] || 0} />
        ))}
      </div>

      <Card className="p-3 sm:p-4 mb-5 flex flex-wrap items-center gap-3">
        <Segmented
          value={status}
          onChange={setStatus}
          options={[
            { value: 'pending', label: 'مستني الموافقة', count: counts.by_status.pending },
            { value: 'approved', label: 'مقبول' },
            { value: 'rejected', label: 'مرفوض' },
            { value: 'all', label: 'الكل' },
          ]}
        />
        <div className="relative flex-1 min-w-[12rem]">
          <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="دوّر بالاسم أو رقم الموبايل" className="pr-10" />
        </div>
      </Card>

      {error ? (
        <ErrorBox message={error} onRetry={load} />
      ) : !data ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-56 !rounded-3xl" />)}</div>
      ) : data.results.length === 0 ? (
        <Card>
          <Empty
            icon={isLevel ? GraduationCap : BookMarked}
            title={status === 'pending' ? 'مفيش طلبات مستنية 🎉' : 'مفيش طلبات هنا'}
            text={status === 'pending' ? 'كل الطلبات اتراجعت. أي طلب جديد هيظهر هنا على طول.' : 'جرّب تغيّر الفلتر أو المستوى.'}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {data.results.map((r) => (
            <RequestCard key={r.id} r={r} busy={busy === r.id} onApprove={approve} onReject={reject} onDelete={remove} onReceipt={showReceipt} />
          ))}
        </div>
      )}
    </div>
  );
}

function LevelTab({ active, onClick, code, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-2.5 h-14 pl-4 pr-2 rounded-2xl border-2 transition-all ${
        active ? 'bg-[#0e2c4e] border-[#0e2c4e] text-white shadow-lg shadow-[#0e2c4e]/20' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
      }`}
    >
      {code ? <LevelChip code={code} /> : <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-white/15' : 'bg-slate-100'}`}>☰</span>}
      <span className="text-sm font-black">{label || (code === 'General' ? 'عام' : `مستوى ${code}`)}</span>
      {count > 0 && (
        <span className="min-w-6 h-6 px-1.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black flex items-center justify-center">{count}</span>
      )}
    </button>
  );
}

function RequestCard({ r, busy, onApprove, onReject, onDelete, onReceipt }) {
  const pending = r.status === 'pending';
  return (
    <Card className={`relative overflow-hidden p-5 flex flex-col gap-4 ${pending ? 'ring-2 ring-amber-200/70' : ''}`}>
      {pending && <span className="absolute top-0 inset-x-0 h-1 bg-gradient-to-l from-amber-300 via-amber-500 to-amber-300" />}

      <div className="flex items-start gap-3">
        <LevelChip code={r.level_code} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-black text-slate-900 truncate">{r.full_name}</h3>
            <StatusBadge status={r.status} />
          </div>
          <p className="text-sm text-slate-600 font-bold truncate mt-0.5" dir="auto">{r.item_name}</p>
          <p className="text-[11px] text-slate-400 font-bold mt-0.5" title={fullDate(r.created_at)}>طلب #{r.id} • {timeAgo(r.created_at)}</p>
        </div>
        <div className="text-left shrink-0">
          <p className="text-xl font-black text-slate-900" dir="ltr">{money(r.amount)}</p>
          <p className="text-[10px] font-black text-slate-400">جنيه</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Info icon={UserRound} label="الموبايل">
          <span className="flex items-center justify-between gap-2">
            <span dir="ltr" className="font-black">{r.phone}</span>
            <PhoneActions phone={r.phone} />
          </span>
        </Info>
        <Info icon={Wallet} label="طريقة الدفع">{r.payment_method || '—'}</Info>
      </div>

      {r.note && (
        <p className="flex items-start gap-2 rounded-2xl bg-slate-50 border border-slate-100 px-3.5 py-2.5 text-xs text-slate-600 leading-relaxed">
          <StickyNote className="w-4 h-4 text-slate-400 shrink-0" /> {r.note}
        </p>
      )}
      {!pending && (
        <p className="text-[11px] text-slate-500 font-bold">
          {r.status === 'approved' ? 'اتقبل' : 'اترفض'} {r.reviewed_by ? `بواسطة ${r.reviewed_by}` : ''} • {fullDate(r.reviewed_at)}
          {r.admin_note && <span className="block mt-1 text-rose-600">السبب: {r.admin_note}</span>}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        {r.has_receipt ? (
          <Btn variant="soft" size="sm" icon={Receipt} onClick={() => onReceipt(r)}>صورة التحويل</Btn>
        ) : (
          <span className="text-[11px] font-bold text-slate-400">من غير صورة تحويل</span>
        )}
        <div className="mr-auto flex gap-2">
          {pending ? (
            <>
              <Btn variant="dangerSoft" size="sm" icon={X} disabled={busy} onClick={() => onReject(r)}>رفض</Btn>
              <Btn variant="success" size="sm" icon={Check} loading={busy} onClick={() => onApprove(r)}>قبول وتفعيل فوري</Btn>
            </>
          ) : (
            <>
              {r.status === 'rejected' && <Btn variant="ghost" size="sm" icon={RotateCcw} loading={busy} onClick={() => onApprove(r)}>قبول بردو</Btn>}
              <Btn variant="ghost" size="icon" title="حذف الطلب" onClick={() => onDelete(r)}><Trash2 className="w-4 h-4 text-rose-500" /></Btn>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

function Info({ icon: Icon, label, children }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 px-3.5 py-2.5">
      <p className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 mb-0.5"><Icon className="w-3 h-3" /> {label}</p>
      <div className="text-sm text-slate-800 font-bold">{children}</div>
    </div>
  );
}
