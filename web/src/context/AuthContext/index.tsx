"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUser, AuthContextType } from "@/types/auth";
import { useRouter } from "next/navigation";
import { ValidationCheck } from "./ValidationCheck";
import { StorageClear } from "./StorageClear";
import { useGoogleAuth } from "./useGoogleAuth";
import { useGithubAuth } from "./useGithubAuth";
import { loginUser } from "./login";
import { signupUser } from "./SignUp";

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
    ValidationCheck(storedUser, storedToken, setUser, setToken, setIsLoading);
  }, []);

  // ---------- Login ----------
  const login = (email: string, password: string, rememberMe: boolean) => {
    return loginUser(email, password, rememberMe, setUser, setToken);
  };

  // ---------- Signup ----------
  const signup = (email: string, password: string, username: string) => {
    return signupUser(email, password, username, setIsLoading);
  };

  // ---------- Logout ----------
  const logout = () => {
    StorageClear();
    router.push("/auth/login");
  };
  // ---------- Login with Google ----------
  const { loginWithGoogle } = useGoogleAuth({
    setUser,
    setToken
  });

  // ---------- Login with GitHub ----------
  const { loginWithGithub } = useGithubAuth({
    setUser,
    setToken
  });

  // ---------- Context Value ----------
  const value = {
    user,
    setUser,
    token,
    login,
    loginWithGoogle,
    loginWithGithub,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  // ---------- Render ----------
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
