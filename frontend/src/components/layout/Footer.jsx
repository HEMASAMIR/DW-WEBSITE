'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { ACADEMY_INFO, BRANCHES_DATA, whatsappLink } from '@/constants/siteContent';
import {
  GraduationCap,
  Phone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Code2,
  Mail,
  Sparkles,
  ExternalLink,
  X,
  Check,
  Copy,
  ChevronLeft,
  Globe2,
  Award,
  BookOpen,
  Building2,
  UserCheck,
  Star,
  Clock,
  Flame,
  Send,
  Lock
} from 'lucide-react';

export default function Footer() {
  const { openAdminDashboard } = useModal();
  const { isAdmin } = useAuth();
  const [devModalOpen, setDevModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(null);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const devWhatsapp =
    'https://wa.me/201055673184?text=' +
    encodeURIComponent('السلام عليكم مهندس إبراهيم سمير، أتواصل معك عبر موقع دويتشه فيلت للألمانية');
  const devEmail =
    'mailto:01055673184hs@gmail.com?subject=' +
    encodeURIComponent('تواصل واستفسار برمجي - Eng. Ibrahim Samir');

  return (
    <footer className="bg-[#050a15] text-slate-300 pt-20 pb-12 relative z-10 overflow-hidden border-t border-slate-800">
      
      {/* Top Luminous Neon Gradient Border */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-teal-500 via-amber-400 to-transparent shadow-[0_0_20px_rgba(13,148,136,0.8)]" />

      {/* Ambient Lighting Orbs */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-gradient-to-b from-teal-500/10 via-emerald-500/5 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[350px] bg-gradient-to-t from-amber-500/10 via-amber-600/5 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-16">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Brand Info & Identity (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Brand Logo & Tag */}
            <div className="flex items-center gap-3.5">
              <div className="relative group">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-xl shadow-teal-500/30 group-hover:scale-105 transition-transform duration-300 p-2.5">
                  <GraduationCap className="w-7 h-7 stroke-[2.5]" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#050a15] animate-ping" />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#050a15]" />
              </div>
              <div>
                <span className="font-black text-2xl sm:text-3xl text-white tracking-tight block">
                  Deutsche <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">Welt</span>
                </span>
                <span className="text-xs text-teal-400 font-extrabold flex items-center gap-1.5 mt-0.5">
                  <span>الأستاذ خالد • أكاديمية الألمانية</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-950/80 border border-teal-500/40 text-teal-300 font-mono">2026</span>
                </span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400 max-w-sm font-medium">
              {ACADEMY_INFO.subtitle} — منصتك الأولى والمتكاملة لاجتياز امتحانات جوته وتيلك وتأهيل الكول سنتر وسوق العمل الطبي والمهني في ألمانيا.
            </p>

            {/* Quick Trust Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-800/90 text-slate-300 border border-slate-700/80">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>شهادات معتمدة دولياً</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-800/90 text-slate-300 border border-slate-700/80">
                <Globe2 className="w-3.5 h-3.5 text-teal-400" />
                <span>٤ فروع + أونلاين Live</span>
              </span>
            </div>

            {/* Interactive Social Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                title="محادثة واتساب الأكاديمية"
                className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600/30 to-teal-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-400 transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 hover:scale-110"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
              </a>
              <a
                href={`tel:${ACADEMY_INFO.phonePrimary}`}
                title="الاتصال الهاتفي المباشر"
                className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600/30 to-sky-600/20 border border-teal-500/40 flex items-center justify-center text-teal-400 hover:bg-teal-600 hover:text-white hover:border-teal-400 transition-all duration-300 shadow-lg hover:shadow-teal-500/30 hover:scale-110"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href="#branches"
                title="مواقع الفروع على الخريطة"
                className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600/30 to-amber-700/20 border border-amber-500/40 flex items-center justify-center text-amber-400 hover:bg-amber-600 hover:text-slate-950 hover:border-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-500/30 hover:scale-110"
              >
                <MapPin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-black text-base flex items-center gap-2 border-r-4 border-teal-400 pr-3">
              <span>الروابط السريعة</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-semibold text-slate-400">
              <li>
                <Link href="/#hero" className="group flex items-center gap-2 py-1 hover:text-teal-300 transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5 text-teal-400 group-hover:-translate-x-1 transition-transform" />
                  <span>الرئيسية</span>
                </Link>
              </li>
              <li>
                <Link href="/#online-courses" className="group flex items-center gap-2 py-1 hover:text-teal-300 transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5 text-teal-400 group-hover:-translate-x-1 transition-transform" />
                  <span>الكورسات والمستويات</span>
                </Link>
              </li>
              <li>
                <Link href="/#books-store" className="group flex items-center gap-2 py-1 hover:text-teal-300 transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5 text-teal-400 group-hover:-translate-x-1 transition-transform" />
                  <span>متجر كتب المنهج</span>
                </Link>
              </li>
              <li>
                <Link href="/#branches" className="group flex items-center gap-2 py-1 hover:text-teal-300 transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5 text-teal-400 group-hover:-translate-x-1 transition-transform" />
                  <span>الفروع والمقرات</span>
                </Link>
              </li>
              <li>
                <Link href="/#about-teacher" className="group flex items-center gap-2 py-1 hover:text-teal-300 transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5 text-teal-400 group-hover:-translate-x-1 transition-transform" />
                  <span>عن هير خالد الحلواني</span>
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="group flex items-center gap-2 py-1 hover:text-teal-300 transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5 text-teal-400 group-hover:-translate-x-1 transition-transform" />
                  <span>آراء وتجارب الطلاب</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Branches Contact (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-black text-base flex items-center gap-2 border-r-4 border-amber-400 pr-3">
              <span>فروعنا بالحضور</span>
            </h4>
            
            <div className="space-y-2.5">
              {BRANCHES_DATA.map((b) => (
                <a
                  key={b.id}
                  href={b.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-amber-400/40 transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <strong className="text-xs sm:text-sm font-extrabold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{b.name}</span>
                    </strong>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 group-hover:bg-amber-500/20 group-hover:text-amber-300 transition-colors shrink-0">
                      {b.city}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 pr-5">
                    {b.address}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Quick Contact Box (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <div className="relative rounded-3xl p-6 bg-gradient-to-br from-slate-900/95 via-slate-850 to-slate-900/95 backdrop-blur-2xl border-2 border-amber-400/40 shadow-2xl shadow-amber-500/10 flex flex-col justify-between space-y-5 hover:border-amber-400/70 transition-all group overflow-hidden">
              
              {/* Top ambient glow inside the card */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />

              {isAdmin ? (
                <>
                  <div className="space-y-1.5 relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>جلسة المشرف نشطة</span>
                    </span>
                    <h5 className="text-white font-black text-lg pt-1">لوحة تحكم الأدمن 👑</h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      إدارة المستويات الدراسية، الكتب، ومتابعة حجوزات الطلاب وقاعدة البيانات.
                    </p>
                  </div>

                  <button
                    onClick={openAdminDashboard}
                    className="w-full relative py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-teal-500/20 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-slate-950" />
                    <span>دخول لوحة التحكم المباشرة</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-2 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/15 text-amber-300 border border-amber-400/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>خدمة العملاء متواجدون الآن</span>
                    </div>

                    <h5 className="text-white font-black text-lg">تواصل معنا فوراً 💬</h5>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      للاستفسار عن مواعيد الكورسات، حجز المقاعد، أو طلب شحن كتب المنهج المطبوعة.
                    </p>
                  </div>

                  {/* Primary WhatsApp Button with Light Sweep Effect */}
                  <a
                    href={whatsappLink('السلام عليكم، أود الاستفسار عن تفاصيل كورسات الألمانية والاشتراك')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full relative group/btn py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/20 transition-all transform hover:scale-[1.02] active:scale-95 overflow-hidden"
                  >
                    {/* Sweep Light Animation */}
                    <span className="absolute inset-0 w-1/2 h-full bg-white/30 skew-x-12 -translate-x-full group-hover/btn:translate-x-[300%] transition-transform duration-1000 ease-in-out" />
                    
                    <MessageCircle className="w-4 h-4 fill-slate-950" />
                    <span>محادثة واتساب سريعة</span>
                  </a>

                  {/* Quick Phone Call Sub-Action */}
                  <a
                    href={`tel:${ACADEMY_INFO.phonePrimary}`}
                    className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 border border-slate-700/80 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-400" />
                    <span>أو اتصل بنا: <span dir="ltr">{ACADEMY_INFO.phonePrimary}</span></span>
                  </a>
                </>
              )}

            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Eng. Ibrahim Samir Developer Badge */}
        <div className="pt-8 border-t border-slate-800/90 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-6 relative">
          
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-right">
            <p className="font-semibold">
              © {new Date().getFullYear()} Deutsche Welt Akademie — الأستاذ خالد الحلواني. جميع الحقوق محفوظة.
            </p>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-[11px] text-teal-400/90 font-bold flex items-center gap-1">
              <span>🇩🇪 أعلى معايير الجودة والتعليم الأكاديمي 🇪🇬</span>
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
                  إس
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-teal-400 font-extrabold block leading-tight">تطوير وتصميم هندسي</span>
                  <span className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                    Eng. Ibrahim Samir (المهندس إبراهيم سمير)
                  </span>
                </div>
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse mr-1" />
              </div>
            </button>

            {/* Hover Popover Card for Instant Access */}
            <div className="hidden group-hover:flex absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-80 bg-slate-900/98 backdrop-blur-2xl border-2 border-amber-400/70 rounded-3xl p-5 shadow-2xl flex-col gap-3 z-30 animate-fadeIn pointer-events-auto">
              <div className="text-center pb-3 border-b border-slate-800">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-md mb-2">
                  إس
                </div>
                <span className="text-[10px] text-teal-400 font-black tracking-wider uppercase block">Full-Stack Software Engineer</span>
                <h5 className="text-white font-black text-base">المهندس إبراهيم سمير</h5>
              </div>

              <a
                href={devWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all shadow-md"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 fill-current text-emerald-200" />
                  <span>واتساب: <span dir="ltr">01055673184</span></span>
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
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 pt-2">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 font-black text-3xl border-2 border-amber-300">
                إس
              </div>
              <span className="inline-block text-[11px] text-teal-300 font-extrabold bg-teal-950/90 px-4 py-1 rounded-full border border-teal-500/40">
                تطوير وتصميم موقع دويتشه فيلت الألمانية
              </span>
              <h3 className="text-2xl font-black text-white">المهندس إبراهيم سمير</h3>
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
                  <div className="text-right">
                    <span className="block font-black text-sm">محادثة واتساب مباشرة 💬</span>
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
                  <div className="text-right">
                    <span className="block font-black text-sm">إرسال إيميل رسمي ✉️</span>
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
                    <span className="text-emerald-400 font-extrabold">تم نسخ الرقم</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>نسخ الرقم</span>
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
                    <span className="text-emerald-400 font-extrabold">تم نسخ الإيميل</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span>نسخ الإيميل</span>
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
