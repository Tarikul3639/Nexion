import { Request, Response } from "express";
import User from "../../models/User";

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