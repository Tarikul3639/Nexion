import { Schema } from "mongoose";

export const ReactionSchema = new Schema(
  {
    emoji: { type: String, required: true },
    count: { type: Number, default: 0 },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { _id: false }
);
