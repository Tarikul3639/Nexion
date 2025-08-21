// models/Conversation.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConversation extends Document {
  username: string;
  type: "classroom" | "group" | "direct";
  lastMessage?: mongoose.Types.ObjectId;
  avatar?: string;
  unread?: number;
  participants: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema: Schema<IConversation> = new Schema(
  {
    username: { type: String, required: true },
    type: { type: String, enum: ["classroom", "group", "direct"], default: "direct", required: true },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    avatar: String,
    unread: { type: Number, default: 0 },
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  },
  { timestamps: true }
);

const Conversation: Model<IConversation> = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export default Conversation;
