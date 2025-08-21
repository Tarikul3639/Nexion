"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import { ProfileProvider } from "@/context/ProfileContext";
import Loading from "@/components/ui/loading";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Check if current page should hide sidebar on mobile
  const isConversationPage = pathname?.match(/\/(chat|classroom)\/\d+$/);

  return (
    <div className="flex bg-gray-50 overflow-hidden">
      {/* Sidebar - Use conditional rendering instead of CSS hidden to avoid accessibility issues */}
      {!isConversationPage && (
        <div className="shrink-0">
          <Sidebar />
        </div>
      )}

      {isConversationPage && (
        <>
          {/* Desktop sidebar for conversation pages */}
          <div className="hidden md:block shrink-0">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main content area */}
      <main className="flex-1 overflow-hidden">
        <ProfileProvider>{children}</ProfileProvider>
      </main>
    </div>
  );
}
