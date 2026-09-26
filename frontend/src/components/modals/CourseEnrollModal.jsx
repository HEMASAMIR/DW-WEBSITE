'use client';

import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/services/courses.service';
import { whatsappLink } from '@/constants/siteContent';
import { X, BookOpen, CheckCircle2, MessageCircle } from 'lucide-react';

const PAYMENT_METHODS = [
  { value: 'فودافون كاش', label: 'فودافون كاش (Vodafone Cash)' },
  { value: 'إنستا باي', label: 'إنستا باي (InstaPay)' },
  { value: 'دفع نقدي بالفرع', label: 'دفع نقدي بأحد الفروع' },
];

export default function CourseEnrollModal() {
  const { activeModal, modalData, closeModal } = useModal();
  if (activeModal !== 'enroll' || !modalData?.course) return null;
  return <EnrollForm course={modalData.course} onClose={closeModal} />;
}

function EnrollForm({ course, onClose }) {
  const { user } = useAuth();
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ');

  const [studentName, setStudentName] = useState(fullName);
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].value);
  const [sent, setSent] = useState(false);

  const price = formatPrice(course.price);

  const handleSubmit = (e) => {
    e.preventDefault();
    const lines = [
      'مرحباً هير خالد (أكاديمية دويتشه فيلت) 👋',
      'أود الاشتراك وتفعيل المستوى على حسابي في الموقع:',
      '',
      `📌 المستوى: ${course.code} - ${course.title}`,
      price ? `💰 السعر: ${price} ج.م` : null,
      `👤 الاسم: ${studentName}`,
      `📱 الهاتف: ${phone}`,
      user?.email ? `📧 البريد المسجل: ${user.email}` : null,
      user?.id ? `🆔 رقم الحساب: ${user.id}` : null,
      `💳 طريقة الدفع: ${paymentMethod}`,
    ].filter((l) => l !== null);

    window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">الاشتراك في المستوى {course.code}</h3>
            <p className="text-xs text-amber-300 font-medium">
              {course.title}{price ? ` • ${price} ج.م` : ''}
            </p>
          </div>
        </div>

        {sent ? (
          <div className="text-center py-6 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <h4 className="text-xl font-bold text-white">تم تجهيز طلبك على واتساب</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              أرسل الرسالة في واتساب وأكمل الدفع. بعد التأكيد سيتم تفعيل المستوى على حسابك وسيظهر لك زر
              <strong className="text-amber-300"> &quot;ادخل للمحاضرات&quot; </strong>
              مباشرة.
            </p>
            <button onClick={onClose} className="mt-2 bg-amber-400 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl">
              تم
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">اسم الطالب بالكامل</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">رقم الواتساب</label>
              <input
                type="tel"
                required
                inputMode="numeric"
                pattern="[0-9]{11}"
                title="رقم الهاتف يجب أن يكون 11 رقماً"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="010xxxxxxxx"
                dir="ltr"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 text-right"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">طريقة الدفع</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            {price && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex justify-between">
                <span>المبلغ المطلوب:</span>
                <span className="text-amber-400 font-bold">{price} ج.م</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg hover:from-emerald-400 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>إرسال طلب الاشتراك عبر واتساب</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
