"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useChat } from "@/context/ChatContext/ChatProvider";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

export default function AISuggestionsToggleButton() {
  const { showAISuggestions, setShowAISuggestions } = useChat();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            onClick={() => setShowAISuggestions(!showAISuggestions)}
            className={`rounded-sm bg-transparent transition-all items-center ${
              showAISuggestions
                ? "text-blue-100 bg-[#323438] hover:bg-[#323480] hover:text-blue-200"
                : "text-gray-500 hover:bg-[#323438] hover:text-blue-100"
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>AI Suggestions</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
