'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  ExternalLink,
  Sparkles,
  Building2,
  Navigation,
  Compass,
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
  Clock,
  ArrowLeft,
  Map,
  Flame,
  Award
} from 'lucide-react';

const ENRICHED_BRANCHES = [
  {
    id: 'shebin',
    name: 'فرع شبين الكوم',
    city: 'المنوفية',
    region: 'delta',
    badge: '👑 المقر الرئيسي والأكاديمي',
    badgeType: 'gold',
    address: 'برج حجازي – الدور الثاني علوي، أمام مستشفى الجامعة مباشرة',
    mapUrl: 'https://maps.app.goo.gl/NJRj414R5yurS7Gs8?g_st=ac',
    phone: '010552287454',
    workingHours: 'يومياً: 10:00 ص – 9:00 م',
    highlights: ['المقر الإداري الرئيسي لهير خالد', 'قاعات تدريب مجهزة ومكيفة بالكامل', 'تسجيل فوري واستلام كتب المنهج'],
    theme: {
      cardGradient: 'from-amber-500/10 via-teal-500/5 to-white',
      borderHover: 'hover:border-amber-500/60',
      glowColor: 'bg-amber-500/20',
      accentColor: 'text-amber-600',
      badgeBg: 'bg-gradient-to-r from-amber-500/15 to-amber-600/20 text-amber-800 border-amber-500/30',
      iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/30',
      ctaGradient: 'from-amber-600 via-teal-600 to-teal-700 hover:from-amber-500 hover:to-teal-600',
    }
  },
  {
    id: 'nasr-city',
    name: 'فرع مدينة نصر',
    city: 'القاهرة',
    region: 'cairo',
    badge: '📍 القاهرة الكبرى',
    badgeType: 'sky',
    address: '١٦ ش شريف سامي - بالقرب من (كوبري المنهل / جامع السلام) - الدور الأول',
    mapUrl: 'https://maps.app.goo.gl/i55RDUisL7wcdwf3A',
    phone: '01144151673',
    workingHours: 'يومياً: 10:00 ص – 9:00 م',
    highlights: ['موقع استراتيجي بقلب مدينة نصر', 'شاشات عرض ذكية للتدريب الصوتي', 'خدمة عملاء ودعم مستمر للطلاب'],
    theme: {
      cardGradient: 'from-sky-500/10 via-blue-500/5 to-white',
      borderHover: 'hover:border-sky-500/60',
      glowColor: 'bg-sky-500/20',
      accentColor: 'text-sky-600',
      badgeBg: 'bg-gradient-to-r from-sky-500/15 to-blue-500/20 text-sky-800 border-sky-500/30',
      iconBg: 'bg-gradient-to-br from-sky-500 to-blue-600 shadow-sky-500/30',
      ctaGradient: 'from-sky-600 via-blue-600 to-indigo-700 hover:from-sky-500 hover:to-blue-600',
    }
  },
  {
    id: 'mansoura',
    name: 'فرع المنصورة',
    city: 'الدقهلية',
    region: 'delta',
    badge: '🏛️ فرع المنصورة - الجامعة',
    badgeType: 'purple',
    address: '١ شارع الشيخ الغزالي أمام مستشفى الجامعة البوابة الرئيسية',
    mapUrl: 'https://maps.app.goo.gl/PpTdBa3fkWC7WGYt5',
    phone: '010552287454',
    workingHours: 'يومياً: 10:00 ص – 8:30 م',
    highlights: ['أمام بوابة الجامعة الرئيسية مباشرة', 'مناسب لطلبة الطب ومعادلات ألمانيا', 'بيئة دراسية وتدريبية هادئة'],
    theme: {
      cardGradient: 'from-violet-500/10 via-purple-500/5 to-white',
      borderHover: 'hover:border-violet-500/60',
      glowColor: 'bg-violet-500/20',
      accentColor: 'text-violet-600',
      badgeBg: 'bg-gradient-to-r from-violet-500/15 to-purple-500/20 text-violet-800 border-violet-500/30',
      iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/30',
      ctaGradient: 'from-violet-600 via-purple-600 to-indigo-700 hover:from-violet-500 hover:to-purple-600',
    }
  },
  {
    id: 'alexandria',
    name: 'فرع الإسكندرية',
    city: 'الإسكندرية',
    region: 'alex',
    badge: '🌊 فرع الإسكندرية - سموحة',
    badgeType: 'teal',
    address: 'سموحة ١ شارع 3 من شارع النصر أمام صيدلية الخليلي',
    mapUrl: 'https://maps.app.goo.gl/WY4LqQKPTK4M9e4A7',
    phone: '01144151673',
    workingHours: 'يومياً: 10:00 ص – 9:00 م',
    highlights: ['أرقى مواقع سموحة وشارع النصر', 'قاعات مكيفة ومجهزة بالكامل', 'مواعيد صباحية ومسائية مرنة'],
    theme: {
      cardGradient: 'from-teal-500/10 via-emerald-500/5 to-white',
      borderHover: 'hover:border-teal-500/60',
      glowColor: 'bg-teal-500/20',
      accentColor: 'text-teal-600',
      badgeBg: 'bg-gradient-to-r from-teal-500/15 to-emerald-500/20 text-teal-800 border-teal-500/30',
      iconBg: 'bg-gradient-to-br from-teal-500 to-emerald-600 shadow-teal-500/30',
      ctaGradient: 'from-teal-600 via-emerald-600 to-cyan-700 hover:from-teal-500 hover:to-emerald-600',
    }
  },
];

export default function BranchesSection() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyAddress = (id, address) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredBranches = activeTab === 'ALL'
    ? ENRICHED_BRANCHES
    : ENRICHED_BRANCHES.filter((b) => b.region === activeTab || b.city.includes(activeTab));

  return (
    <section id="branches" className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-200/80 relative z-10 overflow-hidden">
      
      {/* Decorative Ambient Background Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs font-black bg-gradient-to-r from-teal-500/15 via-amber-500/15 to-teal-500/15 border border-teal-500/30 text-teal-800 shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>فروعنا المعتمدة في جمهورية مصر العربية 🇩🇪 🇪🇬</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            تفضّل بزيارتنا في{' '}
            <span className="bg-gradient-to-r from-teal-600 via-sky-600 to-amber-600 bg-clip-text text-transparent">
              أقرب فرع لك
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-medium">
            ٤ مقرات تعليمية مجهزة بأحدث الوسائل التفاعلية والشاشات الذكية، تتيح لك الحضور الفعلي واستلام كتب المنهج المطبوعة والتسجيل المباشر.
          </p>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap justify-center items-center gap-2.5 pt-4">
            {[
              { key: 'ALL', label: 'جميع الفروع (4 مقرات)' },
              { key: 'cairo', label: '📍 القاهرة' },
              { key: 'delta', label: '🌾 الدلتا (شبين & المنصورة)' },
              { key: 'alex', label: '🌊 الإسكندرية' }
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all duration-300 transform active:scale-95 shadow-sm ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-teal-500/30 shadow-md scale-105 ring-2 ring-teal-500/40'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-teal-400'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {filteredBranches.map((branch) => {
            const isShebin = branch.id === 'shebin';
            return (
              <div
                key={branch.id}
                className={`group relative rounded-3xl p-7 sm:p-8 bg-gradient-to-br ${branch.theme.cardGradient} backdrop-blur-xl border border-slate-200/90 ${branch.theme.borderHover} shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between overflow-hidden`}
              >
                {/* Ambient Halo Behind Card */}
                <div
                  className={`absolute -top-24 -left-24 w-56 h-56 ${branch.theme.glowColor} rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-all duration-700 opacity-60 group-hover:opacity-100`}
                />

                {/* Card Top Row: Badge + City Icon */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black border shadow-xs ${branch.theme.badgeBg}`}>
                        {isShebin && <Award className="w-3.5 h-3.5 text-amber-600" />}
                        <span>{branch.badge}</span>
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>متاح الزيارة</span>
                      </span>
                    </div>

                    {/* 3D-styled Icon Emblem */}
                    <div className={`w-12 h-12 rounded-2xl ${branch.theme.iconBg} flex items-center justify-center text-white shadow-lg group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shrink-0`}>
                      {branch.id === 'shebin' && <Building2 className="w-6 h-6" />}
                      {branch.id === 'nasr-city' && <Navigation className="w-6 h-6" />}
                      {branch.id === 'mansoura' && <Compass className="w-6 h-6" />}
                      {branch.id === 'alexandria' && <MapPin className="w-6 h-6" />}
                    </div>
                  </div>

                  {/* Branch Title & Working Hours */}
                  <div className="mb-4">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-teal-700 transition-colors duration-300 flex items-center gap-2">
                      <span>{branch.name}</span>
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{branch.workingHours}</span>
                    </div>
                  </div>

                  {/* Address Box with Copy Feature */}
                  <div className="bg-white/80 hover:bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs mb-5 transition-all duration-300 group-hover:shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 mt-0.5 shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed select-text">
                          {branch.address}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyAddress(branch.id, branch.address)}
                        title="نسخ العنوان"
                        className="p-2 rounded-xl text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all shrink-0 active:scale-90"
                      >
                        {copiedId === branch.id ? (
                          <Check className="w-4 h-4 text-emerald-600 animate-bounce" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {copiedId === branch.id && (
                      <p className="text-[11px] font-bold text-emerald-600 mt-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> تم نسخ العنوان بنجاح!
                      </p>
                    )}
                  </div>

                  {/* Highlights Pills */}
                  <div className="space-y-2 mb-6">
                    {branch.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions: Call + WhatsApp + Google Maps Button */}
                <div className="space-y-3 pt-4 border-t border-slate-200/80">
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Direct Call */}
                    <a
                      href={`tel:${branch.phone}`}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 font-extrabold text-xs transition-all border border-slate-200/60 active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      <span dir="ltr">{branch.phone}</span>
                    </a>

                    {/* Quick WhatsApp */}
                    <a
                      href={`https://wa.me/2${branch.phone}?text=${encodeURIComponent(`مرحباً إدارة دويتشه فيلت، أود الاستفسار عن مواعيد الحضور في ${branch.name}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs transition-all border border-emerald-200/60 active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>واتساب الفرع</span>
                    </a>
                  </div>

                  {/* Primary Google Maps Button */}
                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full relative flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-gradient-to-r ${branch.theme.ctaGradient} text-white font-black text-sm shadow-md hover:shadow-xl transition-all duration-300 transform active:scale-98`}
                  >
                    <Map className="w-4 h-4" />
                    <span>افتح الموقع على Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Banner: Online Alternative */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white shadow-xl border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-2 text-center sm:text-right relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>تسكن بعيداً عن مقراتنا؟ لا تقلق!</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black">
              الكورسات الأونلاين المباشرة متاحة لجميع المحافظات 🌍
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              محاضرات تفاعلية لايف عبر Zoom مع هير خالد، تسجيلات مستمرة ومتابعة يومية على مدار ٢٤ ساعة.
            </p>
          </div>

          <a
            href="#online-courses"
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-black text-xs sm:text-sm shadow-lg shadow-teal-500/25 transition-all duration-300 flex items-center gap-2 transform active:scale-95"
          >
            <span>استكشف الكورسات الأونلاين</span>
            <ArrowLeft className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
