"use client";
import React from "react";
import { usePanel } from "@/context/PanelContext";
import ConversationWindow from "@/components/chat/RightSide";
import ClassroomWindow from "@/components/classroom/ClassroomWindow";
import { ProfileRightPanel } from "@/components/profile/RightPanel";
import Welcome from "./Welcome";

export default function RightPanel() {
  const { activeTab, selectedChat, selectedProfile } = usePanel();
  console.log("active tab : ",activeTab);

  if (!selectedChat && !selectedProfile) {
    return <Welcome />;
  }

  switch (activeTab) {
    case "chats":
      return <ConversationWindow />;
    case "classroom":
      return <ClassroomWindow />;
    case "profile":
      return <ProfileRightPanel />;
    default:
      return <div>Select a tab to see content</div>;
  }
}
