import { Request, Response } from "express";
import User from "@/models/User";
import { IUser } from "@/models/User/Types";
import jwt from "jsonwebtoken";
import config from "config";
// 🔥 Import sub-schema types for cleaner tracking data handling
import { ISession, ILoginHistory } from "@/models/User/UserTrackingSchema"; 
import { IAuthProvider } from "@/models/User/UserOAuthSchema";


// Google login handler
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { email, name, avatar, googleId, token } = req.body;

    if (!email || !googleId || !token) {
      return res.status(400).json({
        success: false,
        message: "Google authentication failed. Missing required data.",
      });
    }

    // --- 1. User Retrieval ---
    let user = (await User.findOne({
      $or: [
        { email },
        // 🔥 Updated path from 'oauth' to 'authProviders'
        { "authProviders.provider": "google", "authProviders.providerId": googleId },
      ],
    })) as IUser | null;

    // --- 2. Request Info ---
    const ipRaw =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "Unknown IP";
    const ip = Array.isArray(ipRaw) ? ipRaw[0] : String(ipRaw);
    const userAgent = (req.headers['user-agent'] as string) || "Unknown Device";
    const now = new Date();


    // --- 3. Create or Update User ---
    if (!user) {
      // 🔹 Create a new user (with 'authProviders' array)
      user = new User({
        name,
        email,
        username: email.split("@")[0],
        avatar,
        // 🔥 Use 'authProviders' instead of 'oauth'
        authProviders: [
          {
            provider: "google",
            providerId: googleId,
            email,
            avatar,
          },
        ],
      });
    } else {
      // 🔹 If user exists but OAuth not linked, add provider
      // 🔥 Check 'authProviders' instead of 'oauth'
      const alreadyLinked = user.authProviders.some(
        (o) => o.provider === "google" && o.providerId === googleId
      );
      if (!alreadyLinked) {
        user.authProviders.push({
          provider: "google",
          providerId: googleId,
          email,
          avatar,
        } as IAuthProvider); // Type assertion for safety
      }
    }

    // --- 4. Generate JWT token ---
    const key = config.get("jwt.secret") as string;
    if (!key) throw new Error("JWT secret key not found");

    const jwtToken = jwt.sign(
      { _id: user._id.toString(), email: user.email },
      key,
      { expiresIn: "7d" }
    );


    // --- 5. 🔥 Update Tracking & Session Data (SCHEME CHANGE APPLIED) ---
    
    // 🔹 Add session (to tracking.sessions)
    const newSession: Partial<ISession> = {
      userAgent: userAgent,
      ipAddress: ip,
      token: jwtToken,
      createdAt: now,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };
    user.tracking.sessions.push(newSession as ISession);

    // 🔹 Update login history (to tracking.loginHistory)
    const loginEntry: Partial<ILoginHistory> = {
      userAgent: userAgent,
      ipAddress: ip,
      loginMethod: "google",
      status: "success",
      loginAt: now,
    };
    user.tracking.loginHistory.push(loginEntry as ILoginHistory);

    // 🔹 Update last seen, last active and status
    user.tracking.lastSeen = now;
    user.tracking.lastActiveAt = now;
    user.tracking.status = "online"; // Set user status to 'online'

    // The pre('save') middleware will cap the tracking arrays here!
    await user.save(); 

    // --- 6. Send response ---
    res.status(200).json({
      success: true,
      message: "Google login successful",
      data: {
        token: jwtToken,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          // Send current tracking status
          status: user.tracking.status,
          // Send current session info
          session: newSession, 
          authProviders: user.authProviders,
        },
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
