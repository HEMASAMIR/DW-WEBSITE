'use client';

import React, { useState } from 'react';
import { ACADEMY_INFO, TOPICS } from '@/constants/siteContent';
import {
  Phone,
  MessageCircle,
  Send,
  CheckCircle2,
  Sparkles,
  User,
  BookOpen,
  HelpCircle,
  Clock,
  ShieldCheck,
  Headphones,
  Flame,
  ArrowLeft
} from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', phone: '', level: 'A1', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const text = `🇩🇪 *طلب استفسار وحجز جديد عبر موقع دويتشه فيلت:*\n\n👤 *الاسم:* ${formData.name}\n📱 *رقم الهاتف:* ${formData.phone}\n🎓 *المستوى المطلوب:* ${TOPICS[formData.level] || formData.level}\n💬 *الاستفسار / الملاحظات:* ${formData.message || 'لا توجد ملاحظات إضافية'}\n\nيرجى التواصل معي لتأكيد التفاصيل ومواعيد الكورسات. شكراً جزيلاً!`;
    
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      window.open(`https://wa.me/${ACADEMY_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
      setTimeout(() => setSubmitted(false), 6000);
    }, 400);
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-slate-50 via-teal-50/20 to-slate-50 border-t border-slate-200/80 relative z-10 overflow-hidden">
      
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Card Container */}
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-white/95 via-white/90 to-slate-50/90 backdrop-blur-2xl border border-slate-200/90 shadow-2xl overflow-hidden">
          
          {/* Top glowing decorative line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 via-amber-400 to-teal-500" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content / Info Box (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-teal-500/15 to-emerald-500/15 border border-teal-500/30 text-teal-800 shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                <span>خدمة التسجيل والاستفسارات المباشرة</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  هل لديك سؤال أو ترغب في{' '}
                  <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 bg-clip-text text-transparent">
                    حجز كورس؟
                  </span>
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                  تواصل معنا للاستفسار عن المستويات والاشتراك والكتب.
                </p>
              </div>

              {/* Direct Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/${ACADEMY_INFO.whatsapp}?text=${encodeURIComponent('السلام عليكم، أود الاستفسار عن تفاصيل كورسات الألمانية مع هير خالد')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 relative py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:from-teal-600 hover:to-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-teal-900/25 transition-all transform hover:scale-[1.02] active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>محادثة واتساب مباشرة</span>
                </a>

                <a
                  href={`tel:${ACADEMY_INFO.phonePrimary}`}
                  className="py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm flex items-center justify-center gap-2 border border-slate-300 hover:border-teal-400 transition-all shadow-sm active:scale-95"
                >
                  <Phone className="w-4 h-4 text-teal-600" />
                  <span>اتصال تلفوني</span>
                </a>
              </div>

            </div>

            {/* Right Contact Form Card (lg:col-span-7) */}
            <div className="lg:col-span-7 relative rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-200 shadow-lg">
              
              {submitted ? (
                <div className="text-center py-12 space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 border border-emerald-300 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900">تم تجهيز طلبك بنجاح! 🎉</h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto font-medium">
                    تم فتح محادثة الواتساب المباشرة مع هير خالد وفريق الأكاديمية لتأكيد حجزك وبياناتك فوراً.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    إرسال استفسار آخر
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-2">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">أرسل استفسارك السريع</h3>
                      <p className="text-xs text-slate-500 font-medium">سنقوم بتجهيز الرد فوراً عبر الواتساب</p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  
                  {/* Name & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-teal-600" />
                        <span>الاسم بالكامل</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="أدخل اسمك الكريم"
                        className="w-full bg-white border border-slate-300/90 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 shadow-xs transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-teal-600" />
                        <span>رقم الهاتف (الواتساب)</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="010xxxxxxxxx"
                        dir="ltr"
                        className="w-full bg-white border border-slate-300/90 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 text-right shadow-xs transition-all font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Level Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                      <span>المستوى المطلوب أو نوع الاستفسار</span>
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full bg-white border border-slate-300/90 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 shadow-xs transition-all font-bold cursor-pointer"
                    >
                      {Object.entries(TOPICS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message Notes */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                      <span>ملاحظاتك أو استفسارك (اختياري)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="اكتب استفسارك هنا، مثلاً: أود معرفة المواعيد المسائية أو فروع الدلتا..."
                      className="w-full bg-white border border-slate-300/90 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 resize-none shadow-xs transition-all font-medium"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative py-4 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-teal-700/25 transition-all transform hover:scale-[1.01] active:scale-98 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'جاري التجهيز...' : 'إرسال الاستفسار عبر واتساب الأكاديمية'}</span>
                  </button>

                </form>
              )}

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
