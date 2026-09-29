'use client';

import React from 'react';
import { useModal } from '@/context/ModalContext';
import { formatPriceLatin } from '@/services/courses.service';
import { OrderShell } from './OrderShell';
import AccessRequestForm from './AccessRequestForm';
import { GraduationCap } from 'lucide-react';

export default function CourseEnrollModal() {
  const { activeModal, modalData, closeModal } = useModal();
  if (activeModal !== 'enroll' || !modalData?.course) return null;
  const course = modalData.course;
  return (
    <OrderShell icon={GraduationCap} title={`الاشتراك في المستوى ${course.code}`} subtitle={course.title} onClose={closeModal}>
      <AccessRequestForm
        kind="level"
        itemId={course.id}
        amount={formatPriceLatin(course.price)}
        onClose={closeModal}
        itemLine={`📌 المستوى: ${course.code} - ${course.title}`}
        sentText="الإدارة هتراجع التحويل، وأول ما الطلب يتقبل المستوى هيتفعّل على حسابك فوراً وهيظهرلك زرار «ادخل للمحاضرات» وجروب الواتساب بتاع المستوى."
      />
    </OrderShell>
  );
}
