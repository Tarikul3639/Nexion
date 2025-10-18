import { Request, Response } from "express";
import User from "@/models/User";
import Conversation from "@/models/Conversation";

export const DeleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Optionally, delete related data (e.g., conversations)
    await Conversation.deleteMany({ participants: userId });

    return res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === "SoftDeleteStop") {
        return res.status(200).json({
          success: true,
          message: "User account deleted successfully (soft delete)",
        });
      }
    }
    console.error("Error deleting user account:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
