import React, { useState } from "react";
import { Search, Pin } from "lucide-react";
import { Chat, ChatListProps, ChatItemProps } from "./type";

// Chat Type Icon
const ChatTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "class":
      return <span className="text-[#614BFF] text-xs font-bold">C</span>; // or use BookOpen
    case "group":
      return <span className="text-[#35D57F] text-xs font-bold">G</span>; // or use Users
    default:
      return null;
  }
};

// Single Chat Item
export const ChatItem = ({
  chat,
  isActive = false,
  onSelect,
}: ChatItemProps) => (
  <div
    className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-200 rounded-xl ${
      isActive ? "bg-[#323438]" : "hover:bg-[#323438] active:bg-[#1E1E1F]"
    }`}
    onClick={() => onSelect(chat)}
  >
    <div className="relative flex-shrink-0">
      <img
        src={chat.avatar}
        alt={chat.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      {chat.type !== "student" && (
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#23C26C] border-2 border-[#161616] rounded-full flex items-center justify-center">
          <ChatTypeIcon type={chat.type} />
        </div>
      )}
    </div>

    <div className="flex-1 min-w-0 ml-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-sm text-white truncate">
          {chat.name}
        </h3>
        <span className="text-xs text-[#8B8B90] flex-shrink-0 ml-2">
          {chat.timestamp}
        </span>
      </div>
      <p className="text-xs text-[#8B8B90] truncate">
        {chat.isTyping ? (
          <span className="text-[#23C26C]">Someone is typing...</span>
        ) : (
          chat.lastMessage
        )}
      </p>
    </div>

    {(chat.unreadCount ?? 0) > 0 && (
      <div className="flex-shrink-0 ml-3">
        <div className="w-5 h-5 bg-[#614BFF] rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-semibold">
            {chat.unreadCount ?? 0}
          </span>
        </div>
      </div>
    )}
  </div>
);

// Chat List Component
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
