"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthContextType } from "@/types/auth";
import { MOCK_USERS, DEFAULT_MOCK_USER } from "@/lib/mock-auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "procurly_mock_auth_user_id";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved mock session from localStorage
    try {
      const savedId = localStorage.getItem(STORAGE_KEY);
      if (savedId) {
        const found = MOCK_USERS.find((u) => u.id === savedId);
        if (found) {
          setUser(found);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
    // Default to initial mock user
    setUser(DEFAULT_MOCK_USER);
    setIsLoading(false);
  }, []);

  const login = async (userIdOrEmail: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate brief network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    const found = MOCK_USERS.find(
      (u) => u.id === userIdOrEmail || u.email.toLowerCase() === userIdOrEmail.toLowerCase()
    );
    if (found) {
      setUser(found);
      try {
        localStorage.setItem(STORAGE_KEY, found.id);
      } catch {
        // Ignore storage errors
      }
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const switchUser = (userId: string) => {
    const found = MOCK_USERS.find((u) => u.id === userId);
    if (found) {
      setUser(found);
      try {
        localStorage.setItem(STORAGE_KEY, found.id);
      } catch {
        // Ignore storage errors
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        availableUsers: MOCK_USERS,
        login,
        logout,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
