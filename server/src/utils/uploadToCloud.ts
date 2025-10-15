// backend/utils/uploadToCloud.ts
import { v2 as cloudinary } from "cloudinary";
import config from "config";
import fs from "fs";

cloudinary.config(config.get("cloudinary"));

export interface UploadResult {
  url: string;
  public_id: string;
  format: string;
  size: number;
}

// Generic reusable function
export const uploadToCloud = async (
  filePath: string,
  folder: string = "general",
  fileName?: string
): Promise<UploadResult> => {
  try {
    const uploaded = await cloudinary.uploader.upload(filePath, {
      folder, // e.g., "avatars" or "chat_attachments"
      resource_type: "auto", // auto detect image/video/file
      public_id: fileName,  // File name
    });

    // Remove local temp file after upload
    fs.unlinkSync(filePath);

    return {
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
      format: uploaded.format,
      size: uploaded.bytes,
    };
  } catch (error) {
    console.error("Cloud upload failed:", error);
    throw new Error("Cloud upload failed");
  }
};
