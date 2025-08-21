import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import config from "config";
import bcrypt from "bcryptjs";

// JWT payload interface
interface ITokenPayload {
  _id: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Token verify route
export const verifyToken = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Get token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    // 2️⃣ Verify JWT signature
    const key = config.get("jwt.secret") as string;
    if (!key) throw new Error("JWT secret key not found");

    const decoded = jwt.verify(token, key) as ITokenPayload;

    // 3️⃣ Optional: check token expiry manually
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ success: false, message: "Token expired" });
    }

    // 4️⃣ Database check by _id + email + username
    const user = await User.findOne({
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
  } catch (error) {
    console.error("Token verification error:", error);

    // 7️⃣ Handle JWT errors specifically
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Register user
export const register = async (req: Request, res: Response) => {
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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // TODO: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // TODO: Create user in database
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // For now, return success response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    interface ILoginUser {
      _id: { toString(): string };
      email: string;
      username: string;
      password: string;
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    const user = (await User.findOne({ email }).select(
      "+password"
    )) as ILoginUser | null;

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Password is incorrect" });
    }

    const key = config.get("jwt.secret") as string;
    if (!key) throw new Error("JWT secret key not found");

    const token = jwt.sign(
      { _id: user._id.toString(), email: user.email },
      key,
      { expiresIn: "7d" }
    );

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
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Logout user
export const logout = async (req: Request, res: Response) => {
  try {
    // TODO: Invalidate token (add to blacklist)

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update user profile
export const profileUpdate = async (req: Request, res: Response) => {
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
      const existingUser = await User.findOne({ username: trimmedUsername, _id: { $ne: id } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Username already taken",
        });
      }
    }

    const updateData: Partial<{ username: string }> = {};
    if (username) updateData.username = username.trim();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true, select: "username avatar email" }
    );

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
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

