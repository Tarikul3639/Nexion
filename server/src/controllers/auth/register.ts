import { Request, Response } from "express";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// Register user
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
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
      name,
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
