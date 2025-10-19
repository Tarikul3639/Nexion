import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { AttachmentSchema, IAttachment } from "./Attachment";
import { ReactionSchema, IReaction } from "./Reaction";

// 🔥 Updated and Expanded Interface (IMessage)
export interface IMessage extends Document {
  conversationId: Types.ObjectId; 
  senderId: Types.ObjectId | null; 
  senderName?: string; // 🔥 Made non-required for soft delete handling
  senderAvatar?: string;
  senderIdBackup?: Types.ObjectId; // For account recovery
  
  content: {
    text?: string;
    attachments?: IAttachment[];
 };
 
  type: "text" | "image" | "video" | "file" | "audio" | "system" | "notification"; 
 
  // Message Threading/Reply
  replyToId?: Types.ObjectId; 
 
  // Actions & Status
  reactions: IReaction[];
  isPinned: boolean;
  isEdited: boolean;
  
  // Soft Delete & Visibility Fields
  isGloballyDeleted: boolean; 
  deletedForUsers: Types.ObjectId[]; 
  
  // System Message Fields
  isSystemMessage: boolean;
  systemEventType?: "user_joined" | "user_left" | "group_renamed" | "chat_created"; 
 
  // Read Status
  readBy: Types.ObjectId[];
  deliveryStatus: "sending" | "sent" | "delivered" | "seen"; 
 
  // Time Tracking
  createdAt: Date;
  updatedAt: Date;
}


const messageSchema: Schema<IMessage> = new Schema(
  {
    // 1. Core Identification
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true, index: true }, 
    senderId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true }, 
    senderIdBackup: { type: Schema.Types.ObjectId, ref: "User", select: false }, 
  
   // 2. Display Cache (Sender info at the time of sending)
    senderName: { type: String }, // 🔥 'required: true' removed
    senderAvatar: { type: String },

    // 3. Content
    content: { 
      text: String,
      attachments: [AttachmentSchema],
    },
 
    // 4. Message Type & Threading
    type: { type: String, 
        enum: ["text", "image", "video", "file", "audio", "system", "notification"], 
        default: "text", 
        index: true 
   },
   replyToId: { type: Schema.Types.ObjectId, ref: "Message" }, 

    // 5. Actions & Status
    reactions: { type: [ReactionSchema], default: [] }, // 🔥 Added default: []
    isPinned: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },
 
    // 6. System Message Handling
    isSystemMessage: { type: Boolean, default: false },
    systemEventType: { type: String, enum: ["user_joined", "user_left", "group_renamed", "chat_created"] },
 
    // 7. Deletion & Visibility
    isGloballyDeleted: { type: Boolean, default: false, index: true }, 
    deletedForUsers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }], 

    // 8. Read Status
    readBy: [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
    deliveryStatus: { 
        type: String, 
        enum: ["sending", "sent", "delivered", "seen"], 
        default: "sent",
        index: true 
    },
  },
  { timestamps: true }
);

// --- Middleware ---
/**
 * Middleware: Auto Filter Out Globally Deleted Messages
 */
messageSchema.pre<mongoose.Query<IMessage[] | IMessage | null, IMessage>>(/^find/, function (next) {
    this.where({ isGloballyDeleted: { $ne: true } }); 
    next();
});

// --- Export Model ---
const Message: Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);
export default Message;