import User from "@/models/User";
import { Request, Response } from "express";
import { uploadToCloud } from "@/utils/uploadToCloud";

export const Avatar = async (req: Request, res: Response) => {
  
  try {
    // Get user ID from auth middleware instead of form data for security
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    
    const file = req.file; // from multer

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

     // upload to cloudinary using reusable function
    const uploaded = await uploadToCloud(file.path, "avatars", userId);

    // Save avatar path to DB
    user.avatar = uploaded.url;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      url: user.avatar,
    });
  } catch (error) {
    console.error("Photo upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
