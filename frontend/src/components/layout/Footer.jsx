'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { ACADEMY_INFO } from '@/constants/siteContent';
import { useContactInfo, whatsappHref, primaryPhone } from '@/lib/contactInfo';
import { track } from '@/lib/analytics';
import { useBranches } from '@/hooks/useBranches';
import { branchTone } from '@/constants/branchTones';
import Reveal from '@/components/common/Reveal';
import {
  Phone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Mail,
  Sparkles,
  ExternalLink,
  X,
  Check,
  Copy,
  ChevronLeft,
  Globe2,
  Award,
  Lock
} from 'lucide-react';

import { t } from '@/lib/i18n';
// Each link / branch gets its own accent colour.
const QUICK_LINKS = [
  { href: '/#hero', label: 'الرئيسية', tone: 'text-teal-400 group-hover:bg-teal-500/20' },
  { href: '/courses', label: 'الكورسات والمستويات', tone: 'text-sky-400 group-hover:bg-sky-500/20' },
  { href: '/books', label: 'متجر كتب المنهج', tone: 'text-amber-400 group-hover:bg-amber-500/20' },
  { href: '/#branches', label: 'الفروع والمقرات', tone: 'text-rose-400 group-hover:bg-rose-500/20' },
  { href: '/#about-teacher', label: 'عن هير خالد الحلواني', tone: 'text-violet-400 group-hover:bg-violet-500/20' },
  { href: '/#reviews', label: 'آراء وتجارب الطلاب', tone: 'text-emerald-400 group-hover:bg-emerald-500/20' },
];

function FlagStripe({ className = '' }) {
  return (
    <span className={`flex overflow-hidden ${className}`}>
      <span className="flex-1 bg-slate-950" /><span className="flex-1 bg-red-600" /><span className="flex-1 bg-amber-400" />
    </span>
  );
}

export default function Footer() {
  const { openAdminDashboard } = useModal();
  const { isAdmin } = useAuth();
  const branches = useBranches();
  const contact = useContactInfo();
  const phone = primaryPhone(contact);
  const [devModalOpen, setDevModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(null);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const devWhatsapp =
    'https://wa.me/201055673184?text=' +
    encodeURIComponent(t('السلام عليكم مهندس إبراهيم سمير، أتواصل معك عبر موقع دويتشه فيلت للألمانية'));
  const devEmail =
    'mailto:01055673184hs@gmail.com?subject=' +
    encodeURIComponent(t('تواصل واستفسار برمجي - Eng. Ibrahim Samir'));

  return (
    <footer className="bg-[#071427] text-slate-300 pt-16 pb-10 relative z-10 overflow-hidden">
      <FlagStripe className="absolute top-0 inset-x-0 h-1.5" />

      {/* Ambient light + grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_85%_0%,rgba(20,184,166,0.18),transparent_60%),radial-gradient(ellipse_50%_50%_at_0%_100%,rgba(245,158,11,0.12),transparent_60%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-14">

        {/* Contact / admin CTA band */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-[#0e2c4e] via-[#0f3a5c] to-teal-900 border border-white/10 p-6 sm:p-8 shadow-2xl">
          <div className="absolute -top-20 -end-10 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {isAdmin ? (
              <>
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t('جلسة المشرف نشطة')}</span>
                  </span>
                  <h5 className="text-white font-black text-2xl">{t('لوحة تحكم الأدمن')}</h5>
                  <p className="text-sm text-slate-300">{t('إدارة المستويات الدراسية، الكتب، ومتابعة حجوزات الطلاب وقاعدة البيانات.')}</p>
                </div>
                <button
                  onClick={openAdminDashboard}
                  className="shrink-0 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-300 to-amber-500 text-[#0e2c4e] font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 hover:-translate-y-0.5 transition-transform cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>{t('دخول لوحة التحكم المباشرة')}</span>
                </button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold bg-white/10 text-amber-300 border border-white/15">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{t('تواصل معنا')}</span>
                  </span>
                  <h5 className="text-white font-black text-2xl sm:text-3xl">{t('تواصل معنا فوراً')}</h5>
                  <p className="text-sm text-slate-300">{t('للاستفسار عن الكورسات والاشتراك وطلب الكتب.')}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <a
                    onClick={() => track('contact', { method: 'whatsapp', location: 'footer' })}
                    href={whatsappHref(contact, t('السلام عليكم، أود الاستفسار عن تفاصيل كورسات الألمانية والاشتراك'))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-7 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 hover:-translate-y-0.5 transition-all"
                  >
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>{t('محادثة واتساب سريعة')}</span>
                  </a>
                  <a
                    onClick={() => track('contact', { method: 'phone', location: 'footer' })}
                    href={`tel:${phone}`}
                    className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-black text-sm flex items-center justify-center gap-2.5 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-amber-300" />
                    <span dir="ltr">{phone}</span>
                  </a>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">

          {/* Brand */}
          <div className="lg:col-span-5 space-y-5">
            <Image src="/assets/images/logo-full-white.png" alt="Deutsche Welt" width={954} height={622} sizes="200px" className="h-24 w-auto" />
            <p className="text-sm leading-relaxed text-slate-400 max-w-md font-medium">
              {t(ACADEMY_INFO.subtitle)} — {t('منصتك الأولى والمتكاملة لاجتياز امتحانات جوته وتيلك وتأهيل الكول سنتر وسوق العمل الطبي والمهني في ألمانيا.')}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-white/[0.05] text-slate-300 border border-white/10">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('شهادات معتمدة دولياً')}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-white/[0.05] text-slate-300 border border-white/10">
                <Globe2 className="w-3.5 h-3.5 text-teal-400" />
                <span>{branches.length}{' '}{t('فروع + أونلاين')}</span>
              </span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              {[
                { href: whatsappHref(contact), title: t('محادثة واتساب الأكاديمية'), icon: MessageCircle, cls: 'hover:bg-emerald-500 hover:border-emerald-400', external: true, fill: true },
                { href: `tel:${phone}`, title: t('الاتصال الهاتفي المباشر'), icon: Phone, cls: 'hover:bg-teal-500 hover:border-teal-400' },
                { href: '/#branches', title: t('مواقع الفروع على الخريطة'), icon: MapPin, cls: 'hover:bg-amber-500 hover:border-amber-400' },
              ].map(({ href, title, icon: Icon, cls, external, fill }) => (
                <a
                  key={title}
                  href={href}
                  title={title}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={`w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-slate-200 hover:text-white hover:-translate-y-1 transition-all duration-300 ${cls}`}
                >
                  <Icon className={`w-5 h-5 ${fill ? 'fill-current' : ''}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3 space-y-5">
            <h4 className="text-white font-black text-lg flex items-center gap-3">
              <FlagStripe className="h-5 w-1.5 flex-col rounded-full" />
              <span>{t('الروابط السريعة')}</span>
            </h4>
            <ul className="space-y-1 text-sm font-semibold text-slate-400">
              {QUICK_LINKS.map((l, i) => (
                <Reveal as="li" key={l.href} from="left" delay={i * 70}>
                  <Link href={l.href} className="group flex items-center gap-2 py-1.5 hover:text-white hover:-translate-x-1 transition-all">
                    <span className={`w-6 h-6 rounded-lg bg-white/[0.04] ${l.tone} flex items-center justify-center transition-colors`}>
                      <ChevronLeft className="w-3.5 h-3.5 ltr:-scale-x-100" />
                    </span>
                    <span>{t(l.label)}</span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Branches */}
          <div className="lg:col-span-4 space-y-5">
            <h4 className="text-white font-black text-lg flex items-center gap-3">
              <FlagStripe className="h-5 w-1.5 flex-col rounded-full" />
              <span>{t('فروعنا بالحضور')}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {branches.map((b, i) => (
                <Reveal
                  as="a"
                  key={b.id}
                  from="left"
                  delay={i * 90}
                  href={b.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] ${branchTone(b.color, i).footer.split(' ').pop()}`}
                >
                  <span className={`w-10 h-10 rounded-xl ${branchTone(b.color, i).footer} group-hover:text-[#0e2c4e] flex items-center justify-center shrink-0 transition-colors`}>
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center justify-between gap-2">
                      <strong className="text-sm font-extrabold text-white">{t(b.name)}</strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 shrink-0">{t(b.city)}</span>
                    </span>
                    <span className="block text-[11px] text-slate-400 truncate mt-0.5">{t(b.address)}</span>
                  </span>
                </Reveal>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Eng. Ibrahim Samir Developer Badge */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-6 relative">

          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-start">
            <p className="font-semibold">
              © {new Date().getFullYear()} Deutsche Welt Akademie — {t('هير خالد الحلواني. جميع الحقوق محفوظة.')}
            </p>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-[11px] text-teal-400/90 font-bold flex items-center gap-1">
              <span>{t('🇩🇪 أعلى معايير الجودة والتعليم الأكاديمي 🇪🇬')}</span>
            </span>
          </div>

          {/* Premium Developer Badge — Eng. Ibrahim Samir */}
          <div className="relative group">
            <button
              onClick={() => setDevModalOpen(true)}
              className="relative p-0.5 rounded-full bg-gradient-to-r from-amber-400 via-teal-400 to-amber-500 shadow-xl hover:shadow-amber-500/25 transition-all transform hover:scale-105 cursor-pointer"
            >
              <div className="bg-[#0b1329] group-hover:bg-[#111c3d] px-5 py-2.5 rounded-full flex items-center gap-3 transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-md">
                  {t('إس')}
                </div>
                <div className="text-start">
                  <span className="text-[10px] text-teal-400 font-extrabold block leading-tight">{t('تطوير وتصميم هندسي')}</span>
                  <span className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                    Eng. Ibrahim Samir {t('(المهندس إبراهيم سمير)')}
                  </span>
                </div>
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse ms-1" />
              </div>
            </button>

            {/* Hover Popover Card for Instant Access */}
            <div className="hidden group-hover:flex absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-80 bg-slate-900/98 backdrop-blur-2xl border-2 border-amber-400/70 rounded-3xl p-5 shadow-2xl flex-col gap-3 z-30 animate-fadeIn pointer-events-auto">
              <div className="text-center pb-3 border-b border-slate-800">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-md mb-2">
                  {t('إس')}
                </div>
                <span className="text-[10px] text-teal-400 font-black tracking-wider uppercase block">Full-Stack Software Engineer</span>
                <h5 className="text-white font-black text-base">{t('المهندس إبراهيم سمير')}</h5>
              </div>

              <a
                href={devWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all shadow-md"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 fill-current text-emerald-200" />
                  <span>{t('واتساب:')}{' '}<span dir="ltr">01055673184</span></span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-90" />
              </a>

              <a
                href={devEmail}
                className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-black transition-all shadow-md"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-cyan-200" />
                  <span className="truncate max-w-[160px]" dir="ltr">01055673184hs@gmail.com</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-90" />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Dev Contact Modal (For Click / Mobile / Full View) */}
      {devModalOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setDevModalOpen(false); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
        >
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6">
            <button
              onClick={() => setDevModalOpen(false)}
              className="absolute top-4 end-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 pt-2">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 font-black text-3xl border-2 border-amber-300">
                {t('إس')}
              </div>
              <span className="inline-block text-[11px] text-teal-300 font-extrabold bg-teal-950/90 px-4 py-1 rounded-full border border-teal-500/40">
                {t('تطوير وتصميم موقع دويتشه فيلت الألمانية')}
              </span>
              <h3 className="text-2xl font-black text-white">{t('المهندس إبراهيم سمير')}</h3>
              <p className="text-xs text-slate-400 font-mono">Full-Stack Software Engineer</p>
            </div>

            <div className="space-y-3.5 pt-2">
              {/* WhatsApp Button */}
              <a
                href={devWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all transform hover:scale-[1.02] border border-emerald-400/40"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 fill-current shrink-0 text-emerald-200" />
                  <div className="text-start">
                    <span className="block font-black text-sm">{t('محادثة واتساب مباشرة 💬')}</span>
                    <span className="text-xs font-mono text-emerald-200" dir="ltr">01055673184</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 shrink-0 opacity-90" />
              </a>

              {/* Email Button */}
              <a
                href={devEmail}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-600/30 transition-all transform hover:scale-[1.02] border border-cyan-400/40"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 shrink-0 text-cyan-200" />
                  <div className="text-start">
                    <span className="block font-black text-sm">{t('إرسال إيميل رسمي ✉️')}</span>
                    <span className="text-xs font-mono text-cyan-200" dir="ltr">01055673184hs@gmail.com</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 shrink-0 opacity-90" />
              </a>
            </div>

            {/* Quick Copy Info Bar */}
            <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2.5 text-xs">
              <button
                onClick={() => handleCopy('01055673184', 'phone')}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 flex items-center justify-center gap-1.5 transition-colors font-bold cursor-pointer"
              >
                {copiedText === 'phone' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-extrabold">{t('تم نسخ الرقم')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>{t('نسخ الرقم')}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleCopy('01055673184hs@gmail.com', 'email')}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 flex items-center justify-center gap-1.5 transition-colors font-bold cursor-pointer"
              >
                {copiedText === 'email' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-extrabold">{t('تم نسخ الإيميل')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span>{t('نسخ الإيميل')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
