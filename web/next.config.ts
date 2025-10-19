import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "cdn-icons-png.flaticon.com",
      "res.cloudinary.com",
      "api.dicebear.com",
    ],
  },
};

export default nextConfig;
