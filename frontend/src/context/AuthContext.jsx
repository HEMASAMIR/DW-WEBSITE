'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sync stored user token on app mount
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('dw_token');
      const storedUser = localStorage.getItem('dw_user');
      if (storedToken) {
        setToken(storedToken);
      }
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {}
      }
      
      // Fetch fresh profile from Django backend if token exists
      if (storedToken) {
        authService.getProfile()
          .then((profileData) => {
            setUser(profileData);
            localStorage.setItem('dw_user', JSON.stringify(profileData));
          })
          .catch(() => {
            // Token might be expired
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    const jwtToken = data.access || data.token;
    setToken(jwtToken);
    if (data.user) {
      setUser(data.user);
    } else {
      const profile = await authService.getProfile();
      setUser(profile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('dw_user', JSON.stringify(profile));
      }
    }
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token || !!user,
    isAdmin: user?.is_staff || user?.role === 'admin' || user?.is_superuser,
    login,
    register,
    logout,
    setUser
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
