"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
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
