'use client';

import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { 
  Star, 
  MessageSquare, 
  Maximize2, 
  Award, 
  Sparkles,
  Video,
  Play,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Building2,
  GraduationCap,
  Stethoscope,
  Users,
  Search,
  MessageCircle,
  FileCheck
} from 'lucide-react';

export default function ReviewsSection() {
  const { openLightboxModal } = useModal();
  const [activeTab, setActiveTab] = useState('screenshots');
  const [swiperIndex, setSwiperIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // All 74 Student Review Screenshots
  const allReviewScreenshots = Array.from({ length: 74 }, (_, i) => ({
    id: i + 1,
    image: `/assets/reviews/review_${i + 1}.jpg`,
    title: `رأي الطالب الموثق رقم ${i + 1}`,
    badge: (i % 3 === 0) ? 'Goethe B1/B2' : (i % 3 === 1) ? 'Concentrix & Vodafone' : 'تأسيس A1/A2'
  }));

  const itemsPerPage = 4;
  const maxPages = Math.ceil(allReviewScreenshots.length / itemsPerPage);

  const handlePrev = () => {
    setSwiperIndex((prev) => (prev > 0 ? prev - 1 : maxPages - 1));
  };

  const handleNext = () => {
    setSwiperIndex((prev) => (prev < maxPages - 1 ? prev + 1 : 0));
  };

  const currentScreenshots = allReviewScreenshots.slice(
    swiperIndex * itemsPerPage,
    (swiperIndex + 1) * itemsPerPage
  );

  const alumniReviews = [
    {
      id: 1,
      name: 'محمد عبدالرحمن',
      role: 'Senior Team Leader • Concentrix',
      comment: 'بدأت مع هير خالد من الصفر في A1، أسلوبه في تبسيط الجرامر وربطه بسوق العمل والكول سنتر خلاني أتقبل في Concentrix من أول إنترفيو بعد كورس B1، وحالياً بقيت Team Leader بفضل ربنا ثم هير خالد!',
      rating: 5,
      icon: Building2,
      tag: 'راتب 25k+'
    },
    {
      id: 2,
      name: 'ياسمين الشناوي',
      role: 'Senior Customer Advisor • Vodafone DE',
      comment: 'كورس الـ Upskilling مع هير خالد كان نقطة تحول في حياتي المهنية. التدريب على مكالمات الـ Incident Management وطريقة التعامل مع الألمان كانت واقعية جداً. شكراً يا أحسن هير في مصر!',
      rating: 5,
      icon: MessageCircle,
      tag: 'Vodafone DE'
    },
    {
      id: 3,
      name: 'د. أحمد سامي',
      role: 'طبيب مقيم في مستشفى بمدينة شتوتغارت 🇩🇪',
      comment: 'كنت محتاج ألماني طبي عشان معادلة الأطباء في ألمانيا، كورس الـ Medizin مع هير خالد وكتاب الأكاديمية خلوني أعدي امتحان الـ FSP من أول مرة وبكل سهولة. ربنا يباركلك في علمك يا هير.',
      rating: 5,
      icon: Stethoscope,
      tag: 'معادلة الأطباء'
    }
  ];

  return (
    <section id="reviews" className="py-20 bg-[#f0fdfa] border-t border-slate-200 relative z-10">
      
      {/* Background Glow Highlights */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative">
        
        {/* Top Header Section */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 glass-pill px-5 py-2 rounded-full text-xs font-bold text-amber-800 border border-amber-400/50 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>معرض الآراء والتجارب الموثقة 100%</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0f172a] leading-tight">
            قصص نجاح وتجارب <span className="text-gradient-cyan">طلاب وأطباء وخريجي هير خالد</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            أكثر من 15,000 طالب حققوا أهدافهم في العمل بشركات الكول سنتر العالمية والتأهيل للسفر والامتحانات الرسمية.
          </p>
        </div>

        {/* High-Trust Stats Highlight Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <span className="block text-teal-600 font-black text-2xl font-mono">+15,000</span>
            <span className="text-xs text-slate-700 font-bold">طالب تم تدريبهم</span>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <span className="block text-amber-600 font-black text-2xl font-mono">98.4%</span>
            <span className="text-xs text-slate-700 font-bold">نسبة نجاح جوته & تلـك</span>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <span className="block text-emerald-600 font-black text-2xl font-mono">74+</span>
            <span className="text-xs text-slate-700 font-bold">شات موثق بالصور</span>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <span className="block text-teal-700 font-black text-2xl font-mono">+10</span>
            <span className="text-xs text-slate-700 font-bold">سنوات خبرة بالمجال</span>
          </div>
        </div>

        {/* Dynamic Category Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('screenshots')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all ${
              activeTab === 'screenshots' ? 'glass-pill-active shadow-md' : 'glass-pill'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>سلايدر محادثات الطلاب (+74 شات)</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all ${
              activeTab === 'video' ? 'glass-pill-active shadow-md' : 'glass-pill'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>فيديو النجاح وتجارب خريجي الكورسات</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all ${
              activeTab === 'testimonials' ? 'glass-pill-active shadow-md' : 'glass-pill'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>تجارب العمل بـ Concentrix & Vodafone</span>
          </button>
        </div>

        {/* Tab 1: 74 Screenshots Swiper Hub */}
        {activeTab === 'screenshots' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
            
            {/* Header Control Panel */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 border border-teal-300 px-3.5 py-1 rounded-full text-xs font-bold mb-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>معرض محادثات ورسائل شكر طلاب الأكاديمية (74 صورة)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0f172a]">
                  تصفح آراء الطلاب الحقيقية من شات وواتساب هير خالد
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  اضغط على أي صورة لتكبيرها وقراءة التفاصيل بوضوح كامل.
                </p>
              </div>

              {/* Swiper Controls & Counter */}
              <div className="flex items-center gap-4 shrink-0">
                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-4 py-2 rounded-full text-xs font-mono font-black shadow-sm">
                  صفحة {swiperIndex + 1} من {maxPages} ({swiperIndex * itemsPerPage + 1} - {Math.min((swiperIndex + 1) * itemsPerPage, allReviewScreenshots.length)})
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="w-11 h-11 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center hover:bg-teal-600 hover:text-white hover:scale-110 transition-all shadow-sm"
                    title="السابق"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-11 h-11 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center hover:bg-teal-600 hover:text-white hover:scale-110 transition-all shadow-sm"
                    title="التالي"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Screenshots Display Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {currentScreenshots.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openLightboxModal(item.image, item.title)}
                  className="group relative rounded-2xl overflow-hidden bg-slate-50 border-2 border-slate-200 aspect-[3/4] cursor-pointer hover:border-amber-400 transition-all shadow-md hover:shadow-2xl"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-400/40">
                    {item.badge}
                  </div>
                  <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="glass-pill-gold px-4 py-2.5 rounded-full text-xs font-black flex items-center gap-2 shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                      <Maximize2 className="w-4 h-4 text-slate-900" />
                      <span>تكبير وتصفح المحادثة 🔍</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Page Jump Buttons Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-xs text-slate-500 font-bold ml-2">انتقل لصفحة:</span>
              {Array.from({ length: Math.min(10, maxPages) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setSwiperIndex(i)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                    swiperIndex === i
                      ? 'bg-teal-600 text-white shadow-md scale-110'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              {maxPages > 10 && (
                <span className="text-xs text-slate-400 font-bold px-1">... {maxPages}</span>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Video Showcase Card */}
        {activeTab === 'video' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-amber-400/60 shadow-2xl space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Video Player */}
              <div className="lg:col-span-7">
                <div className="relative rounded-3xl overflow-hidden bg-slate-900 border-4 border-teal-500/30 shadow-2xl group">
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    poster="/assets/images/video_poster.jpg"
                    className="w-full aspect-video object-cover rounded-2xl"
                  >
                    <source src="/assets/videos/video_reviews.mp4" type="video/mp4" />
                    متصفحك لا يدعم تشغيل الفيديو المباشر.
                  </video>
                </div>
              </div>

              {/* Video Details Wrap */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 text-xs font-extrabold text-amber-800 border border-amber-400/50">
                  <Video className="w-4 h-4 text-amber-600" />
                  <span>تجارب حية ومقابلات فيديو</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0f172a] leading-tight">
                  قصص نجاح من قلب المحاضرات والمقابلات
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  استمع مباشرة لخريجي أكاديمية دويتشه فيلت وكيف ساعدهم هير خالد في اجتياز المقابلات الصعبة للعمل في Concentrix و Vodafone DE وتحقيق طلاقة التحدث بالألماني.
                </p>
                <ul className="space-y-3 text-xs text-teal-950 font-bold">
                  <li className="flex items-center gap-2.5 p-2.5 rounded-xl bg-teal-50 border border-teal-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>تأهيل واجتياز مقابلات الـ HR & Technical برواتب مجزية</span>
                  </li>
                  <li className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>التحضير المباشر لامتحانات معهد جوته Goethe B1 & B2</span>
                  </li>
                  <li className="flex items-center gap-2.5 p-2.5 rounded-xl bg-teal-50 border border-teal-200">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>كسر حاجز الخوف والطلاقة في التحدث مع الألمان</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Testimonials / Corporate Alumni */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {alumniReviews.map((rev) => {
                const IconComponent = rev.icon;
                return (
                  <div
                    key={rev.id}
                    className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl flex flex-col justify-between space-y-4 border border-slate-200 transition-all transform hover:-translate-y-1"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-900 font-black flex items-center justify-center text-base shadow-sm border border-teal-300">
                            <IconComponent className="w-6 h-6 text-teal-700" />
                          </div>
                          <div>
                            <h4 className="text-[#0f172a] font-extrabold text-base">{rev.name}</h4>
                            <span className="text-xs text-amber-700 font-bold block">{rev.role}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-y border-slate-100 py-2">
                        <span className="text-[11px] font-bold bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
                          {rev.tag}
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-slate-50 p-4 rounded-2xl border border-slate-200 font-medium">
                        "{rev.comment}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

