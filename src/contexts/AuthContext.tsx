import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Check for saved user data with email
      const savedUserData = localStorage.getItem(`user_${parsedUser.email}`);
      if (savedUserData) {
        setUser(JSON.parse(savedUserData));
      } else {
        setUser(parsedUser);
      }
    }
    setLoading(false);
  }, []);

  const signOut = () => {
    if (user) {
      // Save user data before signing out
      localStorage.setItem(`user_${user.email}`, JSON.stringify(user));
    }
    localStorage.removeItem('user');
    localStorage.removeItem('habits');
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);