/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'HR';
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getInitialUser = (): User | null => {
  const storedUser = localStorage.getItem('hrms_user');
  if (storedUser) {
    const parsed = JSON.parse(storedUser) as User;
    api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
    return parsed;
  }
  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const navigate = useNavigate();

  const login = (userData: User) => {
    localStorage.setItem('hrms_user', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    setUser(userData);
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrms_user');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

// Re-export useAuth from dedicated hook file for convenience
export { useAuth } from './useAuth';
