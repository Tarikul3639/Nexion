// src/controllers/auth/logout.ts (COMPLETED)

import { Request, Response } from "express";
import User from "@/models/User";
import { ITokenPayload } from "@/types/auth";
import jwt from "jsonwebtoken"; // Although not strictly needed, good for decoding if necessary
import config from "config";

// IMPORTANT: This route requires a middleware that verifies the token
// and attaches the decoded user info (like _id) to req.user.
// For simplicity, we'll assume a 'req.userId' is available after auth middleware runs.
// If you don't have a middleware, you need to decode the token here again.

export const logout = async (req: Request, res: Response) => {
  console.log("Trigger to logout :", req.body);
  // 1. Get the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  // 2. Get the User ID (This should ideally come from an Auth Middleware)
  // If you don't use middleware, you must decode the JWT here to get the _id:
  let userId: string;
  if (token) {
    try {
      // --- 5. Successful Login: JWT Creation ---
      const key = config.get("jwt.secret") as string;
      if (!key) throw new Error("JWT secret key not found");
      const decoded = jwt.decode(token) as ITokenPayload; // Use decode for ID (verify fails if expired)
      if (!decoded || !decoded._id) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token structure" });
      }
      userId = decoded._id;
    } catch (error) {
      // If decoding fails, we still proceed to clear the client-side, but return 200
      return res
        .status(200)
        .json({ success: true, message: "Client session cleared" });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "No token provided for session revocation",
    });
  }

  try {
    // 3. Invalidate token: Remove the specific token from the sessions array
    const result = await User.updateOne(
      { _id: userId },
      {
        // $pull removes all array elements that match the specified condition
        $pull: {
          "tracking.sessions": { token: token },
        },
      }
    );

    // Optional: Log if token was actually removed
    if (result.modifiedCount === 0) {
      console.warn(
        `Attempted to log out user ${userId}, but token was not found in sessions.`
      );
    }

    // 4. Respond to client
    res.status(200).json({
      success: true,
      message: "Logout successful and session revoked",
    });
  } catch (error) {
    console.error("Logout error (Database update failed):", error);
    res.status(500).json({
      success: false,
      message: "Internal server error: Could not revoke session",
    });
  }
};
