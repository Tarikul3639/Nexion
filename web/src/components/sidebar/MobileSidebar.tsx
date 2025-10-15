"use client";

import { mobileNavigationItems, TabKey } from "./navigationItems";
import { usePanel } from "@/context/PanelContext";
import { useResponsive } from "@/hooks/useResponsive";

export function MobileSidebar() {
  const { activeTab, setActiveTab, activeChat, activeProfile, activeClassroom, activeBot } = usePanel();
  const { isDesktop } = useResponsive();
  // Check if any panel is active
  const isAnyPanelActive = activeChat || activeProfile || activeClassroom || activeBot;
  // Hide mobile sidebar if an item is selected
  if (!isDesktop && isAnyPanelActive) return null;

  return (
    <div className="md:hidden w-full  text-white flex justify-around items-center h-16 ">
      {mobileNavigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            onClick={() => setActiveTab(item.id as TabKey)}
            key={item.id}
            className={`flex flex-col items-center justify-center text-sm transition-colors ${
              isActive ? "text-blue-500" : "text-gray-200 hover:text-white"
            }`}
          >
            <Icon width={20} height={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
