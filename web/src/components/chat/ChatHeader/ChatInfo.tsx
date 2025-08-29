"use client";

import { ChatItem } from "@/types/chat";

export default function ChatInfo({ chat }: { chat: ChatItem }) {
  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
      <h3 className="text-lg md:text-xl font-semibold text-white truncate">
        {chat.name}
      </h3>
      <div className="flex flex-col md:flex-row md:items-center text-xs text-gray-400 font-medium gap-1 md:gap-3 overflow-hidden">
        {chat.participants && <span className="truncate">{chat.participants} members</span>}
        {chat.status === "online" ? (
          <span className="text-green-500 truncate">Active now</span>
        ) : (
          <span className="text-gray-500 truncate">
            {chat.type === "single" && <span className="mr-1 text-gray-400">Offline</span>}
            {chat.lastActive ?? "Offline"}
          </span>
        )}
      </div>
    </div>
  );
}
