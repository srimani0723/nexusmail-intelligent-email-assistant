import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '../types';
import { authApi } from '../api/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);

      // Check if OAuth callback redirected with a token query parameter
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get('token');
      if (tokenParam) {
        localStorage.setItem('nexus_token', tokenParam);
        // Clean URL to remove the token parameter from address bar
        params.delete('token');
        const newSearch = params.toString() ? `?${params.toString()}` : '';
        window.history.replaceState({}, document.title, window.location.pathname + newSearch);
      }

      const data = await authApi.getMe();
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = () => {
    window.location.href = '/api/auth/google';
  };

  const logout = async () => {
    try {
      localStorage.removeItem('nexus_token');
      await authApi.logout();
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      localStorage.removeItem('nexus_token');
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
