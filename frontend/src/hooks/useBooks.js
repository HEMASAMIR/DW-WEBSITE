import { useState, useEffect, useCallback } from 'react';
import { booksService } from '@/services/books.service';
import { getErrorMessage } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

// Real data only: names, prices and access always come from the backend.
// Never add hard-coded fallback books here — they show wrong names/prices to the client.
export function useBooks() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [books, setBooks] = useState([]);
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
    // Logged in → the student's own list (with has_access). Visitor → the site's public catalog.
    const load = isAuthenticated
      ? booksService.getBooks().catch((err) => {
          if (err.response?.status === 401) return booksService.getPublicBooks();
          throw err;
        })
      : booksService.getPublicBooks();
    load
      .then((data) => {
        if (cancelled) return;
        // Admins see everything unlocked (content requests unlock it for them if the backend hasn't).
        setBooks(isAdmin ? data.map((item) => ({ ...item, hasAccess: true })) : data);
        setError('');
        setRequiresLogin(false);
      })
      .catch((err) => {
        if (cancelled) return;
        // Public catalog unavailable (not configured) → fall back to asking the visitor to log in.
        const needsLogin = !isAuthenticated || err.response?.status === 401;
        setRequiresLogin(needsLogin);
        setBooks([]);
        setError(needsLogin ? '' : getErrorMessage(err, 'تعذر تحميل الكتب حالياً.'));
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, isAdmin, reloadKey]);

  return { books, loading, error, requiresLogin, isGuest: !isAuthenticated, reload };
}
