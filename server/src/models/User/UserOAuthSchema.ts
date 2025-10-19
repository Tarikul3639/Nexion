// models/subSchemas/UserOAuthSchema.ts

import { Schema } from "mongoose";

// 🔥 TypeScript Interface
export interface IAuthProvider {
    provider: "email" | "google" | "facebook" | "twitter" | "github";
    providerId?: string;
    email?: string;
    avatar?: string;
}
/*
  !TODO: Main OAuth Schema
  This schema manages user authentication through various OAuth providers.
  ~Main OAuth Schema (Used as an Array in User Model)
*/
export const UserOAuthSchema: Schema<IAuthProvider> = new Schema({
    provider: { type: String, enum: ["email", "google", "facebook", "twitter", "github"], default: "email", required: true },
    providerId: { type: String },
    email: { type: String },
    avatar: { type: String },
}, { _id: false });