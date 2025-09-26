import { Router } from "express";
import authRoutes from "./authRoutes";
import UploadRoutes from "@/controllers/upload";

const router = Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/upload", UploadRoutes);

// Health check route
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

export default router;
