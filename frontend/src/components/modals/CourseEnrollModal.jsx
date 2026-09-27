'use client';

import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatPriceLatin } from '@/services/courses.service';
import { whatsappLink, PAYMENT_INFO } from '@/constants/siteContent';
import PaymentInfo from '@/components/common/PaymentInfo';
import { OrderShell, PayMethodPicker, Field, inputCls, SentState, PAY_OPTIONS } from './OrderShell';
import { GraduationCap, MessageCircle } from 'lucide-react';

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
  const [paymentMethod, setPaymentMethod] = useState(PAY_OPTIONS[0].value);
  const [sent, setSent] = useState(false);

  const price = formatPrice(course.price);
  const priceLatin = formatPriceLatin(course.price);

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
      paymentMethod !== 'دفع نقدي بالفرع' ? `🔢 تم التحويل على رقم: ${PAYMENT_INFO.number} (مرفق صورة التحويل)` : null,
    ].filter((l) => l !== null);

    window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  return (
    <OrderShell icon={GraduationCap} title={`الاشتراك في المستوى ${course.code}`} subtitle={course.title} onClose={onClose}>
      {sent ? (
        <SentState
          onClose={onClose}
          text="ابعت الرسالة على واتساب ومعاها صورة التحويل. بعد تأكيد الدفع هيتفعّل المستوى على حسابك وهيظهرلك زرار «ادخل للمحاضرات» وجروب الواتساب بتاع المستوى."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <PaymentInfo amount={priceLatin} compact />

          <form onSubmit={handleSubmit} className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-900/[0.05] p-5 sm:p-6 space-y-4">
            <Field label="اسم الطالب بالكامل">
              <input type="text" required value={studentName} onChange={(e) => setStudentName(e.target.value)} className={inputCls} />
            </Field>
            <Field label="رقم الواتساب">
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
                className={`${inputCls} text-right`}
              />
            </Field>
            <PayMethodPicker value={paymentMethod} onChange={setPaymentMethod} />

            <button
              type="submit"
              className="dw-shine w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm py-4 rounded-2xl shadow-lg shadow-emerald-500/25 transition-colors"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>إرسال طلب الاشتراك على واتساب</span>
            </button>
          </form>
        </div>
      )}
    </OrderShell>
  );
}
