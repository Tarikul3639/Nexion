"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileUpdate = exports.getProfile = exports.logout = exports.login = exports.register = exports.verifyToken = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Token verify route
const verifyToken = async (req, res) => {
    try {
        // 1️⃣ Get token from Authorization header
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "No token provided" });
        }
        // 2️⃣ Verify JWT signature
        const key = config_1.default.get("jwt.secret");
        if (!key)
            throw new Error("JWT secret key not found");
        const decoded = jsonwebtoken_1.default.verify(token, key);
        // 3️⃣ Optional: check token expiry manually
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            return res.status(401).json({ success: false, message: "Token expired" });
        }
        // 4️⃣ Database check by _id + email + username
        const user = await User_1.default.findOne({
            _id: decoded._id,
            email: decoded.email,
        }).select("-password"); // sensitive data exclude
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "User not found" });
        }
        // 5️⃣ Optional: token blacklist check
        // const blacklisted = await TokenBlacklist.findOne({ token });
        // if (blacklisted) return res.status(401).json({ success: false, message: "Token revoked" });
        // 6️⃣ Respond with sanitized user data
        res.status(200).json({
            success: true,
            message: "Token is valid",
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar || null,
                },
            },
        });
    }
    catch (error) {
        console.error("Token verification error:", error);
        // 7️⃣ Handle JWT errors specifically
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ success: false, message: "Token expired" });
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.verifyToken = verifyToken;
// Register user
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide username, email, and password",
            });
        }
        // TODO: Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        // TODO: Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // TODO: Create user in database
        await User_1.default.create({
            username,
            email,
            password: hashedPassword,
        });
        // For now, return success response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    }
    catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.register = register;
// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Please provide email and password" });
        }
        const user = (await User_1.default.findOne({ email }).select("+password"));
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "User not found" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ success: false, message: "Password is incorrect" });
        }
        const key = config_1.default.get("jwt.secret");
        if (!key)
            throw new Error("JWT secret key not found");
        const token = jsonwebtoken_1.default.sign({ _id: user._id.toString(), email: user.email }, key, { expiresIn: "7d" });
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    username: user.username,
                },
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.login = login;
// Logout user
const logout = async (req, res) => {
    try {
        // TODO: Invalidate token (add to blacklist)
        res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.logout = logout;
// Get current user profile
const getProfile = async (req, res) => {
    try {
        // TODO: Get user from database using req.user.id
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: "mock-user-id",
                    username: "Mock User",
                    email: "mock@example.com",
                    createdAt: new Date(),
                },
            },
        });
    }
    catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getProfile = getProfile;
// Update user profile
const profileUpdate = async (req, res) => {
    try {
        const { id, username } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        if (username) {
            const trimmedUsername = username.trim();
            // Check if username is already taken by another user
            const existingUser = await User_1.default.findOne({ username: trimmedUsername, _id: { $ne: id } });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "Username already taken",
                });
            }
        }
        const updateData = {};
        if (username)
            updateData.username = username.trim();
        const updatedUser = await User_1.default.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true, select: "username avatar email" });
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                avatar: updatedUser.avatar,
                email: updatedUser.email,
            },
        });
    }
    catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.profileUpdate = profileUpdate;
