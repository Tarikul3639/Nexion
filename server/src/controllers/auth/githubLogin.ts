import { Request, Response } from "express";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import config from "config";
import axios from "axios";

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
    let email = githubUser.email;
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

    // console.log("GitHub user fetched from API:", { githubUser, email });

    // 4️⃣ Find or create user
    let user = await User.findOne({
      "oauth.providerId": githubUser.id.toString(),
      "oauth.provider": "github",
    });

    if (!user) {
      // Check if user already exists with same email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        // Link GitHub account to existing user
        existingUser.oauth = [
          ...(existingUser.oauth || []),
          {
            provider: "github",
            providerId: githubUser.id.toString(),
            email,
            avatar: githubUser.avatar_url,
          },
        ];
        await existingUser.save();
        user = existingUser;
      } else {
        // Create new user
        user = new User({
          email,
          name: githubUser.name || githubUser.login,
          username: githubUser.login,
          avatar: githubUser.avatar_url,
          oauth: [
            {
              provider: "github",
              providerId: githubUser.id.toString(),
              email,
              avatar: githubUser.avatar_url,
            },
          ],
        });
        await user.save();
      }
    }

    // 5️⃣ Update login history & sessions
    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "Unknown IP";
    const now = new Date();

    user.loginHistory.push({
      ipAddress: Array.isArray(ip) ? ip[0] : ip,
      userAgent: req.headers["user-agent"] || "Unknown Device",
      loginMethod: "github",
      status: "success",
      loginAt: now,
    });

    user.sessions.push({
      ipAddress: Array.isArray(ip) ? ip[0] : ip,
      userAgent: req.headers["user-agent"] || "Unknown Device",
      token: "", // JWT will be added after generation
      createdAt: now,
      expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    await user.save();

    // 6️⃣ Generate JWT
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

    // Add token to latest session
    user.sessions[user.sessions.length - 1].token = jwtToken;
    await user.save();
    
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
          sessions: user.sessions,
          oauth: user.oauth,
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
