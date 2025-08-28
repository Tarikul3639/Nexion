"use client";

import React, { useState, useEffect } from "react";
import ChatList from "../../chat/ChatList";
import { pinnedChats, allChats } from "../../chat/sample";
import { Chat } from "@/types/chat.list";
import { usePanel } from "@/context/PanelContext";

export default function LeftPanelWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="w-full h-full md:w-80 lg:w-96 flex items-center justify-center text-white">
      {mounted ? <LeftPanel /> : "Loading..."}
    </div>
  );
}

function LeftPanel() {
  const { selectedChat, setSelectedChat } = usePanel();

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  };

  return (
    <ChatList
      pinnedChats={pinnedChats as Chat[]}
      allChats={allChats as Chat[]}
      selectedChat={selectedChat as Chat | undefined}
      onSelectChat={handleSelectChat}
    />
  );
}
