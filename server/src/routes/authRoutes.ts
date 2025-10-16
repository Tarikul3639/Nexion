import { Router } from "express";
import {
  verifyLoggedInUser,
  register,
  login,
  logout,
  ForgotPassword,
  VerifyOTP,
  passwordReset,
  DeleteAccount,
} from "@/controllers";
import { verifyToken } from "@/middleware/verifyToken";
import { googleLogin } from "@/controllers/auth/googleLogin";

const router = Router();

// Public routes
router.get("/verify", verifyLoggedInUser);
router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/forgot-password", ForgotPassword);
router.post("/verify-otp", VerifyOTP);
router.post("/reset-password", passwordReset);

// Protected routes (require authentication)
router.post("/logout", verifyToken, logout);
router.delete("/delete-account", verifyToken, DeleteAccount);

export default router;
