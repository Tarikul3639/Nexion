import { Request, Response } from "express";

// Get current user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    // TODO: Get user from database using req.user.id

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: "mock-user-id",
          name: "Mock User",
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