'use client';

import React, { useState, useEffect } from 'react';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { coursesService, formatDuration, formatPrice } from '@/services/courses.service';
import { getErrorMessage } from '@/services/api';
import CommentsPanel from '@/components/dashboard/CommentsPanel';
import { PlayCircle, Eye, Video, FileText, Loader2, AlertCircle, RefreshCw, Lock, LogIn, MessageCircle } from 'lucide-react';

/**
 * Lessons screen for one level (like the app's "Video list → Player" screens).
 * `level` is the normalized level from coursesService.getLevels().
 */
export default function LevelView({ level }) {
  const { isAdmin } = useAuth();
  const [reloadKey, setReloadKey] = useState(0);
  const hasAccess = level.hasAccess || isAdmin;
  if (!hasAccess) return <LockedLevel level={level} />;
  return <LevelLessons key={`${level.id}-${reloadKey}`} levelId={level.id} onRetry={() => setReloadKey((k) => k + 1)} />;
}

function LockedLevel({ level }) {
  const { isAuthenticated } = useAuth();
  const { openEnrollModal, openLoginPromptModal } = useModal();
  const price = formatPrice(level.price);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center mx-auto">
        <Lock className="w-8 h-8 text-amber-400" />
      </div>
      <h3 className="text-xl font-black text-white">
        {isAuthenticated ? `محاضرات المستوى ${level.code} مقفولة` : `محاضرات المستوى ${level.code} متاحة للمشتركين`}
      </h3>
      <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
        {isAuthenticated
          ? 'اشترك في المستوى وبعد تأكيد الدفع هيتفعّل على حسابك فوراً وتقدر تشوف كل المحاضرات والملفات وتشارك في المناقشة.'
          : 'للاشتراك لازم تسجّل الدخول أو تعمل حساب جديد الأول، وبعد تأكيد الدفع هيتفعّل المستوى على حسابك.'}
      </p>
      {price && <p className="text-3xl font-black text-amber-400">{price} ج.م</p>}
      {isAuthenticated ? (
        <button
          onClick={() => openEnrollModal(level)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-white font-black text-sm px-7 py-3.5 rounded-2xl shadow-lg"
        >
          <MessageCircle className="w-4 h-4" />
          اشترك الآن عبر واتساب
        </button>
      ) : (
        <button
          onClick={() => openLoginPromptModal({ type: 'course', title: level.title, price, item: level })}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-sm px-7 py-3.5 rounded-2xl shadow-lg"
        >
          <LogIn className="w-4 h-4" />
          اشترك الآن
        </button>
      )}
    </div>
  );
}

/** Fetched fresh on every mount — embed URLs are signed and expire (~4h), so never cache them. */
function LevelLessons({ levelId, onRetry }) {
  const [content, setContent] = useState(null);
  const [error, setError] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);
  const { openFileViewer } = useModal();

  useEffect(() => {
    let cancelled = false;
    coursesService
      .getLevelContent(levelId)
      .then((data) => {
        if (cancelled) return;
        setContent(data);
        setActiveVideo(data.videos[0] || null);
      })
      .catch((err) => !cancelled && setError(getErrorMessage(err, 'تعذر تحميل محاضرات هذا المستوى.')));
    return () => {
      cancelled = true;
    };
  }, [levelId]);

  const handleView = (file) =>
    openFileViewer({ title: file.name, load: (onProgress) => coursesService.viewFile(levelId, file, onProgress) });

  if (error) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl text-center py-12 space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <p className="text-sm text-rose-300">{error}</p>
        <button onClick={onRetry} className="inline-flex items-center gap-2 bg-slate-800 text-slate-200 text-xs font-bold px-5 py-2 rounded-xl hover:bg-slate-700">
          <RefreshCw className="w-4 h-4" />
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-4">
        {activeVideo ? (
          <>
            <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              <iframe
                key={activeVideo.id}
                src={activeVideo.embed_url}
                title={activeVideo.title}
                className="w-full h-full"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <h4 className="text-base font-black text-white">{activeVideo.title}</h4>
              {activeVideo.length > 0 && (
                <span className="text-xs text-amber-400 font-semibold">مدة المحاضرة: {formatDuration(activeVideo.length)}</span>
              )}
            </div>

            <CommentsPanel key={`${levelId}-${activeVideo.id}`} levelId={levelId} videoId={activeVideo.id} />
          </>
        ) : (
          <div className="aspect-video bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center text-sm text-slate-400">
            لم يتم رفع محاضرات لهذا المستوى بعد.
          </div>
        )}
      </div>

      <div className="lg:col-span-4 space-y-4">
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-black text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-amber-400" />
              المحاضرات
            </h5>
            <span className="text-xs bg-slate-800 text-amber-300 font-bold px-2 py-0.5 rounded-full">{content.videos.length} محاضرة</span>
          </div>
          <div className="space-y-2 max-h-[480px] overflow-y-auto pl-1">
            {content.videos.map((vid, idx) => (
              <button
                key={vid.id}
                onClick={() => setActiveVideo(vid)}
                className={`w-full text-right p-2.5 rounded-2xl border text-xs transition-all flex items-center gap-3 ${
                  activeVideo?.id === vid.id ? 'bg-amber-400/15 border-amber-400/80' : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className="relative w-24 aspect-video rounded-xl overflow-hidden bg-slate-800 shrink-0">
                  {vid.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- external Bunny CDN thumbnail
                    <img src={vid.thumbnail_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <PlayCircle className="w-5 h-5 text-amber-400 absolute inset-0 m-auto" />
                  )}
                  {vid.length > 0 && (
                    <span className="absolute bottom-1 left-1 bg-slate-950/90 text-amber-300 text-[9px] px-1 rounded font-mono font-bold">
                      {formatDuration(vid.length)}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-amber-400 font-bold block">محاضرة {idx + 1}</span>
                  <span className={`font-bold block leading-snug line-clamp-2 ${activeVideo?.id === vid.id ? 'text-amber-300' : 'text-slate-100'}`}>
                    {vid.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {content.files.length > 0 && (
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h5 className="text-sm font-black text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              ملفات المستوى
            </h5>
            {content.files.map((file) => (
              <button
                key={file.id}
                onClick={() => handleView(file)}
                className="w-full flex items-center justify-between gap-2 bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white text-xs font-extrabold px-3.5 py-3 rounded-xl transition-all"
              >
                <span className="text-right truncate">{file.name}</span>
                <span className="flex items-center gap-1 shrink-0">
                  <Eye className="w-4 h-4" />
                  عرض
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
