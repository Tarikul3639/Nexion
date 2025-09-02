import { Request, Response } from "express";

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