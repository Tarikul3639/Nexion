"use client";

import React, { createContext, useContext, useState } from "react";
import axios from "axios";

// -------------------- Types & Interfaces --------------------
interface IUser {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
}

interface IUpdateResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    username: string;
    avatar?: string | null;
  };
}

interface ProfileContextType {
  updateProfile: (
    userData: Partial<IUser>,
    token: string
  ) => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
}

// -------------------- Context & Hook --------------------
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

// -------------------- Provider Component --------------------
export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // ---------- Update Profile ----------
  const updateProfile = async (
    userData: Partial<IUser>,
    token: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);

      const response = await axios.put<IUpdateResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/profile`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (response.status === 200 && data.success) {
        return { success: true, message: data.message };
      }

      return { success: false, message: data.message };
    } catch (error: unknown) {
      const message = "Update failed";

      const err = error as {
        response?: { data?: { message: string } };
        message?: string;
      };

      return { 
        success: false, 
        message: err.response?.data?.message || err.message || message 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Context Value ----------
  const value: ProfileContextType = {
    updateProfile,
    isLoading,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
