'use client';

import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatPriceLatin } from '@/services/courses.service';
import { whatsappLink, PAYMENT_INFO } from '@/constants/siteContent';
import PaymentInfo from '@/components/common/PaymentInfo';
import { OrderShell, PayMethodPicker, Field, inputCls, SentState, PAY_OPTIONS } from './OrderShell';
import { ShoppingCart, MessageCircle } from 'lucide-react';

export default function BookOrderModal() {
  const { activeModal, modalData, closeModal } = useModal();
  if (activeModal !== 'bookOrder' || !modalData?.book) return null;
  return <BookOrderForm book={modalData.book} onClose={closeModal} />;
}

function BookOrderForm({ book, onClose }) {
  const { user } = useAuth();
  const [name, setName] = useState([user?.first_name, user?.last_name].filter(Boolean).join(' '));
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [paymentMethod, setPaymentMethod] = useState(PAY_OPTIONS[0].value);
  const [sent, setSent] = useState(false);

  const price = formatPrice(book.price);
  const priceLatin = formatPriceLatin(book.price);

  const handleSubmit = (e) => {
    e.preventDefault();
    const lines = [
      'مرحباً إدارة دويتشه فيلت 👋',
      'أريد شراء الكتاب وتفعيله على حسابي في الموقع:',
      '',
      `📚 الكتاب: ${book.name} (مستوى ${book.level})`,
      price ? `💰 السعر: ${price} ج.م` : null,
      `👤 الاسم: ${name}`,
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
    <OrderShell icon={ShoppingCart} title="طلب شراء كتاب" subtitle={`${book.name} • مستوى ${book.level}`} onClose={onClose}>
      {sent ? (
        <SentState
          onClose={onClose}
          text="ابعت الرسالة على واتساب ومعاها صورة التحويل. بعد تأكيد الدفع هيتفعّل الكتاب على حسابك وهيظهرلك زرار «اقرأ الكتاب»."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <PaymentInfo amount={priceLatin} compact />

          <form onSubmit={handleSubmit} className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-900/[0.05] p-5 sm:p-6 space-y-4">
            <Field label="الاسم بالكامل">
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
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
              <span>إرسال طلب الكتاب على واتساب</span>
            </button>
          </form>
        </div>
      )}
    </OrderShell>
  );
}
