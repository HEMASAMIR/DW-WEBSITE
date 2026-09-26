'use client';

import React from 'react';
import { useBooks } from '@/hooks/useBooks';
import { formatPrice } from '@/services/courses.service';
import AccessGroups, { AccessCard } from '@/components/common/AccessGroups';

export default function BooksPage() {
  const { books, loading, error, requiresLogin, isGuest, reload } = useBooks();

  return (
    <AccessGroups
      title="الكتب"
      subtitle={isGuest ? 'كل كتب الأكاديمية وأسعارها.' : 'الكتب المفعّلة لك تقدر تعرضها أونلاين على طول، والباقي متاح للشراء.'}
      items={books}
      loading={loading}
      error={error}
      requiresLogin={requiresLogin}
      isGuest={isGuest}
      reload={reload}
      emptyText="لا توجد كتب متاحة حالياً."
      renderCard={(b) => (
        <AccessCard
          href={`/books/${b.id}`}
          code={b.level}
          title={b.name}
          subtitle={`مستوى ${b.level}`}
          price={formatPrice(b.price)}
          hasAccess={b.hasAccess}
          guest={isGuest}
          actionLabel={b.hasAccess ? 'عرض الكتاب' : isGuest ? 'التفاصيل' : 'اطلب الكتاب'}
        />
      )}
    />
  );
}
