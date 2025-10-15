import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useLeftPanelData } from "@/context/LeftPanelDataContext";
import { useSocket } from "@/context/SocketContext";
import { Input } from "@/components/ui/input";

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
        socket.emit("search", { search: searchValue.trim() });
        setSearchActive(true);
      } else {
        setSearchActive(false);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchValue, socket, setSearchActive, setSearchResults]);

  return (
    <div className="relative group w-full">
      <Input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 bg-[#1E1E1F] border border-[#242424] rounded px-3 pr-10 text-white placeholder-[#555555] text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-5000 transition-all"
      />
      <Search
        size={20}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white opacity-70 pointer-events-none group-focus-within:text-blue-500 group-focus-within:opacity-100 transition-all"
      />
    </div>
  );
}
