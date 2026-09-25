import apiClient from './api';
import { API_ENDPOINTS } from '@/constants/apiRoutes';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, { username, password });
      if (response.data.access || response.data.token) {
        const token = response.data.access || response.data.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem('dw_token', token);
          if (response.data.user) {
            localStorage.setItem('dw_user', JSON.stringify(response.data.user));
          }
        }
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'فشل تسجيل الدخول. تحقق من اسم المستخدم وكلمة المرور' };
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'حدث خطأ أثناء إنشاء الحساب' };
    }
  },

  logout: async () => {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (e) {
      // ignore
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('dw_token');
        localStorage.removeItem('dw_user');
      }
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PROFILE);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'تعذر جلب ملف المستخدم' };
    }
  },

  googleSignIn: async (credential) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.GOOGLE_SIGNIN, { credential });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'فشل التسجيل بحساب جوجل' };
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'فشل إرسال رابط إعادة الضبط' };
    }
  }
};
