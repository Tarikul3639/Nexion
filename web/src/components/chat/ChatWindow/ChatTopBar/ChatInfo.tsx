// components/ChatInfo.tsx
"use client";

import { IChatList } from "@/types/message/message.messageList";
import { useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {useAuth} from "@/context/AuthContext";

export default function ChatInfo({ chat }: { chat: IChatList }) {

  const { user } = useAuth();

  // ---------------- Active Participants ----------------
  const activeUsers = useMemo(
    () => chat.participants?.filter((p) => p.status === "online") || [],
    [chat.participants]
  );

  const isActive = activeUsers.length > 0;

  // ---------------- Last Active Participant ----------------
  const lastActiveUser = useMemo(() => {
    if (!chat.participants || chat.participants.length === 0) return null;
    const others = chat.participants.filter(
      (p) => p._id !== user?.id // self exclude
    );
    if (!others.length) return null;

    return others.sort(
      (a, b) =>
        new Date(b.lastSeen || 0).getTime() -
        new Date(a.lastSeen || 0).getTime()
    )[0];
  }, [chat.participants, user?.id]);

  // ---------------- Tooltip Content ----------------
  const tooltipContent = isActive
    ? `Active: ${activeUsers.map((u) => u.username).join(", ")}`
    : lastActiveUser
    ? `Last active: ${lastActiveUser.username}`
    : "No participants";

  // ---------------- Display Text (Messenger style) ----------------
  let displayText = "Offline";
  if (isActive) displayText = "Active now";
  else if (chat.type === "direct" && lastActiveUser && lastActiveUser.lastSeen) {
    const diff = Date.now() - new Date(lastActiveUser.lastSeen).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) displayText = "Just now";
    else if (minutes < 60) displayText = `${minutes} min ago`;
    else if (hours < 24) displayText = `${hours} hr ago`;
    else displayText = `${days} day${days > 1 ? "s" : ""} ago`;
  }

  // ---------------- Display Number of Members ----------------
  const memberCount =
    chat.type === "group"
      ? chat.participants
        ? chat.participants.length
        : 1
      : undefined;

  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
      <h3 className="text-lg md:text-xl font-semibold text-white truncate">
        {chat.name}
      </h3>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col md:flex-row md:items-center text-xs text-gray-400 font-medium gap-1 md:gap-3 overflow-hidden cursor-pointer">
            {memberCount && <span className="truncate">{memberCount} members</span>}
            <span
              className={isActive ? "text-green-500 truncate" : "text-gray-500 truncate"}
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
