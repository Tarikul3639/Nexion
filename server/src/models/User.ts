import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  status: "online" | "offline" | "away" | "busy";
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
    avatar: { type: String, default: "https://example.com/default-avatar.png" },
    status: { type: String, enum: ["online", "offline", "away", "busy"], default: "offline" },
    bio: { type: String, maxLength: 150 },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    lastSeen: { type: Date },
  },
  { timestamps: true }
);

// Indexes for fast search
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

export default mongoose.model<IUser>("User", UserSchema);
