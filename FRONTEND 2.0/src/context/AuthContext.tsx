import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import api from "../services/api";

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, password?: string, name?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("moneyforge_token");
      if (token) {
        try {
          // Attempt to fetch user profile using the token
          const { data } = await api.get('/api/user/profile');
          // Map backend user to frontend User type if needed
          setUser({
            id: data._id || Math.random().toString(36).substr(2, 9),
            email: data.email,
            name: data.name,
            joinedAt: data.createdAt || new Date().toISOString(),
          });
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("moneyforge_token");
        }
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email: string, password?: string) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    
    if (data.token) {
      localStorage.setItem("moneyforge_token", data.token);
    }
    
    setUser({
      id: data._id || Math.random().toString(36).substr(2, 9),
      email: data.email,
      name: data.name,
      joinedAt: new Date().toISOString(),
    });
  };

  const signup = async (email: string, password?: string, name?: string) => {
    const { data } = await api.post('/api/auth/register', { email, password, name });
    
    if (data.token) {
      localStorage.setItem("moneyforge_token", data.token);
    }
    
    setUser({
      id: data._id || Math.random().toString(36).substr(2, 9),
      email: data.email,
      name: data.name,
      joinedAt: new Date().toISOString(),
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("moneyforge_token");
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
