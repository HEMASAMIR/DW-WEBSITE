import { useState, useEffect } from 'react';
import { coursesService } from '@/services/courses.service';
import { COURSE_LEVELS_DATA } from '@/constants/mockData';

export function useCourses() {
  const [courses, setCourses] = useState(COURSE_LEVELS_DATA);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await coursesService.getLevels();
        if (data && data.length > 0) {
          setCourses(data);
        }
      } catch (err) {
        // Fallback already set
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const filteredCourses = activeTab === 'ALL'
    ? courses
    : courses.filter(c => c.code === activeTab || c.level === activeTab);

  return {
    courses: filteredCourses,
    allCourses: courses,
    loading,
    activeTab,
    setActiveTab
  };
}
