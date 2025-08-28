"use client";
import React from "react";
import { usePanel } from "@/context/PanelContext";
import ChatWindow from "@/components/chat/ChatWindow";
import ClassroomWindow from "@/components/classroom/ClassroomWindow";

export default function RightPanel() {
  const { activeTab, selectedChat } = usePanel();

  if (!selectedChat) {
    return (
      <div className="flex-1 hidden md:flex items-center justify-center text-gray-100">
        <span>Select an item from the left panel</span>
      </div>
    );
  }

  switch (activeTab) {
    case "chats":
      return <ChatWindow />;
    case "classroom":
      return <ClassroomWindow />;
    default:
      return null;
  }
}