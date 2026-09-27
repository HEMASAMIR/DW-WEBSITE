'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { coursesService, formatDuration, formatPrice } from '@/services/courses.service';
import { getErrorMessage } from '@/services/api';
import CommentsPanel from '@/components/dashboard/CommentsPanel';
import {
  PlayCircle, Play, FileText, Loader2, AlertCircle, RefreshCw, Lock, LogIn, MessageCircle,
  ChevronRight, ChevronLeft, Clock, ListVideo, MessageSquare, Eye, CheckCircle2, ArrowRight,
} from 'lucide-react';

/** "3 ساعات 25 دقيقة" from a number of seconds. */
function formatTotal(seconds) {
  const total = Math.round(seconds / 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (!h) return `${m} دقيقة`;
  return m ? `${h} ساعة ${m} دقيقة` : `${h} ساعة`;
}

/**
 * Level page body. Everything shown comes from the backend:
 * level (title/price/has_access) + /videos/ (videos, files).
 */
export default function LevelView({ level }) {
  const [reloadKey, setReloadKey] = useState(0);
  if (!level.hasAccess) return <LockedLevel level={level} />;
  return <LevelLessons key={`${level.id}-${reloadKey}`} level={level} onRetry={() => setReloadKey((k) => k + 1)} />;
}

/* ------------------------------------------------------------------ */
/* Hero band shared by the locked and unlocked views                   */
/* ------------------------------------------------------------------ */
function LevelHero({ level, children, aside }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-white shadow-2xl">
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="relative p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex items-start gap-5 flex-1 min-w-0">
          <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-teal-400 to-emerald-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-teal-900/40 ring-4 ring-white/10 shrink-0">
            {level.code}
          </span>
          <div className="min-w-0 space-y-3">
            <Link href="/courses" className="inline-flex items-center gap-1 text-xs font-bold text-teal-200/80 hover:text-white">
              <ArrowRight className="w-3.5 h-3.5" />
              كل المستويات
            </Link>
            <h1 className="text-2xl sm:text-4xl font-black leading-tight" dir="auto">{level.title}</h1>
            {level.description && <p className="text-sm text-slate-300 leading-relaxed max-w-2xl" dir="auto">{level.description}</p>}
            {children}
          </div>
        </div>
        {aside}
      </div>
    </section>
  );
}

function Chip({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white backdrop-blur">
      <Icon className="w-3.5 h-3.5 text-amber-300" />
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Locked level                                                        */
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
    <div className="space-y-6">
      <LevelHero
        level={level}
        aside={
          price && (
            <div className="lg:w-72 shrink-0 rounded-3xl bg-white text-slate-900 p-6 shadow-xl space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-500">سعر المستوى</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-teal-700">{price}</span>
                  <span className="text-sm font-bold text-slate-500">ج.م</span>
                </div>
                {oldPrice && <span className="text-sm text-slate-400 line-through">{oldPrice} ج.م</span>}
              </div>
              <button
                onClick={subscribe}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-sm py-3.5 rounded-2xl shadow-lg shadow-teal-600/25 transition-transform hover:scale-[1.02]"
              >
                {isAuthenticated ? <MessageCircle className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                اشترك الآن
              </button>
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

/* ------------------------------------------------------------------ */
/* Unlocked level: player + playlist + discussion/files                */
/* ------------------------------------------------------------------ */
/** Fetched fresh on every mount — embed URLs are signed and expire (~4h), so never cache them. */
function LevelLessons({ level, onRetry }) {
  const [content, setContent] = useState(null);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [tab, setTab] = useState('discussion');
  const playerRef = useRef(null);
  const { openFileViewer } = useModal();

  useEffect(() => {
    let cancelled = false;
    coursesService
      .getLevelContent(level.id)
      .then((data) => !cancelled && setContent(data))
      .catch((err) => !cancelled && setError(getErrorMessage(err, 'تعذر تحميل محاضرات هذا المستوى.')));
    return () => {
      cancelled = true;
    };
  }, [level.id]);

  const viewFile = (file) =>
    openFileViewer({ title: file.name, load: (onProgress) => coursesService.viewFile(level.id, file, onProgress) });

  const select = (index) => {
    setActiveIndex(index);
    playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (error) {
    return (
      <div className="space-y-6">
        <LevelHero level={level} />
        <div className="rounded-3xl border border-rose-200 bg-rose-50 text-center py-12 space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <button onClick={onRetry} className="inline-flex items-center gap-2 bg-rose-600 text-white text-xs font-black px-5 py-2.5 rounded-full hover:bg-rose-700">
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="space-y-6">
        <LevelHero level={level} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
          <div className="lg:col-span-8 aspect-video rounded-3xl bg-slate-200" />
          <div className="lg:col-span-4 h-96 rounded-3xl bg-slate-200" />
        </div>
      </div>
    );
  }

  const { videos, files } = content;
  const active = videos[activeIndex] || null;
  const totalSeconds = videos.reduce((s, v) => s + (Number(v.length) || 0), 0);

  return (
    <div className="space-y-6">
      <LevelHero level={level}>
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-300/30 text-xs font-black text-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            مفعّل لك
          </span>
          <Chip icon={ListVideo}>{videos.length} محاضرة</Chip>
          {totalSeconds > 0 && <Chip icon={Clock}>{formatTotal(totalSeconds)}</Chip>}
          {files.length > 0 && <Chip icon={FileText}>{files.length} ملف</Chip>}
        </div>
      </LevelHero>

      {videos.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm font-semibold text-slate-500">
          لم يتم رفع محاضرات لهذا المستوى بعد.
        </div>
      ) : (
        // DOM order = mobile order: player → playlist → discussion/files.
        // On desktop the playlist sits in its own sticky column spanning both rows.
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ---------------- Player + current lesson ---------------- */}
          <div className="lg:col-span-8 lg:col-start-1 lg:row-start-1 space-y-5 min-w-0" ref={playerRef} style={{ scrollMarginTop: '6rem' }}>
            <div className="rounded-3xl overflow-hidden bg-black shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/10">
              <div className="aspect-video">
                <iframe
                  key={active.id}
                  src={active.embed_url}
                  title={active.title}
                  className="w-full h-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0 space-y-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full">
                  المحاضرة {activeIndex + 1} من {videos.length}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 break-words" dir="auto">{active.title}</h2>
                {active.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDuration(active.length)}
                  </span>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => select(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-black hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                  السابقة
                </button>
                <button
                  onClick={() => select(activeIndex + 1)}
                  disabled={activeIndex >= videos.length - 1}
                  className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-black hover:bg-teal-500 shadow-md shadow-teal-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  التالية
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ---------------- Playlist ---------------- */}
          <aside className="lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24">
            <Playlist videos={videos} activeIndex={activeIndex} totalSeconds={totalSeconds} onSelect={select} />
          </aside>

          {/* ---------------- Discussion / files ---------------- */}
          <div className="lg:col-span-8 lg:col-start-1 lg:row-start-2 min-w-0">
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-200 px-2">
                <TabButton active={tab === 'discussion'} onClick={() => setTab('discussion')} icon={MessageSquare}>
                  المناقشة
                </TabButton>
                <TabButton active={tab === 'files'} onClick={() => setTab('files')} icon={FileText}>
                  ملفات المستوى
                  {files.length > 0 && <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">{files.length}</span>}
                </TabButton>
              </div>
              <div className="p-5 sm:p-6">
                {tab === 'discussion' ? (
                  <CommentsPanel key={`${level.id}-${active.id}`} levelId={level.id} videoId={active.id} />
                ) : files.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">لا توجد ملفات لهذا المستوى.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {files.map((file) => (
                      <button
                        key={file.id}
                        onClick={() => viewFile(file)}
                        className="group flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 text-right transition-colors"
                      >
                        <span className="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:border-teal-300 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-teal-600" />
                        </span>
                        <span className="flex-1 min-w-0 text-sm font-bold text-slate-800 truncate" dir="auto">{file.name}</span>
                        <span className="inline-flex items-center gap-1 text-xs font-black text-teal-700 shrink-0">
                          <Eye className="w-4 h-4" />
                          عرض
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

function Playlist({ videos, activeIndex, totalSeconds, onSelect }) {
  const select = onSelect;
  return (
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 bg-gradient-to-l from-teal-50 to-white">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ListVideo className="w-5 h-5 text-teal-600" />
                  محتوى المستوى
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  {videos.length} محاضرة{totalSeconds > 0 ? ` • ${formatTotal(totalSeconds)}` : ''}
                </p>
              </div>
              <ol className="max-h-[70vh] overflow-y-auto divide-y divide-slate-100">
                {videos.map((vid, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <li key={vid.id}>
                      <button
                        onClick={() => select(idx)}
                        className={`w-full text-right flex items-center gap-3 px-4 py-3 transition-colors border-r-4 ${
                          isActive ? 'bg-teal-50 border-teal-500' : 'border-transparent hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                            isActive ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {isActive ? (
                            <span className="dw-eq" aria-label="قيد التشغيل"><span /><span /><span /></span>
                          ) : (
                            idx + 1
                          )}
                        </span>
                        <span className="relative w-24 aspect-video rounded-lg overflow-hidden bg-slate-200 shrink-0">
                          {vid.thumbnail_url ? (
                            // eslint-disable-next-line @next/next/no-img-element -- external Bunny CDN thumbnail
                            <img src={vid.thumbnail_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <PlayCircle className="w-6 h-6 text-slate-400 absolute inset-0 m-auto" />
                          )}
                          {!isActive && (
                            <span className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/25 transition-colors">
                              <Play className="w-5 h-5 text-white opacity-0 hover:opacity-100 fill-white" />
                            </span>
                          )}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span
                            className={`block text-sm font-bold leading-snug line-clamp-2 break-words ${isActive ? 'text-teal-800' : 'text-slate-800'}`}
                            dir="auto"
                          >
                            {vid.title}
                          </span>
                          {vid.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 mt-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(vid.length)}
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
  );
}

function TabButton({ active, onClick, icon: Icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center gap-2 px-4 py-4 text-sm font-black transition-colors ${
        active ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800'
      }`}
    >
      <Icon className="w-4 h-4" />
      {children}
      {active && <span className="absolute bottom-0 inset-x-3 h-0.5 rounded-full bg-teal-600" />}
    </button>
  );
}
