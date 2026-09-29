'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { requestsService, ACCESS_REQUEST_EVENT } from '@/services/requests.service';
import { getErrorMessage, isMissingEndpoint } from '@/services/api';
import { useContactInfo, whatsappHref, numberForMethod, CASH_METHOD } from '@/lib/contactInfo';
import PaymentInfo from '@/components/common/PaymentInfo';
import { track, priceValue } from '@/lib/analytics';
import { PayMethodPicker, Field, inputCls, SentState, usePayOptions } from './OrderShell';
import { Send, Loader2, ImagePlus, X, Clock3, AlertCircle } from 'lucide-react';

import { t } from '@/lib/i18n';
/**
 * Subscribe / buy form shared by the level and book modals.
 * Sends the request to the admin dashboard; approving it there unlocks the item on the student's account.
 * kind: 'level' | 'book'
 * itemLine: one line describing the item, used for the WhatsApp fallback message.
 *
 * Requests go to the backend's /api/requests/, or to the website's own store while the backend
 * has none (see requests.service). WhatsApp is only a last resort if neither exists.
 */
export default function AccessRequestForm({ kind, itemId, amount, onClose, sentText, itemLine }) {
  const { user } = useAuth();
  const [name, setName] = useState([user?.first_name, user?.last_name].filter(Boolean).join(' '));
  const [phone, setPhone] = useState(user?.phone_number || '');
  const contact = useContactInfo();
  const payOptions = usePayOptions();
  const [chosenMethod, setPaymentMethod] = useState('');
  // The admin's methods load after the first render — fall back to the first one offered.
  const paymentMethod = payOptions.some((o) => o.value === chosenMethod) ? chosenMethod : payOptions[0]?.value || '';
  const [receipt, setReceipt] = useState(null);
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(null); // 'platform' | 'whatsapp'
  const [pending, setPending] = useState(null); // an earlier request for the same item still under review
  const fileRef = useRef(null);

  useEffect(() => {
    track('begin_checkout', { item_type: kind, item_id: itemId, value: priceValue(amount), currency: 'EGP' });
    // Once per opened form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    requestsService.mine()
      .then((list) => {
        if (cancelled) return;
        setPending(list.find((r) => r.kind === kind && String(r.item_id) === String(itemId) && r.status === 'pending') || null);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [kind, itemId]);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await requestsService.create({
        kind, item_id: itemId, full_name: name, phone, payment_method: paymentMethod, note, receipt,
      });
      track('generate_lead', { item_type: kind, item_id: itemId, value: priceValue(amount), currency: 'EGP', channel: 'platform' });
      window.dispatchEvent(new CustomEvent(ACCESS_REQUEST_EVENT, { detail: { kind, itemId } }));
      setSent('platform');
    } catch (err) {
      if (isMissingEndpoint(err)) {
        sendOnWhatsapp();
        return;
      }
      setError(getErrorMessage(err, t('تعذر إرسال الطلب، حاول مرة أخرى.')));
    } finally {
      setSending(false);
    }
  };

  // i18n-keep: the WhatsApp message goes to the academy, always in Arabic
  const sendOnWhatsapp = () => {
    const lines = [
      'مرحباً إدارة دويتشه فيلت 👋',
      kind === 'level' ? 'أود الاشتراك وتفعيل المستوى على حسابي في الموقع:' : 'أريد شراء الكتاب وتفعيله على حسابي في الموقع:',
      '',
      itemLine,
      amount ? `💰 السعر: ${amount} ج.م` : null,
      `👤 الاسم: ${name}`,
      `📱 الهاتف: ${phone}`,
      user?.id ? `🆔 رقم الحساب: ${user.id}` : null,
      `💳 طريقة الدفع: ${paymentMethod}`,
      paymentMethod !== CASH_METHOD ? `🔢 تم التحويل على رقم: ${numberForMethod(contact, paymentMethod)} (مرفق صورة التحويل)` : null,
      note ? `📝 ${note}` : null,
    ].filter((l) => l !== null && l !== undefined);
    window.open(whatsappHref(contact, lines.join('\n')), '_blank', 'noopener,noreferrer');
    track('generate_lead', { item_type: kind, item_id: itemId, value: priceValue(amount), currency: 'EGP', channel: 'whatsapp' });
    setSent('whatsapp');
  };

  if (sent === 'platform') {
    return <SentState onClose={onClose} title={t('طلبك وصل للإدارة ✨')} text={sentText} showNumber={false} />;
  }
  if (sent === 'whatsapp') {
    return (
      <SentState
        onClose={onClose}
        number={paymentMethod !== CASH_METHOD ? numberForMethod(contact, paymentMethod) : null}
        showNumber={paymentMethod !== CASH_METHOD}
        text={t('ابعت الرسالة على واتساب ومعاها صورة التحويل. بعد تأكيد الدفع هيتفعّل على حسابك في الموقع.')}
      />
    );
  }

  if (pending) {
    return (
      <div className="text-center py-10 space-y-4 max-w-md mx-auto">
        <span className="inline-flex w-20 h-20 rounded-full bg-amber-100 text-amber-600 items-center justify-center">
          <Clock3 className="w-10 h-10" />
        </span>
        <h4 className="text-2xl font-black text-[#0e2c4e]">{t('طلبك قيد المراجعة')}</h4>
        <p className="text-sm text-slate-600 leading-relaxed">
          {t('بعتّ طلب لنفس العنصر قبل كده والإدارة بتراجعه. أول ما يتقبل هيتفعّل على حسابك تلقائياً.')}
        </p>
        <button onClick={onClose} className="mt-2 bg-[#0e2c4e] hover:bg-teal-700 text-white font-black text-sm px-8 py-3 rounded-2xl transition-colors">
          {t('تمام')}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <PaymentInfo amount={amount} compact />

      <form onSubmit={submit} className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-900/[0.05] p-5 sm:p-6 space-y-4">
        <Field label={t('الاسم بالكامل')}>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </Field>
        <Field label={t('رقم الواتساب')}>
          <input
            type="tel"
            required
            inputMode="numeric"
            pattern="[0-9]{11}"
            title={t('رقم الهاتف يجب أن يكون 11 رقماً')}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
            placeholder="010xxxxxxxx"
            dir="ltr"
            className={`${inputCls} text-start`}
          />
        </Field>
        <PayMethodPicker value={paymentMethod} onChange={setPaymentMethod} />

        {paymentMethod !== CASH_METHOD && (
          <Field label={t('صورة التحويل (بتسرّع التفعيل)')}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => setReceipt(e.target.files?.[0] || null)}
            />
            {receipt ? (
              <div className="flex items-center gap-3 rounded-2xl border-2 border-emerald-300 bg-emerald-50 px-4 py-3">
                <ImagePlus className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="flex-1 min-w-0 truncate text-xs font-bold text-emerald-800" dir="ltr">{receipt.name}</span>
                <button
                  type="button"
                  onClick={() => { setReceipt(null); if (fileRef.current) fileRef.current.value = ''; }}
                  className="p-1 rounded-lg hover:bg-emerald-100 text-emerald-700"
                  aria-label={t('إزالة')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 hover:border-teal-400 hover:bg-teal-50/50 py-4 text-xs font-black text-slate-500 hover:text-teal-700 transition-colors"
              >
                <ImagePlus className="w-5 h-5" /> {t('ارفع سكرين التحويل')}
              </button>
            )}
          </Field>
        )}

        <Field label={t('ملاحظة (اختياري)')}>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={`${inputCls} resize-none`}
            placeholder={t('مثلاً: حوّلت من رقم تاني')}
          />
        </Field>

        {error && (
          <p className="flex items-start gap-2 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-bold text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="dw-shine w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-70 text-white font-black text-sm py-4 rounded-2xl shadow-lg shadow-emerald-500/25 transition-colors"
        >
          {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          <span>{sending ? t('جاري الإرسال...') : t('إرسال الطلب للإدارة')}</span>
        </button>
      </form>
    </div>
  );
}
