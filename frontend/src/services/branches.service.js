import apiClient from './api';
import { API_ENDPOINTS } from '@/constants/apiRoutes';
import { BRANCHES_DATA } from '@/constants/mockData';

export const branchesService = {
  getBranches: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BRANCHES);
      return response.data?.results || response.data || BRANCHES_DATA;
    } catch (error) {
      return BRANCHES_DATA;
    }
  }
};
