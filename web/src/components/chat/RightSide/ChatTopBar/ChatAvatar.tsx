"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IChatList } from "@/types/message";

export default function ChatAvatar({ chat }: { chat: IChatList }) {
  return (
    <Avatar className="w-12 h-12 rounded-lg flex-shrink-0">
      <AvatarImage src={chat.avatar} alt={chat.name} />
      <AvatarFallback className="rounded-lg bg-white text-black">
        <span className="text-xl font-bold">
          {(chat?.name || "NA").slice(0, 2).toUpperCase()}
        </span>
      </AvatarFallback>
    </Avatar>
  );
}
