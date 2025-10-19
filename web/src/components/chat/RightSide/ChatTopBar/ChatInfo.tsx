// ChatInfo.tsx
"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
interface IChatPartner {
    id: string;
    name: string;
    avatar: string;
    status: string;
}

export default function ChatInfo({ conversationUserInfo }: { conversationUserInfo: IChatPartner }) {

  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
      <h3 className="text-lg md:text-xl font-semibold text-white truncate capitalize">{conversationUserInfo.name}</h3>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-xs text-gray-400 font-medium cursor-pointer">
            <span className={conversationUserInfo.status === "online" ? "text-green-500 capitalize" : "text-gray-500 capitalize"}>{conversationUserInfo.status}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-900 text-white text-sm">{conversationUserInfo.status}</TooltipContent>
      </Tooltip>
    </div>
  );
}
