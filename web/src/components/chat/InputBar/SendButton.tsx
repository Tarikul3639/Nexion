"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

export default function SendButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className="rounded-sm flex items-center justify-center transition-all duration-200 bg-blue-600 hover:bg-blue-700 active:scale-95 focus:outline-none"
          >
            <Send className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Send Message</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
