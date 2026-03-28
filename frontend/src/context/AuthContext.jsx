import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const normalizeUser = (user) => {
  if (!user) return null;

  let normalizedAddress = user.address;
  if (typeof user.address === 'string') {
    try {
      normalizedAddress = JSON.parse(user.address);
    } catch {
      normalizedAddress = user.address;
    }
  }

  return {
    ...user,
    address: normalizedAddress,
    cafe_id: user.cafe_id || null,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mxp_user');
    return saved ? normalizeUser(JSON.parse(saved)) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('mxp_token'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('mxp_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mxp_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('mxp_token', token);
    } else {
      localStorage.removeItem('mxp_token');
    }
  }, [token]);

  const login = async (payload) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Login failed');
      }

      const nextUser = normalizeUser(result.data?.user);
      const nextToken = result.data?.token;

      setUser(nextUser);
      setToken(nextToken || null);

      return nextUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Signup failed');
      }

      const nextUser = normalizeUser(result.data?.user);
      const nextToken = result.data?.token;

      setUser(nextUser);
      setToken(nextToken || null);

      return nextUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
      return normalizeUser(next);
    });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
