'use client';

import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/services/courses.service';
import { whatsappLink } from '@/constants/siteContent';
import { X, ShoppingCart, CheckCircle2, MessageCircle } from 'lucide-react';

export default function BookOrderModal() {
  const { activeModal, modalData, closeModal } = useModal();
  if (activeModal !== 'bookOrder' || !modalData?.book) return null;
  return <BookOrderForm book={modalData.book} onClose={closeModal} />;
}

function BookOrderForm({ book, onClose }) {
  const { user } = useAuth();
  const [name, setName] = useState([user?.first_name, user?.last_name].filter(Boolean).join(' '));
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [sent, setSent] = useState(false);

  const price = formatPrice(book.price);

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
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">طلب شراء كتاب</h3>
            <p className="text-xs text-amber-300 font-medium">{book.name}{price ? ` • ${price} ج.م` : ''}</p>
          </div>
        </div>

        {sent ? (
          <div className="text-center py-6 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <h4 className="text-xl font-bold text-white">تم تجهيز طلبك على واتساب</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              أرسل الرسالة وأكمل الدفع، وبعد التأكيد سيظهر لك زر <strong className="text-amber-300">&quot;تحميل الكتاب PDF&quot;</strong> في متجر الكتب.
            </p>
            <button onClick={onClose} className="mt-2 bg-amber-400 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl">
              تم
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">الاسم بالكامل</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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

            {price && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>المبلغ المطلوب:</span>
                <span className="text-amber-400 font-bold text-sm">{price} ج.م</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>إرسال الطلب عبر واتساب</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
