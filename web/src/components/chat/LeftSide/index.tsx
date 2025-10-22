"use client";

import React, { useState } from "react";
import { Pin } from "lucide-react";

// Components
import ChatListSkeleton from "./ChatListSkeleton";
import SearchBar from "@/components/ui/SearchBar";
import ChatItem from "./ChatItem";

// Hooks
import { useSearchUserAndConversations } from "./hooks/SearchUserAndConversations";
import { useInitialConversations } from "./hooks/useInitialConversations";

export default function ChatList() {
  // State for search
  const [searchValue, setSearchValue] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Hooks to fetch data
  const searchResults = useSearchUserAndConversations(searchValue);
  const { data: initialConversations, loading: isLoading } =
    useInitialConversations();

  // Determine which chats to show based on search state
  const displayItems =
    (isSearching ? searchResults : initialConversations) ?? [];

  // console.log("Current conversations:", displayItems);

  // Separate pinned chats
  const pinnedChats = displayItems?.filter(
    (chat) => chat.isPinned && chat.name?.toLowerCase().includes("")
  );

  // Separate unpinned chats
  const unpinnedChats = displayItems?.filter((chat) => !chat.isPinned);

  //Loading state
  if (isLoading) {
    return <ChatListSkeleton />;
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Search */}
      <div className="px-2 md:px-4 pt-4">
        <SearchBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          setIsSearching={setIsSearching}
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {/* Pinned Chats */}
        {pinnedChats?.length > 0 && (
          <div className="mt-4 px-4">
            <h2 className="text-xs font-medium text-[#67676D] tracking-wide mb-3 flex items-center gap-2">
              <Pin size={12} /> PINNED CHATS
            </h2>
            <div className="space-y-1">
              {pinnedChats?.map((conversation) => (
                <ChatItem key={conversation.id} conversation={conversation} />
              ))}
            </div>
          </div>
        )}

        {/* All Chats */}
        {unpinnedChats?.length > 0 && (
          <div className="mt-6 px-4">
            <h2 className="text-xs font-medium text-[#67676D] tracking-wide mb-3">
              ALL CONVERSATIONS
            </h2>
            <div className="space-y-1">
              {unpinnedChats?.map((conversation) => (
                <ChatItem key={conversation.id} conversation={conversation} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
