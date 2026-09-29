'use client';

import React from 'react';
import { useModal } from '@/context/ModalContext';
import { formatPriceLatin } from '@/services/courses.service';
import { OrderShell } from './OrderShell';
import AccessRequestForm from './AccessRequestForm';
import { ShoppingCart } from 'lucide-react';

import { t } from '@/lib/i18n';
export default function BookOrderModal() {
  const { activeModal, modalData, closeModal } = useModal();
  if (activeModal !== 'bookOrder' || !modalData?.book) return null;
  const book = modalData.book;
  return (
    <OrderShell icon={ShoppingCart} title={t('طلب شراء كتاب')} subtitle={`${book.name} • ${t('مستوى {code}', { code: book.level })}`} onClose={closeModal}>
      <AccessRequestForm
        kind="book"
        itemId={book.id}
        amount={formatPriceLatin(book.price)}
        onClose={closeModal}
        // i18n-keep: part of the WhatsApp message to the academy
        itemLine={`📚 الكتاب: ${book.name} (مستوى ${book.level})`}
        sentText={t('الإدارة هتراجع التحويل، وأول ما الطلب يتقبل الكتاب هيتفعّل على حسابك فوراً وهيظهرلك زرار «اقرأ الكتاب».')}
      />
    </OrderShell>
  );
}
