"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ISelectedChatHeader } from "@/types/message/types";

export default function ChatAvatar({ User }: { User: ISelectedChatHeader }) {
  return (
    <Avatar className="w-12 h-12 rounded-lg flex-shrink-0">
      <AvatarImage src={User.avatar} alt={User.name} />
      <AvatarFallback className="rounded-lg bg-white text-black">
        <span className="text-xl font-bold">
          {(User.name || "NA").slice(0, 2).toUpperCase()}
        </span>
      </AvatarFallback>
    </Avatar>
  );
}
