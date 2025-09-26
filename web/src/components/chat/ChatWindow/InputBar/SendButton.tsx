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
import { usePanel } from "@/context/PanelContext";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";

export default function SendButton() {
  const {
    draftMessage,
    setDraftMessage,
    allMessages,
    setAllMessages,
    replyToId,
    setReplyToId,
    setIsRecordingActive,
  } = useChat();
  const { socket } = useSocket();
  const { selectedChat } = usePanel();
  const { user } = useAuth();

  if (!draftMessage?.text && !draftMessage?.attachments?.length) return null;

  const handleMessageSend = async () => {
    if (!socket || !selectedChat || !user || !draftMessage) return;

    const tempId = Date.now().toString();
    let uploadedAttachments: any = [];

    // Upload files to backend
    if (draftMessage.attachments?.length) {
      uploadedAttachments = await Promise.all(
        draftMessage.attachments.map(async (att) => {
          if (!att.file) return att; // already has URL, skip

          const formData = new FormData();
          formData.append("file", att.file);

          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, {
            // your upload route
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          return {
            ...att,
            url: data.url, // cloudinary URL
            file: undefined, // optional: remove local File
          };
        })
      );
    }

    const optimisticMessage = {
      id: tempId,
      senderId: user.id,
      senderName: user.username || "Unknown",
      senderAvatar: user.avatar || "",
      content: { ...draftMessage, attachments: uploadedAttachments },
      updatedAt: new Date().toISOString(),
      status: "sending" as const,
      isMe: true,
      replyToId: replyToId || undefined,
      tempId,
    };

    setAllMessages((prev) => [...prev, optimisticMessage]);

    socket.emit("sendMessage", {
      conversation: selectedChat.id,
      sender: user.id,
      content: { ...draftMessage, attachments: uploadedAttachments },
      replyTo: replyToId,
      tempId,
    });

    setDraftMessage({ text: "", attachments: [] });
    setReplyToId(null);
    setIsRecordingActive(false);
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
