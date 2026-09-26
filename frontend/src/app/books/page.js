'use client';

import React from 'react';
import { useBooks } from '@/hooks/useBooks';
import { formatPrice } from '@/services/courses.service';
import { BOOK_EXTRAS } from '@/constants/siteContent';
import AccessGroups, { AccessCard } from '@/components/common/AccessGroups';

export default function BooksPage() {
  const { books, loading, error, requiresLogin, reload } = useBooks();

  return (
    <AccessGroups
      title="الكتب"
      subtitle="الكتب المفعّلة لك تقدر تعرضها أونلاين على طول، والباقي متاح للشراء."
      items={books}
      loading={loading}
      error={error}
      requiresLogin={requiresLogin}
      reload={reload}
      emptyText="لا توجد كتب متاحة حالياً."
      renderCard={(b) => (
        <AccessCard
          href={`/books/${b.id}`}
          code={b.level}
          title={b.name}
          subtitle={BOOK_EXTRAS[b.level?.toUpperCase()]?.subName}
          price={formatPrice(b.price)}
          hasAccess={b.hasAccess}
          actionLabel={b.hasAccess ? 'عرض الكتاب' : 'اطلب الكتاب'}
        />
      )}
    />
  );
}
