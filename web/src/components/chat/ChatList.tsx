import React, { useState } from "react";
import { Search, Pin } from "lucide-react";
import ChatItem from "./ChatItem";
import { ChatListProps } from "@/types/chat.list";

export default function ChatList({
  pinnedChats = [],
  allChats = [],
  selectedChat,
  onSelectChat,
}: ChatListProps) {
  const [searchValue, setSearchValue] = useState("");

  const filteredPinnedChats = pinnedChats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredAllChats = allChats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col">
      {/* Search */}
      <div className="px-4 pt-4">
        <div className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search chats or people..."
            className="w-full h-12 bg-[#1E1E1F] border border-[#242424] rounded-lg px-3 pr-10 text-white placeholder-[#555555] text-sm focus:outline-none focus:ring-2 focus:ring-[#614BFF] focus:ring-opacity-30 focus:border-[#614BFF] transition-all duration-200"
          />
          <Search
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white opacity-70 pointer-events-none"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {/* Pinned Chats */}
        {filteredPinnedChats.length > 0 && (
          <div className="mt-4 px-4">
            <h2 className="text-xs font-medium text-[#67676D] tracking-wide mb-3 flex items-center gap-2">
              <Pin size={12} /> PINNED CHATS
            </h2>
            <div className="space-y-1">
              {filteredPinnedChats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={selectedChat?.id === chat.id}
                  onSelect={onSelectChat}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Chats */}
        {filteredAllChats.length > 0 && (
          <div className="mt-6 px-4">
            <h2 className="text-xs font-medium text-[#67676D] tracking-wide mb-3">
              ALL CONVERSATIONS
            </h2>
            <div className="space-y-1">
              {filteredAllChats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={selectedChat?.id === chat.id}
                  onSelect={onSelectChat}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
