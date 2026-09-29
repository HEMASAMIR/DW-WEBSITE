'use client';

import React from 'react';
import { ListVideo } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { formatPriceLatin } from '@/services/courses.service';
import AccessGroups, { LevelCard } from '@/components/common/AccessGroups';

import { t } from '@/lib/i18n';
export default function CoursesPage() {
  const { allCourses, loading, error, requiresLogin, isGuest, reload } = useCourses();

  return (
    <AccessGroups
      title={t('المستويات')}
      icon={ListVideo}
      unit={t('مستوى')}
      subtitle={isGuest ? t('كل مستويات الأكاديمية وأسعارها.') : t('المستويات المفعّلة لك تقدر تدخل تشوف محاضراتها على طول، والباقي متاح للاشتراك.')}
      items={allCourses}
      loading={loading}
      error={error}
      requiresLogin={requiresLogin}
      isGuest={isGuest}
      reload={reload}
      emptyText={t('لا توجد مستويات متاحة حالياً.')}
      renderCard={(c) => (
        <LevelCard
          href={`/courses/${c.id}`}
          code={c.code}
          title={c.title}
          subtitle={c.subName}
          price={formatPriceLatin(c.price)}
          hasAccess={c.hasAccess}
          guest={isGuest}
          actionLabel={c.hasAccess ? t('ادخل للمحاضرات') : isGuest ? t('التفاصيل') : t('اشترك')}
        />
      )}
    />
  );
}
