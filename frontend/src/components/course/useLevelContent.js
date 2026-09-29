import { useState, useEffect, useCallback } from 'react';
import { coursesService } from '@/services/courses.service';
import { getErrorMessage } from '@/services/api';

import { t } from '@/lib/i18n';
/**
 * Videos + files of one level from the backend (/api/courses/levels/<id>/videos/).
 * Fetched fresh on every mount — embed URLs are signed and expire (~4h), so never cache them.
 */
export function useLevelContent(levelId, enabled = true) {
  const [content, setContent] = useState(null);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const retry = useCallback(() => {
    setError('');
    setContent(null);
    setReloadKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!enabled || !levelId) return;
    let cancelled = false;
    coursesService
      .getLevelContent(levelId)
      .then((data) => !cancelled && setContent(data))
      .catch((err) => !cancelled && setError(getErrorMessage(err, t('تعذر تحميل محاضرات هذا المستوى.'))));
    return () => {
      cancelled = true;
    };
  }, [levelId, enabled, reloadKey]);

  return { content, error, retry };
}

/** "3 ساعات 25 دقيقة" from a number of seconds. */
export function formatTotal(seconds) {
  const total = Math.round((Number(seconds) || 0) / 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (!h) return t('{m} دقيقة', { m });
  return m ? t('{h} ساعة {m} دقيقة', { h, m }) : t('{h} ساعة', { h });
}

export const totalSeconds = (videos = []) => videos.reduce((s, v) => s + (Number(v.length) || 0), 0);
