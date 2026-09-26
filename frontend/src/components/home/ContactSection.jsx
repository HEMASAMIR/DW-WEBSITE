'use client';

import React, { useState } from 'react';
import { ACADEMY_INFO, TOPICS } from '@/constants/siteContent';
import { Phone, MessageCircle, Send, CheckCircle2, Sparkles } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', phone: '', level: 'A1', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const text = `استفسار جديد من الموقع:\nالاسم: ${formData.name}\nالهاتف: ${formData.phone}\nالمستوى: ${formData.level}\nالرسالة: ${formData.message}`;
    window.open(`https://wa.me/${ACADEMY_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-20 bg-[#f0fdfa] border-t border-slate-200 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left WhatsApp / Call CTA Box */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full text-xs font-bold">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>تواصل مباشر معنا</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-[#0f172a] leading-tight">
                هل لديك سؤال أو ترغب في <span className="text-gradient-gold">حجز كورس؟</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                فريق خدمة العملاء متواجد على مدار اليوم للإجابة عن مواعيد الكورسات، اختيار المستوى المناسب، وتوصيل الكتب.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href={`https://wa.me/${ACADEMY_INFO.whatsapp}?text=${encodeURIComponent('السلام عليكم، أستفسر عن محتوى ومواعيد كورسات الألمانية مع الأستاذ خالد')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-pill-gold flex items-center justify-center gap-2 text-sm px-6 py-3.5 rounded-full transition-all transform hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>محادثة واتساب مباشرة</span>
                </a>

                <a
                  href={`tel:${ACADEMY_INFO.phonePrimary}`}
                  className="glass-pill flex items-center justify-center gap-2 text-sm px-6 py-3.5 rounded-full transition-all"
                >
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span>اتصال تلفوني</span>
                </a>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-inner">
              {submitted ? (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto animate-bounce" />
                  <h4 className="text-[#0f172a] font-extrabold text-lg">تم فتح واتساب برسالتك</h4>
                  <p className="text-xs text-slate-600">اضغط إرسال في واتساب وسيرد عليك مسئول التسجيل في أقرب وقت.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-black text-[#0f172a] mb-2">أرسل استفسارك السريع</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#0f172a] font-bold mb-1.5">الاسم بالكامل</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="أدخل اسمك الكريم"
                        className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-slate-400 focus:outline-none focus:border-teal-500 shadow-sm"
                        style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#0f172a] font-bold mb-1.5">رقم الهاتف (الواتساب)</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="010xxxxxxxxx"
                        className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-slate-400 focus:outline-none focus:border-teal-500 text-right shadow-sm"
                        style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#0f172a] font-bold mb-1.5">المستوى المطلوب</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-3 text-sm text-[#0f172a] focus:outline-none focus:border-teal-500 shadow-sm"
                      style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                    >
                      {Object.entries(TOPICS || { A1: 'المستوى A1', A2: 'المستوى A2', B1: 'المستوى B1', B2: 'المستوى B2', C1: 'المستوى C1' }).map(([value, label]) => (
                        <option key={value} value={value} style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-[#0f172a] font-bold mb-1.5">ملاحظاتك أو الاستفسار</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="اكتب استفسارك هنا..."
                      className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-slate-400 focus:outline-none focus:border-teal-500 resize-none shadow-sm"
                      style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full glass-pill-active py-3.5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-transform transform hover:scale-105 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال الاستفسار عبر واتساب الأكاديمية</span>
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
