import React from "react";
import { Pin } from "lucide-react";
import { MessageItem } from "@/types/message";


export default function MessageBubble({
  message,
}: {
  message: MessageItem;
  scrollToMessage?: (id: string) => void;
}) {
  return (
    <>
      {message.isPinned && (
        <div
          className={`absolute -top-4 ${
            message.isMe ? "-left-4 -rotate-40" : "-right-4 rotate-40"
          } text-yellow-500`}
        >
          <Pin className="w-3 h-3" />
        </div>
      )}
      {message.content && (
        <p className="text-base text-gray-50 py-2.5 leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
      )}
    </>
  );
}
