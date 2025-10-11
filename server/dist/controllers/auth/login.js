"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const User_1 = __importDefault(require("@/models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
