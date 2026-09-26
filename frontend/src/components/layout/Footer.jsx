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
  Award
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

  const devWhatsapp = "https://wa.me/201055673184?text=" + encodeURIComponent("السلام عليكم مهندس إبراهيم سمير، أتواصل معك عبر موقع دويتشه فيلت للألمانية");
  const devEmail = "mailto:01055673184hs@gmail.com?subject=" + encodeURIComponent("تواصل واستفسار برمجي - Eng. Ibrahim Samir");

  return (
    <footer className="bg-[#070e1c] text-slate-300 pt-20 pb-12 border-t border-teal-500/20 relative z-10 overflow-hidden">
      
      {/* Subtle Luxury Glow Effects in Background */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-teal-500/5 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-16">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Brand Info & Identity (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/25">
                <GraduationCap className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-black text-2xl text-white tracking-tight">Deutsche <span className="text-gradient-gold">Welt</span></span>
                <span className="text-[11px] text-teal-400 font-bold block">الأستاذ خالد • أكاديمية الألمانية</span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400 max-w-sm">
              {ACADEMY_INFO.subtitle} — منصتك المتكاملة لاجتياز امتحانات جوته وتأهيل الكول سنتر وسوق العمل في ألمانيا.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                title="واتساب الأكاديمية"
                className="w-11 h-11 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all shadow-md hover:scale-110"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
              </a>
              <a
                href={`tel:${ACADEMY_INFO.phonePrimary}`}
                title="اتصال الأكاديمية"
                className="w-11 h-11 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-teal-400 hover:bg-teal-600 hover:text-white hover:border-teal-500 transition-all shadow-md hover:scale-110"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-black text-base border-r-4 border-teal-400 pr-3">روابط السريعة</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-400">
              <li><Link href="/#hero" className="hover:text-teal-300 transition-colors flex items-center gap-1.5"><ChevronLeft className="w-3 h-3 text-teal-400" />الرئيسية</Link></li>
              <li><Link href="/#online-courses" className="hover:text-teal-300 transition-colors flex items-center gap-1.5"><ChevronLeft className="w-3 h-3 text-teal-400" />الكورسات والمستويات</Link></li>
              <li><Link href="/#books-store" className="hover:text-teal-300 transition-colors flex items-center gap-1.5"><ChevronLeft className="w-3 h-3 text-teal-400" />متجر الكتب</Link></li>
              <li><Link href="/#branches" className="hover:text-teal-300 transition-colors flex items-center gap-1.5"><ChevronLeft className="w-3 h-3 text-teal-400" />الفروع بالحضور</Link></li>
              <li><Link href="/#about-teacher" className="hover:text-teal-300 transition-colors flex items-center gap-1.5"><ChevronLeft className="w-3 h-3 text-teal-400" />السيرة الذاتية للأستاذ خالد</Link></li>
              <li><Link href="/#reviews" className="hover:text-teal-300 transition-colors flex items-center gap-1.5"><ChevronLeft className="w-3 h-3 text-teal-400" />تجارب الطلاب الموثقة</Link></li>
            </ul>
          </div>

          {/* Column 3: Branches Contact (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-black text-base border-r-4 border-amber-400 pr-3">فروعنا بالحضور</h4>
            <ul className="space-y-3 text-xs text-slate-300">
              {BRANCHES_DATA.map((b) => (
                <li key={b.id} className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <a href={b.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">
                    <strong className="text-white block">{b.name} ({b.city})</strong>
                    <span className="text-[11px] text-slate-400 line-clamp-1">{b.address}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Quick Contact Box (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/80 shadow-2xl flex flex-col justify-between space-y-5 hover:border-amber-400/40 transition-all">
              {isAdmin ? (
                <>
                  <div className="space-y-1">
                    <h5 className="text-white font-black text-base flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span>لوحة التحكم الإدارية</span>
                    </h5>
                    <p className="text-xs text-slate-300">إدارة المستويات والكتب والطلاب المعتمدين.</p>
                  </div>
                  <button
                    onClick={openAdminDashboard}
                    className="w-full glass-pill-active py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <span>دخول لوحة الإدارة 🔐</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <span className="inline-block text-[10px] text-amber-300 bg-amber-900/40 px-3 py-0.5 rounded-full border border-amber-400/30 font-bold">
                      خدمة العملاء متواجدون الآن
                    </span>
                    <h5 className="text-white font-black text-base">تواصل معنا فوراً</h5>
                    <p className="text-xs text-slate-300">للاستفسار عن الكورسات، أسعار الكتب وتأهيل السفريات.</p>
                  </div>
                  <a
                    href={whatsappLink('السلام عليكم، أريد الاستفسار عن الكورسات والخدمات المتاحة')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full glass-pill-gold py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-xl"
                  >
                    <MessageCircle className="w-4 h-4 text-slate-900 fill-current" />
                    <span>محادثة واتساب مباشرة 💬</span>
                  </a>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar — Ultra Luxury Eng. Ibrahim Samir Developer Badge */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-6 relative">
          <p>© {new Date().getFullYear()} Deutsche Welt Academy - الأستاذ خالد. جميع الحقوق محفوظة.</p>

          {/* Premium Developer Crest Badge */}
          <div className="relative group">
            <button
              onClick={() => setDevModalOpen(true)}
              className="relative group p-0.5 rounded-full bg-gradient-to-r from-amber-400 via-teal-400 to-amber-500 shadow-xl hover:shadow-amber-500/25 transition-all transform hover:scale-105 cursor-pointer"
            >
              <div className="bg-[#0f172a] group-hover:bg-[#15203b] px-5 py-2.5 rounded-full flex items-center gap-3 transition-colors">
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
            <div className="hidden group-hover:flex absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-80 bg-slate-900/95 backdrop-blur-2xl border-2 border-amber-400/70 rounded-3xl p-5 shadow-2xl flex-col gap-3 z-30 animate-fadeIn pointer-events-auto">
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
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shadow-sm"
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
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 flex items-center justify-center gap-1.5 transition-colors font-bold"
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
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 flex items-center justify-center gap-1.5 transition-colors font-bold"
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
