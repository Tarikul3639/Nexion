import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
    images: {
    domains: ["placehold.co", "i.pravatar.cc", "images.unsplash.com", "res.cloudinary.com"],
  },
};

export default nextConfig;
