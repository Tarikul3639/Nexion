"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChatList, Welcome } from "@/components/chat";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [user, setUser] = useState<{ username: string } | null>(null);

  // client-side localStorage fetch
  useEffect(() => {
    const storedUser = localStorage.getItem("chatfly-user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // 🔹 route change detect
  useEffect(() => {
    console.log("Layout route changed:", pathname);
  }, [pathname]);

  const handleChatSelect = (chat: any) => {
    setSelectedChatId(chat._id);
    router.push(`/dashboard/chat/${chat._id}`);
  };

  return (
    <div className="flex overflow-hidden">
      <div className={`${selectedChatId ? "hidden md:block sm:w-80" : "block w-full sm:w-80"} border-r border-gray-200`}>
        <ChatList onChatSelect={handleChatSelect} selectedChatId={selectedChatId || undefined} />
      </div>

      {selectedChatId ? (
        children
      ) : (
        <div className="hidden sm:flex w-full flex items-center justify-center">
          {user && <Welcome userName={user.username} />}
        </div>
      )}
    </div>
  );
}
