'use client';

import React from 'react';
import { useCourses } from '@/hooks/useCourses';
import { formatPrice } from '@/services/courses.service';
import AccessGroups, { AccessCard } from '@/components/common/AccessGroups';

export default function CoursesPage() {
  const { allCourses, loading, error, requiresLogin, reload } = useCourses();

  return (
    <AccessGroups
      title="المستويات"
      subtitle="المستويات المفعّلة لك تقدر تدخل تشوف محاضراتها على طول، والباقي متاح للاشتراك."
      items={allCourses}
      loading={loading}
      error={error}
      requiresLogin={requiresLogin}
      reload={reload}
      emptyText="لا توجد مستويات متاحة حالياً."
      renderCard={(c) => (
        <AccessCard
          href={`/courses/${c.id}`}
          code={c.code}
          title={c.title}
          subtitle={c.subName}
          price={formatPrice(c.price)}
          hasAccess={c.hasAccess}
          actionLabel={c.hasAccess ? 'ادخل للمحاضرات' : 'اشترك'}
        />
      )}
    />
  );
}
