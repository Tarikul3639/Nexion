"use client";

import { useEffect, useCallback } from "react";
import { usePanel } from "@/context/PanelContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const {
    activeBot,
    selectedConversation,
    setSelectedConversation,
    activeClassroom,
    activeProfile,
    setActiveBot,
    setActiveClassroom,
    setActiveProfile,
  } = usePanel();

  const isAnyPanelActive =
    activeBot || selectedConversation || activeClassroom || activeProfile;

  // Helper: Close all active panels
  const closeAllPanels = useCallback(() => {
    setActiveBot(null);
    setSelectedConversation(null);
    setActiveClassroom(null);
    setActiveProfile(null);
  }, [setActiveBot, setSelectedConversation, setActiveClassroom, setActiveProfile]);

  useEffect(() => {
    if (isAnyPanelActive) history.pushState({ panelOpen: true }, "");

    const handlePopState = () => {
      if (isAnyPanelActive) {
        closeAllPanels();
        history.pushState({ panelOpen: false }, "");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isAnyPanelActive, closeAllPanels]);

  if (!isAnyPanelActive) return null;

  return (
    <Button
      size="icon"
      variant="ghost"
      className="md:hidden text-gray-300 hover:text-white hover:bg-[#323438]"
      onClick={closeAllPanels}
    >
      <ArrowLeft className="w-5 h-5" />
    </Button>
  );
}
