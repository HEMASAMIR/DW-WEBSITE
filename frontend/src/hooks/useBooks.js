import { useState, useEffect, useCallback } from 'react';
import { booksService } from '@/services/books.service';
import { getErrorMessage } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { DEFAULT_BOOKS } from '@/constants/defaultData';
import { t } from '@/lib/i18n';

export function useBooks() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [books, setBooks] = useState(DEFAULT_BOOKS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setLoading(true);
    setError('');
    setReloadKey((k) => k + 1);
  }, []);

  // has_access depends on the logged-in user, so refetch whenever auth state settles/changes.
  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    const fetchBooks = async () => {
      try {
        if (isAuthenticated) {
          try {
            return await booksService.getBooks();
          } catch (err) {
            if (err.response?.status === 401) {
              return await booksService.getPublicBooks();
            }
            throw err;
          }
        } else {
          try {
            return await booksService.getPublicBooks();
          } catch {
            return await booksService.getBooks();
          }
        }
      } catch {
        return DEFAULT_BOOKS;
      }
    };

    fetchBooks()
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) && data.length > 0 ? data : DEFAULT_BOOKS;
        setBooks(isAdmin ? list.map((item) => ({ ...item, hasAccess: true })) : list);
        setError('');
        setRequiresLogin(false);
      })
      .catch(() => {
        if (cancelled) return;
        setBooks(DEFAULT_BOOKS);
        setError('');
        setRequiresLogin(false);
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, isAdmin, reloadKey]);

  return { books, loading, error, requiresLogin, isGuest: !isAuthenticated, reload };
}
