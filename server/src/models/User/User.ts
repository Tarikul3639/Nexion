// models/User.ts (Main User Model)

import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

// 🔥 Import all necessary types and schemas
import { IUser } from "./Types"; // Assuming IUser is defined in ./Types.ts
import { UserSocialSchema } from "./UserSocialSchema";
import { limitTrackingArrayMiddleware, UserTrackingSchema } from "./UserTrackingSchema";
import { UserOAuthSchema } from "./UserOAuthSchema";
import { UserSecuritySchema } from "./UserSecuritySchema";

// 🔥 Import Middlewares (as per your structure)
import { 
  hashPasswordMiddleware,
  softDeleteMiddleware,
  filterDeletedUsersMiddleware,
  postSoftDeleteCleanup,
  // Assuming postAccountRestoreCleanup is defined in Middlewares.ts
} from "./Middlewares";


// Create the main User schema
export const UserSchema: Schema<IUser> = new Schema(
  {
    // 1. CORE IDENTITY & AUTH
    name: { type: String, required: true, trim: true, maxLength: 50 },
    username: {
      type: String, trim: true, required: true, unique: true, sparse: true, minLength: 3,
    },
    email: {
      type: String, required: true, unique: true, lowercase: true, trim: true,
    },
    usernameBackup: { type: String, select: false },
    emailBackup: { type: String, select: false },
    password: { type: String, minlength: 6, select: false },

    // 2. PROFILE INFO
    avatar: { type: String, default: "https://api.dicebear.com/9.x/thumbs/svg?seed=Nexion" },
    bio: { type: String, maxLength: 150 },

    // 3. 🔹 REFACTORED SECTIONS (Using Sub-Schemas)
    social: { type: UserSocialSchema, default: {} },
    tracking: { type: UserTrackingSchema, default: {} },
    authProviders: [UserOAuthSchema], // sub-document array for OAuth providers
    security: { type: UserSecuritySchema, default: {} },

    // 4. ROLE & SOFT DELETE
    role: { type: String, enum: ["admin", "teacher", "student", "user"], default: "user" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    // 5. PRIVACY (Kept inline as it is small)
    privacy: {
      showLastSeen: { type: Boolean, default: true }, // This setting controls whether other users can see when that user was last active (lastSeen timestamp).
      showStatus: { type: Boolean, default: true }, // This setting controls whether other users can see the user's current status (online, offline, busy, etc.).
      allowFriendRequests: { type: Boolean, default: true },
    },

    recoveryEmail: { type: String, lowercase: true, trim: true },
  },
  { timestamps: true }
);

// ⚡ Index Optimization (Paths updated for the new structure)
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ "tracking.lastActiveAt": -1 }); 
UserSchema.index({ "tracking.loginHistory.loginAt": -1 }); 
UserSchema.index({ "social.friends": 1 });
UserSchema.index({ "tracking.status": 1 }); // Status field is assumed to be moved under 'tracking' for better structure


// 🧠 Middlewares
UserSchema.pre("save", hashPasswordMiddleware);
// @ts-ignore: Mongoose 8.x/TypeScript 5.x type conflict workaround.
UserSchema.pre("save", limitTrackingArrayMiddleware);
UserSchema.pre("findOneAndDelete", softDeleteMiddleware);
UserSchema.pre(/^find/, filterDeletedUsersMiddleware);

// Post-save hook for soft-delete/restore logic
UserSchema.post("save", async function (doc: IUser & Document) {
    if (doc.isModified('isDeleted')) {
        if (doc.isDeleted) {
            await postSoftDeleteCleanup(doc);
        }
        // Assuming there will be a postAccountRestoreCleanup middleware too
        // else if (!doc.isDeleted) {
        //     await postAccountRestoreCleanup(doc); 
        // }
    }
});


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
