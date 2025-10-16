import { Router } from "express";
import {
  verifyLoggedInUser,
  register,
  login,
  logout,
  getProfile,
  ForgotPassword,
  VerifyOTP,
  passwordReset,
} from "@/controllers";

const router = Router();

// Public routes
router.get("/verify", verifyLoggedInUser);
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", ForgotPassword);
router.post("/verify-otp", VerifyOTP);
router.post("/reset-password", passwordReset);

// Protected routes (require authentication)
router.post("/logout", logout);
// router.get("/profile", getProfile);

export default router;
