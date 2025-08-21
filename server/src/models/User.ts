// models/User.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  bio?: string;
  friends: mongoose.Types.ObjectId[];
  blockedUsers: mongoose.Types.ObjectId[];
  lastSeen?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: { type: String, default: "C" },
    status: { type: String, enum: ["online", "offline", "away"], default: "offline" },
    bio: { type: String, maxLength: 150 },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastSeen: { type: Date },
  },
  { timestamps: true }
);

// Index for searching by username or email
UserSchema.index({ username: "text", email: "text" });

export default mongoose.model<IUser>("User", UserSchema);
