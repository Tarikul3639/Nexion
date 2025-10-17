import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * Conversation Interface (TypeScript)
 */
export interface IConversation extends Document {
  _id: Types.ObjectId;
  name?: string;
  type: "direct" | "group" | "classroom";
  lastMessage?: Types.ObjectId;
  avatar?: string;
  unread?: number;
  participants: Types.ObjectId[];
  isPinned?: boolean;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Conversation Schema Definition
 */
const conversationSchema = new Schema<IConversation>(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    type: {
      type: String,
      enum: ["direct", "group", "classroom"],
      required: true,
      index: true,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    avatar: {
      type: String,
      trim: true,
    },
    unread: {
      type: Number,
      default: 0,
      min: 0,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

/**
 * Indexes for performance
 */
conversationSchema.index({ participants: 1 });
conversationSchema.index({ type: 1 });
conversationSchema.index({ updatedAt: -1 });

/**
 * Pre-save validation
 */
conversationSchema.pre<IConversation>("save", function (next) {
  // Ensure participants are unique
  if (this.participants && this.participants.length > 0) {
    const uniqueIds = Array.from(new Set(this.participants.map((id) => id.toString())));
    this.participants = uniqueIds.map((id) => new mongoose.Types.ObjectId(id));
  }

  // Validate direct chat participant count
  if (this.type === "direct" && this.participants.length !== 2) {
    return next(new Error("Direct conversation must have exactly 2 participants."));
  }

  next();
});

/**
 * Soft delete filter
 */
conversationSchema.pre<mongoose.Query<IConversation[], IConversation>>(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

/**
 * Post-delete cleanup
 */
conversationSchema.post("findOneAndDelete", async function (doc: IConversation) {
  if (doc && doc._id) {
    try {
      await mongoose.model("Message").deleteMany({ conversation: doc._id });
    } catch (err) {
      console.error("Error cleaning up messages for deleted conversation:", err);
    }
  }
});

/**
 * Create and export the model
 */
export const Conversation: Model<IConversation> = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export default Conversation;
