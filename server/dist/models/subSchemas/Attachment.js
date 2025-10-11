"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentSchema = void 0;
// models/subSchemas/Attachment.ts
const mongoose_1 = require("mongoose");
exports.AttachmentSchema = new mongoose_1.Schema({
    type: { type: String, enum: ["image", "video", "file", "audio"], required: true },
    url: { type: String, required: true },
    name: { type: String }, // File name
    size: { type: Number }, // File size in bytes
    extension: { type: String }, // File extension
    alt: { type: String }, // Image alt text
    thumbnail: { type: String }, // Optional thumbnail for images/videos
    duration: { type: Number }, // Audio/Video duration in seconds
    waveform: [{ type: Number }], // Optional waveform data for audio
}, { _id: false });
