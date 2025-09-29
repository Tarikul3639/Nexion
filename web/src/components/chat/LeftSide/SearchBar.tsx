import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useLeftPanelData } from "@/context/LeftPanelDataContext";
import { useSocket } from "@/context/SocketContext";

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({
  placeholder = "Search chats or people...",
}: SearchBarProps) {
  const { socket } = useSocket();
  const { setSearchActive, setSearchResults } = useLeftPanelData();
  const [searchValue, setSearchValue] = useState("");

  // Debounce search
  useEffect(() => {
    if (!socket) return;
    const timeout = setTimeout(() => {
      if (searchValue.trim().length > 1) {
        socket.emit("searchUsers", { search: searchValue.trim() });
        setSearchActive(true);
      } else {
        setSearchActive(false);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchValue, socket]);

  return (
    <div className="relative group w-full">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 bg-[#1E1E1F] border border-[#242424] rounded-lg px-3 pr-10 text-white placeholder-[#555555] text-sm focus:outline-none focus:ring-1 focus:ring-[#614BFF] focus:ring-opacity-30 focus:border-[#614BFF] transition-all duration-200"
      />
      <Search
        size={20}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white opacity-70 pointer-events-none group-focus-within:text-[#614BFF] group-focus-within:opacity-100 transition-all duration-200"
      />
    </div>
  );
}
