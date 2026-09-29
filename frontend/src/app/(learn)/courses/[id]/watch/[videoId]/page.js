'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCourses } from '@/hooks/useCourses';
import { useModal } from '@/context/ModalContext';
import { coursesService, formatDuration } from '@/services/courses.service';
import { useLevelContent } from '@/components/course/useLevelContent';
import Playlist from '@/components/course/Playlist';
import CommentsPanel from '@/components/dashboard/CommentsPanel';
import {
  ArrowRight, ChevronRight, ChevronLeft, Clock, FileText, MessageSquare, Eye, AlertCircle, RefreshCw, Lock, LogIn,
} from 'lucide-react';

import { t } from '@/lib/i18n';
/** Standalone watch page: /courses/<levelId>/watch/<videoId>. All data from the backend. */
export default function WatchPage() {
  const { id, videoId } = useParams();
  const { allCourses, loading, error: levelsError, requiresLogin } = useCourses();
  const { openAuthModal } = useModal();
  const level = allCourses.find((c) => String(c.id) === String(id));
  const canWatch = !!level?.hasAccess;
  const { content, error, retry } = useLevelContent(id, canWatch);

  let body;
  if (loading && !level) {
    body = <Skeleton />;
  } else if (requiresLogin || (!loading && level && !canWatch)) {
    body = (
      <Notice icon={Lock} text={requiresLogin ? t('سجّل الدخول لمشاهدة المحاضرات.') : t('المستوى ده مش مفعّل على حسابك.')}>
        {requiresLogin ? (
          <button onClick={() => openAuthModal('login')} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-full text-sm font-black">
            <LogIn className="w-4 h-4" /> {t('تسجيل الدخول')}
          </button>
        ) : (
          <Link href={`/courses/${id}`} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-full text-sm font-black">
            {t('تفاصيل المستوى والاشتراك')}
          </Link>
        )}
      </Notice>
    );
  } else if (levelsError || error) {
    body = (
      <Notice icon={AlertCircle} text={levelsError || error}>
        <button onClick={retry} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-full text-sm font-black">
          <RefreshCw className="w-4 h-4" /> {t('إعادة المحاولة')}
        </button>
      </Notice>
    );
  } else if (!level) {
    body = <Notice icon={AlertCircle} text={t('المستوى غير موجود.')} />;
  } else if (!content) {
    body = <Skeleton />;
  } else {
    body = <Watch level={level} content={content} videoId={videoId} />;
  }

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-slate-100 to-slate-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{body}</div>
    </div>
  );
}

function Watch({ level, content, videoId }) {
  const { openFileViewer } = useModal();
  const [tab, setTab] = useState('discussion');
  const { videos, files } = content;

  // New lesson → show the top bar + player (the sticky header would otherwise cover the top bar).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [videoId]);
  const index = Math.max(0, videos.findIndex((v) => String(v.id) === String(videoId)));
  const active = videos[index];
  const prev = videos[index - 1];
  const next = videos[index + 1];

  const viewFile = (file) =>
    openFileViewer({ title: file.name, load: (onProgress) => coursesService.viewFile(level.id, file, onProgress) });

  if (!active) {
    return <Notice icon={AlertCircle} text={t('لم يتم رفع محاضرات لهذا المستوى بعد.')} />;
  }

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white border border-slate-200 shadow-sm px-4 py-3">
        <Link href={`/courses/${level.id}`} className="inline-flex items-center gap-2 text-sm font-black text-slate-800 hover:text-teal-700 min-w-0">
          <ArrowRight className="w-4 h-4 shrink-0 ltr:-scale-x-100" />
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0">
            {level.code}
          </span>
          <span className="truncate" dir="auto">{level.title}</span>
        </Link>
        <span className="text-xs font-black text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full">
          {t('المحاضرة {n} من {total}', { n: index + 1, total: videos.length })}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Player + lesson info (mobile order: player → playlist → tabs) */}
        <div className="lg:col-span-8 lg:col-start-1 lg:row-start-1 space-y-5 min-w-0">
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

          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 break-words" dir="auto">{active.title}</h1>
              {active.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDuration(active.length)}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {prev ? (
                <Link
                  href={`/courses/${level.id}/watch/${prev.id}`}
                  className="flex items-center gap-2 p-3 rounded-2xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50 min-w-0"
                >
                  <ChevronRight className="w-5 h-5 text-teal-600 shrink-0 ltr:-scale-x-100" />
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold text-slate-500">{t('المحاضرة السابقة')}</span>
                    <span className="block text-sm font-black text-slate-800 truncate" dir="auto">{prev.title}</span>
                  </span>
                </Link>
              ) : <span />}
              {next ? (
                <Link
                  href={`/courses/${level.id}/watch/${next.id}`}
                  className="flex items-center justify-end gap-2 p-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/20 min-w-0 text-end"
                >
                  <span className="min-w-0 text-start">
                    <span className="block text-[11px] font-bold text-teal-100">{t('المحاضرة التالية')}</span>
                    <span className="block text-sm font-black truncate" dir="auto">{next.title}</span>
                  </span>
                  <ChevronLeft className="w-5 h-5 shrink-0 ltr:-scale-x-100" />
                </Link>
              ) : (
                <Link
                  href={`/courses/${level.id}`}
                  className="flex items-center justify-center p-3 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-black"
                >
                  {t('خلصت محاضرات المستوى 🎉')}
                </Link>
              )}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-20">
          <Playlist levelId={level.id} videos={videos} activeId={active.id} />
        </aside>

        <div className="lg:col-span-8 lg:col-start-1 lg:row-start-2 min-w-0">
          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-200 px-2">
              <TabButton active={tab === 'discussion'} onClick={() => setTab('discussion')} icon={MessageSquare}>
                {t('المناقشة')}
              </TabButton>
              <TabButton active={tab === 'files'} onClick={() => setTab('files')} icon={FileText}>
                {t('ملفات المستوى')}
                {files.length > 0 && <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">{files.length}</span>}
              </TabButton>
            </div>
            <div className="p-5 sm:p-6">
              {tab === 'discussion' ? (
                <CommentsPanel key={`${level.id}-${active.id}`} levelId={level.id} videoId={active.id} />
              ) : files.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">{t('لا توجد ملفات لهذا المستوى.')}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => viewFile(file)}
                      className="group flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 text-start transition-colors"
                    >
                      <span className="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:border-teal-300 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-teal-600" />
                      </span>
                      <span className="flex-1 min-w-0 text-sm font-bold text-slate-800 truncate" dir="auto">{file.name}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-black text-teal-700 shrink-0">
                        <Eye className="w-4 h-4" />
                        {t('عرض')}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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

function Skeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-14 rounded-2xl bg-slate-200" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 aspect-video rounded-3xl bg-slate-300/70" />
        <div className="lg:col-span-4 h-96 rounded-3xl bg-slate-200" />
      </div>
    </div>
  );
}

function Notice({ icon: Icon, text, children }) {
  return (
    <div className="max-w-md mx-auto text-center bg-white border border-slate-200 rounded-3xl p-10 space-y-4 text-slate-700 shadow-sm">
      <Icon className="w-10 h-10 mx-auto opacity-70" />
      <p className="text-sm font-semibold">{text}</p>
      {children}
    </div>
  );
}
