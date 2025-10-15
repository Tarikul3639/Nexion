// ChatInfo.tsx
"use client";

import { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { IChatList } from "@/types/message/x";

interface ChatInfoProps {
  chat: IChatList;
}

export default function ChatInfo({ chat }: ChatInfoProps) {
  const { user } = useAuth();

  // ---------------- Determine Status ----------------
  const showStatus = useMemo(() => {
    if (!chat.participants || !user) return "Offline";

    const other = chat.participants.find((p) => p._id !== user.id);
    if (!other) return "Offline";

    if (other.status === "online") return "Online";

    // offline → show last active
    if (other.lastSeen) {
      const diff = Date.now() - new Date(other.lastSeen).getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return "Last active: just now";
      if (minutes < 60) return `Last active: ${minutes} min ago`;
      if (hours < 24) return `Last active: ${hours} hr ago`;
      return `Last active: ${days} day${days > 1 ? "s" : ""} ago`;
    }

    return "Offline";
  }, [chat.participants, user]);

  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
      <h3 className="text-lg md:text-xl font-semibold text-white truncate capitalize">{chat.name}</h3>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-xs text-gray-400 font-medium cursor-pointer">
            <span className={showStatus === "Online" ? "text-green-500" : "text-gray-500"}>{showStatus}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-900 text-white text-sm">{showStatus}</TooltipContent>
      </Tooltip>
    </div>
  );
}
