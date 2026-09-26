'use client';

import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { 
  Sparkles, 
  Award, 
  Play, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  Search,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Globe,
  FileText,
  Briefcase,
  Building2,
  ChevronLeft
} from 'lucide-react';

export default function HeroSection() {
  const { openQuizModal, openStudentDashboard, openCvModal } = useModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const coursesSection = document.getElementById('online-courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden z-10 bg-gradient-to-br from-[#f0fdfa] via-[#ecfeff] to-[#fffbeb] border-b border-teal-500/10">
      
      {/* Radial Glow Spotlight in Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Hero Section Header Content */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Top Capsule Badge */}
          <div className="inline-flex items-center gap-2 glass-pill px-5 py-2 rounded-full shadow-md text-xs sm:text-sm font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
            <span>منصة تأسيس واستكمال اللغة الألمانية الأولى في مصر والوطن العربي</span>
          </div>

          {/* Multi-Tone Gradient Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
            تعلم الألمانية مع الأستاذ خالد <br className="hidden sm:inline" />
            <span className="text-gradient-cyan">لكل مرحلة تستحق التوثيق </span>
            <span className="text-gradient-gold">والتميز</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            خبرة أكثر من 10 سنوات في إعداد وتهيئة الطلاب للامتحانات الدولية <span className="text-amber-700 font-bold">(Goethe & Telc & ÖSD)</span> والالتحاق بالجامعات وسوق العمل بألمانيا.
          </p>

          {/* Search Capsule Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="search-glow relative max-w-2xl mx-auto rounded-full bg-white backdrop-blur-xl border border-teal-500/30 p-2 sm:p-2.5 flex items-center shadow-lg transition-all">
              <div className="pr-3 text-teal-600">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم الكورس (A1, A2, B1, B2) أو الثانوية العامة..."
                className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none px-2"
              />
              <button
                type="submit"
                className="glass-pill-gold px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-1.5 shrink-0 transition-transform transform hover:scale-105"
              >
                <span>استعرض الكورسات</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Interactive CV Banner Trigger Bar */}
          <div 
            onClick={() => openCvModal('overview')}
            className="glass-pill p-3 sm:p-4 rounded-full max-w-3xl mx-auto flex items-center justify-between cursor-pointer border border-teal-500/30 hover:border-teal-400 transition-all shadow-md group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                الملف المهني والشهادات المعتمدة للمحاضر هير خالد (Concentrix & Vodafone DE)
              </span>
            </div>
            <div className="glass-pill-gold px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1 shrink-0">
              <span>استعرض الـ CV كاملاً</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>

          {/* Feature Capsule Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs">
            <div className="glass-pill px-4 py-2 rounded-full flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>+15,000 طالب محترف</span>
            </div>
            <div className="glass-pill px-4 py-2 rounded-full flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>شهادات معتمدة 100%</span>
            </div>
            <div className="glass-pill px-4 py-2 rounded-full flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>كتب ومناهج أونلاين</span>
            </div>
            <div className="glass-pill px-4 py-2 rounded-full flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-600" />
              <span>استجابة وتصحيح يومي</span>
            </div>
          </div>

        </div>

        {/* Bottom Hero Grid Details & Photo Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Key Benefits & CV Stats */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-emerald rounded-3xl p-6 space-y-4 border border-slate-200 shadow-xl">
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-600" />
                لماذا تشترك في أكاديمية Herr Khaled؟
              </h3>
              
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-teal-50 border border-teal-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-teal-800 block">شرح مبسط وتأسيس قوي في الجرامر والـ Sprechen</span>
                    <span className="text-xs text-slate-600">أساليب حديثة تعتمد على التحدث والتدريب العملي المستمر.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-200">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-800 block">منصة تفاعلية مخصصة لكل طالب</span>
                    <span className="text-xs text-slate-600">محاضرات مسجلة ومباشرة مع متابعة التقييم والواجبات أونلاين.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-teal-50 border border-teal-200">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-teal-800 block">اختبار تحديد مستوى مجاني شامل</span>
                    <span className="text-xs text-slate-600">حدد مستواك بدقة في دقائق للحصول على الخطة المناسبة لك.</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={openQuizModal}
                  className="glass-pill-gold py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>اختبار تحديد المستوى (مجاناً)</span>
                </button>

                <button
                  onClick={() => openCvModal('overview')}
                  className="glass-pill py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 text-teal-800 border border-teal-300"
                >
                  <FileText className="w-4 h-4" />
                  <span>السيرة الذاتية والشهادات 📄</span>
                </button>
              </div>
            </div>
          </div>

          {/* Photo Frame & Floating Corporate Experience Chips */}
          <div className="lg:col-span-6">
            <div className="relative glass-emerald rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
              
              {/* Card Header Tag */}
              <div className="flex items-center justify-between">
                <span className="glass-pill px-3.5 py-1 text-xs font-bold text-teal-700">
                  Herr Khaled El-Halawany
                </span>
                <span className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  مباشر عبر الإنترنت & الفروع
                </span>
              </div>

              {/* Herr Khaled Photo Frame with Full Face Visibility */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] bg-slate-100 border border-teal-500/30 group shadow-inner">
                <img
                  src="/assets/images/herr_khaled_1.jpg"
                  alt="الأستاذ خالد - Herr Khaled"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating Chips Overlay */}
                <div 
                  onClick={() => openCvModal('overview')}
                  className="absolute bottom-3 right-3 glass-pill px-3 py-1.5 rounded-xl text-[11px] font-bold text-amber-300 flex items-center gap-1.5 cursor-pointer shadow-xl border border-amber-400/40 hover:scale-105 transition-transform"
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>شراكة Concentrix & Vodafone DE</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => openCvModal('overview')}
                className="w-full glass-pill-active py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>عرض السيرة الذاتية الرسمية والشهادات المعتمدة 📄✨</span>
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
