"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// -------------------- Types & Interfaces --------------------
interface IUser {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
}

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<{ success: boolean; message: string }>;
  signup: (
    email: string,
    password: string,
    username: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface IVerifyUser {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
}

interface IVerifyResponse {
  success: boolean;
  message: string;
  data: {
    user: IVerifyUser;
  };
}

interface ILoginResponseUser {
  id: string;
  email: string;
  username: string;
}
interface ILoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: ILoginResponseUser;
  };
}

interface ISignupResponse {
  success: boolean;
  message: string;
}

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

  // ---------- Effect: Check Auth on Mount ----------
  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Helper: Clear Auth Data ----------
  const clearAuthData = () => {
    localStorage.removeItem("chatfly-user");
    localStorage.removeItem("chatfly-token");
    document.cookie =
      "chatfly-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  // ---------- Auth Check ----------
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);

      const storedUser = localStorage.getItem("chatfly-user");
      const storedToken = localStorage.getItem("chatfly-token");

      if (storedUser && storedToken) {
        // Verify token with server
        const response = await axios.get<IVerifyResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        const data = response.data;

        if (response.status === 200 && data.success && data.data.user) {
          setToken(storedToken);
          setUser({
            id: data.data.user.id,
            email: data.data.user.email,
            username: data.data.user.username,
            avatar: data.data.user.avatar ?? undefined,
          });

          document.cookie = `chatfly-token=${storedToken}; path=/; max-age=${
            7 * 24 * 60 * 60
          }; Secure; SameSite=Strict`;
        } else {
          clearAuthData();
        }
      }
    } catch (error: unknown) {
      console.error("Auth check failed:", error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Login ----------
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        { email, password }
      );

      const data = response.data as ILoginResponse;

      if (response.status === 200 && data.success) {
        const { user, token } = data.data;

        if (rememberMe) {
          localStorage.setItem("chatfly-user", JSON.stringify(user));
          localStorage.setItem("chatfly-token", token);
        } else {
          sessionStorage.setItem("chatfly-user", JSON.stringify(user));
          sessionStorage.setItem("chatfly-token", token);
        }

        document.cookie = `chatfly-token=${token}; path=/; max-age=${
          7 * 24 * 60 * 60
        }; Secure; SameSite=Strict`;

        setUser(user);
        return { success: true, message: data.message };
      }

      return { success: false, message: data.message };
    } catch (error: unknown) {
      const message = "Login failed";
      const err = error as {
        response?: { data?: { message: string } };
        message?: string;
      };
      return {
        success: false,
        message: err.response?.data?.message || err.message || message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Signup ----------
  const signup = async (
    email: string,
    password: string,
    username: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
        { email, password, username }
      );

      const data = response.data as ISignupResponse;

      if (response.status === 201 && data.success) {
        return { success: true, message: data.message };
      }

      return { success: false, message: data.message };
    } catch (error: unknown) {
      const message = "Signup failed";

      const err = error as {
        response?: { data?: { message: string } };
        message?: string;
      };
      return {
        success: false,
        message: err.response?.data?.message || err.message || message,
      };
    } finally {
      setIsLoading(false);
    }
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
