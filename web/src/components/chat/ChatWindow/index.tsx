import ChatHeader from "./ChatTopBar";
import { ChatProvider } from "@/context/ChatContext";
import InputBar from "./InputBar/index";
import MessageList from "./MessageList";
import ReplyPreview from "./ReplayPreview";
import { useEffect, useState } from "react";

export default function ChatContainer() {
  return (
    <div className="flex-1 flex flex-col h-full ">
      <ChatProvider>
        <ChatHeader />
        <MessageList />
        <ReplyPreview />
        <InputBar />
      </ChatProvider>
    </div>
  );
}
