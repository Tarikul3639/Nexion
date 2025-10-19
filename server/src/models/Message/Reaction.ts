// models/subSchemas/Reaction.ts
import { Schema, Types } from "mongoose";

/*
  Reaction Schema subSchema for Messages
  This schema defines the structure of a reaction within a message.
*/

// Interface for type safety
export interface IReaction {
  emoji: string;
  reactedBy: Types.ObjectId; 
  createdAt: Date; 
}

export const ReactionSchema = new Schema<IReaction>(
  {
    emoji: { 
      type: String, 
      required: true 
    },
    
    reactedBy: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, 
    
    createdAt: { 
      type: Date, 
      default: Date.now 
    }, 
  },
  { 
    _id: false, 
  }
);