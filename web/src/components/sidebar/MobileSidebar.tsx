"use client";

import { NavigationItems, TabKey } from "./navigationItems";
import { usePanel } from "@/context/PanelContext";
import { useResponsive } from "@/hooks/useResponsive";
import { User } from "lucide-react";

export function MobileSidebar() {
  const Items = [ ...NavigationItems, { id: "profile", icon: User, label: "Profile" } ];
  const { activeTab, setActiveTab, selectedConversation, activeProfile, activeClassroom, activeBot } = usePanel();
  const { isDesktop } = useResponsive();
  // Check if any panel is active
  const isAnyPanelActive = selectedConversation || activeProfile || activeClassroom || activeBot;
  // Hide mobile sidebar if an item is selected
  if (!isDesktop && isAnyPanelActive) return null;

  return (
    <div className="md:hidden w-full bg-zinc-800/50 text-white flex justify-around items-center h-16 rounded-t-2xl ">
      {Items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            onClick={() => setActiveTab(item.id as TabKey)}
            key={item.id}
            className={`flex flex-col items-center justify-center text-[10px] transition-colors space-y-1 ${
              isActive ? "text-blue-500" : "text-gray-200 hover:text-white"
            }`}
          >
            <Icon width={16} height={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
