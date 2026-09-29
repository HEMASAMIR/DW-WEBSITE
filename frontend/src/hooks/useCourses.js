import { useState, useEffect, useCallback } from 'react';
import { coursesService } from '@/services/courses.service';
import { getErrorMessage } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

// Real data only: names, prices and access always come from the backend.
// Never add hard-coded fallback levels here — they show wrong names/prices to the client.
export function useCourses() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');
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
      ? coursesService.getLevels().catch((err) => {
          if (err.response?.status === 401) return coursesService.getPublicLevels();
          throw err;
        })
      : coursesService.getPublicLevels();
    load
      .then((data) => {
        if (cancelled) return;
        // Admins see everything unlocked (content requests unlock it for them if the backend hasn't).
        setCourses(isAdmin ? data.map((item) => ({ ...item, hasAccess: true })) : data);
        setError('');
        setRequiresLogin(false);
      })
      .catch((err) => {
        if (cancelled) return;
        // Public catalog unavailable (not configured) → fall back to asking the visitor to log in.
        const needsLogin = !isAuthenticated || err.response?.status === 401;
        setRequiresLogin(needsLogin);
        setCourses([]);
        setError(needsLogin ? '' : getErrorMessage(err, 'تعذر تحميل الكورسات حالياً.'));
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, isAdmin, reloadKey]);

  const filteredCourses = activeTab === 'ALL' ? courses : courses.filter((c) => c.code === activeTab);

  return {
    courses: filteredCourses,
    allCourses: courses,
    loading,
    error,
    requiresLogin,
    isGuest: !isAuthenticated,
    reload,
    activeTab,
    setActiveTab,
  };
}
