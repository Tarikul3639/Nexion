// models/Types.ts (or at the top of User.ts)

import mongoose, { Document, Types } from "mongoose";

// 🔥 Import all necessary Sub-Schema Interfaces
// Assuming these are exported from their respective subSchema files
import { IUserSocial } from "./UserSocialSchema";
import { IUserTracking } from "./UserTrackingSchema";
import { IAuthProvider } from "./UserOAuthSchema"; 
import { IUserSecurity } from "./UserSecuritySchema";

// 🔹 Main User Interface
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  username: string | undefined;
  usernameBackup?: string;
  email: string | undefined;
  emailBackup?: string;
  password: string; // select: false in schema
  avatar?: string;
  bio?: string;
  
  // 🔥 REFACTORED SECTIONS (Using Sub-Schema Interfaces)
  social: IUserSocial;
  tracking: IUserTracking; 
  authProviders: IAuthProvider[]; // Renamed from 'oauth'
  security: IUserSecurity;

  // 🔹 Role & Management
  role: "admin" | "teacher" | "student" | "user";
  isDeleted: boolean;
  deletedAt?: Date;

  // 🔹 Privacy Settings (Kept inline as it is small)
  privacy: {
    showLastSeen: boolean;
    showStatus: boolean;
    allowFriendRequests: boolean;
  };

  recoveryEmail?: string;

  // 🔹 Timestamps (Automatically added by { timestamps: true })
  createdAt: Date;
  updatedAt: Date;

  // 🔹 Methods
  comparePassword(enteredPassword: string): Promise<boolean>;
  restoreAccount(): Promise<void>;
}
