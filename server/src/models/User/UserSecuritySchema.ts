// models/subSchemas/UserSecuritySchema.ts

import { Schema } from "mongoose";

// 🔥 TypeScript Interface
export interface IUserSecurity {
    otp?: string;
    otpExpires?: Date;
    otpVerified: boolean;
    emailVerified: boolean;
    verificationToken?: string;
    verificationExpires?: Date;
}

/*
  !TODO: Main Security Schema
  This schema manages user security settings, including OTP, email verification, and account recovery.
*/
export const UserSecuritySchema: Schema<IUserSecurity> = new Schema({
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },
    otpVerified: { type: Boolean, default: false, select: false },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String, select: false },
    verificationExpires: { type: Date, select: false },
}, { _id: false });