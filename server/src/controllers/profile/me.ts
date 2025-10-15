import { Request, Response } from "express";
import User from "@/models/User";

export const Me = async (req: Request, res: Response) => {
  try {
    const { id, name, username, bio } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID missing" });
    }

    // Check if username is taken (if username was changed)
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: id }, // exclude current user
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        username,
        bio,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.username,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
      },
    });
  } catch (error) {
    console.error("Error handling user profile:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
