"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { usePanel } from "@/context/PanelContext";

export default function BackButton() {
  const { selectedChat, setSelectedChat } = usePanel();

  // Handle mobile browser back button
  useEffect(() => {
    // Push initial state when selectedChat is opened
    if (selectedChat) {
      history.pushState({ chatOpen: true }, "");
    }

    const handlePopState = () => {
      if (selectedChat) {
        // Close the chat instead of navigating back
        setSelectedChat(null);
        // Push state again to prevent leaving page
        history.pushState({ chatOpen: false }, "");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [selectedChat, setSelectedChat]);

  if (!selectedChat) return null;

  return (
    <Button
      size="icon"
      variant="ghost"
      className="md:hidden text-gray-300 hover:text-white hover:bg-[#323438]"
      onClick={() => setSelectedChat(null)}
    >
      <ArrowLeft className="w-5 h-5" />
    </Button>
  );
}
