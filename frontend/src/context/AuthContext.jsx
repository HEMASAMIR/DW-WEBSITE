'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { tokenStorage, AUTH_LOGOUT_EVENT } from '@/services/api';
import { isTemporaryAdmin } from '@/constants/temporaryAdmins';

const AuthContext = createContext();

export const ADMIN_GROUP = 'Admin';

/** Backend may send groups as ["Admin"] or [{ name: "Admin" }]. */
function hasGroup(user, name) {
  const groups = user?.groups || [];
  return groups.some((g) => (typeof g === 'string' ? g : g?.name) === name);
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const setUser = useCallback((next) => {
    setUserState((prev) => {
      const value = typeof next === 'function' ? next(prev) : next;
      if (value) tokenStorage.setUser(value);
      return value;
    });
  }, []);

  const clearSession = useCallback(() => {
    tokenStorage.clear();
    setUserState(null);
    setIsAuthenticated(false);
  }, []);

  // localStorage is client-only, so the stored session is read after hydration.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const hasToken = !!tokenStorage.getAccess();
    if (!hasToken) {
      tokenStorage.clear();
      setLoading(false);
      return;
    }
    setUserState(tokenStorage.getUser());
    setIsAuthenticated(true);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Validates the session (refreshes the access token if needed) and syncs the latest profile.
    // The profile endpoint does not return id/email/is_staff, so merge instead of replacing.
    authService.getProfile()
      .then((profile) => setUser((prev) => ({ ...(prev || {}), ...profile })))
      .catch((err) => {
        if (err.response?.status === 401) clearSession();
      })
      .finally(() => setLoading(false));
  }, [setUser, clearSession]);

  useEffect(() => {
    window.addEventListener(AUTH_LOGOUT_EVENT, clearSession);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, clearSession);
  }, [clearSession]);

  // TEMPORARY: known "Admin" group accounts until the API returns groups (see constants/temporaryAdmins.js).
  const [tempAdmin, setTempAdmin] = useState(false);
  useEffect(() => {
    let cancelled = false;
    isTemporaryAdmin(user?.email).then((ok) => !cancelled && setTempAdmin(ok));
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const applySession = (data) => {
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const login = async (email, password) => applySession(await authService.login(email, password));

  const loginWithGoogle = async (idToken) => applySession(await authService.googleSignIn(idToken));

  const register = (userData) => authService.register(userData);

  const logout = async () => {
    await authService.logout();
    clearSession();
  };

  const updateProfile = async (fields) => {
    const profile = await authService.updateProfile(fields);
    setUser((prev) => ({ ...(prev || {}), ...profile }));
    return profile;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    // Admin = member of the backend "Admin" group (backend decision: groups, not is_staff/superuser).
    // tempAdmin covers the known admin accounts until the backend returns `groups` in the user object.
    isAdmin: isAuthenticated && (hasGroup(user, ADMIN_GROUP) || tempAdmin),
    login,
    loginWithGoogle,
    register,
    logout,
    updateProfile,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
