"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { ChatItem } from "@/types/chat";
import BackButton from "./BackButton";
import ChatAvatar from "./ChatAvatar";
import ChatInfo from "./ChatInfo";
import ActionButtons from "./ActionButtons";

export default function ChatHeader({
  selectedChat,
  setSelectedChat,
}: {
  selectedChat: ChatItem;
  setSelectedChat: (chat: ChatItem | null) => void;
}) {
  return (
    <Card className="w-full py-2 border-none shadow-none rounded-none bg-transparent">
      <CardHeader className="flex py-2 flex-row items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <BackButton onClick={() => setSelectedChat(null)} />
          <ChatAvatar chat={selectedChat} />
          <ChatInfo chat={selectedChat} />
        </div>

        {/* Right Side */}
        <ActionButtons />
      </CardHeader>
    </Card>
  );
}
