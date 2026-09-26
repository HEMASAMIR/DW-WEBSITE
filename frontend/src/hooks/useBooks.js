import { useState, useEffect, useCallback } from 'react';
import { booksService } from '@/services/books.service';
import { useAuth } from '@/context/AuthContext';

const DEFAULT_BOOKS = [
  {
    id: 1,
    name: 'سلسلة مذكرات A1 الشاملة (Deutsche Welt A1)',
    level: 'A1',
    price: 500,
    isActive: true,
    hasAccess: false,
  },
  {
    id: 2,
    name: 'كتاب القواعد والجرامر المكثف A2',
    level: 'A2',
    price: 550,
    isActive: true,
    hasAccess: false,
  },
  {
    id: 3,
    name: 'دليل التحضير لامتحان معهد جوته Goethe B1',
    level: 'B1',
    price: 600,
    isActive: true,
    hasAccess: false,
  },
  {
    id: 4,
    name: 'كتاب الكفاءة والتأهيل لسوق العمل B2',
    level: 'B2',
    price: 650,
    isActive: true,
    hasAccess: false,
  },
];

export function useBooks() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [books, setBooks] = useState(DEFAULT_BOOKS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setLoading(true);
    setError('');
    setReloadKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    booksService
      .getBooks()
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setBooks(data);
        } else {
          setBooks(DEFAULT_BOOKS);
        }
        setError('');
      })
      .catch(() => {
        if (cancelled) return;
        setBooks(DEFAULT_BOOKS);
        setError('');
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, reloadKey]);

  return { books, loading, error: '', requiresLogin: false, reload };
}
