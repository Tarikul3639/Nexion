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

interface IPhotoUploadResponse {
  success: boolean;
  message: string;
  url?: string;
  avatar?: string;
}

interface ProfileContextType {
  updateProfile: (
    userData: Partial<IUser>,
    token: string
  ) => Promise<{ success: boolean; message: string }>;
  uploadProfilePhoto: (
    file: File,
    userId: string,
    token: string
  ) => Promise<{ success: boolean; message: string; url?: string }>;
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/me`,
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

  // ---------- Upload Profile Photo ----------
  const uploadProfilePhoto = async (
    file: File,
    userId: string,
    token: string
  ): Promise<{ success: boolean; message: string; url?: string }> => {
    try {
      setIsLoading(true);
      
      if (!file || !file.type.startsWith("image/")) {
        return { success: false, message: "Invalid file type. Please upload an image." };
      }
      
      const formData = new FormData();
      formData.append("avatar", file);
      // No need to send userId, it will be extracted from the token by the server
      
      const response = await axios.post<IPhotoUploadResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (response.status >= 200 && response.status < 300 && response.data.success) {
        return { 
          success: true, 
          message: "Profile photo uploaded successfully",
          url: response.data.url || response.data.avatar || undefined
        };
      }
      
      return { 
        success: false, 
        message: response.data.message || "Failed to upload profile photo" 
      };
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message: string } };
        message?: string;
      };
      
      return { 
        success: false, 
        message: err.response?.data?.message || err.message || "Failed to upload profile photo" 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Context Value ----------
  const value: ProfileContextType = {
    updateProfile,
    uploadProfilePhoto,
    isLoading,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
