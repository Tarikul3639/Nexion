import React, { useState } from "react";
import { usePanel } from "@/context/PanelContext";
import ChatList from "./chat/ChatList";
import { pinnedChats, allChats, initialMessages } from "./chat/sample";
import { Chat } from "./chat/type";

export default function LeftPanel() {
  const { setSelectedItem } = usePanel();
  const [selectedChat, setSelectedChat] = useState<Chat | undefined>(undefined);
  const [showChatList, setShowChatList] = useState(true);

  return (
    <div className="w-full h-full md:w-80 lg:w-96">
      <ChatList
        pinnedChats={pinnedChats as any}
        allChats={allChats as any}
        selectedChat={selectedChat}
        onSelectChat={(chat: any) => {
          setSelectedChat(chat);
          setShowChatList(false);
          setSelectedItem(chat);
        }}
      />
    </div>
  );
}
