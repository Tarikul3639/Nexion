"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/routes/upload.ts
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("config"));
// Cloudinary config (from config/default.json)
cloudinary_1.v2.config(config_1.default.get("cloudinary"));
const router = express_1.default.Router();
// Multer setup with basic file filter
const upload = (0, multer_1.default)({
    dest: "uploads/",
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype) {
            return cb(new Error("Invalid file type"));
        }
        cb(null, true);
    },
});
router.post("/", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const uploaded = await cloudinary_1.v2.uploader.upload(file.path, {
            folder: "chat_attachments",
            resource_type: "auto", // auto detect image/video/file
        });
        const response = {
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
            format: uploaded.format,
            size: uploaded.bytes,
        };
        return res.json(response);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Upload failed" });
    }
});
exports.default = router;
