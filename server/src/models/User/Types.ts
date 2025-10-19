import mongoose, { Document } from "mongoose";

// 🔹 Interface (TypeScript)
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  username: string;
  usernameBackup?: string;
  email: string;
  emailBackup?: string;
  password: string;
  avatar?: string;
  status: "online" | "offline" | "away" | "busy";
  bio?: string;

  // 🔹 Social & Privacy
  friends: mongoose.Types.ObjectId[];
  blockedUsers: mongoose.Types.ObjectId[];
  blockedBy: mongoose.Types.ObjectId[];
  friendRequests: {
    from: mongoose.Types.ObjectId;
    status: "pending" | "accepted" | "rejected";
    createdAt: Date;
  }[];

  // 🔹 Activity & Tracking
  lastSeen?: Date;
  lastActiveAt?: Date;
  loginHistory: {
    ipAddress?: string;
    userAgent?: string;
    loginMethod?: string;
    status?: string;
    loginAt?: Date;
  }[];
  sessions: {
    createdAt?: Date;
    expiresAt?: Date;
    userAgent?: string;
    ipAddress?: string;
    token?: string;
  }[];

  // 🔹 OAuth
  oauth: {
    provider: "google" | "github";
    providerId: string;
    email?: string;
    avatar?: string;
  }[];

  // 🔹 Security & Verification
  otp?: string;
  otpExpires?: Date;
  otpVerified?: boolean;
  emailVerified?: boolean;
  verificationToken?: string;
  verificationExpires?: Date;

  // 🔹 Account Management
  role: "admin" | "teacher" | "student" | "user";
  isDeleted: boolean;
  deletedAt?: Date;

  // 🔹 Privacy Settings
  privacy: {
    showLastSeen: boolean;
    showStatus: boolean;
    allowFriendRequests: boolean;
  };

  recoveryEmail?: string;

  // 🔹 Timestamps
  createdAt: Date;
  updatedAt: Date;

  // 🔹 Methods
  comparePassword(enteredPassword: string): Promise<boolean>;
  restoreAccount(): Promise<void>;
}
