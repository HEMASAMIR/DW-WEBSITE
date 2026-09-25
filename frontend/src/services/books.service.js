import apiClient from './api';
import { API_ENDPOINTS } from '@/constants/apiRoutes';
import { BOOKS_STORE_DATA } from '@/constants/mockData';

export const booksService = {
  getBooks: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BOOKS);
      return response.data?.results || response.data || BOOKS_STORE_DATA;
    } catch (error) {
      console.warn('Backend API offline, using books fallback data');
      return BOOKS_STORE_DATA;
    }
  },

  placeBookOrder: async (orderData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.BOOK_ORDER, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'تعذر إرسال طلب الكتاب' };
    }
  },

  downloadBook: async (bookId) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BOOK_DOWNLOAD(bookId), {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'تعذر تحميل الكتاب' };
    }
  }
};
