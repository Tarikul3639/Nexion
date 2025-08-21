import { Router } from "express";
import {
  verifyToken,
  register,
  login,
  logout,
  getProfile,
  profileUpdate,
} from "../controllers/authController";

const router = Router();

// Public routes
router.get("/verify", verifyToken);
router.post("/register", register);
router.post("/login", login);

// Protected routes (require authentication)
router.post("/logout", logout);
router.get("/profile", getProfile);
router.put("/profile", profileUpdate);

export default router;
