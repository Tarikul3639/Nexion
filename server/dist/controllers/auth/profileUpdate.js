"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileUpdate = void 0;
const User_1 = __importDefault(require("@/models/User"));
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
