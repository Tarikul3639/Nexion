"use client";

import React from "react";

// Components
import ConversationWindow from "@/components/chat/RightSide";
import ClassroomWindow from "@/components/classroom/ClassroomWindow";
import { ProfileRightPanel } from "@/components/profile/RightPanel";
import Welcome from "./Welcome";

// Context
import { usePanel } from "@/context/PanelContext";
import { ProfileProvider } from "@/context/ProfileContext/index";

export default function RightPanel() {
  // Extract active states from the panel context
  const { activeTab, activeChat, activeProfile, activeBot, activeClassroom } =
    usePanel();

  // Determine if any panel is currently active
  const isAnyPanelActive =
    activeChat || activeProfile || activeClassroom || activeBot;

  // If no panel is active, show the default Welcome screen
  if (!isAnyPanelActive) {
    return <Welcome />;
  }

  // Render content based on which tab is active
  switch (activeTab) {
    case "chats":
      return <ConversationWindow />;

    case "classroom":
      return <ClassroomWindow />;

    case "profile":
      return (
        <ProfileProvider>
          <ProfileRightPanel />
        </ProfileProvider>
      );

    default:
      return <div>Select a tab to see content</div>;
  }
}
