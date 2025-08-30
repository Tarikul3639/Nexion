"use client";

import React from "react";
import { Settings } from "lucide-react";
import { desktopNavigationItems, TAB_KEYS, TabKey } from "./navigationItems";
import { usePanel } from "@/context/PanelContext";

export function DesktopSidebar() {
  const { activeTab, setActiveTab } = usePanel();
  return (
    <div className="hidden md:flex h-full w-16 flex-col items-center py-4">
      <div className="mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          CH
        </div>
      </div>

      <div className="flex flex-col space-y-4 flex-1">
        {desktopNavigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabKey)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors group relative hover:scale-105 z-10 ${
                activeTab === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-900"
              }`}
            >
              <Icon size={20} />
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      <button
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors group relative ${
          activeTab === TAB_KEYS.SETTINGS
            ? "bg-blue-600 text-white"
            : "text-gray-400 hover:text-white hover:bg-gray-800"
        }`}
        title="Settings"
      >
        <Settings size={20} />
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
          Settings
        </div>
      </button>
    </div>
  );
}
