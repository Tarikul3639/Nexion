import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "./Types";

type NextFunction = (err?: Error) => void;

/* -----------------------------------------------
 * 🔐 Password Hash Middleware
 * -----------------------------------------------
 * This middleware automatically hashes a user's password
 * before saving it to the database, using bcrypt.
 * It runs only when the password field has been modified.
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
 * 🧩 Soft Delete Middleware
 * -----------------------------------------------
 * Instead of permanently deleting a user from the database,
 * this middleware performs a "soft delete" — marking the user
 * as deleted while preserving their data for recovery or logging.
 */
export const softDeleteMiddleware = async function (
  this: mongoose.Query<IUser | null, IUser>,
  next: NextFunction
) {
  const query = this.getQuery();
  const user = await this.model.findOne(query);

  if (user) {
    // Backup original username and email
    user.usernameBackup = user.username;
    user.emailBackup = user.email;

    // Apply soft delete flags and data
    user.isDeleted = true;
    user.deletedAt = new Date();
    user.username = user.username ? `deleted_${user._id}` : undefined;
    user.email = user.email ? `deleted_${user._id}` : undefined;

    // Invalidate all active sessions
    user.sessions = [];

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
 * Automatically excludes soft-deleted users from
 * query results unless explicitly overridden.
 */
export const filterDeletedUsersMiddleware = function (
  this: mongoose.Query<IUser[] | IUser | null, IUser>,
  next: NextFunction
) {
  this.where({ isDeleted: false });
  next();
};

/* -----------------------------------------------
 * 🧹 Post-Soft Delete Cleanup Logic
 * -----------------------------------------------
 * This function performs cleanup tasks after a user
 * has been soft-deleted — updating related conversations
 * and messages while preserving recovery capability.
 */
export const postSoftDeleteCleanup = async function (doc: IUser & Document) {
  // Run only if the user was actually soft-deleted
  if (!doc.isDeleted) return;

  const Conversation = mongoose.model("Conversation");
  const Message = mongoose.model("Message");
  const docId = doc._id;

  // 1️⃣ Handle Group/Classroom Chats
  // Remove the deleted user from all group/classroom participants
  await Conversation.updateMany(
    {
      participants: docId,
      type: { $in: ["group", "classroom"] }, // Select 'group' and 'classroom' chats
    },
    { $pull: { participants: docId } } // Remove user from participants array
  );

  // 2️⃣ Handle Direct Chats
  // Instead of removing the user, mark them as inactive
  // so the chat remains accessible for history or recovery.
  await Conversation.updateMany(
    {
      participants: docId,
      type: "direct", // Select only direct chats
    },
    {
      $addToSet: { inactiveParticipants: docId }, // Add to inactive list (avoids duplicates)
    }
  );

  // 3️⃣ Update Messages
  // Replace sender references with a placeholder while
  // keeping a backup of the original sender ID.
  await Message.updateMany(
    { sender: docId },
    {
      $set: {
        senderName: "Deleted User",
        sender: null, // Remove MongoDB reference to the user
        senderIdBackup: docId, // Preserve ID for potential recovery
      },
    }
  );

  console.log(`🧹 Soft-deleted user cleanup completed for: ${doc.email}`);
};
