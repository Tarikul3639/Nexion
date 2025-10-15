"use client";

// React & Next imports
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

// Contexts & Hooks
import { usePanel } from "@/context/PanelContext";
import { useAuth } from "@/context/AuthContext";
import { useResponsive } from "@/hooks/useResponsive";

// UI Components
import { SidebarWrapper } from "@/components/sidebar/Sidebar";
import LeftPanel from "@/components/panels/LeftPanel/LeftPanel";
import RightPanel from "@/components/panels/RightPanel/RightPanel";
import Loading from "./loading";

export default function WorkspaceLayout() {
  // Next.js routing hooks
  const router = useRouter();
  const pathname = usePathname();

  // Custom contexts
  const { activeChat, activeProfile, activeClassroom, activeBot } = usePanel();
  const { isAuthenticated, isLoading } = useAuth();

  // Responsive hook (to detect desktop/mobile)
  const { isDesktop } = useResponsive();

  // Check if any panel (chat/classroom/profile/bot) is active
  const isAnyPanelActive =
    activeChat || activeProfile || activeClassroom || activeBot;

  // Redirect unauthenticated users to login page
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading spinner while authentication is being checked
  if (isLoading) {
    return <Loading />;
  }

  // If not authenticated and not loading, show nothing
  if (!isAuthenticated) {
    return null;
  }

  // Main workspace layout
  return (
    <SidebarWrapper>
      {/* Desktop: show both panels side-by-side */}
      {/* Mobile: show either left or right panel */}
      {!isDesktop ? (
        isAnyPanelActive ? <RightPanel /> : <LeftPanel />
      ) : (
        <>
          <LeftPanel />
          <RightPanel />
        </>
      )}
    </SidebarWrapper>
  );
}
