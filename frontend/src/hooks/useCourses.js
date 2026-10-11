import { useState, useEffect, useCallback } from 'react';
import { coursesService } from '@/services/courses.service';
import { getErrorMessage } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { DEFAULT_COURSES } from '@/constants/defaultData';
import { t } from '@/lib/i18n';

export function useCourses() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState(DEFAULT_COURSES);
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

    const fetchCourses = async () => {
      try {
        if (isAuthenticated) {
          try {
            return await coursesService.getLevels();
          } catch (err) {
            if (err.response?.status === 401) {
              return await coursesService.getPublicLevels();
            }
            throw err;
          }
        } else {
          try {
            return await coursesService.getPublicLevels();
          } catch {
            return await coursesService.getLevels();
          }
        }
      } catch {
        return DEFAULT_COURSES;
      }
    };

    fetchCourses()
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) && data.length > 0 ? data : DEFAULT_COURSES;
        setCourses(isAdmin ? list.map((item) => ({ ...item, hasAccess: true })) : list);
        setError('');
        setRequiresLogin(false);
      })
      .catch(() => {
        if (cancelled) return;
        setCourses(DEFAULT_COURSES);
        setError('');
        setRequiresLogin(false);
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
