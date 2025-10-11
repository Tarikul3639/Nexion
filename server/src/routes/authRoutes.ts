import { Router } from "express";
import {
  verifyToken,
  register,
  login,
  logout,
  getProfile,
  profileUpdate,
  ForgotPassword,
  VerifyOTP,
  passwordReset,
} from "@/controllers";

const router = Router();

// Public routes
router.get("/verify", verifyToken);
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", ForgotPassword);
router.post("/verify-otp", VerifyOTP);
router.post("/reset-password", passwordReset);

// Protected routes (require authentication)
router.post("/logout", logout);
router.get("/profile", getProfile);
router.put("/profile", profileUpdate);

export default router;
