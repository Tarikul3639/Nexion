"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = void 0;
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
