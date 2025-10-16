import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "./UserTypes";

type NextFunction = (err?: Error) => void;

// Password Hash Middleware
export const hashPasswordMiddleware = async function (
  this: Document & IUser,
  next: NextFunction
) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
};

// Soft Delete Middleware
export const softDeleteMiddleware = async function (
  this: mongoose.Query<IUser | null, IUser>,
  next: NextFunction
) {
  const query = this.getQuery();
  const user = await this.model.findOne(query);

  if (user) {
    // Backup original data
    user.usernameBackup = user.username;
    user.emailBackup = user.email;

    // Soft delete
    user.isDeleted = true;
    user.deletedAt = new Date();
    user.username = user.username ? `deleted_${user._id}` : undefined;
    user.email = user.email ? `deleted_${user._id}` : undefined;

    // Optional: invalidate sessions
    user.sessions = [];

    await user.save();

    // Stop actual delete
    const err = new Error("Soft delete applied instead of real delete");
    // @ts-ignore
    err.name = "SoftDeleteStop";
    return next(err);
  }

  next();
};

// Auto Filter Out Deleted Users
export const filterDeletedUsersMiddleware = function (
  this: mongoose.Query<IUser[] | IUser | null, IUser>,
  next: NextFunction
) {
  this.where({ isDeleted: false });
  next();
};

// Post-save cleanup for soft delete
export const postSoftDeleteCleanup = async function (doc: IUser & Document) {
  if (doc.isDeleted) {
    const Conversation = mongoose.model("Conversation");
    const Message = mongoose.model("Message");

    await Conversation.updateMany(
      { participants: doc._id },
      { $pull: { participants: doc._id } }
    );

    await Message.updateMany(
      { sender: doc._id },
      { $set: { senderName: "Deleted User", sender: null } }
    );

    console.log(`🧹 Soft-deleted user cleaned up: ${doc.email}`);
  }
};
