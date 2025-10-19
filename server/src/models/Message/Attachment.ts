// models/subSchemas/Attachment.ts
import { Schema } from "mongoose";

/*
  Attachment Schema subSchema for Messages
  This schema defines the structure of an attachment within a message.
*/

// Interface for type safety
export interface IAttachment {
    type: "image" | "video" | "file" | "audio";
    url: string;
    name?: string;
    sizeInBytes?: number;
    extension?: string;
    altText?: string;
    thumbnailUrl?: string;
    durationInSeconds?: number;
    waveform?: number[];
    mimeType?: string;
}

export const AttachmentSchema = new Schema<IAttachment>(
  {
    type: { 
      type: String, 
      enum: ["image", "video", "file", "audio"], 
      required: true, 
      index: true 
    },
    url: { 
      type: String, 
      required: true 
    },
    name: { 
      type: String 
    },
    sizeInBytes: { 
      type: Number 
    }, 
    extension: { 
      type: String 
    },
    altText: { 
      type: String 
    }, 
    thumbnailUrl: { 
      type: String 
    }, 
    durationInSeconds: { 
      type: Number 
    }, 
    waveform: [{ 
      type: Number 
    }],
    mimeType: { 
      type: String 
    }, 
  },
  { _id: false }
);