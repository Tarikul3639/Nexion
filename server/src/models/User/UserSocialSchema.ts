// models/subSchemas/UserSocialSchema.ts

import { Schema, Types } from "mongoose";

// 🔥 TypeScript Interface
interface IFriendRequest {
    from: Types.ObjectId;
    status: "pending" | "accepted" | "rejected";
    createdAt: Date;
}
export interface IUserSocial {
    friends: Types.ObjectId[];
    blockedUsers: Types.ObjectId[];
    blockedBy: Types.ObjectId[];
    requests: IFriendRequest[];
}

// Sub-Schema for Friend Requests
const FriendRequestSchema = new Schema<IFriendRequest>({
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
}, { _id: false });


/*
  !TODO: Main Social Schema
  This schema manages user social interactions, including friends, blocked users, and friend requests.
*/
export const UserSocialSchema: Schema<IUserSocial> = new Schema({
    friends: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    blockedBy: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    requests: [FriendRequestSchema],
}, { _id: false });