// ChatInfo.tsx
"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ISelectedChatHeader } from "@/types/message/types";

export default function ChatInfo({ User }: { User: ISelectedChatHeader }) {

  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
      <h3 className="text-lg md:text-xl font-semibold text-white truncate capitalize">{User.name}</h3>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-xs text-gray-400 font-medium cursor-pointer">
            <span className={User.status === "online" ? "text-green-500 capitalize" : "text-gray-500 capitalize"}>{User.status}</span>
            {User.lastActiveAt && (
              <span className="text-gray-500 capitalize"> last active: {User.lastActiveAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-900 text-white text-sm">{User.status}</TooltipContent>
      </Tooltip>
    </div>
  );
}
