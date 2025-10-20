import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { AttachmentSchema, IAttachment } from "./Attachment";
import { ReactionSchema, IReaction } from "./Reaction";

/** 
 * 🔥 IMessage Interface
 * Represents a chat message with support for text, attachments, reactions,
 * soft deletion, system events, and read/delivery tracking.
 */
export interface IMessage extends Document {
  conversationId: Types.ObjectId; 
  senderId: Types.ObjectId | null; 

  /** 
   * IMPORTANT: Cached sender info at the time of sending.
   * Use this for UI display to maintain historical consistency.
   */
  senderName?: string; 
  senderAvatar?: string;

  /** Backup ID for account recovery scenarios */
  senderIdBackup?: Types.ObjectId; 
  
  content: {
    text?: string;
    attachments?: IAttachment[];
  };
  
  type: "text" | "image" | "video" | "file" | "audio" | "system" | "notification"; 
  
  /** Threading / reply reference */
  replyToId?: Types.ObjectId; 
  
  /** Actions & Status */
  reactions: IReaction[];
  isPinned: boolean;
  isEdited: boolean;
  
  /** Soft Delete & Visibility */
  isGloballyDeleted: boolean; 
  deletedForUsers: Types.ObjectId[]; 
  
  /** System Message Fields */
  isSystemMessage: boolean;
  systemEventType?: "user_joined" | "user_left" | "group_renamed" | "chat_created"; 
  
  /** Read Status */
  readBy: Types.ObjectId[];
  deliveryStatus: "sending" | "sent" | "delivered" | "seen"; 
  
  /** Time Tracking */
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema: Schema<IMessage> = new Schema(
  {
    // --------------------------
    // 1️⃣ Core Identification
    // --------------------------
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true, index: true }, 
    senderId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true }, 
    senderIdBackup: { type: Schema.Types.ObjectId, ref: "User", select: false }, 

    // --------------------------
    // 2️⃣ Display Cache (IMPORTANT)
    // --------------------------
    senderName: { type: String }, 
    senderAvatar: { type: String },

    // --------------------------
    // 3️⃣ Content
    // --------------------------
    content: { 
      text: String,
      attachments: [AttachmentSchema],
    },

    // --------------------------
    // 4️⃣ Message Type & Threading
    // --------------------------
    type: { 
      type: String, 
      enum: ["text", "image", "video", "file", "audio", "system", "notification"], 
      default: "text", 
      index: true 
    },
    replyToId: { type: Schema.Types.ObjectId, ref: "Message" }, 

    // --------------------------
    // 5️⃣ Actions & Status
    // --------------------------
    reactions: { type: [ReactionSchema], default: [] }, // NOTE: Default empty array for easier push()
    isPinned: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },

    // --------------------------
    // 6️⃣ System Message Handling
    // --------------------------
    isSystemMessage: { type: Boolean, default: false },
    systemEventType: { type: String, enum: ["user_joined", "user_left", "group_renamed", "chat_created"] },

    // --------------------------
    // 7️⃣ Deletion & Visibility
    // --------------------------
    isGloballyDeleted: { type: Boolean, default: false, index: true }, 
    deletedForUsers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }], 

    // --------------------------
    // 8️⃣ Read Status
    // --------------------------
    readBy: [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
    deliveryStatus: { 
        type: String, 
        enum: ["sending", "sent", "delivered", "seen"], 
        default: "sent",
        index: true 
    },
  },
  { timestamps: true } // NOTE: createdAt & updatedAt auto-managed
);

// --------------------------
// Middleware
// --------------------------
/**
 * IMPORTANT: Auto filter out globally deleted messages in all find queries
 * Regex /^find/ matches find, findOne, findOneAndUpdate, etc.
 */
messageSchema.pre<mongoose.Query<IMessage[] | IMessage | null, IMessage>>(/^find/, function (next) {
    this.where({ isGloballyDeleted: { $ne: true } }); 
    next();
});

// --------------------------
// Export Model
// --------------------------
const Message: Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);
export default Message;
