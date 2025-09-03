"use client";
import React, { useEffect } from "react";
import { SidebarWrapper } from "@/components/sidebar/Sidebar";
import LeftPanel from "@/components/panels/LeftPanel/LeftPanel";
import RightPanel from "@/components/panels/RightPanel/RightPanel";
import { usePanel } from "@/context/PanelContext";
import { useResponsive } from "@/hooks/useResponsive";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Loading from "./loading";

export default function WorkspaceLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const { selectedChat } = usePanel();
  const { isDesktop } = useResponsive();
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

  return (
    <SidebarWrapper>
      {!isDesktop ? (
        selectedChat ? (
          <RightPanel />
        ) : (
          <LeftPanel />
        )
      ) : (
        <>
          <LeftPanel />
          <RightPanel />
        </>
      )}
    </SidebarWrapper>
  );
}
