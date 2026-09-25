'use client';

import React, { useState } from 'react';
import { ACADEMY_INFO } from '@/constants/mockData';
import { Phone, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', phone: '', level: 'A1', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/40 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left WhatsApp / Call CTA Box */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 text-xs font-bold px-3.5 py-1 rounded-full border border-red-500/30">
                <MessageCircle className="w-4 h-4" />
                <span>تواصل مباشر معنا</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                هل لديك سؤال أو ترغب في حجز كورس؟
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                فريق خدمة العملاء متواجد على مدار اليوم للإجابة عن مواعيد الكورسات، اختيار المستوى المناسب، وتوصيل الكتب.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href={`https://wa.me/${ACADEMY_INFO.whatsapp}?text=${encodeURIComponent('السلام عليكم، أستفسر عن محتوى ومواعيد كورسات الألمانية مع الأستاذ خالد')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>محادثة واتساب مباشرة</span>
                </a>

                <a
                  href={`tel:${ACADEMY_INFO.phonePrimary}`}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl border border-slate-700 transition-all"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>اتصال تلفوني</span>
                </a>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7 bg-slate-950/80 p-6 sm:p-8 rounded-2xl border border-slate-800">
              {submitted ? (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-white font-bold text-lg">تم إرسال استفسارك بنجاح!</h4>
                  <p className="text-xs text-slate-400">سيتواصل معك مسئول التسجيل في أقرب وقت عبر الهاتف أو الواتساب.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-2">أرسل استفسارك السريع</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">الاسم بالكامل</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="أدخل اسمك الكريم"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">رقم الهاتف (الواتساب)</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="010xxxxxxxxx"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 dir-ltr text-right"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">المستوى المطلوب</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="A1">المستوى الأساسي A1</option>
                      <option value="A2">المستوى A2</option>
                      <option value="B1">المستوى B1</option>
                      <option value="B2">المستوى B2</option>
                      <option value="C1">المستوى C1</option>
                      <option value="BOOK">شراء كتب فقط</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">ملاحظاتك أو الاستفسار</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="اكتب استفسارك هنا..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm py-3 rounded-xl shadow-md transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال الطلب</span>
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
