import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('fitpeak_token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('fitpeak_token');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      const stored = localStorage.getItem('fitpeak_token');
      if (!stored) {
        setLoading(false);
        return;
      }
      try {
        const data = await authAPI.me();
        setUser(data);
        setToken(stored);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [logout]);

  const login = async (credentials) => {
    const data = await authAPI.login(credentials);
    const receivedToken = data.access_token || data.token;
    localStorage.setItem('fitpeak_token', receivedToken);
    setToken(receivedToken);
    const me = await authAPI.me();
    setUser(me);
    return me;
  };

  const register = async (userData) => {
    const data = await authAPI.register(userData);
    const receivedToken = data.access_token || data.token;
    if (receivedToken) {
      localStorage.setItem('fitpeak_token', receivedToken);
      setToken(receivedToken);
      const me = await authAPI.me();
      setUser(me);
      return me;
    }
    return data;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
