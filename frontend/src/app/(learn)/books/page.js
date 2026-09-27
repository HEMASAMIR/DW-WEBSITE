'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import { formatPriceLatin } from '@/services/courses.service';
import AccessGroups, { BookCard } from '@/components/common/AccessGroups';

export default function BooksPage() {
  const { books, loading, error, requiresLogin, isGuest, reload } = useBooks();

  return (
    <AccessGroups
      title="الكتب"
      icon={BookOpen}
      unit="كتاب"
      subtitle={isGuest ? 'كل كتب الأكاديمية وأسعارها.' : 'الكتب المفعّلة لك تقدر تقراها أونلاين على طول، والباقي متاح للطلب.'}
      items={books}
      loading={loading}
      error={error}
      requiresLogin={requiresLogin}
      isGuest={isGuest}
      reload={reload}
      emptyText="لا توجد كتب متاحة حالياً."
      renderCard={(b) => (
        <BookCard
          href={`/books/${b.id}`}
          name={b.name}
          level={b.level}
          price={formatPriceLatin(b.price)}
          hasAccess={b.hasAccess}
          guest={isGuest}
          actionLabel={b.hasAccess ? 'اقرأ الكتاب' : isGuest ? 'التفاصيل' : 'اطلب الكتاب'}
        />
      )}
    />
  );
}
