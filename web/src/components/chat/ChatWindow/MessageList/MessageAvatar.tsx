import React from "react";
import { Avatar, AvatarFallback,AvatarImage } from "@/components/ui/avatar";
import { MessageItem } from "@/types/message";

export default function MessageAvatar({ message }: { message: MessageItem }) {
  return (
    <Avatar className="w-7 h-7 rounded-sm md:w-8 md:h-8 text-sm font-semibold flex-shrink-0">
      <AvatarImage src={message.senderAvatar} alt={message.senderName} />
      <AvatarFallback className="rounded-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold">
        {message.senderName.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
