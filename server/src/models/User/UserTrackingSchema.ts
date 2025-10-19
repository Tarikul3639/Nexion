// models/subSchemas/UserTrackingSchema.ts

import { NextFunction } from "express";
import { Schema } from "mongoose";
import { IUser } from "./Types";

// 🔥 TypeScript Interface
export interface ILoginHistory {
    ipAddress?: string;
    userAgent?: string;
    loginMethod: "email" | "google" | "facebook" | "twitter" | "github";
    status: "success" | "failed";
    loginAt: Date;
}
export interface ISession {
    createdAt: Date;
    expiresAt: Date;
    userAgent?: string;
    ipAddress?: string;
    token?: string;
}
export interface IUserTracking {
    lastSeen?: Date;
    lastActiveAt: Date;
    status: "online" | "offline" | "away" | "busy"; // Moved from root
    loginHistory: ILoginHistory[];
    sessions: ISession[];
}

// Sub-Schema for Login History
const LoginHistorySchema = new Schema<ILoginHistory>({
    ipAddress: String,
    userAgent: String,
    loginMethod: { type: String, enum: ["email", "google", "facebook", "twitter", "github"], default: "email", required: true },
    status: { type: String, enum: ["success", "failed"], default: "success" },
    loginAt: { type: Date, default: Date.now },
}, { _id: false });

// Sub-Schema for Sessions
const SessionSchema = new Schema<ISession>({
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    userAgent: String,
    ipAddress: String,
    token: { type: String, select: false },
}, { _id: false });


/*
    !TODO: Main User Tracking Schema
    This schema tracks user activity, including last seen time, status, login history, and active sessions.
*/
export const UserTrackingSchema: Schema<IUserTracking> = new Schema({
    lastSeen: { type: Date },
    lastActiveAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["online", "offline", "away", "busy"], default: "offline" }, // 🔥 Moved here
    loginHistory: [LoginHistorySchema],
    sessions: [SessionSchema],
}, { _id: false });


/*
    * -----------------------------------------------
    * 📉 Limit Tracking Arrays Middleware
    * This middleware limits the number of entries in the login history and active sessions arrays.
    * It keeps only the most recent 5 entries to optimize storage and performance.
    * -----------------------------------------------
*/
   
export const limitTrackingArrayMiddleware = function (
  this: Document & IUser,
  next: NextFunction
) {
    // ...
    const tracking: IUserTracking = this.tracking;
    const MAX_ENTRIES = 5;

    // If Sessions-number exceeds MAX_ENTRIES, slice it to keep only the latest entries
    if (tracking.sessions && tracking.sessions.length > MAX_ENTRIES) {
        tracking.sessions = tracking.sessions.slice(
        tracking.sessions.length - MAX_ENTRIES
        );
    }

    // Apply the same logic for Login History
    if (tracking.loginHistory && tracking.loginHistory.length > MAX_ENTRIES) {
        tracking.loginHistory = tracking.loginHistory.slice(
        tracking.loginHistory.length - MAX_ENTRIES
        );
    }

  next();
};