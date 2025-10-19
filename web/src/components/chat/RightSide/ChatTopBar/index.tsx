// ChatHeader.tsx
"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { usePanel } from "@/context/PanelContext";
import BackButton from "../../../ui/BackButton";
import ChatAvatar from "./ChatAvatar";
import ChatInfo from "./ChatInfo";
import ActionButtons from "./ActionButtons";
import { useChatPartnerInfo } from "../Hooks/useChatPartnerInfo";

export default function ChatHeader() {
  const { selectedConversation } = usePanel();
  const { conversationUserInfo, isLoading } =
    useChatPartnerInfo(selectedConversation);

  if (!conversationUserInfo) return null;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full py-0 border-none shadow-none rounded-none bg-transparent">
      <CardHeader className="flex px-1 md:px-3 py-2 flex-row items-center justify-between">
        
        {/* Left Side */}
        <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
          <BackButton />
          <ChatAvatar conversationUserInfo={conversationUserInfo} />
          <ChatInfo conversationUserInfo={conversationUserInfo} />
        </div>

        {/* Right Side */}
        <ActionButtons />
      </CardHeader>
    </Card>
  );
}
