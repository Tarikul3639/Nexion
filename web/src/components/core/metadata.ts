
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Nexion",
  description: "Nexion - Your AI Chat Companion",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: "/icons/icon-192x192.svg",
  },
  appleWebApp: {
    title: "Nexion",
    capable: true,
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Nexion",
    description: "Nexion - Your AI Chat Companion",
    type: "website",
  },
  twitter: {
    title: "Nexion",
    description: "Nexion - Your AI Chat Companion",
    card: "summary",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0f172a",
};
