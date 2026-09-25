import apiClient from './api';
import { API_ENDPOINTS } from '@/constants/apiRoutes';

export const quizService = {
  submitQuiz: async (quizData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PLACEMENT_QUIZ, quizData);
      return response.data;
    } catch (error) {
      return { score: quizData.score, recommended_level: quizData.recommended_level };
    }
  }
};
