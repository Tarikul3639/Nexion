// ChatHeader.tsx
"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { usePanel } from "@/context/PanelContext";
import BackButton from "@/components/ui/BackButton";
import ChatAvatar from "./ChatAvatar";
import ChatInfo from "./ChatInfo";
import ActionButtons from "./ActionButtons";

export default function ChatHeader() {
  // IMPORTANT: Access the current selected conversation from context
  const { selectedConversation } = usePanel();

  // If no conversation is selected, render nothing
  if (!selectedConversation) return null;

  return (
    <Card className="w-full py-0 border-none shadow-none rounded-none bg-transparent">
      <CardHeader className="flex px-1 md:px-3 py-2 flex-row items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
          <BackButton />
          <ChatAvatar User={selectedConversation} />
          <ChatInfo User={selectedConversation} />
        </div>

        {/* Right Side */}
        <ActionButtons />
      </CardHeader>
    </Card>
  );
}
