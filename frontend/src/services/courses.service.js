import apiClient from './api';
import { API_ENDPOINTS } from '@/constants/apiRoutes';
import { COURSE_LEVELS_DATA, MOCK_LESSON_VIDEOS } from '@/constants/mockData';

export const coursesService = {
  getLevels: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.COURSE_LEVELS);
      return response.data?.results || response.data || COURSE_LEVELS_DATA;
    } catch (error) {
      console.warn('Backend API offline, using course levels fallback');
      return COURSE_LEVELS_DATA;
    }
  },

  getLevelVideos: async (levelId) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.LEVEL_VIDEOS(levelId));
      return response.data?.results || response.data || MOCK_LESSON_VIDEOS;
    } catch (error) {
      return MOCK_LESSON_VIDEOS;
    }
  },

  requestLevelEnrollment: async (enrollData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LEVEL_ENROLL_REQUEST, enrollData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'فشل إرسال طلب الالتحاق بالحورة' };
    }
  },

  downloadFile: async (levelId, fileId) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.COURSE_FILE_DOWNLOAD(levelId, fileId), {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'فشل تحميل الملف' };
    }
  }
};
