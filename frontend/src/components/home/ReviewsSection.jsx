'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useModal } from '@/context/ModalContext';
import Reveal from '@/components/common/Reveal';
import { toneFor } from '@/constants/levelTones';
import { STUDENT_FEEDBACK } from '@/constants/studentFeedback';
import {
  Star, MessageSquare, Maximize2, Award, Sparkles, Video, CheckCircle2, ChevronRight, ChevronLeft, Building2,
  GraduationCap, Stethoscope, Users, MessageCircle, FileCheck, Quote, MapPin, Languages, BadgeCheck,
} from 'lucide-react';
import { t, tRich, getLang } from '@/lib/i18n';

const AR = /[؀-ۿ]/;

// Calm accent per screenshot card (border on hover)
const SHOT_TONES = [
  'border-teal-200 hover:border-teal-400',
  'border-amber-200 hover:border-amber-400',
  'border-violet-200 hover:border-violet-400',
  'border-sky-200 hover:border-sky-400',
];

// Older chat screenshots + the session feedback messages (shown whole on WhatsApp's dark background).
const OLD_SHOTS = Array.from({ length: 74 }, (_, i) => ({ id: `r${i + 1}`, image: `/assets/reviews/review_${i + 1}.jpg`, n: i + 1 }));
const FEEDBACK_SHOTS = STUDENT_FEEDBACK.map((f, i) => ({ id: `f${f.id}`, image: f.image, n: OLD_SHOTS.length + i + 1, whole: true }));
const ALL_SHOTS = [...FEEDBACK_SHOTS, ...OLD_SHOTS];
const shotNo = (feedbackId) => FEEDBACK_SHOTS.find((s) => s.id === `f${feedbackId}`)?.n;


export default function ReviewsSection() {
  const { openLightboxModal } = useModal();
  const [activeTab, setActiveTab] = useState('feedback');
  const [swiperIndex, setSwiperIndex] = useState(0);

  const itemsPerPage = 8;
  const maxPages = Math.ceil(ALL_SHOTS.length / itemsPerPage);
  const currentScreenshots = ALL_SHOTS.slice(swiperIndex * itemsPerPage, (swiperIndex + 1) * itemsPerPage);
  const handlePrev = () => setSwiperIndex((prev) => (prev > 0 ? prev - 1 : maxPages - 1));
  const handleNext = () => setSwiperIndex((prev) => (prev < maxPages - 1 ? prev + 1 : 0));

  const alumniReviews = [
    {
      id: 1,
      name: t('محمد عبدالرحمن'),
      role: 'Senior Team Leader • Concentrix',
      comment: t('بدأت مع هير خالد من الصفر في A1، أسلوبه في تبسيط الجرامر وربطه بسوق العمل والكول سنتر خلاني أتقبل في Concentrix من أول إنترفيو بعد كورس B1، وحالياً بقيت Team Leader بفضل ربنا ثم هير خالد!'),
      rating: 5,
      icon: Building2,
      tag: t('راتب 25k+'),
    },
    {
      id: 2,
      name: t('ياسمين الشناوي'),
      role: 'Senior Customer Advisor • Vodafone DE',
      comment: t('كورس الـ Upskilling مع هير خالد كان نقطة تحول في حياتي المهنية. التدريب على مكالمات الـ Incident Management وطريقة التعامل مع الألمان كانت واقعية جداً. شكراً يا أحسن هير في مصر!'),
      rating: 5,
      icon: MessageCircle,
      tag: 'Vodafone DE',
    },
    {
      id: 3,
      name: t('د. أحمد سامي'),
      role: t('طبيب مقيم في مستشفى بمدينة شتوتغارت 🇩🇪'),
      comment: t('كنت محتاج ألماني طبي عشان معادلة الأطباء في ألمانيا، كورس الـ Medizin مع هير خالد وكتاب الأكاديمية خلوني أعدي امتحان الـ FSP من أول مرة وبكل سهولة. ربنا يباركلك في علمك يا هير.'),
      rating: 5,
      icon: Stethoscope,
      tag: t('معادلة الأطباء'),
    },
  ];

  const openShot = (image, n) => openLightboxModal(image, t('رسالة واتساب من طالب — {n}', { n }));

  const tabs = [
    { key: 'feedback', icon: Quote, label: t('آراء الطلاب ({n})', { n: STUDENT_FEEDBACK.length }) },
    { key: 'screenshots', icon: MessageSquare, label: t('معرض المحادثات ({n} صورة)', { n: ALL_SHOTS.length }) },
    { key: 'video', icon: Video, label: t('فيديو النجاح وتجارب خريجي الكورسات') },
    { key: 'testimonials', icon: Building2, label: t('تجارب العمل بـ Concentrix & Vodafone') },
  ];

  return (
    <section id="reviews" className="py-20 bg-[#f0fdfa] border-t border-slate-200 relative z-10 overflow-hidden">
      {/* Background Glow Highlights */}
      <div className="absolute top-10 start-10 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 end-10 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative">
        {/* Top Header Section */}
        <Reveal className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 glass-pill px-5 py-2 rounded-full text-xs font-bold text-amber-800 border border-amber-400/50 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>{t('معرض الآراء والتجارب الموثقة 100%')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0f172a] leading-tight">
            {tRich('قصص نجاح وتجارب <b>طلاب وأطباء وخريجي هير خالد</b>', { b: (s) => <span className="text-gradient-cyan">{s}</span> })}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t('أكثر من 15,000 طالب حققوا أهدافهم في العمل بشركات الكول سنتر العالمية والتأهيل للسفر والامتحانات الرسمية.')}
          </p>
        </Reveal>

        {/* High-Trust Stats Highlight Bar — one calm colour each */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: '+15,000', label: t('طالب تم تدريبهم'), icon: Users, cls: 'from-teal-50 border-teal-200/70 hover:border-teal-300 hover:shadow-teal-500/15', num: 'text-teal-600', tile: 'bg-teal-100 text-teal-600' },
            { value: '98.4%', label: t('نسبة نجاح جوته & تلـك'), icon: Award, cls: 'from-amber-50 border-amber-200/70 hover:border-amber-300 hover:shadow-amber-500/15', num: 'text-amber-600', tile: 'bg-amber-100 text-amber-600' },
            { value: `${ALL_SHOTS.length}+`, label: t('شات موثق بالصور'), icon: MessageSquare, cls: 'from-violet-50 border-violet-200/70 hover:border-violet-300 hover:shadow-violet-500/15', num: 'text-violet-600', tile: 'bg-violet-100 text-violet-600' },
            { value: '+10', label: t('سنوات خبرة بالمجال'), icon: GraduationCap, cls: 'from-sky-50 border-sky-200/70 hover:border-sky-300 hover:shadow-sky-500/15', num: 'text-sky-600', tile: 'bg-sky-100 text-sky-600' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal
                key={s.label}
                from="zoom"
                delay={i * 120}
                className={`group bg-gradient-to-b ${s.cls} to-white p-5 rounded-3xl border shadow-sm hover:shadow-xl hover:-translate-y-1.5 space-y-2`}
              >
                <span className={`dw-wiggle mx-auto w-10 h-10 rounded-2xl flex items-center justify-center ${s.tile}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className={`block font-black text-2xl font-mono ${s.num}`} dir="ltr">{s.value}</span>
                <span className="text-xs text-slate-700 font-bold">{s.label}</span>
              </Reveal>
            );
          })}
        </div>

        {/* Tabs */}
        <Reveal className="flex flex-wrap items-center justify-center gap-2 pt-2" role="tablist">
          {tabs.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all ${
                activeTab === key ? 'glass-pill-active shadow-md' : 'glass-pill'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </Reveal>

        {/* Tab: Student feedback */}
        {activeTab === 'feedback' && <FeedbackWall onShot={openShot} />}

        {/* Tab: Chat screenshots */}
        {activeTab === 'screenshots' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 border border-teal-300 px-3.5 py-1 rounded-full text-xs font-bold mb-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>{t('معرض المحادثات ({n} صورة)', { n: ALL_SHOTS.length })}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0f172a]">{t('تصفح آراء الطلاب الحقيقية من شات وواتساب هير خالد')}</h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">{t('اضغط على أي صورة لتكبيرها وقراءة التفاصيل بوضوح كامل.')}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-4 py-2 rounded-full text-xs font-mono font-black shadow-sm">
                  {t('صفحة {p} من {n}', { p: swiperIndex + 1, n: maxPages })}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={handlePrev} className="w-11 h-11 rounded-full bg-slate-100 text-slate-700 border border-slate-300 flex items-center justify-center hover:bg-teal-600 hover:text-white hover:scale-110 transition-all shadow-sm" title={t('السابق')}>
                    <ChevronRight className="w-5 h-5 ltr:-scale-x-100" />
                  </button>
                  <button onClick={handleNext} className="w-11 h-11 rounded-full bg-slate-100 text-slate-700 border border-slate-300 flex items-center justify-center hover:bg-teal-600 hover:text-white hover:scale-110 transition-all shadow-sm" title={t('التالي')}>
                    <ChevronLeft className="w-5 h-5 ltr:-scale-x-100" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {currentScreenshots.map((item, n) => (
                <Reveal
                  key={item.id}
                  delay={n * 70}
                  onClick={() => openShot(item.image, item.n)}
                  className={`dw-shine group relative rounded-2xl overflow-hidden border-2 aspect-[3/4] cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-1.5 ${item.whole ? 'bg-[#0b141a]' : 'bg-slate-50'} ${SHOT_TONES[n % SHOT_TONES.length]}`}
                >
                  <Image
                    src={item.image}
                    alt={t('رسالة واتساب من طالب — {n}', { n: item.n })}
                    fill
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 46vw"
                    className={`${item.whole ? 'object-contain p-2' : 'object-cover'} group-hover:scale-105 transition-transform duration-500`}
                  />
                  <div className="absolute top-3 start-3 bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-400/40" dir="ltr">
                    #{item.n}
                  </div>
                  <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="glass-pill-gold px-4 py-2.5 rounded-full text-xs font-black flex items-center gap-2 shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                      <Maximize2 className="w-4 h-4 text-slate-900" />
                      <span>{t('تكبير وتصفح المحادثة 🔍')}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-xs text-slate-500 font-bold me-2">{t('انتقل لصفحة:')}</span>
              {Array.from({ length: maxPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setSwiperIndex(i)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${swiperIndex === i ? 'bg-teal-600 text-white shadow-md scale-110' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Video */}
        {activeTab === 'video' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-amber-400/60 shadow-2xl space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="relative rounded-3xl overflow-hidden bg-slate-900 border-4 border-teal-500/30 shadow-2xl group">
                  <video controls playsInline preload="metadata" poster="/assets/images/video_poster.jpg" className="w-full aspect-video object-cover rounded-2xl">
                    <source src="/assets/videos/video_reviews.mp4" type="video/mp4" />
                    {t('متصفحك لا يدعم تشغيل الفيديو المباشر.')}
                  </video>
                </div>
              </div>
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 text-xs font-extrabold text-amber-800 border border-amber-400/50">
                  <Video className="w-4 h-4 text-amber-600" />
                  <span>{t('تجارب حية ومقابلات فيديو')}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0f172a] leading-tight">{t('قصص نجاح من قلب المحاضرات والمقابلات')}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('استمع مباشرة لخريجي أكاديمية دويتشه فيلت وكيف ساعدهم هير خالد في اجتياز المقابلات الصعبة للعمل في Concentrix و Vodafone DE وتحقيق طلاقة التحدث بالألماني.')}
                </p>
                <ul className="space-y-3 text-xs text-teal-950 font-bold">
                  <li className="flex items-center gap-2.5 p-2.5 rounded-xl bg-teal-50 border border-teal-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t('تأهيل واجتياز مقابلات الـ HR & Technical برواتب مجزية')}</span>
                  </li>
                  <li className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{t('التحضير المباشر لامتحانات معهد جوته Goethe B1 & B2')}</span>
                  </li>
                  <li className="flex items-center gap-2.5 p-2.5 rounded-xl bg-teal-50 border border-teal-200">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{t('كسر حاجز الخوف والطلاقة في التحدث مع الألمان')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Corporate alumni */}
        {activeTab === 'testimonials' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
            {alumniReviews.map((rev) => {
              const IconComponent = rev.icon;
              return (
                <div key={rev.id} className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl flex flex-col space-y-4 border border-slate-200 transition-all transform hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-900 font-black flex items-center justify-center shadow-sm border border-teal-300">
                      <IconComponent className="w-6 h-6 text-teal-700" />
                    </div>
                    <div>
                      <h4 className="text-[#0f172a] font-extrabold text-base">{rev.name}</h4>
                      <span className="text-xs text-amber-700 font-bold block">{rev.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-y border-slate-100 py-2">
                    <span className="text-[11px] font-bold bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-amber-200">{rev.tag}</span>
                    <Stars />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-slate-50 p-4 rounded-2xl border border-slate-200 font-medium">&ldquo;{rev.comment}&rdquo;</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Student feedback wall                                               */
/* ------------------------------------------------------------------ */

function FeedbackWall({ onShot }) {
  const featured = STUDENT_FEEDBACK.filter((f) => f.featured);
  const rest = STUDENT_FEEDBACK.filter((f) => !f.featured);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h3 className="text-2xl sm:text-3xl font-black text-[#0f172a]">{t('رسائل الطلاب بعد السيشنات')}</h3>
        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          {t('كلام الطلاب بنفسهم بعد المحاضرات، ومع كل رأي صورة الرسالة زي ما وصلت على واتساب.')}
        </p>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-teal-200 text-teal-800 text-xs font-black shadow-sm">
          <MessageCircle className="w-3.5 h-3.5" /> {t('{n} رسالة من الطلاب', { n: STUDENT_FEEDBACK.length })}
        </span>
      </div>

      {/* Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <SpotlightCard item={featured[0]} onShot={onShot} />
        <div className="lg:col-span-2 grid gap-5">
          {featured.slice(1).map((f) => <FeedbackCard key={f.id} item={f} onShot={onShot} highlight />)}
        </div>
      </div>

      {/* Wall — every message */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
        {rest.map((f, i) => (
          <div key={f.id} className="break-inside-avoid mb-5 dw-card-enter" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
            <FeedbackCard item={f} onShot={onShot} />
          </div>
        ))}
      </div>
    </div>
  );
}

const isArabic = (text) => AR.test(text);
const translated = (text) => isArabic(text) && getLang() !== 'ar';

function Stars({ className = 'w-4 h-4' }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400" aria-label="5/5">
      {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`${className} fill-current`} />)}
    </span>
  );
}

function WhoLine({ item, dark }) {
  const tone = item.level ? toneFor(item.level) : null;
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-white bg-gradient-to-br ${tone?.badge || 'from-teal-400 to-[#0e2c4e]'} shadow-md`}>
        <GraduationCap className="w-5 h-5" />
      </span>
      <div className="min-w-0">
        <p className={`text-sm font-black truncate ${dark ? 'text-white' : 'text-[#0e2c4e]'}`}>{t('طالب في الأكاديمية')}</p>
        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
          {item.level && (
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black text-white bg-gradient-to-br ${tone?.badge}`} dir="ltr">{item.level}</span>
          )}
          {item.place === 'mansoura' && (
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${dark ? 'text-teal-200' : 'text-slate-500'}`}>
              <MapPin className="w-3 h-3" /> {t('أوفلاين — فرع المنصورة')}
            </span>
          )}
          {!item.level && !item.place && (
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${dark ? 'text-teal-200' : 'text-emerald-600'}`}>
              <BadgeCheck className="w-3 h-3" /> {t('رسالة حقيقية على واتساب')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ShotButton({ item, onShot, dark }) {
  return (
    <button
      type="button"
      onClick={() => onShot(item.image, shotNo(item.id))}
      className={`shrink-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-[11px] font-black transition-colors ${
        dark ? 'bg-white/10 hover:bg-white/20 border border-white/15 text-white' : 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700'
      }`}
    >
      <MessageCircle className="w-3.5 h-3.5" /> {t('الرسالة الأصلية')}
    </button>
  );
}

function FeedbackText({ item, className }) {
  const ar = isArabic(item.text);
  return (
    <>
      <p className={className} dir={ar ? undefined : 'ltr'} lang={ar ? undefined : 'de'}>{t(item.text)}</p>
      {translated(item.text) && (
        <p className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
          <Languages className="w-3 h-3" /> {t('مترجمة من العربية')}
        </p>
      )}
    </>
  );
}

function SpotlightCard({ item, onShot }) {
  return (
    <Reveal className="lg:col-span-3 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#07192e] via-[#0c2847] to-[#0e3b68] text-white p-7 sm:p-9 shadow-2xl shadow-[#07192e]/25 flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_100%_0%,rgba(20,184,166,0.35),transparent_60%),radial-gradient(ellipse_60%_80%_at_0%_100%,rgba(245,158,11,0.25),transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 flex h-1.5" dir="ltr">
        <span className="flex-1 bg-slate-950" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
      </div>
      <Quote className="absolute -top-2 end-6 w-40 h-40 text-white/[0.06] pointer-events-none" />
      <div className="relative flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-300 text-xs font-black">
          <Sparkles className="w-3.5 h-3.5" /> {t('أعلى تقييم')}
        </span>
        {item.score && (
          <span className="px-4 py-1.5 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 text-2xl font-black shadow-lg shadow-amber-500/30" dir="ltr">{item.score}</span>
        )}
      </div>
      <div className="relative flex-1 mt-6 flex flex-col justify-center gap-2">
        <FeedbackText item={item} className="text-base sm:text-lg leading-loose font-semibold text-slate-100" />
      </div>
      <div className="relative mt-7 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <WhoLine item={item} dark />
        <div className="flex items-center gap-3">
          <Stars />
          <ShotButton item={item} onShot={onShot} dark />
        </div>
      </div>
    </Reveal>
  );
}

function FeedbackCard({ item, onShot, highlight }) {
  const tone = item.level ? toneFor(item.level) : null;
  return (
    <article
      className={`group relative overflow-hidden rounded-3xl bg-white p-5 sm:p-6 border shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 ${
        highlight ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-200/80'
      }`}
    >
      <span className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${tone?.badge || (highlight ? 'from-amber-300 to-orange-400' : 'from-teal-300 to-sky-400')} opacity-80`} />
      <div className="flex items-center justify-between">
        <span className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform">
          <Quote className="w-5 h-5" />
        </span>
        <Stars className="w-3.5 h-3.5" />
      </div>
      <div className="space-y-1.5">
        <FeedbackText item={item} className="text-sm sm:text-[15px] text-slate-700 leading-relaxed font-medium" />
      </div>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <WhoLine item={item} />
        <ShotButton item={item} onShot={onShot} />
      </div>
    </article>
  );
}
