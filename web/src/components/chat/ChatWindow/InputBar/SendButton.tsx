"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useChat } from "@/context/ChatContext";
import { MessageItem } from "@/types/message";

export default function SendButton() {
  const {
    draftMessage,
    setDraftMessage,
    setAllMessages,
    setIsRecordingActive,
  } = useChat();
 if(!draftMessage?.text && !draftMessage?.attachments?.length) return null;
  // Function to handle message sending
  const handleMessageSend = () => {
    console.log(draftMessage);
    const newMessage: MessageItem = {
      id: Date.now().toString(),
      senderId: "user123",
      senderName: "User",
      senderAvatar: "https://example.com/avatar.jpg",
      timestamp: new Date().toISOString(),
      status: "sending",
      isMe: true,
      content: draftMessage,
    };
    setAllMessages((prev) => [...prev, newMessage]);
    // Clear the input after sending
    setDraftMessage(null);
    setIsRecordingActive(false);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            onClick={handleMessageSend}
            className={`rounded-sm mr-2 flex items-center justify-center transition-all duration-200 focus:outline-none ${
              draftMessage?.text || draftMessage?.attachments?.length
                ? "bg-blue-600 hover:bg-blue-700 active:scale-95"
                : "bg-gray-600 hover:bg-gray-700 hidden"
            }`}
          >
            <Send className="w-5 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Send Message</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
