// models/subSchemas/Attachment.ts
import { Schema } from "mongoose";

export const AttachmentSchema = new Schema(
  {
    type: { type: String, enum: ["image", "video", "file", "audio"], required: true },
    url: { type: String, required: true },
    name: { type: String },           // File name
    size: { type: Number },           // File size in bytes
    extension: { type: String },      // File extension
    alt: { type: String },            // Image alt text
    thumbnail: { type: String },      // Optional thumbnail for images/videos
    duration: { type: Number },       // Audio/Video duration in seconds
    waveform: [{ type: Number }],     // Optional waveform data for audio
  },
  { _id: false }
);
