// Middlewares.ts

import mongoose, { Document, Types } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "./Types"; // Assuming IUser is imported here

type NextFunction = (err?: Error) => void;

/* -----------------------------------------------
 * 🔐 Password Hash Middleware
 * -----------------------------------------------
 * This middleware automatically hashes a user's password
 * before saving it to the database, using bcrypt.
 */
export const hashPasswordMiddleware = async function (
  this: Document & IUser,
  next: NextFunction
) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
};

/* -----------------------------------------------
 * 🧩 Soft Delete Middleware (UPDATED)
 * -----------------------------------------------
 * Performs a "soft delete" by updating the user document.
 */
export const softDeleteMiddleware = async function (
  this: mongoose.Query<IUser | null, IUser>,
  next: NextFunction
) {
  const query = this.getQuery();
  // Ensure we are finding the user model
  const user = await (this.model as mongoose.Model<IUser>).findOne(query);

  if (user) {
    // Backup original username and email
    user.usernameBackup = user.username;
    user.emailBackup = user.email;

    // Apply soft delete flags and data
    user.isDeleted = true;
    user.deletedAt = new Date();
    user.username = user.username ? `deleted_${user._id}` : undefined;
    user.email = user.email ? `deleted_${user._id}` : undefined;

    // 🔥 Invalidate all active sessions (UPDATED PATH)
    // Assuming 'sessions' is now nested under 'tracking'
    if (user.tracking) {
      user.tracking.sessions = [];
    }

    await user.save();

    // Stop the actual delete operation
    const err = new Error("Soft delete applied instead of real delete");
    // @ts-ignore
    err.name = "SoftDeleteStop";
    return next(err);
  }

  next();
};

/* -----------------------------------------------
 * 🚫 Filter Deleted Users Middleware
 * -----------------------------------------------
 * Automatically excludes soft-deleted users from query results.
 */
export const filterDeletedUsersMiddleware = function (
  this: mongoose.Query<IUser[] | IUser | null, IUser>,
  next: NextFunction
) {
  this.where({ isDeleted: false });
  next();
};

/* -----------------------------------------------
 * 🧹 Post-Soft Delete Cleanup Logic (UPDATED)
 * -----------------------------------------------
 * Performs cleanup tasks on related models (Conversation, Message).
 */
export const postSoftDeleteCleanup = async function (doc: IUser & Document) {
  // Run only if the user was actually soft-deleted
  if (!doc.isDeleted) return;

  const Conversation = mongoose.model("Conversation");
  const Message = mongoose.model("Message");
  const docId = doc._id;

  // 1️⃣ Handle Group/Classroom Chats
  await Conversation.updateMany(
    {
      participants: docId,
      type: { $in: ["group", "classroom"] },
    },
    { $pull: { participants: docId } }
  );

  // 2️⃣ Handle Direct Chats
  await Conversation.updateMany(
    {
      participants: docId,
      type: "direct",
    },
    {
      $addToSet: { inactiveParticipants: docId },
    }
  );

  // 3️⃣ Update Messages (UPDATED SENDER FIELD)
  await Message.updateMany(
    { senderId: docId }, // Assuming Message schema uses senderId now
    {
      $set: {
        senderName: "Deleted User",
        senderId: null, // 🔥 Corrected: Changed from 'sender' to 'senderId'
        senderIdBackup: docId,
        senderAvatar: undefined, // Clear the avatar cache
      },
      $pull: { 
        reactions: { reactedBy: docId } // Remove any reactions made by the deleted user
      }
    }
  );
  
  console.log(`🧹 Soft-deleted user cleanup completed for: ${doc.email}`);
};
