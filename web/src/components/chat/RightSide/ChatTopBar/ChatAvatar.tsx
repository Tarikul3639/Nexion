"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface IChatPartner {
    id: string;
    name: string;
    avatar: string;
    status: string;
}

export default function ChatAvatar({ conversationUserInfo }: { conversationUserInfo: IChatPartner }) {
  return (
    <Avatar className="w-12 h-12 rounded-lg flex-shrink-0">
      <AvatarImage src={conversationUserInfo.avatar} alt={conversationUserInfo.name} />
      <AvatarFallback className="rounded-lg bg-white text-black">
        <span className="text-xl font-bold">
          {(conversationUserInfo.name || "NA").slice(0, 2).toUpperCase()}
        </span>
      </AvatarFallback>
    </Avatar>
  );
}
