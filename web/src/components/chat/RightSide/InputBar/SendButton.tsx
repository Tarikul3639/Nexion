"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useSendMessage } from "@/components/chat/Hooks/useSendMessage";

export default function SendButton() {
  // Use the custom hook to get the necessary logic and status
  const { handleMessageSend, isReadyToSend } = useSendMessage();
  
  // Don't render anything if there's no message to send
  if (!isReadyToSend) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            id="send-btn"
            size="icon"
            onClick={handleMessageSend}
            className="rounded-sm flex items-center justify-center transition-all duration-200 focus:outline-none bg-blue-600 hover:bg-blue-700 active:scale-95"
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