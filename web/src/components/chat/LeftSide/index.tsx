import React from "react";
import { Pin } from "lucide-react";
import ChatItem from "./ChatItem";
import { IChatList } from "@/types/message/message.messageList";
import { useLeftPanelData } from "@/context/LeftPanelDataContext";
import SearchBar from "./SearchBar";
import ChatListSkeleton from "./ChatListSkeleton";

interface ChatListProps {
  allChats: IChatList[];
  selectedChat?: IChatList;
  onSelectChat: (chat: IChatList) => void;
  isLoading: boolean;
}

export default function ChatList({
  allChats = [],
  selectedChat,
  onSelectChat,
  isLoading,
}: ChatListProps) {
  const { searchActive, searchResults } = useLeftPanelData();

  const chatsToShow = searchActive ? searchResults : allChats;

  // console.log("Chats to show:", chatsToShow);

  const filteredPinnedChats = chatsToShow.filter(
    (chat) => chat.isPinned && chat.name?.toLowerCase().includes("")
  );

  const filteredAllChats = chatsToShow.filter((chat) => !chat.isPinned);

  if (isLoading) {
    return <ChatListSkeleton />;
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Search */}
      <div className="px-2 md:px-4 pt-4">
        <SearchBar />
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
