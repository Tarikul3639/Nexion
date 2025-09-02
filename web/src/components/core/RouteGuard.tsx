"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// List of public routes that don't require authentication
const publicRoutes = ["/auth/login", "/auth/signup"];

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if the route requires authentication
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isLoading) {
      // If user is not authenticated and the route is not public, redirect to login
      if (!isAuthenticated && !isPublicRoute) {
        router.push("/auth/login");
      }
      
      // If user is authenticated and tries to access login/signup pages, redirect to home
      if (isAuthenticated && isPublicRoute) {
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading state or render children
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // For public routes or authenticated users viewing protected routes
  return <>{children}</>;
}
