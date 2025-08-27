"use client";

import { mobileNavigationItems, TabKey, TAB_KEYS } from "./navigationItems";
import { usePanel } from "@/context/PanelContext";
import { useResponsive } from "@/hooks/useResponsive";
import Link from "next/link";

export function MobileSidebar() {
  const { activeTab, setActiveTab, selectedItem, setSelectedItem } = usePanel();
  const { isDesktop } = useResponsive();
  // Hide mobile sidebar if an item is selected
  if (!isDesktop && selectedItem) return null;

  return (
    <div className="md:hidden w-full bg-black text-white flex justify-around items-center h-16 border-t border-gray-700">
      {mobileNavigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            onClick={() => setActiveTab(item.id as TabKey)}
            key={item.id}
            className={`flex flex-col items-center justify-center text-sm transition-colors ${
              isActive ? "text-blue-500" : "text-white"
            }`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
