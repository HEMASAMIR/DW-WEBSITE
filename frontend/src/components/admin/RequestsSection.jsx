'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { getErrorMessage } from '@/services/api';
import { useModal } from '@/context/ModalContext';
import {
  Card, Btn, Input, LevelChip, StatusBadge, Skeleton, ErrorBox, PhoneActions, Avatar,
  money, timeAgo, fullDate, useToast, useConfirm,
} from './ui';
import {
  GraduationCap, BookMarked, Search, Check, X, Receipt, Trash2, Wallet, StickyNote,
  UserRound, RotateCcw, Clock, Sparkles, ShieldCheck, CheckCircle2, ChevronLeft, Zap,
  Layers, Inbox, Phone, MessageCircle, Eye, AlertTriangle, ArrowUpDown
} from 'lucide-react';
import { translate as t } from './prefs';

const BOOK_LEVELS = ['A1', 'A2', 'B1', 'B2', 'General'];

/**
 * Ultra-Premium Animated Requests Section
 * Features:
 * - Dynamic Level Tabs with glowing aura & bounce counters
 * - Sticky Floating Control Bar that follows as you scroll
 * - Staggered card reveal animations with German-themed accents
 * - Instant access grant upon approval
 */
export default function RequestsSection({ kind, onChanged, onSwitchToSubscribers }) {
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

  // Tabs: real level codes (courses) or active book levels
  useEffect(() => {
    const load = isLevel
      ? adminService.getLevels().then((ls) => ls.map((l) => l.name))
      : adminService.getBooks().then((bs) => BOOK_LEVELS.filter((c) => bs.some((b) => b.level === c)));
    load.then(setLevelCodes).catch(() => setLevelCodes(isLevel ? [] : BOOK_LEVELS));
  }, [isLevel]);

  useEffect(() => {
    const id = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const load = useCallback(() => {
    setError('');
    adminService
      .getRequests({ kind, status: status === 'all' ? undefined : status, level: level || undefined, search: query || undefined })
      .then(setData)
      .catch((e) => setError(getErrorMessage(e, t('تعذر تحميل الطلبات.'))));
  }, [kind, status, level, query]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(load, [load]);

  const counts = data?.counts || { by_status: {}, pending_by_level: {} };
  const totalPending = counts.by_status.pending || 0;
  const totalApproved = counts.by_status.approved || 0;

  const tabs = useMemo(
    () => [...new Set([...levelCodes, ...Object.keys(counts.pending_by_level || {})])],
    [levelCodes, counts.pending_by_level]
  );

  const approve = async (r) => {
    setBusy(r.id);
    try {
      const res = await adminService.approveRequest(r.id, '', r);
      toast('ok', res.detail || t('تم تفعيل الصلاحية للطالب فوراً بنجاح ✨'));
      load();
      onChanged?.();
    } catch (e) {
      toast('err', getErrorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  const reject = async (r) => {
    const res = await confirm({
      title: t('رفض طلب {name}؟', { name: r.full_name }),
      text: t('اكتب سبب الرفض ليظهر للطالب (اختياري).'),
      input: true,
      inputPlaceholder: t('مثلاً: تحويل غير مكتمل، أو رقم الهاتف غير مطابق'),
      confirmText: t('رفض الطلب'),
      danger: true,
    });
    if (!res) return;
    setBusy(r.id);
    try {
      const resReject = await adminService.rejectRequest(r.id, res.value);
      toast('ok', resReject.detail || t('تم رفض الطلب'));
      load();
      onChanged?.();
    } catch (e) {
      toast('err', getErrorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  const remove = async (r) => {
    if (
      !(await confirm({
        title: t('حذف الطلب نهائياً؟'),
        text: t('سيتم مسح هذا الطلب من السجل. الصلاحية المفعّلة للطالب (إن وُجدت) لن تتأثر.'),
        confirmText: t('تأكيد الحذف'),
        danger: true,
      }))
    )
      return;
    try {
      const resDel = await adminService.deleteRequest(r.id);
      toast('ok', resDel.detail || t('تم حذف الطلب.'));
      load();
      onChanged?.();
    } catch (e) {
      toast('err', getErrorMessage(e));
    }
  };

  const showReceipt = (r) =>
    openFileViewer({
      title: t('إيصال التحويل البنكي — {name}', { name: r.full_name }),
      load: (onProgress) => adminService.viewReceipt(r.id, onProgress),
    });

  return (
    <div className="space-y-6">
      {/* 1. Hero Showcase Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#07192e] via-[#0c2847] to-[#0e3b68] text-white p-6 sm:p-8 shadow-2xl shadow-[#07192e]/25 border border-white/10">
        {/* Glow ambient background lights */}
        <div className="absolute top-0 start-0 -ms-20 -mt-20 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 end-0 -me-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* German flag mini accent strip */}
        <div className="absolute top-0 inset-x-0 flex h-1.5" dir="ltr">
          <span className="flex-1 bg-slate-950" />
          <span className="flex-1 bg-red-600" />
          <span className="flex-1 bg-amber-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/30 shrink-0 transform hover:scale-105 transition-transform duration-300">
              {isLevel ? <GraduationCap className="w-9 h-9 sm:w-11 sm:h-11" /> : <BookMarked className="w-9 h-9 sm:w-11 sm:h-11" />}
            </span>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-black text-amber-300 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                {t('تفعيل فوري وتلقائي عند الموافقة')}
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                {isLevel ? t('طلبات اشتراكات الكورسات') : t('طلبات شراء الكتب')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 max-w-xl leading-relaxed">
                {isLevel
                  ? t('أي طالب يطلب اشتراك، موافقتك بتفتح له المحتوى والمحاضرات على حسابه بالسيرفر فوراً.')
                  : t('موافقتك بتتيح الكتاب وقراءته وملفاته على حساب الطالب فوراً.')}
              </p>
            </div>
          </div>

          {/* Quick Counter Pills */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 text-center min-w-[95px] shadow-inner">
              <span className="block text-2xl font-black text-amber-300" dir="ltr">
                {totalPending}
              </span>
              <span className="text-[11px] font-bold text-slate-300">{t('بانتظار المراجعة')}</span>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 text-center min-w-[95px] shadow-inner">
              <span className="block text-2xl font-black text-emerald-400" dir="ltr">
                {totalApproved}
              </span>
              <span className="text-[11px] font-bold text-slate-300">{t('مقبول ومفعّل')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Level Pills (Horizontal Glass Strip) */}
      <div className="relative">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 px-1 scrollbar-none">
          <LevelPill
            active={level === ''}
            onClick={() => setLevel('')}
            label={t('جميع المستويات')}
            count={totalPending}
            icon={Layers}
          />
          {tabs.map((code) => {
            const pendingInLevel = counts.pending_by_level?.[code] || 0;
            return (
              <LevelPill
                key={code}
                active={level === code}
                onClick={() => setLevel(code)}
                code={code}
                label={code === 'General' ? t('عام') : t('مستوى {code}', { code })}
                count={pendingInLevel}
              />
            );
          })}
        </div>
      </div>

      {/* 3. STICKY FLOATING TOOLBAR: "كل اما انزل اشوفها ققدامني" */}
      <div className="sticky top-[4.25rem] z-30 transition-all duration-300">
        <div className="rounded-2xl p-2.5 sm:p-3.5 bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-xl shadow-slate-900/[0.06] flex flex-wrap items-center justify-between gap-3">
          {/* Segmented Filter Pills */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 gap-1 overflow-x-auto max-w-full">
            <FilterTab
              active={status === 'pending'}
              onClick={() => setStatus('pending')}
              label={t('بانتظار الموافقة')}
              count={counts.by_status?.pending || 0}
              tone="amber"
            />
            <FilterTab
              active={status === 'approved'}
              onClick={() => setStatus('approved')}
              label={t('تم القبول والتفعيل')}
              count={counts.by_status?.approved || 0}
              tone="emerald"
            />
            <FilterTab
              active={status === 'rejected'}
              onClick={() => setStatus('rejected')}
              label={t('المرفوضة')}
              count={counts.by_status?.rejected || 0}
              tone="rose"
            />
            <FilterTab
              active={status === 'all'}
              onClick={() => setStatus('all')}
              label={t('الكل')}
              tone="slate"
            />
          </div>

          {/* Quick Search Input */}
          <div className="relative flex-1 min-w-[15rem] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('ابحث باسم الطالب أو رقم الهاتف...')}
              className="w-full h-10 ps-10 pe-8 rounded-xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-[10px] hover:bg-slate-400"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Requests List or Empty State */}
      {error ? (
        <ErrorBox message={error} onRetry={load} />
      ) : !data ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 !rounded-3xl shadow-sm" />
          ))}
        </div>
      ) : data.results.length === 0 ? (
        <Card className="p-10 sm:p-16 text-center border-2 border-dashed border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50">
          <div className="max-w-md mx-auto space-y-4">
            <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-50 to-emerald-100/60 border border-teal-200 text-teal-600 flex items-center justify-center dw-float-slow shadow-xl shadow-teal-500/10">
              {status === 'pending' ? (
                <ShieldCheck className="w-12 h-12 text-teal-600" />
              ) : isLevel ? (
                <GraduationCap className="w-12 h-12 text-teal-600" />
              ) : (
                <BookMarked className="w-12 h-12 text-teal-600" />
              )}
              <span className="absolute -top-1 -start-1 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black shadow-md">
                ✓
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900">
              {status === 'pending' ? t('لا توجد طلبات معلقة حالياً 🎉') : t('لم يتم العثور على طلبات')}
            </h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              {status === 'pending'
                ? t('تمت مراجعة كل طلبات الطلاب بالكامل. بمجرد أن يرسل أي طالب طلباً جديداً، سيظهر هنا فوراً مع إمكانية التفعيل بضغطة واحدة.')
                : t('جرّب تغيير كلمات البحث أو الانتقال لمستوى آخر أو عرض الطلبات المعتمدة.')}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {level && (
                <Btn variant="soft" size="sm" onClick={() => setLevel('')}>
                  {t('عرض كل المستويات')}
                </Btn>
              )}
              {status !== 'all' && (
                <Btn variant="ghost" size="sm" onClick={() => setStatus('all')}>
                  {t('عرض سجل كل الطلبات')}
                </Btn>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {data.results.map((r, idx) => (
            <div
              key={r.id}
              className="dw-card-enter"
              style={{ animationDelay: `${Math.min(idx * 60, 400)}ms` }}
            >
              <ModernRequestCard
                r={r}
                busy={busy === r.id}
                onApprove={approve}
                onReject={reject}
                onDelete={remove}
                onReceipt={showReceipt}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components: Level Pill, Filter Tab, Modern Card                */
/* ------------------------------------------------------------------ */

function LevelPill({ active, onClick, code, label, count = 0, icon: Icon }) {
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
      ) : Icon ? (
        <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${active ? 'bg-white/15 text-amber-300' : 'bg-slate-100 text-slate-500'}`}>
          <Icon className="w-3.5 h-3.5" />
        </span>
      ) : null}
      <span className="text-xs sm:text-sm font-black">{label}</span>
      {count > 0 && (
        <span className="min-w-5 h-5 px-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
          {count}
        </span>
      )}
    </button>
  );
}

function FilterTab({ active, onClick, label, count, tone = 'slate' }) {
  const toneClasses = {
    amber: active ? 'bg-amber-500 text-slate-950 shadow-sm' : 'hover:text-amber-800',
    emerald: active ? 'bg-emerald-600 text-white shadow-sm' : 'hover:text-emerald-800',
    rose: active ? 'bg-rose-600 text-white shadow-sm' : 'hover:text-rose-800',
    slate: active ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-black transition-all ${
        active ? toneClasses[tone] : 'text-slate-600 hover:bg-white/60'
      }`}
    >
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={`min-w-4 h-4 px-1 rounded-full text-[10px] font-black flex items-center justify-center ${
            active ? 'bg-black/20 text-current' : 'bg-slate-200 text-slate-700'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function ModernRequestCard({ r, busy, onApprove, onReject, onDelete, onReceipt }) {
  const pending = r.status === 'pending';

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border transition-all duration-300 p-5 sm:p-6 flex flex-col gap-4 ${
        pending
          ? 'bg-gradient-to-br from-white via-white to-amber-50/30 border-amber-300/80 shadow-xl shadow-amber-900/[0.04] ring-1 ring-amber-200/50 hover:shadow-2xl hover:border-amber-400'
          : 'bg-white border-slate-200/90 shadow-md hover:shadow-xl hover:border-slate-300'
      }`}
    >
      {/* Top subtle highlight stripe */}
      {pending && (
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400" />
      )}

      {/* Header Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={r.full_name} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-black text-slate-900 truncate">{r.full_name}</h4>
              <StatusBadge status={r.status} />
            </div>
            <p className="text-xs text-slate-500 font-bold mt-0.5" title={fullDate(r.created_at)}>
              {t('طلب #{id}', { id: r.id })} • {timeAgo(r.created_at)}
            </p>
          </div>
        </div>

        {/* Amount Badge */}
        <div className="text-end shrink-0 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-1.5 shadow-sm">
          <p className="text-lg font-black text-[#0e2c4e]" dir="ltr">
            {money(r.amount)} <span className="text-[10px] font-black text-slate-500">{t('ج.م')}</span>
          </p>
          {r.coupon_code ? (
            <p className="text-[10px] font-black text-emerald-700 text-center" title={t('بدل {n} ج.م', { n: money(r.original_amount) })}>
              🎟️ <span dir="ltr">{r.coupon_code}</span> • -{money(r.discount)}
            </p>
          ) : (
            <p className="text-[10px] font-bold text-slate-400 text-center">{t('المبلغ')}</p>
          )}
        </div>
      </div>

      {/* Target Item Pill */}
      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50/90 border border-slate-100">
        <LevelChip code={r.level_code} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black text-slate-800 truncate" dir="auto">
            {r.item_name}
          </p>
          <p className="text-[10px] font-bold text-teal-600">
            {r.kind === 'level' ? t('اشتراك كورس ومحاضرات') : t('شراء كتاب')}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="rounded-2xl bg-white border border-slate-100 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span dir="ltr" className="font-black text-slate-900 text-xs">
              {r.phone}
            </span>
          </div>
          <PhoneActions phone={r.phone} />
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 p-3 flex items-center gap-2 text-slate-700">
          <Wallet className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="font-bold truncate">{r.payment_method || t('طريقة دفع غير محددة')}</span>
        </div>
      </div>

      {/* Student Note */}
      {r.note && (
        <div className="flex items-start gap-2 rounded-2xl bg-amber-50/60 border border-amber-100 p-3 text-xs text-amber-900 leading-relaxed font-medium">
          <StickyNote className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>{r.note}</span>
        </div>
      )}

      {/* Rejection / Approval Note if already processed */}
      {!pending && (
        <div className="text-[11px] font-bold text-slate-500 bg-slate-50 rounded-xl p-2.5">
          {r.status === 'approved' ? t('✓ تم القبول والتفعيل') : t('✕ تم الرفض')}{' '}
          {r.reviewed_by ? t('بواسطة {name}', { name: r.reviewed_by }) : ''} • {fullDate(r.reviewed_at)}
          {r.admin_note && (
            <span className="block mt-1 text-rose-600 font-black">{t('السبب:')}{' '}{r.admin_note}</span>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-auto pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        {r.has_receipt ? (
          <button
            onClick={() => onReceipt(r)}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-black transition-all active:scale-95"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>{t('عرض إيصال التحويل')}</span>
          </button>
        ) : (
          <span className="text-[11px] font-bold text-slate-400">{t('بدون إيصال مرفق')}</span>
        )}

        <div className="flex items-center gap-2 ms-auto">
          {pending ? (
            <>
              <button
                disabled={busy}
                onClick={() => onReject(r)}
                className="h-10 px-3.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black transition-all disabled:opacity-50 active:scale-95 flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>{t('رفض')}</span>
              </button>
              <button
                disabled={busy}
                onClick={() => onApprove(r)}
                className="h-10 px-5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white text-xs font-black transition-all hover:brightness-110 shadow-lg shadow-emerald-600/25 active:scale-95 disabled:opacity-50 flex items-center gap-2 animate-pulse hover:animate-none"
              >
                {busy ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 text-amber-300" />
                )}
                <span>{t('قبول وتفعيل فوري')}</span>
              </button>
            </>
          ) : (
            <>
              {r.status === 'rejected' && (
                <button
                  disabled={busy}
                  onClick={() => onApprove(r)}
                  className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('تفعيل رغم الرفض')}</span>
                </button>
              )}
              <button
                onClick={() => onDelete(r)}
                className="w-9 h-9 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                title={t('حذف الطلب نهائياً')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
