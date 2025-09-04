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
import { MessageItem } from "@/types/message/message";
import { usePanel } from "@/context/PanelContext";
import { useSocket } from "@/context/SocketContext";

export default function SendButton() {
  const {
    replyToId,
    setReplyToId,
    draftMessage,
    setDraftMessage,
    setAllMessages,
    setIsRecordingActive,
  } = useChat();
  const { socket } = useSocket();
  const { selectedChat } = usePanel();

  if (!draftMessage?.text && !draftMessage?.attachments?.length) return null;

  // Function to handle message sending
  const handleMessageSend = () => {
    if (!socket || !selectedChat) return;

    const tempId = Date.now().toString();

    const optimisticMessage: MessageItem = {
      id: tempId,
      senderId: "me", // backend userId replace হবে socket.user থেকে
      senderName: "You",
      senderAvatar: "",
      updatedAt: new Date().toISOString(),
      status: "sending",
      isMe: true,
      replyToId: replyToId || undefined,
      content: draftMessage,
    };

    // Local UI update (optimistic)
    setAllMessages((prev) => [...prev, optimisticMessage]);

    // Emit to backend
    socket.emit("sendMessage", {
      conversation: selectedChat.id,
      participants: selectedChat.participants, // সার্ভারে যাতে পাঠানো যায়
      content: draftMessage,
      replyTo: replyToId,
    });

    // Reset input state
    setDraftMessage(null);
    setIsRecordingActive(false);
    setReplyToId(null);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            onClick={handleMessageSend}
            className={`rounded-sm flex items-center justify-center transition-all duration-200 focus:outline-none ${
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
