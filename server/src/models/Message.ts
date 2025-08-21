// models/Message.ts
import mongoose, { Document, Schema, Model } from "mongoose";

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  type: "text" | "image" | "video" | "file";
  replyTo?: mongoose.Types.ObjectId;
  reactions?: {
    emoji: string;
    count: number;
    users: mongoose.Types.ObjectId[];
  }[];
  isPinned?: boolean;
  readBy?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema: Schema<IMessage> = new Schema(
  {
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    type: { type: String, enum: ["text", "image", "video", "file"], default: "text" },
    replyTo: { type: Schema.Types.ObjectId, ref: "Message" },
    reactions: [
      {
        emoji: String,
        count: Number,
        users: [{ type: Schema.Types.ObjectId, ref: "User" }],
      },
    ],
    isPinned: { type: Boolean, default: false },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }], 
  },
  { timestamps: true }
);

const Message: Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
