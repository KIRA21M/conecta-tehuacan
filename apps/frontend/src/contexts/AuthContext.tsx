'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, SessionUser, authAPI } from '../services/api';

interface AuthContextType {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const session = await authAPI.login(email, password);
      setUser(session.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
    } catch (error) {
      // Even if logout fails, clear local state
      setUser(null);
    }
  };

  const refreshSession = async () => {
    try {
      const session = await authAPI.refresh();
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const session = authAPI.getSession();
      if (session) {
        // Try to refresh to validate the session
        await refreshSession();
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'session') {
        if (e.newValue) {
          try {
            const session = JSON.parse(e.newValue);
            setUser(session.user);
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}