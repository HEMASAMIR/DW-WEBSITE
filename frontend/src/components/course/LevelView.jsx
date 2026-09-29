'use client';

import React from 'react';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { coursesService, formatDuration, formatPrice, formatPriceLatin } from '@/services/courses.service';
import { useLevelContent, formatTotal, totalSeconds } from './useLevelContent';
import Reveal from '@/components/common/Reveal';
import PaymentInfo from '@/components/common/PaymentInfo';
import { useContactInfo, groupLink } from '@/lib/contactInfo';
import {
  PlayCircle, Play, FileText, AlertCircle, RefreshCw, Lock, LogIn, MessageCircle, Clock, ListVideo,
  Eye, CheckCircle2, ChevronLeft, FileType2, Sparkles,
} from 'lucide-react';

import { t } from '@/lib/i18n';
/**
 * Level overview page (cinematic hero + lecture grid + files sidebar). Watching happens on its
 * own page: /courses/<levelId>/watch/<videoId>. Everything shown comes from the backend.
 */
export default function LevelView({ level }) {
  if (!level.hasAccess) return <LockedLevel level={level} />;
  return <UnlockedLevel level={level} />;
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
function LevelHero({ level, backdrop, badge, stats, actions, side }) {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* Backdrop: blurred first-lecture thumbnail + light + grid */}
      {backdrop && (
        // eslint-disable-next-line @next/next/no-img-element -- external Bunny CDN thumbnail
        <img src={backdrop} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover scale-125 blur-3xl opacity-[0.12]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_85%_0%,rgba(20,184,166,0.45),transparent_60%),radial-gradient(ellipse_60%_60%_at_0%_100%,rgba(245,158,11,0.22),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.08] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        style={{
          backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <span
        aria-hidden
        className="absolute -bottom-16 -end-4 text-[12rem] sm:text-[20rem] font-black leading-none text-transparent select-none pointer-events-none [-webkit-text-stroke:2px_rgba(255,255,255,0.06)]"
        dir="ltr"
      >
        {level.code}
      </span>
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-slate-50/[0.04] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <nav className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
            <Link href="/courses" className="hover:text-teal-300 transition-colors">{t('المستويات')}</Link>
            <ChevronLeft className="w-3.5 h-3.5 ltr:-scale-x-100" />
            <span className="text-teal-300" dir="ltr">{level.code}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-teal-300 to-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-teal-500/30">
              {t('المستوى {code}', { code: level.code })}
            </span>
            {badge}
          </div>

          <h1 className="text-4xl sm:text-6xl font-black leading-[1.1] tracking-tight bg-gradient-to-l from-white via-white to-teal-200 bg-clip-text text-transparent pb-1" dir="auto">
            {level.title}
          </h1>
          {level.description && (
            <p className="text-sm sm:text-lg text-slate-300 leading-relaxed max-w-2xl" dir="auto">{level.description}</p>
          )}

          {stats && (
            <div className="flex flex-wrap items-center gap-2.5">
              {stats.map(({ icon: Icon, value, label }) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] border border-white/10 backdrop-blur px-4 py-2">
                  <Icon className="w-4 h-4 text-teal-300" />
                  <span className="text-sm font-black">{value}</span>
                  <span className="text-xs font-bold text-slate-400">{label}</span>
                </span>
              ))}
            </div>
          )}

          {actions && <div className="flex flex-wrap gap-3 pt-2">{actions}</div>}
        </div>

        {side && <div className="lg:col-span-5">{side}</div>}
      </div>
    </section>
  );
}

const primaryBtn =
  'group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-300 to-amber-500 text-slate-950 text-sm sm:text-base font-black shadow-xl shadow-amber-500/30 hover:shadow-amber-400/50 transition-all hover:-translate-y-0.5';
const ghostBtn =
  'inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 backdrop-blur text-sm font-black transition-colors';

/** Big "featured lecture" card shown in the hero (first lecture). */
function FeaturedLecture({ levelId, video }) {
  return (
    <Link href={`/courses/${levelId}/watch/${video.id}`} className="group block relative">
      <div className="absolute -inset-3 rounded-[2.2rem] bg-gradient-to-br from-teal-400/40 via-transparent to-amber-400/30 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity" />
      <div className="relative rounded-[1.75rem] overflow-hidden ring-1 ring-white/15 shadow-2xl bg-slate-900">
        <div className="relative aspect-video">
          {video.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- external Bunny CDN thumbnail
            <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          ) : (
            <PlayCircle className="w-14 h-14 text-slate-600 absolute inset-0 m-auto" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <span className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
            <span className="absolute inset-0 rounded-full bg-white/60 animate-ping opacity-40" />
            <Play className="relative w-8 h-8 text-teal-700 fill-teal-700 ms-[-3px]" />
          </span>
          <div className="absolute bottom-0 inset-x-0 p-5 space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              {t('المحاضرة الأولى')}
            </span>
            <p className="text-base sm:text-lg font-black leading-snug line-clamp-2 break-words" dir="auto">{video.title}</p>
            {video.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-300">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(video.length)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
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
  const contact = useContactInfo();
  const group = groupLink(contact, level.code);

  const viewFile = (file) =>
    openFileViewer({ title: file.name, load: (onProgress) => coursesService.viewFile(level.id, file, onProgress) });

  return (
    <div className="pb-16">
      <LevelHero
        level={level}
        backdrop={first?.thumbnail_url}
        badge={
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-300/30 text-xs font-black text-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t('مفعّل لك')}
          </span>
        }
        stats={
          content && [
            { icon: ListVideo, value: videos.length, label: t('محاضرة') },
            ...(total > 0 ? [{ icon: Clock, value: formatTotal(total), label: t('مدة المحتوى') }] : []),
            ...(files.length ? [{ icon: FileText, value: files.length, label: t('ملف') }] : []),
          ]
        }
        actions={
          first && (
            <>
              <Link href={`/courses/${level.id}/watch/${first.id}`} className={primaryBtn}>
                <Play className="w-5 h-5 fill-slate-950" />
                {t('ابدأ المشاهدة')}
              </Link>
              {group && (
                <a href={group} target="_blank" rel="noopener noreferrer" className={`${ghostBtn} !bg-emerald-500/90 hover:!bg-emerald-400 !border-emerald-300/40`}>
                  <MessageCircle className="w-4 h-4 fill-white" />
                  {t('جروب الواتساب')}
                </a>
              )}
              {files.length > 0 && (
                <a href="#level-files" className={ghostBtn}>
                  <FileText className="w-4 h-4" />
                  {t('ملفات المستوى')}
                </a>
              )}
            </>
          )
        }
        side={
          !content && !error ? (
            <div className="hidden lg:block aspect-video rounded-[1.75rem] bg-white/5 ring-1 ring-white/10 animate-pulse" />
          ) : (
            first && (
              <div className="hidden lg:block">
                <FeaturedLecture levelId={level.id} video={first} />
              </div>
            )
          )
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative">
        {error ? (
          <div className="rounded-3xl border border-rose-200 bg-white shadow-xl text-center py-12 space-y-4">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-sm font-semibold text-rose-700">{error}</p>
            <button onClick={retry} className="inline-flex items-center gap-2 bg-rose-600 text-white text-xs font-black px-5 py-2.5 rounded-full hover:bg-rose-700">
              <RefreshCw className="w-4 h-4" />
              {t('إعادة المحاولة')}
            </button>
          </div>
        ) : !content ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
            {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="aspect-[4/3] rounded-3xl bg-white shadow-sm" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Lectures */}
            <section className="lg:col-span-8 rounded-[2rem] bg-white border border-slate-200/80 shadow-xl shadow-slate-900/[0.04] p-5 sm:p-7">
              <SectionTitle
                icon={ListVideo}
                title={t('محاضرات المستوى')}
                sub={`${t('{n} محاضرة', { n: videos.length })}${total > 0 ? ` • ${formatTotal(total)}` : ''}`}
              />
              {videos.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-10">{t('لم يتم رفع محاضرات لهذا المستوى بعد.')}</p>
              ) : (
                <ol className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                  {videos.map((vid, idx) => (
                    <Reveal as="li" key={vid.id} delay={(idx % 2) * 120} className="h-full [&>*]:h-full">
                      <LectureCard levelId={level.id} video={vid} index={idx} />
                    </Reveal>
                  ))}
                </ol>
              )}
            </section>

            {/* Files */}
            <aside id="level-files" className="lg:col-span-4 lg:sticky lg:top-24 scroll-mt-24 space-y-5">
              {group && <GroupCard href={group} code={level.code} />}
              <section className="rounded-[2rem] bg-white border border-slate-200/80 shadow-xl shadow-slate-900/[0.04] p-5 sm:p-6">
                <SectionTitle icon={FileText} title={t('ملفات المستوى')} sub={files.length ? t('{n} ملف • بتتفتح جوه الموقع', { n: files.length }) : t('لا توجد ملفات')} />
                {files.length > 0 && (
                  <ul className="mt-5 space-y-2 max-h-[60vh] overflow-y-auto -mx-1 px-1">
                    {files.map((file) => (
                      <li key={file.id}>
                        <FileRow file={file} onOpen={() => viewFile(file)} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

/** WhatsApp group of the level (subscribers only). */
function GroupCard({ href, code }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="dw-shine group relative block overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-6 shadow-xl shadow-emerald-600/25 hover:-translate-y-1 transition-transform"
    >
      <MessageCircle className="absolute -end-6 -bottom-6 w-32 h-32 text-white/10 -rotate-12" />
      <div className="relative flex items-center gap-4">
        <span className="relative w-14 h-14 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-lg shrink-0">
          <span className="absolute inset-0 rounded-2xl bg-white/60 animate-ping opacity-30" />
          <MessageCircle className="relative w-7 h-7 fill-emerald-600" />
        </span>
        <div className="min-w-0">
          <span className="block text-xs font-bold text-emerald-100">{t('جروب الطلاب')}</span>
          <span className="block text-lg font-black leading-snug">{t('جروب واتساب المستوى')}{' '}<span dir="ltr">{code}</span></span>
        </div>
      </div>
      <p className="relative text-sm text-emerald-50/90 mt-4 leading-relaxed">
        {t('انضم لجروب المستوى عشان تتابع كل جديد وتسأل وتتواصل مع زمايلك.')}
      </p>
      <span className="relative mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-700 text-sm font-black group-hover:gap-3 transition-all">
        {t('انضم للجروب')}
        <ChevronLeft className="w-4 h-4 ltr:-scale-x-100" />
      </span>
    </a>
  );
}

function SectionTitle({ icon: Icon, title, sub }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/25 shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">{title}</h2>
        {sub && <p className="text-xs font-bold text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function LectureCard({ levelId, video, index }) {
  return (
    <Link
      href={`/courses/${levelId}/watch/${video.id}`}
      className="group flex flex-col h-full rounded-3xl bg-slate-50 hover:bg-white border border-slate-200/70 hover:border-teal-300 hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      <span className="relative block aspect-video bg-slate-200 overflow-hidden">
        {video.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- external Bunny CDN thumbnail
          <img src={video.thumbnail_url} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <PlayCircle className="w-10 h-10 text-slate-400 absolute inset-0 m-auto" />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        <span className="absolute top-3 start-3 min-w-9 h-9 px-2 rounded-xl bg-white/95 backdrop-blur text-slate-900 text-sm font-black flex items-center justify-center shadow">
          {String(index + 1).padStart(2, '0')}
        </span>
        {video.length > 0 && (
          <span className="absolute bottom-3 end-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/75 backdrop-blur text-white text-[11px] font-black" dir="ltr">
            <Clock className="w-3 h-3" />
            {formatDuration(video.length)}
          </span>
        )}
        <span className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-xl scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
          <Play className="w-6 h-6 fill-white ms-[-2px]" />
        </span>
      </span>
      <span className="flex items-start gap-3 p-4">
        <span className="flex-1 min-w-0 text-sm sm:text-[15px] font-black text-slate-900 group-hover:text-teal-800 leading-snug line-clamp-2 break-words" dir="auto">
          {video.title}
        </span>
        <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-teal-600 group-hover:-translate-x-1 transition-all shrink-0 mt-0.5 ltr:-scale-x-100" />
      </span>
    </Link>
  );
}

const FILE_STYLES = {
  pdf: { label: 'PDF', cls: 'bg-rose-50 text-rose-600 border-rose-200' },
  doc: { label: 'WORD', cls: 'bg-blue-50 text-blue-600 border-blue-200' },
  docx: { label: 'WORD', cls: 'bg-blue-50 text-blue-600 border-blue-200' },
};

function FileRow({ file, onOpen }) {
  const ext = (file.name || '').split('.').pop().toLowerCase();
  const style = FILE_STYLES[ext] || { label: null, cls: 'bg-teal-50 text-teal-600 border-teal-200' };
  const name = style.label ? (file.name || '').replace(/\.[^.]+$/, '') : file.name;
  return (
    <button
      onClick={onOpen}
      className="group w-full flex items-center gap-3 p-3 rounded-2xl border border-transparent hover:border-teal-200 hover:bg-teal-50/60 text-start transition-colors"
    >
      <span className={`w-11 h-12 rounded-xl border flex flex-col items-center justify-center shrink-0 ${style.cls}`}>
        {style.label ? (
          <>
            <FileType2 className="w-4 h-4" />
            <span className="text-[8px] font-black mt-0.5">{style.label}</span>
          </>
        ) : (
          <FileText className="w-5 h-5" />
        )}
      </span>
      <span className="flex-1 min-w-0 text-sm font-black text-slate-800 group-hover:text-teal-800 line-clamp-2 break-words" dir="auto">{name || file.name}</span>
      <span className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-teal-600 group-hover:text-white text-slate-500 flex items-center justify-center shrink-0 transition-colors">
        <Eye className="w-4 h-4" />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Locked                                                              */
/* ------------------------------------------------------------------ */
function LockedLevel({ level }) {
  const { isAuthenticated } = useAuth();
  const { openEnrollModal, openLoginPromptModal } = useModal();
  const contact = useContactInfo();
  const price = formatPrice(level.price);
  const oldPrice = level.oldPrice && level.oldPrice > (level.price || 0) ? formatPrice(level.oldPrice) : null;

  const subscribe = () =>
    isAuthenticated
      ? openEnrollModal(level)
      : openLoginPromptModal({ type: 'course', title: level.title, price, item: level });

  return (
    <div className="pb-16">
      <LevelHero
        level={level}
        badge={
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-black text-slate-200">
            <Lock className="w-3.5 h-3.5" />
            {isAuthenticated ? t('غير مفعّل على حسابك') : t('للمشتركين')}
          </span>
        }
        actions={
          <button onClick={subscribe} className={primaryBtn}>
            {isAuthenticated ? <MessageCircle className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            {t('اشترك الآن')}
          </button>
        }
        side={
          price && (
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2.2rem] bg-gradient-to-br from-amber-400/40 via-transparent to-teal-400/30 blur-2xl" />
              <div className="relative rounded-[1.75rem] bg-white text-slate-900 p-7 sm:p-8 shadow-2xl space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-500">{t('سعر المستوى')}</span>
                  <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-black" dir="ltr">{level.code}</span>
                </div>
                <div>
                  {oldPrice && (
                    <span className="block text-base text-slate-400 line-through font-bold">
                      {Number(level.oldPrice).toLocaleString('en-US', { maximumFractionDigits: 2 })} {t('ج.م')}
                    </span>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-teal-600 tracking-tight" dir="ltr">
                      {Number(level.price).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-lg font-black text-slate-500">{t('ج.م')}</span>
                  </div>
                </div>
                <button
                  onClick={subscribe}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-950 hover:bg-teal-700 text-white text-sm font-black transition-colors"
                >
                  {isAuthenticated ? <MessageCircle className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                  {isAuthenticated ? t('اشترك في المستوى') : t('سجّل دخول للاشتراك')}
                </button>
              </div>
            </div>
          )
        }
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 relative grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white p-8 sm:p-10 text-center space-y-4 shadow-xl shadow-slate-900/[0.05]">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
            <Lock className="w-7 h-7 text-slate-950" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {isAuthenticated ? t('محاضرات المستوى {code} مقفولة', { code: level.code }) : t('محاضرات المستوى {code} متاحة للمشتركين', { code: level.code })}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
            {isAuthenticated
              ? t('اشترك في المستوى وبعد تأكيد الدفع هيتفعّل على حسابك وتقدر تشوف كل المحاضرات والملفات وتشارك في المناقشة.')
              : t('للاشتراك لازم تسجّل الدخول أو تعمل حساب جديد الأول، وبعد تأكيد الدفع هيتفعّل المستوى على حسابك.')}
          </p>
          {groupLink(contact, level.code) && (
            <p className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
              <MessageCircle className="w-4 h-4" />
              {t('بعد التفعيل هيظهرلك رابط جروب الواتساب الخاص بالمستوى')}
            </p>
          )}
        </div>
        <PaymentInfo amount={formatPriceLatin(level.price)} />
      </div>
    </div>
  );
}
