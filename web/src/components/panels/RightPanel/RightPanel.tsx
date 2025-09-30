"use client";
import React from "react";
import { usePanel } from "@/context/PanelContext";
import ConversationWindow from "@/components/chat/RightSide";
import ClassroomWindow from "@/components/classroom/ClassroomWindow";
import Welcome from "./Welcome";

export default function RightPanel() {
  const { activeTab, selectedChat } = usePanel();

  if (!selectedChat) {
    return <Welcome />;
  }

  switch (activeTab) {
    case "chats":
      return <ConversationWindow />;
    case "classroom":
      return <ClassroomWindow />;
    default:
      return null;
  }
}
