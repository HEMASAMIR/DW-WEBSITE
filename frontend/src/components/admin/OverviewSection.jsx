'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { getErrorMessage } from '@/services/api';
import { Card, Btn, LevelChip, StatusBadge, Avatar, Skeleton, ErrorBox, Empty, money, timeAgo, fullDate, dateLocale, useToast } from './ui';
import {
  Users, UserPlus, GraduationCap, BookMarked, Wallet, BadgeCheck, ArrowLeft, Check, X, Sparkles, TrendingUp, Inbox,
  BookPlus, MapPinPlus, Zap, Activity, ChartPie, Layers,
} from 'lucide-react';
import { translate as t } from './prefs';

// Level colours for the chart (hex, matching constants/levelTones).
const LEVEL_HEX = { A1: '#14b8a6', A2: '#0ea5e9', B1: '#8b5cf6', B2: '#f43f5e', C1: '#f59e0b', General: '#64748b' };
const hexFor = (code, i) => LEVEL_HEX[code] || ['#14b8a6', '#0ea5e9', '#8b5cf6', '#f43f5e', '#f59e0b', '#10b981'][i % 6];

export default function OverviewSection({ adminName, goTo, onChanged, legacy }) {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null);

  const load = useCallback(() => {
    setError('');
    adminService.getOverview().then(setData).catch((e) => setError(getErrorMessage(e, t('تعذر تحميل البيانات.'))));
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(load, [load]);

  const act = async (req, approve) => {
    setBusy(req.id);
    try {
      const res = approve ? await adminService.approveRequest(req.id) : await adminService.rejectRequest(req.id);
      toast('ok', res.detail);
      load();
      onChanged();
    } catch (e) {
      toast('err', getErrorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  if (error) return <ErrorBox message={error} onRetry={load} />;
  if (!data) return <OverviewSkeleton />;

  const s = data.stats;
  const pendingTotal = s.pending_level_requests + s.pending_book_requests;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('صباح الخير') : t('مساء الخير');
  const hasJoinDates = data.has_join_dates !== false;
  const totalSubs = data.levels.reduce((a, l) => a + l.subscribers, 0);
  const maxSubs = Math.max(1, ...data.levels.map((l) => l.subscribers));

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[2rem] bg-[#0a2340] text-white p-6 sm:p-8 shadow-xl shadow-[#0a2340]/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_100%_0%,rgba(20,184,166,0.45),transparent_60%),radial-gradient(ellipse_60%_80%_at_0%_100%,rgba(245,158,11,0.3),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.07] [mask-image:linear-gradient(to_left,black,transparent)]"
          style={{ backgroundImage: 'linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)', backgroundSize: '36px 36px' }}
        />
        <div className="absolute top-0 inset-x-0 flex h-1" dir="ltr">
          <span className="flex-1 bg-slate-950" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
        </div>
        <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
          <div className="lg:col-span-3 space-y-2.5">
            <p className="inline-flex items-center gap-1.5 text-xs font-black text-teal-200">
              <Sparkles className="w-4 h-4 text-amber-300" />
              {new Date().toLocaleDateString(dateLocale(), { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h2 className="text-2xl sm:text-4xl font-black">{greeting}{t('،')}{' '}{adminName} 👋</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {legacy
                ? t('كل حاجة في الأكاديمية تحت إيدك: الطلاب، والاشتراكات، والكورسات، والكتب، والفروع.')
                : pendingTotal > 0
                ? <>{t('عندك')}{' '}<strong className="text-amber-300">{pendingTotal}{' '}{t('طلب')}</strong>{' '}{t('مستني موافقتك — الطالب بيتفعّل أول ما تقبل.')}</>
                : t('مفيش طلبات مستنية دلوقتي، كل حاجة تمام ✨')}
            </p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-3 gap-2.5">
            <HeroStat value={s.students} label={t('طالب')} />
            <HeroStat value={s.active_level_subscriptions} label={t('اشتراك')} />
            <HeroStat value={legacy ? s.levels : pendingTotal} label={legacy ? t('مستوى') : t('طلب مستني')} gold />
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Kpi icon={Users} tone="teal" label={t('إجمالي الطلاب')} value={s.students.toLocaleString('en-US')}
          sub={hasJoinDates ? t('+{n} الأسبوع ده', { n: s.new_students_7d }) : t('كل الحسابات المسجلة')} onClick={() => goTo('users')} />
        {legacy ? (
          <Kpi icon={BookMarked} tone="amber" label={t('الكتب')} value={s.books} sub={t('{n} تفعيل للطلاب', { n: s.active_book_accesses })} onClick={() => goTo('books')} />
        ) : (
          <Kpi icon={Inbox} tone="amber" label={t('طلبات مستنية')} value={pendingTotal} sub={t('{a} كورسات • {b} كتب', { a: s.pending_level_requests, b: s.pending_book_requests })} pulse={pendingTotal > 0} onClick={() => goTo('requests-level')} />
        )}
        <Kpi icon={BadgeCheck} tone="violet" label={t('اشتراكات مفعّلة')} value={s.active_level_subscriptions} sub={t('{n} كتاب مفعّل', { n: s.active_book_accesses })} onClick={() => goTo('requests-level')} />
        {legacy ? (
          <Kpi icon={Layers} tone="emerald" label={t('المستويات')} value={s.levels} sub={t('الأسعار والنشر')} onClick={() => goTo('courses')} />
        ) : (
          <Kpi icon={Wallet} tone="emerald" label={t('إيرادات الطلبات المقبولة')} value={money(s.revenue_total)} unit={t('ج.م')} sub={t('{n} ج.م آخر 30 يوم', { n: money(s.revenue_30d) })} />
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <QuickAction icon={Zap} title={t('تفعيل مستوى لطالب')} text={t('بعد ما يدفع')} tone="from-teal-500 to-emerald-600" onClick={() => goTo('requests-level')} />
        <QuickAction icon={BookMarked} title={t('تفعيل كتاب لطالب')} text={t('يفتح الكتاب فوراً')} tone="from-sky-500 to-blue-600" onClick={() => goTo('requests-book')} />
        <QuickAction icon={BookPlus} title={t('إضافة كتاب')} text={t('PDF لأي مستوى')} tone="from-violet-500 to-purple-600" onClick={() => goTo('books')} />
        <QuickAction icon={MapPinPlus} title={t('إضافة فرع')} text={t('بلونه ولوكيشنه')} tone="from-amber-400 to-orange-500" onClick={() => goTo('branches')} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Activity */}
        <Card className="xl:col-span-2 p-5 sm:p-6">
          {legacy ? (
            <>
              <CardTitle icon={Activity} title={t('آخر التفعيلات')} sub={t('مين اتفتحله إيه مؤخراً')} action={<LinkBtn onClick={() => goTo('requests-level')}>{t('كل الاشتراكات')}</LinkBtn>} />
              {data.recent_activations?.length ? (
                <ol className="relative border-s-2 border-slate-100 ms-4 space-y-1">
                  {data.recent_activations.map((a) => (
                    <li key={`${a.kind}-${a.item_id}-${a.user_id}`} className="relative ps-6 py-2">
                      <span className="absolute -start-[9px] top-5 w-4 h-4 rounded-full ring-4 ring-white" style={{ background: hexFor(a.level_code, 0) }} />
                      <div className="flex items-center gap-3 rounded-2xl hover:bg-slate-50 px-3 py-2 -mx-3">
                        <Avatar name={a.name} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black text-slate-900 truncate">{a.name}</p>
                          <p className="text-xs text-slate-500 truncate">
                            {a.kind === 'level' ? t('اشترك في') : t('اتفتحله كتاب')} <span className="font-bold text-slate-700" dir="auto">{a.item_name}</span>
                          </p>
                        </div>
                        <LevelChip code={a.level_code} size="sm" />
                        <span className="hidden sm:block text-[11px] font-bold text-slate-400 w-24 text-end" title={fullDate(a.granted_at)}>{timeAgo(a.granted_at)}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <Empty title={t('لسه مفيش تفعيلات')} text={t('لما تفعّل مستوى أو كتاب لطالب هيظهر هنا.')} />
              )}
            </>
          ) : (
            <>
              <CardTitle icon={Inbox} title={t('أحدث الطلبات')} action={<LinkBtn onClick={() => goTo('requests-level')}>{t('كل الطلبات')}</LinkBtn>} />
              {data.recent_requests.length === 0 ? (
                <Empty title={t('لسه مفيش طلبات')} text={t('أول ما طالب يطلب كورس أو كتاب هيظهر هنا.')} />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {data.recent_requests.map((r) => (
                    <li key={r.id} className="py-3.5 flex items-center gap-3">
                      <LevelChip code={r.level_code} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-slate-900 truncate">{r.full_name}</p>
                        <p className="text-xs text-slate-500 truncate">{r.kind === 'level' ? t('كورس') : t('كتاب')}: {r.item_name} • {timeAgo(r.created_at)}</p>
                      </div>
                      <span className="hidden sm:block text-sm font-black text-slate-700" dir="ltr">{money(r.amount)} <span className="text-[10px] text-slate-400">EGP</span></span>
                      {r.status === 'pending' ? (
                        <div className="flex gap-1.5">
                          <Btn size="icon" variant="success" loading={busy === r.id} onClick={() => act(r, true)} title={t('قبول وتفعيل')}><Check className="w-4 h-4" /></Btn>
                          <Btn size="icon" variant="dangerSoft" disabled={busy === r.id} onClick={() => act(r, false)} title={t('رفض')}><X className="w-4 h-4" /></Btn>
                        </div>
                      ) : (
                        <StatusBadge status={r.status} />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </Card>

        {/* Distribution donut */}
        <Card className="p-5 sm:p-6 flex flex-col">
          <CardTitle icon={ChartPie} title={t('توزيع المشتركين')} sub={t('على المستويات')} />
          <div className="flex-1 flex flex-col items-center justify-center gap-5">
            <Donut
              total={totalSubs}
              parts={data.levels.map((l, i) => ({ key: l.id, value: l.subscribers, color: hexFor(l.name, i) }))}
            />
            <div className="w-full grid grid-cols-2 gap-2">
              {data.levels.map((l, i) => (
                <div key={l.id} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: hexFor(l.name, i) }} />
                  <span className="text-xs font-black text-slate-700" dir="ltr">{l.name}</span>
                  <span className="ms-auto text-xs font-black text-slate-900">{l.subscribers}</span>
                  <span className="text-[10px] font-bold text-slate-400">{totalSubs ? Math.round((l.subscribers / totalSubs) * 100) : 0}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Subscribers per level */}
        <Card className="xl:col-span-2 p-5 sm:p-6">
          <CardTitle icon={GraduationCap} title={t('المشتركين في كل مستوى')} action={<LinkBtn onClick={() => goTo('courses')}>{t('إدارة الكورسات')}</LinkBtn>} />
          <div className="space-y-4">
            {data.levels.map((l, i) => (
              <div key={l.id} className="flex items-center gap-4">
                <LevelChip code={l.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className="text-sm font-black text-slate-800 truncate" dir="auto">{l.title}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      {l.pending > 0 && <span className="text-[11px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">{l.pending}{' '}{t('طلب')}</span>}
                      <span className="text-sm font-black text-slate-900">{l.subscribers}</span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(3, (l.subscribers / maxSubs) * 100)}%`, background: `linear-gradient(to left, ${hexFor(l.name, i)}, #0e2c4e)` }} />
                  </div>
                </div>
              </div>
            ))}
            {data.levels.length === 0 && <p className="text-sm text-slate-500 text-center py-6">{t('مفيش مستويات لسه.')}</p>}
          </div>
          {!legacy && data.signups_14d?.some((d) => d.count) && <Signups days={data.signups_14d} />}
        </Card>

        {/* Recent users */}
        <Card className="p-5 sm:p-6">
          <CardTitle icon={UserPlus} title={t('آخر المسجلين')} action={<LinkBtn onClick={() => goTo('users')}>{t('الكل')}</LinkBtn>} />
          <ul className="space-y-2">
            {data.recent_users.map((u) => (
              <li key={u.id} className="flex items-center gap-3 rounded-2xl hover:bg-slate-50 px-2 py-1.5 -mx-2">
                <Avatar name={u.name} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-slate-800 truncate">{u.name}</p>
                  <p className="text-[11px] text-slate-400 font-bold">{u.date_joined ? timeAgo(u.date_joined) : t('حساب #{id}', { id: u.id })}</p>
                </div>
                <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center"><UserPlus className="w-3.5 h-3.5" /></span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function HeroStat({ value, label, gold }) {
  return (
    <div className={`rounded-2xl px-3 py-4 text-center border backdrop-blur ${gold ? 'bg-amber-400/15 border-amber-300/30' : 'bg-white/[0.07] border-white/10'}`}>
      <p className={`text-3xl font-black ${gold ? 'text-amber-300' : 'text-white'}`}>{Number(value || 0).toLocaleString('en-US')}</p>
      <p className="text-[11px] font-bold text-slate-300 mt-0.5">{label}</p>
    </div>
  );
}

function QuickAction({ icon: Icon, title, text, tone, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden text-start rounded-3xl bg-white border border-slate-200/80 p-4 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all"
    >
      <span className={`absolute -end-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${tone} opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500`} />
      <span className={`relative inline-flex w-11 h-11 rounded-2xl bg-gradient-to-br ${tone} text-white items-center justify-center shadow-lg`}>
        <Icon className="w-5 h-5" />
      </span>
      <p className="relative mt-3 text-sm font-black text-slate-900">{title}</p>
      <p className="relative text-[11px] font-bold text-slate-400">{text}</p>
      <ArrowLeft className="ltr:-scale-x-100 absolute top-4 end-4 w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:-translate-x-1 transition-all" />
    </button>
  );
}

/** SVG donut; parts: [{ key, value, color }] */
function Donut({ parts, total }) {
  const r = 58;
  const c = 2 * Math.PI * r;
  const segments = parts.reduce((acc, p) => {
    const len = total ? (p.value / total) * c : 0;
    const offset = acc.length ? acc[acc.length - 1].offset + acc[acc.length - 1].len : 0;
    return [...acc, { ...p, len, offset }];
  }, []);
  return (
    <div className="relative w-44 h-44">
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" className="stroke-slate-100" strokeWidth="18" />
        {segments.filter((sgm) => sgm.len > 0).map((sgm) => (
          <circle
            key={sgm.key}
            cx="80"
            cy="80"
            r={r}
            fill="none"
            stroke={sgm.color}
            strokeWidth="18"
            strokeDasharray={`${Math.max(0, sgm.len - 3)} ${c}`}
            strokeDashoffset={-sgm.offset}
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-slate-900">{total}</span>
        <span className="text-[11px] font-bold text-slate-400">{t('مشترك')}</span>
      </div>
    </div>
  );
}

function Signups({ days }) {
  const max = Math.max(1, ...days.map((d) => d.count));
  const total = days.reduce((a, d) => a + d.count, 0);
  return (
    <div className="mt-6 pt-5 border-t border-slate-100">
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-sm font-black text-slate-800">{t('التسجيلات آخر 14 يوم')}</span>
        <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-600"><TrendingUp className="w-3.5 h-3.5" /> {total}</span>
      </div>
      <div className="h-24 flex items-end gap-1.5" dir="ltr">
        {days.map((d) => (
          <div key={d.date} className="group relative flex-1 h-full flex flex-col justify-end">
            <div className="w-full rounded-t-md bg-gradient-to-t from-teal-600 to-teal-300 group-hover:from-amber-500 group-hover:to-amber-300" style={{ height: `${Math.max(4, (d.count / max) * 100)}%` }} />
            <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-lg bg-slate-900 text-white text-[10px] font-black whitespace-nowrap opacity-0 group-hover:opacity-100">
              {d.count} • {new Date(d.date).toLocaleDateString(dateLocale(), { day: 'numeric', month: 'short' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const KPI_TONES = {
  teal: 'from-teal-400 to-teal-600 shadow-teal-500/30',
  amber: 'from-amber-300 to-orange-500 shadow-amber-500/30',
  violet: 'from-violet-400 to-purple-600 shadow-violet-500/30',
  emerald: 'from-emerald-400 to-emerald-600 shadow-emerald-500/30',
};

function Kpi({ icon: Icon, tone, label, value, unit, sub, onClick, pulse }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag onClick={onClick} className="text-start w-full group">
      <Card className={`relative overflow-hidden p-5 h-full ${onClick ? 'group-hover:-translate-y-0.5 group-hover:shadow-xl transition-all' : ''}`}>
        <div className={`absolute -end-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br ${KPI_TONES[tone]} opacity-[0.09] group-hover:scale-125 transition-transform duration-500`} />
        <div className="flex items-start justify-between gap-3">
          <span className={`relative w-11 h-11 rounded-2xl bg-gradient-to-br ${KPI_TONES[tone]} text-white flex items-center justify-center shadow-lg`}>
            <Icon className="w-5 h-5" />
            {pulse && <span className="absolute -top-1 -end-1 w-3 h-3 rounded-full bg-rose-500 ring-2 ring-white animate-ping" />}
          </span>
          {onClick && <ArrowLeft className="ltr:-scale-x-100 w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />}
        </div>
        <p className="mt-4 text-xs font-bold text-slate-500">{label}</p>
        <p className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {value} {unit && <span className="text-sm text-slate-400 font-black">{unit}</span>}
        </p>
        {sub && <p className="mt-1 text-[11px] font-bold text-slate-400">{sub}</p>}
      </Card>
    </Tag>
  );
}

function CardTitle({ icon: Icon, title, sub, action }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-5">
      <div className="flex items-center gap-2.5">
        {Icon && <span className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center"><Icon className="w-4 h-4" /></span>}
        <div>
          <h3 className="text-base font-black text-slate-900">{title}</h3>
          {sub && <p className="text-xs text-slate-400 font-bold">{sub}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

function LinkBtn({ children, onClick }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1 text-xs font-black text-teal-700 hover:text-teal-900">
      {children} <ArrowLeft className="w-3.5 h-3.5 ltr:-scale-x-100" />
    </button>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-44 !rounded-[2rem]" />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-36 !rounded-3xl" />)}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28 !rounded-3xl" />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Skeleton className="xl:col-span-2 h-80 !rounded-3xl" />
        <Skeleton className="h-80 !rounded-3xl" />
      </div>
    </div>
  );
}
