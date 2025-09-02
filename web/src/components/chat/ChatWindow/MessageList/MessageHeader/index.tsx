import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCheck } from "lucide-react";
import { MessageItem } from "@/types/message";

export default function MessageHeader({ message }: { message: MessageItem }) {
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div
      className={`flex items-center space-x-2 mb-1 ${
        message.isMe ? "justify-start flex-row-reverse space-x-reverse" : ""
      }`}
    >
      <span className="text-base font-semibold text-gray-50">
        {message.senderName}
      </span>

      {message.role === "teacher" && (
        <Badge
          variant="secondary"
          className="text-xs bg-purple-100 text-purple-600"
        >
          Teacher
        </Badge>
      )}
      {message.role === "assistant" && (
        <Badge
          variant="secondary"
          className="text-xs bg-green-100 text-green-600"
        >
          TA
        </Badge>
      )}
      {message.role === "admin" && (
        <Badge
          variant="secondary"
          className="text-xs bg-red-100 text-red-600"
        >
          Admin
        </Badge>
      )}

      <span className="text-base font-normal text-gray-400">
        {formattedTime}
        {message.isEdited && (
          <span className="ml-1 text-gray-400 italic">(edited)</span>
        )}
      </span>
    </div>
  );
}
