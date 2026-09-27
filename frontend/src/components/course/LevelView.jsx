'use client';

import React from 'react';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { coursesService, formatDuration, formatPrice } from '@/services/courses.service';
import { useLevelContent, formatTotal, totalSeconds } from './useLevelContent';
import {
  PlayCircle, Play, FileText, AlertCircle, RefreshCw, Lock, LogIn, MessageCircle, Clock, ListVideo,
  Eye, CheckCircle2, ArrowRight, ChevronLeft,
} from 'lucide-react';

/**
 * Level overview page (hero + curriculum + files). Watching happens on its own page:
 * /courses/<levelId>/watch/<videoId>. Everything shown comes from the backend.
 */
export default function LevelView({ level }) {
  if (!level.hasAccess) return <LockedLevel level={level} />;
  return <UnlockedLevel level={level} />;
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
function LevelHero({ level, badge, actions, side }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-900/20">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.35),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.18),transparent_50%)]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '22px 22px' }}
      />
      <span
        aria-hidden
        className="absolute -bottom-10 left-4 text-[9rem] sm:text-[13rem] font-black leading-none text-white/[0.04] select-none pointer-events-none"
        dir="ltr"
      >
        {level.code}
      </span>

      <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-8 p-6 sm:p-10">
        <div className="lg:col-span-3 space-y-5">
          <Link href="/courses" className="inline-flex items-center gap-1 text-xs font-bold text-teal-200/80 hover:text-white">
            <ArrowRight className="w-3.5 h-3.5" />
            كل المستويات
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 text-xs font-black">
              المستوى {level.code}
            </span>
            {badge}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight" dir="auto">{level.title}</h1>
          {level.description && <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl" dir="auto">{level.description}</p>}
          {actions && <div className="flex flex-wrap gap-3 pt-1">{actions}</div>}
        </div>
        {side && <div className="lg:col-span-2 flex items-center">{side}</div>}
      </div>
    </section>
  );
}

function StatTile({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur px-5 py-4">
      <span className="w-11 h-11 rounded-xl bg-teal-400/15 border border-teal-300/20 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-teal-300" />
      </span>
      <div>
        <div className="text-2xl font-black leading-none">{value}</div>
        <div className="text-xs font-bold text-slate-400 mt-1">{label}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Unlocked                                                            */
/* ------------------------------------------------------------------ */
function UnlockedLevel({ level }) {
  const { content, error, retry } = useLevelContent(level.id);
  const { openFileViewer } = useModal();
  const videos = content?.videos || [];
  const files = content?.files || [];
  const total = totalSeconds(videos);
  const first = videos[0];

  const viewFile = (file) =>
    openFileViewer({ title: file.name, load: (onProgress) => coursesService.viewFile(level.id, file, onProgress) });

  return (
    <div className="space-y-8">
      <LevelHero
        level={level}
        badge={
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-300/30 text-xs font-black text-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            مفعّل لك
          </span>
        }
        actions={
          first && (
            <>
              <Link
                href={`/courses/${level.id}/watch/${first.id}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-sm font-black shadow-lg shadow-amber-500/25 transition-transform hover:scale-[1.03]"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                ابدأ المشاهدة
              </Link>
              {files.length > 0 && (
                <a href="#level-files" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-black">
                  <FileText className="w-4 h-4" />
                  ملفات المستوى
                </a>
              )}
            </>
          )
        }
        side={
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            <StatTile icon={ListVideo} value={content ? videos.length : '—'} label="محاضرة" />
            <StatTile icon={Clock} value={content ? formatTotal(total) : '—'} label="إجمالي مدة المحاضرات" />
            <StatTile icon={FileText} value={content ? files.length : '—'} label="ملف للمذاكرة" />
          </div>
        }
      />

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 text-center py-12 space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <button onClick={retry} className="inline-flex items-center gap-2 bg-rose-600 text-white text-xs font-black px-5 py-2.5 rounded-full hover:bg-rose-700">
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </button>
        </div>
      ) : !content ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-3 animate-pulse">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-20 rounded-2xl bg-slate-100" />)}
        </div>
      ) : (
        <>
          {/* Curriculum */}
          <section className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900">محتوى المستوى</h2>
                <p className="text-xs font-bold text-slate-500 mt-1">
                  {videos.length} محاضرة{total > 0 ? ` • ${formatTotal(total)}` : ''}
                </p>
              </div>
            </div>
            {videos.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-10">لم يتم رفع محاضرات لهذا المستوى بعد.</p>
            ) : (
              <ol className="divide-y divide-slate-100">
                {videos.map((vid, idx) => (
                  <li key={vid.id}>
                    <Link
                      href={`/courses/${level.id}/watch/${vid.id}`}
                      className="group flex items-center gap-4 px-4 sm:px-6 py-4 hover:bg-teal-50/60 transition-colors"
                    >
                      <span className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-teal-600 group-hover:text-white text-slate-500 text-sm font-black flex items-center justify-center shrink-0 transition-colors">
                        {idx + 1}
                      </span>
                      <span className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-slate-200 shrink-0 ring-1 ring-slate-200">
                        {vid.thumbnail_url ? (
                          // eslint-disable-next-line @next/next/no-img-element -- external Bunny CDN thumbnail
                          <img src={vid.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        ) : (
                          <PlayCircle className="w-7 h-7 text-slate-400 absolute inset-0 m-auto" />
                        )}
                        <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 group-hover:bg-slate-950/35 transition-colors">
                          <span className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-4 h-4 text-teal-700 fill-teal-700" />
                          </span>
                        </span>
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm sm:text-base font-black text-slate-900 group-hover:text-teal-800 leading-snug line-clamp-2 break-words" dir="auto">
                          {vid.title}
                        </span>
                        {vid.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 mt-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDuration(vid.length)}
                          </span>
                        )}
                      </span>
                      <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-teal-600 shrink-0 hidden sm:block" />
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* Files */}
          {files.length > 0 && (
            <section id="level-files" className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 space-y-4 scroll-mt-28">
              <div>
                <h2 className="text-xl font-black text-slate-900">ملفات المستوى</h2>
                <p className="text-xs font-bold text-slate-500 mt-1">{files.length} ملف — بتتفتح جوه الموقع</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {files.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => viewFile(file)}
                    className="group flex items-center gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 text-right transition-colors"
                  >
                    <span className="w-11 h-11 rounded-xl bg-white border border-slate-200 group-hover:border-teal-300 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-teal-600" />
                    </span>
                    <span className="flex-1 min-w-0 text-sm font-black text-slate-800 truncate" dir="auto">{file.name}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-black text-teal-700 shrink-0">
                      <Eye className="w-4 h-4" />
                      عرض
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Locked                                                              */
/* ------------------------------------------------------------------ */
function LockedLevel({ level }) {
  const { isAuthenticated } = useAuth();
  const { openEnrollModal, openLoginPromptModal } = useModal();
  const price = formatPrice(level.price);
  const oldPrice = level.oldPrice && level.oldPrice > (level.price || 0) ? formatPrice(level.oldPrice) : null;

  const subscribe = () =>
    isAuthenticated
      ? openEnrollModal(level)
      : openLoginPromptModal({ type: 'course', title: level.title, price, item: level });

  return (
    <div className="space-y-8">
      <LevelHero
        level={level}
        badge={
          isAuthenticated && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-black text-slate-200">
              <Lock className="w-3.5 h-3.5" />
              غير مفعّل
            </span>
          )
        }
        actions={
          <button
            onClick={subscribe}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-sm font-black shadow-lg shadow-amber-500/25 transition-transform hover:scale-[1.03]"
          >
            {isAuthenticated ? <MessageCircle className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            اشترك الآن
          </button>
        }
        side={
          price && (
            <div className="w-full rounded-3xl bg-white text-slate-900 p-6 shadow-xl space-y-2">
              <span className="text-xs font-bold text-slate-500">سعر المستوى</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-teal-700">{price}</span>
                <span className="text-sm font-black text-slate-500">ج.م</span>
              </div>
              {oldPrice && <span className="text-sm text-slate-400 line-through">{oldPrice} ج.م</span>}
            </div>
          )
        }
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7 text-amber-600" />
        </div>
        <h2 className="text-xl font-black text-slate-900">
          {isAuthenticated ? `محاضرات المستوى ${level.code} مقفولة` : `محاضرات المستوى ${level.code} متاحة للمشتركين`}
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          {isAuthenticated
            ? 'اشترك في المستوى وبعد تأكيد الدفع هيتفعّل على حسابك وتقدر تشوف كل المحاضرات والملفات وتشارك في المناقشة.'
            : 'للاشتراك لازم تسجّل الدخول أو تعمل حساب جديد الأول، وبعد تأكيد الدفع هيتفعّل المستوى على حسابك.'}
        </p>
      </div>
    </div>
  );
}
