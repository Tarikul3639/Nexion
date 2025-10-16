// ChatHeader.tsx
"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { usePanel } from "@/context/PanelContext";
import { IChatList } from "@/types/message";
import BackButton from "../../../ui/BackButton";
import ChatAvatar from "./ChatAvatar";
import ChatInfo from "./ChatInfo";
import ActionButtons from "./ActionButtons";
import { useLeftPanelData } from "@/context/LeftPanelDataContext";

export default function ChatHeader() {
  const { activeChat } = usePanel();
  const { allChats } = useLeftPanelData();

  // Find the full chat details from allChats using activeChat id for real-time updates
  const chat = allChats.find((c) => c.id === activeChat?.id) || activeChat;

  if (!chat) return null;

  return (
    <Card className="w-full py-0 border-none shadow-none rounded-none bg-transparent">
      <CardHeader className="flex px-1 md:px-3 py-2 flex-row items-center justify-between">

        {/* Left Side */}
        <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
          <BackButton />
          <ChatAvatar chat={chat as IChatList} />
          <ChatInfo chat={chat as IChatList} />
        </div>

        {/* Right Side */}
        <ActionButtons />
      </CardHeader>
    </Card>
  );
}
