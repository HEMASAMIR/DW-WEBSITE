'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import { formatPriceLatin } from '@/services/courses.service';
import AccessGroups, { BookCard } from '@/components/common/AccessGroups';

import { t } from '@/lib/i18n';
export default function BooksPage() {
  const { books, loading, error, requiresLogin, isGuest, reload } = useBooks();

  return (
    <AccessGroups
      title={t('الكتب')}
      icon={BookOpen}
      unit={t('كتاب')}
      subtitle={isGuest ? t('كل كتب الأكاديمية وأسعارها.') : t('الكتب المفعّلة لك تقدر تقراها أونلاين على طول، والباقي متاح للطلب.')}
      items={books}
      loading={loading}
      error={error}
      requiresLogin={requiresLogin}
      isGuest={isGuest}
      reload={reload}
      emptyText={t('لا توجد كتب متاحة حالياً.')}
      renderCard={(b) => (
        <BookCard
          id={b.id}
          href={`/books/${b.id}`}
          name={b.name}
          level={b.level}
          price={formatPriceLatin(b.price)}
          hasAccess={b.hasAccess}
          guest={isGuest}
          actionLabel={b.hasAccess ? t('اقرأ الكتاب') : isGuest ? t('التفاصيل') : t('اطلب الكتاب')}
        />
      )}
    />
  );
}
