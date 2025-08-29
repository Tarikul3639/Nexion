"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatItem } from "@/types/chat";

export default function ChatAvatar({ chat }: { chat: ChatItem }) {
  return (
    <Avatar className="w-10 md:w-12 h-10 md:h-12 rounded-lg flex-shrink-0">
      <AvatarImage src={chat.avatar} alt={chat.name} />
      <AvatarFallback className="rounded-lg bg-white text-black">
        <span className="text-xl font-bold">
          {(chat?.name || "NA").slice(0, 2).toUpperCase()}
        </span>
      </AvatarFallback>
    </Avatar>
  );
}
