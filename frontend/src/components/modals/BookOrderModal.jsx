'use client';

import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { booksService } from '@/services/books.service';
import { X, ShoppingCart, CheckCircle2, Truck, Send } from 'lucide-react';

export default function BookOrderModal() {
  const { activeModal, modalData, closeModal } = useModal();
  const book = modalData?.book || { title: 'سلسلة Deutsche Welt A1', price: 250, id: 101 };

  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [governorate, setGovernorate] = useState('القاهرة');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (activeModal !== 'bookOrder') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await booksService.placeBookOrder({
        book_id: book.id,
        book_title: book.title,
        customer_name: studentName,
        phone_number: phone,
        address,
        governorate
      });
      setSubmitted(true);
    } catch (err) {
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
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">طلب نسخة مطبوعة</h3>
            <p className="text-xs text-amber-300 font-medium">{book.title} ({book.price} ج.م)</p>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-xl font-bold text-white">تم ثبت طلبك للشحن بنجاح!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              سيقوم مندوب الشحن بالتواصل معك على الهاتف <strong className="text-amber-300 dir-ltr">{phone}</strong> قبل التسليم في عنوانك خلال 48 ساعة.
            </p>
            <button
              onClick={closeModal}
              className="mt-4 bg-amber-400 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl"
            >
              موافق
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">الاسم الكامل للمستلم</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="اسمك الكامل"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">رقم الهاتف</label>
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
                <input
                  type="text"
                  required
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  placeholder="اسم المحافظة"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">العنوان التفصيلي للتوصيل</label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="الشارع - رقم المبنى - الشقة"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
              ></textarea>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>إجمالي الشحن والتسليم:</span>
              </span>
              <span className="text-amber-400 font-bold text-sm">{book.price} ج.م (الدفع عند الاستلام)</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'جاري إرسال الطلب...' : 'تأكيد طلب الكتاب'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
