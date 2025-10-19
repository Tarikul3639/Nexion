import { Request, Response } from "express";
import User from "@/models/User";
import { IUser } from "@/models/User/Types";
import jwt from "jsonwebtoken";
import config from "config";
import bcrypt from "bcryptjs";
import { ILoginHistory, ISession } from "@/models/User/UserTrackingSchema"; // Import sub-schema types for cleaner code

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, device } = req.body;

    // --- 1. Basic Validation ---
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // --- 2. User Retrieval ---
    // Select the password field explicitly for comparison
    const user = (await User.findOne({ email }).select(
      "+password"
    )) as IUser | null;
    
    if (!user) {
        // Use generic error for security
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    
    // Check for social login accounts that don't have a password
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account is registered via social media. Please use social login.",
      });
    }

    // --- 3. Gather Request Info ---
    const ipRaw =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "Unknown IP";
    const ip = Array.isArray(ipRaw) ? ipRaw[0] : String(ipRaw);
    const userAgent = device || (req.headers['user-agent'] as string) || "Unknown Device";
    const now = new Date();


    // --- 4. Password Validation and Failed Login Logging ---
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
        // 🔥 Record failed login attempt (Uses new tracking path)
        const failedEntry: Partial<ILoginHistory> = {
            ipAddress: ip,
            userAgent: userAgent,
            loginMethod: "email",
            status: "failed",
            loginAt: now,
        };
        // The middleware will cap this array automatically on save
        user.tracking.loginHistory.push(failedEntry as ILoginHistory);
        
        await user.save();
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }


    // --- 5. Successful Login: JWT Creation ---
    const key = config.get("jwt.secret") as string;
    if (!key) throw new Error("JWT secret key not found");

    const token = jwt.sign(
      { _id: user._id.toString(), email: user.email },
      key,
      { expiresIn: "7d" }
    );


    // --- 6. 🔥 Update Tracking & Session Data (Using new tracking path) ---
    
    // Create new session
    const newSession: Partial<ISession> = {
      userAgent: userAgent,
      ipAddress: ip,
      token,
      createdAt: now,
      // expiresAt is automatically set by the SessionSchema default function
    };
    user.tracking.sessions.push(newSession as ISession); // Middleware will cap this array

    // Update successful login history
    const successfulEntry: Partial<ILoginHistory> = {
        ipAddress: ip,
        userAgent: userAgent,
        loginMethod: "email",
        status: "success",
        loginAt: now,
    };
    user.tracking.loginHistory.push(successfulEntry as ILoginHistory); // Middleware will cap this array

    // Update last seen, last active and status
    user.tracking.lastSeen = now;
    user.tracking.lastActiveAt = now;
    user.tracking.status = "online"; // Set user status to 'online'

    await user.save(); // The 'pre('save')' middleware caps the tracking arrays here!


    // --- 7. Response ---
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          bio: user.bio,
          // Send current tracking status
          status: user.tracking.status,
          // Send only the current session info
          session: newSession,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
