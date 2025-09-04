import React from "react";
import { Badge } from "@/components/ui/badge";
import { MessageItem } from "@/types/message/message";

export default function MessageHeader({ message }: { message: MessageItem }) {
  // console.log(message);
  const formattedTime = new Date(message.updatedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  console.log(message);

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

      <span className="text-sm font-normal text-gray-400 uppercase">
        {formattedTime}
        {message.isEdited && (
          <span className="ml-1 text-gray-400 italic">(edited)</span>
        )}
      </span>
    </div>
  );
}
