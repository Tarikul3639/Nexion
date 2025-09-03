// models/Conversation.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConversation extends Document {
  name: string; // Name of conversation/group/class
  type: "direct" | "group" | "classroom";
  lastMessage?: mongoose.Types.ObjectId;
  avatar?: string;
  unread?: number;
  participants: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema: Schema<IConversation> = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["direct", "group", "classroom"], required: true },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    avatar: String,
    unread: { type: Number, default: 0 },
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  },
  { timestamps: true }
);

export const Conversation: Model<IConversation> = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);
export default Conversation;
