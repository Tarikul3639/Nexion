import multer from "multer";
import path from "path";
import fs from "fs";

// Dynamic storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Folder type from query or route (like ?type=avatar)
    const folder = req.query.type || "others";

    // Ensure uploads directory exists
    const uploadPath = path.join("uploads", String(folder));

    // Create folder if it doesn’t exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Multer instance
export const upload = multer({ storage });
