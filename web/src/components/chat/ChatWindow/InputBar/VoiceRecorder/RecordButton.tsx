"use client";

import { Button } from "@/components/ui/button";
import { Mic, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useChat } from "@/context/ChatContext";

interface RecordButtonProps {
  handleCancel: () => void;
  handleRecording: () => void;
}

export default function RecordButton({
  handleCancel,
  handleRecording,
}: RecordButtonProps) {
  const { isRecordingActive, message } = useChat();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {isRecordingActive ? (
          <Button
            size="icon"
            onClick={handleCancel}
            className={`rounded-full active:scale-95 focus:outline-none text-gray-300`}
          >
            <X strokeWidth={4} />
          </Button>
        ) : (
          <Button
            size="icon"
            onClick={handleRecording}
            className={`rounded-sm flex items-center justify-center transition-all duration-200 active:scale-95 focus:outline-none bg-blue-600 hover:bg-blue-700 ${message.text || message.attachments.length > 0 ? "hidden" : ""}`}
          >
            <Mic className="w-4 h-4" />
          </Button>
        )}
      </TooltipTrigger>
      <TooltipContent>
        <p>{isRecordingActive ? "Cancel" : "Start Recording"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
