import { Request, Response } from "express";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import config from "config";
import bcrypt from "bcryptjs";

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
