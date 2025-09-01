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

export default function SendButton() {
  const {
    message,
    setMessage,
    setIsRecordingActive,
    messages,
    setMessages,
  } = useChat();

  // Function to handle message sending
  const handleMessageSend = () => {
    if (!message.text && message.attachments.length === 0) return; // don't send empty

    // Determine message type and content based on what's being sent
    let messageType: "text" | "image" | "file" | "audio" | "video" = "text";
    let messageContent: any = { text: message.text };
    
    // If there are attachments, determine type based on the attachment type
    if (message.attachments.length > 0) {
      const attachment = message.attachments[0];
      
      switch(attachment.type) {
        case "image":
          messageType = "image";
          messageContent = { 
            url: URL.createObjectURL(attachment.file),
            alt: attachment.name 
          };
          break;
        case "audio/webm":
          messageType = "audio";
          messageContent = { 
            url: URL.createObjectURL(attachment.file),
            duration: 0 // Calculate or get from file if possible
          };
          break;
        case "video":
          messageType = "video";
          messageContent = { 
            url: URL.createObjectURL(attachment.file),
            duration: "0:00" // Calculate or get from file if possible
          };
          break;
        default:
          messageType = "file";
          messageContent = { 
            filename: attachment.name,
            url: URL.createObjectURL(attachment.file),
            size: `${Math.round(attachment.size / 1024)} KB` 
          };
      }
    }

    // Create new message object matching MessageItem type
    const newMessage: any = {
      id: (messages.length + 1).toString(),
      senderId: "u1", // current user (hardcoded for now)
      senderName: "Tarikul",
      senderAvatar: "https://i.pravatar.cc/100?img=1",
      type: messageType,
      content: message.text ? { text: message.text } : messageContent,
      timestamp: new Date().toISOString(),
      status: "sending",
      isMe: true,
    };

    // ✅ Add to messages state
    setMessages((prev) => [...prev, newMessage]);

    console.log("Message Sent:", newMessage);

    // ✅ Clear the input after sending
    setMessage({ text: "", attachments: [] });
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
              message.text || message.attachments.length > 0
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
