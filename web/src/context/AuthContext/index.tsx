"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { IUser, AuthContextType } from "@/types/auth";
import { useRouter } from "next/navigation";
import { checkAuthStatus } from "./checkAuthStatus";
import { clearAuthData } from "./clearAuthData";
import { loginUser } from "./loginUser";
import { signupUser } from "./signupUser";

// -------------------- Context & Hook --------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// -------------------- Provider Component --------------------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // ---------- State ----------
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Auth Check
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    checkAuthStatus(storedUser, storedToken, setUser, setToken, setIsLoading);
  }, []);

  // ---------- Login ----------
  const login = (email: string, password: string, rememberMe: boolean) => {
    return loginUser(email, password, rememberMe, setUser, setIsLoading);
  };

  // ---------- Signup ----------
  const signup = (email: string, password: string, username: string) => {
    return signupUser(email, password, username, setIsLoading);
  };

  // ---------- Logout ----------
  const logout = () => {
    clearAuthData();
    router.push("/auth/login");
  };

  // ---------- Context Value ----------
  const value = {
    user,
    token,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  // ---------- Render ----------
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
