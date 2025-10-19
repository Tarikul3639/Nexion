import { Request, Response } from "express";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import config from "config";
import axios from "axios";
// 🔥 Import your model types and tracking sub-types
import { IUser } from "@/models/User/Types"; 
import { ISession, ILoginHistory } from "@/models/User/UserTrackingSchema"; 
import { IAuthProvider } from "@/models/User/UserOAuthSchema";


export const githubLogin = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    console.log("GitHub Login Request Body:", req.body);

    if (!code) {
      return res.status(400).json({ success: false, message: "Code missing" });
    }

    // 1️⃣ Exchange code for access token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: config.get("github.clientId"),
        client_secret: config.get("github.clientSecret"),
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) throw new Error("Failed to get access token");

    // 2️⃣ Fetch GitHub user info
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const githubUser = userRes.data;

    // 3️⃣ Fetch email if not public
    let email: string | undefined = githubUser.email;
    if (!email) {
      const emailsRes = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const primaryEmail = emailsRes.data.find(
        (e: any) => e.primary && e.verified
      );
      email = primaryEmail?.email || emailsRes.data[0]?.email;
    }

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "GitHub email not available" });
    }

    // 4️⃣ Find or create user
    let user = (await User.findOne({
      // 🔥 Updated path from 'oauth' to 'authProviders'
      "authProviders.providerId": githubUser.id.toString(),
      "authProviders.provider": "github",
    })) as IUser | null;
    
    const now = new Date();
    const ipRaw = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown IP";
    const ip = Array.isArray(ipRaw) ? ipRaw[0] : String(ipRaw);
    const userAgent = (req.headers['user-agent'] as string) || "Unknown Device";
    
    // Create new OAuth Provider data structure
    const githubAuthProvider: IAuthProvider = {
        provider: "github",
        providerId: githubUser.id.toString(),
        email: email,
        avatar: githubUser.avatar_url,
    };

    if (!user) {
      // Check if user already exists with same email
      const existingUser = (await User.findOne({ email })) as IUser | null;
      if (existingUser) {
        // Link GitHub account to existing user
        // 🔥 Updated path from 'oauth' to 'authProviders'
        const providers = existingUser.authProviders || [];
        // Prevent duplicate linking if somehow providerId check failed
        const alreadyLinked = providers.some(p => p.provider === 'github' && p.providerId === githubUser.id.toString());
        
        if (!alreadyLinked) {
            existingUser.authProviders.push(githubAuthProvider);
        }
        await existingUser.save();
        user = existingUser;
      } else {
        // Create new user
        user = new User({
          email,
          name: githubUser.name || githubUser.login,
          username: githubUser.login,
          avatar: githubUser.avatar_url,
          // 🔥 Use 'authProviders'
          authProviders: [githubAuthProvider],
        });
      }
    } else {
        // User found via providerId, ensure other fields are updated/consistent
        const linkedProvider = user.authProviders.find(p => p.provider === 'github');
        if (linkedProvider) {
            linkedProvider.email = email; // Update email if necessary
            linkedProvider.avatar = githubUser.avatar_url; // Update avatar
        }
    }
    
    if (!user) {
        // Should not happen, but for type safety and edge case handling
        throw new Error("User creation failed.");
    }


    // 5️⃣ Generate JWT (Needed before updating session token)
    const jwtSecret = config.get<string>("jwt.secret");
    if (!jwtSecret) {
      console.error("JWT secret is not configured");
      return res
        .status(500)
        .json({ success: false, message: "Server configuration error" });
    }

    const jwtToken = jwt.sign({ _id: user._id, email: user.email }, jwtSecret, {
      expiresIn: "7d",
    });


    // 6️⃣ Update Tracking & Session Data (SCHEME CHANGE APPLIED)

    // Create new session
    const newSession: Partial<ISession> = {
      ipAddress: ip,
      userAgent: userAgent,
      token: jwtToken, // Use the generated token immediately
      createdAt: now,
      expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };
    // 🔥 Add session to tracking.sessions
    user.tracking.sessions.push(newSession as ISession);

    // Update login history
    const loginEntry: Partial<ILoginHistory> = {
      ipAddress: ip,
      userAgent: userAgent,
      loginMethod: "github",
      status: "success",
      loginAt: now,
    };
    // 🔥 Add login history to tracking.loginHistory
    user.tracking.loginHistory.push(loginEntry as ILoginHistory); 

    // Update last seen, last active and status
    user.tracking.lastSeen = now;
    user.tracking.lastActiveAt = now;
    user.tracking.status = "online"; 

    await user.save(); // The 'pre('save')' middleware caps the tracking arrays here!
    
    // 7️⃣ Respond with token & user
    return res.status(200).json({
      success: true,
      message: "GitHub login successful",
      data: {
        token: jwtToken,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          // 🔥 Updated path for session and auth providers in response
          session: newSession, 
          authProviders: user.authProviders,
          status: user.tracking.status,
        },
      },
    });
  } catch (error) {
    console.error("GitHub login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "GitHub login failed" });
  }
};

export default githubLogin;