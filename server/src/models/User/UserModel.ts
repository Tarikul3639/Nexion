import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "./UserTypes";
import {
  hashPasswordMiddleware,
  softDeleteMiddleware,
  filterDeletedUsersMiddleware,
  postSoftDeleteCleanup,
} from "./UserMiddlewares";

// Create the schema
export const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true, maxLength: 50 },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      sparse: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    usernameBackup: { type: String, select: false },
    emailBackup: { type: String, select: false },
    password: { type: String, minlength: 6, select: false },

    avatar: { type: String, default: "https://example.com/default-avatar.png" },
    bio: { type: String, maxLength: 150 },
    status: {
      type: String,
      enum: ["online", "offline", "away", "busy"],
      default: "offline",
    },

    // 🔹 Social
    friends: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    blockedUsers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    blockedBy: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],

    friendRequests: [
      {
        from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // 🔹 Tracking
    lastSeen: { type: Date },
    lastActiveAt: { type: Date, default: Date.now },
    loginHistory: [
      {
        ipAddress: String,
        userAgent: String,
        loginMethod: {
          type: String,
          enum: ["email", "google", "facebook", "twitter", "github"],
          default: "email",
        },
        status: {
          type: String,
          enum: ["success", "failed"],
          default: "success",
        },
        loginAt: { type: Date, default: Date.now },
      },
    ],
    sessions: [
      {
        createdAt: { type: Date, default: Date.now },
        expiresAt: {
          type: Date,
          default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }, // 7 days later
        userAgent: String,
        ipAddress: String,
        token: { type: String, select: false },
      },
    ],

    // 🔹 OAuth
    oauth: [
      {
        provider: {
          type: String,
          enum: ["email", "google", "facebook", "twitter", "github"],
          default: "email",
          required: true,
        },
        providerId: { type: String },
        email: { type: String },
        avatar: { type: String },
      },
    ],

    // 🔹 Security
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },
    otpVerified: { type: Boolean, default: false, select: false },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String, select: false },
    verificationExpires: { type: Date, select: false },

    // 🔹 Role & Management
    role: {
      type: String,
      enum: ["admin", "teacher", "student", "user"],
      default: "user",
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    // 🔹 Privacy
    privacy: {
      showLastSeen: { type: Boolean, default: true },
      showStatus: { type: Boolean, default: true },
      allowFriendRequests: { type: Boolean, default: true },
    },

    recoveryEmail: { type: String, lowercase: true, trim: true },
  },
  { timestamps: true }
);

// ⚡ Index Optimization
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ lastActiveAt: -1 });
UserSchema.index({ "loginHistory.time": -1 });

// 🧠 Middlewares
UserSchema.pre("save", hashPasswordMiddleware);
UserSchema.pre("findOneAndDelete", softDeleteMiddleware);
UserSchema.pre(/^find/, filterDeletedUsersMiddleware);
UserSchema.post("save", postSoftDeleteCleanup);

// Methods
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};
UserSchema.methods.restoreAccount = async function () {
  this.isDeleted = false;
  this.deletedAt = undefined;
  await this.save();
};

// Export the model
export default mongoose.model<IUser>("User", UserSchema);
