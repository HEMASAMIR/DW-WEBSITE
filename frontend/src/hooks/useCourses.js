import { useState, useEffect, useCallback } from 'react';
import { coursesService } from '@/services/courses.service';
import { useAuth } from '@/context/AuthContext';

const DEFAULT_COURSES = [
  {
    id: 1,
    code: 'A1',
    title: 'المستوى A1 - للمبتدئين من الصفر (Grundstufe A1)',
    description: 'تأسيس اللغة الألمانية وقواعدها والنطق الصحيح والتعريف بالنفس والحوارات الأساسية.',
    price: 1200,
    oldPrice: 1600,
    order: 1,
    hasAccess: false,
    subName: 'Grundstufe A1 - المبتدئين',
    badge: 'الأكثر طلباً للمبتدئين',
    features: ['محاضرات مسجلة ومباشرة HD', 'ملفات الشرح والتدريبات PDF', 'متابعة وتصحيح واجبات'],
  },
  {
    id: 2,
    code: 'A2',
    title: 'المستوى A2 - المحادثة والتأسيس الثاني (Aufbaukurs A2)',
    description: 'توسيع حصيلة المفردات وتطوير حوارات الحياة اليومية وقواعد المستوى الثاني.',
    price: 1400,
    oldPrice: 1850,
    order: 2,
    hasAccess: false,
    subName: 'Grundstufe A2 - المستوى الثاني',
    badge: 'مكثف',
    features: ['حوارات ومحادثات تفاعلية', 'تدريب على قسم الـ Schreiben', 'نماذج وتدريبات أسبوعية'],
  },
  {
    id: 3,
    code: 'B1',
    title: 'المستوى B1 - مؤهل السفر وشركات الكول سنتر (Mittelstufe B1)',
    description: 'التأهيل الكامل لامتحانات معهد جوته Goethe B1 والعمل بشركات Concentrix و Vodafone DE.',
    price: 1800,
    oldPrice: 2400,
    order: 3,
    hasAccess: false,
    subName: 'Mittelstufe B1 - التأسيس للسفر والعمل',
    badge: 'مؤهل لامتحان Goethe / Telc',
    features: ['شرح امتحانات Goethe B1 الأربعة', 'تأهيل مقابلات الكول سنتر 25k+', 'تدريب مكثف على Sprechen'],
  },
  {
    id: 4,
    code: 'B2',
    title: 'المستوى B2 - الطلاقة والكفاءة التخصصية (Oberstufe & Medizin)',
    description: 'إتقان المصطلحات المعقدة والنقاشات التخصصية للأطباء والمهندسين والراغبين بالسفر.',
    price: 2200,
    oldPrice: 2900,
    order: 4,
    hasAccess: false,
    subName: 'Mittelstufe B2 - الكفاءة المهنية والأكاديمية',
    badge: 'احترافي',
    features: ['مصطلحات طبية وهندسية تخصصية', 'التحضير لـ Telc B2 & ÖSD', 'تدريب مباشر مع ألمان'],
  },
];

export function useCourses() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState(DEFAULT_COURSES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setLoading(true);
    setError('');
    setReloadKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    coursesService
      .getLevels()
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setCourses(data);
        } else {
          setCourses(DEFAULT_COURSES);
        }
        setError('');
      })
      .catch(() => {
        if (cancelled) return;
        setCourses(DEFAULT_COURSES);
        setError('');
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, reloadKey]);

  // The placement quiz asks the courses grid to focus on its recommended level.
  useEffect(() => {
    const onSelect = (e) => setActiveTab(e.detail || 'ALL');
    window.addEventListener('dw:select-level', onSelect);
    return () => window.removeEventListener('dw:select-level', onSelect);
  }, []);

  const filteredCourses = activeTab === 'ALL' ? courses : courses.filter((c) => c.code === activeTab);

  return {
    courses: filteredCourses,
    allCourses: courses,
    loading,
    error: '',
    requiresLogin: false,
    reload,
    activeTab,
    setActiveTab,
  };
}
