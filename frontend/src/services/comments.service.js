import apiClient from './api';
import { API_ENDPOINTS } from '@/constants/apiRoutes';

export const commentsService = {
  getComments: async (levelId, videoId) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.VIDEO_COMMENTS(levelId, videoId));
      return response.data?.results || response.data || [];
    } catch (error) {
      return [];
    }
  },

  postComment: async (levelId, videoId, text) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.VIDEO_COMMENTS(levelId, videoId), { text });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'فشل إرسال التعليق' };
    }
  },

  replyToComment: async (levelId, videoId, commentId, text) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.COMMENT_REPLY(levelId, videoId, commentId), { text });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'فشل إرسال الرد' };
    }
  }
};
