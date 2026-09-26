import apiClient, { tokenStorage } from './api';
import { API_ENDPOINTS } from '@/constants/apiRoutes';

function persistSession(data) {
  tokenStorage.setTokens({ access: data.access, refresh: data.refresh });
  if (data.user) tokenStorage.setUser(data.user);
  return data;
}

export const authService = {
  login: async (email, password) => {
    const { data } = await apiClient.post(API_ENDPOINTS.LOGIN, { email: email.trim().toLowerCase(), password });
    return persistSession(data);
  },

  register: async ({ email, password, first_name, last_name, phone_number }) => {
    const { data } = await apiClient.post(API_ENDPOINTS.REGISTER, {
      email: email.trim().toLowerCase(),
      password,
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      phone_number: phone_number.trim(),
    });
    return data;
  },

  googleSignIn: async (idToken) => {
    const { data } = await apiClient.post(API_ENDPOINTS.GOOGLE_SIGNIN, { id_token: idToken });
    return persistSession(data);
  },

  logout: async () => {
    const refresh = tokenStorage.getRefresh();
    try {
      if (refresh) await apiClient.post(API_ENDPOINTS.LOGOUT, { refresh });
    } catch {
      // Token may already be invalid — local logout still proceeds.
    } finally {
      tokenStorage.clear();
    }
  },

  forgotPassword: async (email) => {
    const { data } = await apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, { email: email.trim().toLowerCase() });
    return data;
  },

  resetPassword: async ({ email, otp, new_password }) => {
    const { data } = await apiClient.post(API_ENDPOINTS.RESET_PASSWORD, {
      email: email.trim().toLowerCase(),
      otp: otp.trim(),
      new_password,
    });
    return data;
  },

  /** Returns the `user` object ({first_name, last_name, phone_number, profile_photo}). */
  getProfile: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.PROFILE);
    return data.user || data;
  },

  /** Partial update. Pass a FormData to upload `profile_photo`. */
  updateProfile: async (fields) => {
    const { data } = await apiClient.put(API_ENDPOINTS.PROFILE, fields);
    return data.user || data;
  },

  changePassword: async ({ old_password, new_password }) => {
    const payload = { new_password };
    if (old_password) payload.old_password = old_password;
    const { data } = await apiClient.post(API_ENDPOINTS.CHANGE_PASSWORD, payload);
    return data;
  },
};
