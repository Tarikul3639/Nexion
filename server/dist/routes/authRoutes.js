"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("@/controllers");
const router = (0, express_1.Router)();
// Public routes
router.get("/verify", controllers_1.verifyToken);
router.post("/register", controllers_1.register);
router.post("/login", controllers_1.login);
router.post("/forgot-password", controllers_1.forgotPassword);
// router.post("/verify-otp", verifyOTP);
// router.post("/reset-password", resetPassword);
// Protected routes (require authentication)
router.post("/logout", controllers_1.logout);
router.get("/profile", controllers_1.getProfile);
router.put("/profile", controllers_1.profileUpdate);
exports.default = router;
