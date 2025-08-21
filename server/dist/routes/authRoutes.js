"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Public routes
router.get("/verify", authController_1.verifyToken);
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
// Protected routes (require authentication)
router.post("/logout", authController_1.logout);
router.get("/profile", authController_1.getProfile);
router.put("/profile", authController_1.profileUpdate);
exports.default = router;
