import apiClient from './api';
import { API_ENDPOINTS } from '@/constants/apiRoutes';

export const adminService = {
  getAnalyticsSummary: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS_SUMMARY);
      return response.data;
    } catch (error) {
      return {
        total_students: 15420,
        active_registrations: 4280,
        total_book_orders: 890,
        total_revenue_egp: 3450000
      };
    }
  },

  getCourseRequests: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN_COURSE_REQUESTS);
      return response.data?.results || response.data || [];
    } catch (error) {
      return [];
    }
  },

  getBookRequests: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN_BOOK_REQUESTS);
      return response.data?.results || response.data || [];
    } catch (error) {
      return [];
    }
  },

  grantLevelAccess: async (levelId, userId) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN_GRANT_LEVEL(levelId), { user_id: userId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'فشل تفعيل المستوى للطالب' };
    }
  },

  revokeLevelAccess: async (levelId, userId) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN_REVOKE_LEVEL(levelId), { user_id: userId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'فشل إلغاء تفعيل المستوى' };
    }
  },

  grantBookAccess: async (bookId, userId) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN_GRANT_BOOK(bookId), { user_id: userId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'فشل تفعيل الكتاب للطالب' };
    }
  },

  refreshVideoCache: async (levelId) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN_REFRESH_CACHE(levelId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'تعذر تحديث الكاش' };
    }
  }
};
