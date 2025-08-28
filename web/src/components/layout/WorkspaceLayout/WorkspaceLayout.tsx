"use client";
import React from "react";
import { SidebarWrapper } from "@/components/sidebar/Sidebar";
import LeftPanel from "@/components/panels/LeftPanel/LeftPanel";
import RightPanel from "@/components/panels/RightPanel/RightPanel";
import { usePanel } from "@/context/PanelContext";
import { useResponsive } from "@/hooks/useResponsive";

export default function WorkspaceLayout() {
  const { selectedChat } = usePanel();
  const { isDesktop } = useResponsive();

  return (
    <SidebarWrapper>
      {!isDesktop ? (
        selectedChat ? <RightPanel /> : <LeftPanel />
      ) : (
        <>
          <LeftPanel />
          <RightPanel />
        </>
      )}
    </SidebarWrapper>
  );
}
