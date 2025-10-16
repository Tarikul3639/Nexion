"use client";

import React, { createContext, useContext } from "react";
import { AvatarUpdate } from './AvatarUpdate'
import { ProfileFromUpdate } from './ProfileFromUpdate'

// -------------------- Types & Interfaces --------------------
interface IUser {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatar?: string;
}

interface ProfileContextType {
  ProfileFromUpdate: (
    userData: Partial<IUser>,
    token: string
  ) => Promise<{ success: boolean; message: string }>;
  AvatarUpdate: (
    file: File,
    token: string
  ) => Promise<{ success: boolean; message: string; url?: string }>;
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

  // ---------- Context Value ----------
  const value: ProfileContextType = {
    ProfileFromUpdate,
    AvatarUpdate,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
