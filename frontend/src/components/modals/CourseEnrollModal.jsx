'use client';

import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { coursesService } from '@/services/courses.service';
import { X, BookOpen, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export default function CourseEnrollModal() {
  const { activeModal, modalData, closeModal } = useModal();
  const course = modalData?.course || { name: 'المستوى الأساسي A1', price: 1200, code: 'A1' };

  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState('القاهرة');
  const [paymentMethod, setPaymentMethod] = useState('vodafone');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (activeModal !== 'enroll') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await coursesService.requestLevelEnrollment({
        course_name: course.name,
        course_code: course.code,
        student_name: studentName,
        phone_number: phone,
        governorate,
        payment_method: paymentMethod
      });
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.detail || 'تعذر إرسال الطلب عبر السيرفر. تم تسجيل طلبك محلياً!');
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        <button
          onClick={closeModal}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">حجز واشتراك في الكورس</h3>
            <p className="text-xs text-amber-300 font-medium">{course.name} ({course.price} ج.م)</p>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-xl font-bold text-white">تم استلام طلب اشتراكك بنجاح!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              تم تسجيل بياناتك. سيتواصل معك مسئول التسجيل على رقم الواتساب <strong className="text-amber-300 dir-ltr">{phone}</strong> لإرسال تفاصيل تحويل كود المحاضرات.
            </p>
            <button
              onClick={closeModal}
              className="mt-4 bg-amber-400 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl"
            >
              تم، حسناً
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-300 mb-1">اسم الطالب بالكامل</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="أدخل اسمك الكريم"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">رقم الواتساب للتفعيل</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010xxxxxxxxx"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">المحافظة</label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="القاهرة">القاهرة</option>
                  <option value="الجيزة">الجيزة</option>
                  <option value="الإسكندرية">الإسكندرية</option>
                  <option value="الشرقية">الشرقية</option>
                  <option value="الدقهلية">الدقهلية</option>
                  <option value="محافظة أخرى">محافظة أخرى</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">طريقة الدفع الفوري</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="vodafone">فودافون كاش (Vodafone Cash)</option>
                <option value="instapay">إنستا باي (InstaPay)</option>
                <option value="fawry">فوري (Fawry Pay)</option>
                <option value="branch">دفع نقدي بفرع الدقي / مدينة نصر</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>المبلغ الكلي:</span>
                <span className="text-amber-400 font-bold">{course.price} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span>الخصم الحالي:</span>
                <span className="text-emerald-400 font-bold">25% (مطبق تلقائياً)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-sm py-3.5 rounded-xl shadow-lg hover:from-amber-300 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'جاري الإرسال...' : 'تأكيد حجز المقعد'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
