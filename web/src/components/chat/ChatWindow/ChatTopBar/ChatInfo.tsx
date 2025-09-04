"use client";

import { IChatList } from "@/types/message/message.messageList";
import { useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ChatInfo({ chat }: { chat: IChatList }) {
  // ---------------- Active Participants ----------------
  const activeUsers = useMemo(
    () => chat.participants?.filter((p) => p.status === "online") || [],
    [chat.participants]
  );

  const isActive = activeUsers.length > 0;

  // ---------------- Last Active Participant ----------------
  const lastActiveUser = useMemo(() => {
    if (!chat.participants || chat.participants.length === 0) return null;
    const sorted = [...chat.participants].sort(
      (a, b) =>
        new Date(b.lastSeen || 0).getTime() -
        new Date(a.lastSeen || 0).getTime()
    );
    return sorted[0];
  }, [chat.participants]);

  // ---------------- Tooltip Content ----------------
  const tooltipContent = isActive
    ? `Active: ${activeUsers.map((u) => u.username).join(", ")}`
    : lastActiveUser
    ? `Last active: ${lastActiveUser.username} (${
        lastActiveUser.lastSeen
          ? new Date(lastActiveUser.lastSeen).toLocaleString()
          : "Offline"
      })`
    : "No participants";

  // ---------------- Display Text ----------------
  let displayText = "Offline"; // default for group
  if (isActive) displayText = "Active now";
  else if (
    chat.type === "direct" &&
    lastActiveUser &&
    lastActiveUser.lastSeen
  ) {
    const diff = Date.now() - new Date(lastActiveUser.lastSeen).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) displayText = "Just now";
    else if (minutes < 60) displayText = `${minutes} min ago`;
    else if (hours < 24) displayText = `${hours} hr ago`;
    else displayText = `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
      <h3 className="text-lg md:text-xl font-semibold text-white truncate">
        {chat.name}
      </h3>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col md:flex-row md:items-center text-xs text-gray-400 font-medium gap-1 md:gap-3 overflow-hidden cursor-pointer">
            {chat.participants && chat.type === "group" && (
              <span className="truncate">
                {chat.participants ? chat.participants.length + 1 : 1} members
              </span>
            )}
            <span
              className={
                isActive ? "text-green-500 truncate" : "text-gray-500 truncate"
              }
            >
              {displayText}
            </span>
          </div>
        </TooltipTrigger>

        <TooltipContent className="flex flex-col bg-gray-900 text-white text-sm">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
