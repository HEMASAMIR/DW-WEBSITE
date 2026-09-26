import apiClient from './api';
import { API_ENDPOINTS } from '@/constants/apiRoutes';

export const COMMENT_MAX_LENGTH = 2000;
export const COMMENT_EDIT_WINDOW_MS = 15 * 60 * 1000;
export const REMOVED_COMMENT_TEXT = 'This comment was removed.';

export const commentsService = {
  /** Returns the paginated payload: { count, next, previous, results }. */
  getComments: async (levelId, videoId, page = 1) => {
    const { data } = await apiClient.get(API_ENDPOINTS.VIDEO_COMMENTS(levelId, videoId), { params: { page } });
    if (Array.isArray(data)) return { count: data.length, next: null, previous: null, results: data };
    return data;
  },

  postComment: async (levelId, videoId, content) => {
    const { data } = await apiClient.post(API_ENDPOINTS.VIDEO_COMMENTS(levelId, videoId), { content });
    return data;
  },

  replyToComment: async (levelId, videoId, commentId, content) => {
    const { data } = await apiClient.post(API_ENDPOINTS.COMMENT_REPLY(levelId, videoId, commentId), { content });
    return data;
  },

  editComment: async (levelId, videoId, commentId, content) => {
    const { data } = await apiClient.put(API_ENDPOINTS.COMMENT_DETAIL(levelId, videoId, commentId), { content });
    return data;
  },

  deleteComment: async (levelId, videoId, commentId) => {
    const { data } = await apiClient.delete(API_ENDPOINTS.COMMENT_DETAIL(levelId, videoId, commentId));
    return data;
  },
};

export function canStillEdit(comment) {
  if (!comment?.is_owner || !comment.created_at || comment.content === REMOVED_COMMENT_TEXT) return false;
  return Date.now() - new Date(comment.created_at).getTime() < COMMENT_EDIT_WINDOW_MS;
}
