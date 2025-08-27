"use client";
import React from "react";
import { SidebarWrapper } from "@/components/sidebar/Sidebar";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import { usePanel } from "@/context/PanelContext";
import { useResponsive } from "@/hooks/useResponsive";

export default function WorkspaceLayout() {
  const { selectedItem } = usePanel();
  const { isDesktop } = useResponsive();

  return (
      <SidebarWrapper>
        {!isDesktop ? (
          selectedItem ? (
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
