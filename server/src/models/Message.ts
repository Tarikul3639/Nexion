import mongoose, { Document, Schema, Model } from "mongoose";
import { AttachmentSchema } from "./subSchemas/Attachment";
import { ReactionSchema } from "./subSchemas/Reaction";

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  senderName?: string;
  senderAvatar?: string;
  content: {
    text?: string;
    attachments?: typeof AttachmentSchema[];
  };
  type: "text" | "image" | "video" | "file" | "audio";
  replyTo?: mongoose.Types.ObjectId;
  reactions?: typeof ReactionSchema[];
  isPinned?: boolean;
  readBy?: mongoose.Types.ObjectId[];
  status?: "sending" | "sent" | "delivered" | "seen";
  isEdited?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema: Schema<IMessage> = new Schema(
  {
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String },
    senderAvatar: { type: String },
    content: { 
      text: String,
      attachments: [AttachmentSchema],
    },
    type: { type: String, enum: ["text", "image", "video", "file", "audio"], default: "text" },
    replyTo: { type: Schema.Types.ObjectId, ref: "Message" },
    reactions: [ReactionSchema],
    isPinned: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["sending", "sent", "delivered", "seen"], default: "sent" },

  },
  { timestamps: true }
);

const Message: Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);
export default Message;
