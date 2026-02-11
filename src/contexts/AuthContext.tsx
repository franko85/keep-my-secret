import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types';
import { authService } from '../services/authService';
import {
  saveAuthToken,
  saveCurrentUser,
  getCurrentUser,
  getAuthToken,
  clearAuth,
} from '../mocks/storage';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carica utente dal localStorage all'avvio
  useEffect(() => {
    const savedUser = getCurrentUser();
    const savedToken = getAuthToken();

    if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);

      setUser(response.user);
      setToken(response.token);

      saveCurrentUser(response.user);
      saveAuthToken(response.token);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);

      setUser(response.user);
      setToken(response.token);

      saveCurrentUser(response.user);
      saveAuthToken(response.token);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearAuth();
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere usato all\'interno di AuthProvider');
  }
  return context;
};

