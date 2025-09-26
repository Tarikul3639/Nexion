// backend/routes/upload.ts
import express, { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import { v2 as cloudinary } from "cloudinary";
import config from "config";

// Cloudinary config (from config/default.json)
cloudinary.config(config.get("cloudinary"));

const router = express.Router();

// Multer setup with basic file filter
const upload = multer({
  dest: "uploads/",
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (!file.mimetype) {
      return cb(new Error("Invalid file type"));
    }
    cb(null, true);
  },
});

// Response type for successful upload
interface UploadResponse {
  url: string;
  public_id: string;
  format: string;
  size: number;
}

router.post(
  "/",
  upload.single("file"),
  async (req: Request, res: Response<UploadResponse | { error: string }>) => {
    try {
      const file = req.file as Express.Multer.File | undefined;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const uploaded = await cloudinary.uploader.upload(file.path, {
        folder: "chat_attachments",
        resource_type: "auto", // auto detect image/video/file
      });

      const response: UploadResponse = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
        format: uploaded.format,
        size: uploaded.bytes,
      };

      return res.json(response);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Upload failed" });
    }
  }
);

export default router;
