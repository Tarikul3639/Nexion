"use client";

import React from "react";
import { cn } from "@/lib/utils";
import SearchBar from "../../chat/LeftSide/SearchBar";
import {
  User,
  Settings,
  Sliders,
  Shield,
  Bell,
  Puzzle,
} from "lucide-react";

import type { ProfileSection } from "../types";

export function ProfileLeftPanel({
  activeSection,
  onSectionChange,
}: {
  activeSection: ProfileSection | undefined;
  onSectionChange: (section: ProfileSection) => void;
}) {
  const sections = [
    { id: "general" as ProfileSection, label: "General", icon: User },
    { id: "account" as ProfileSection, label: "Account", icon: Settings },
    {
      id: "preferences" as ProfileSection,
      label: "Preferences",
      icon: Sliders,
    },
    { id: "security" as ProfileSection, label: "Security", icon: Shield },
    {
      id: "notifications" as ProfileSection,
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "integrations" as ProfileSection,
      label: "Integrations",
      icon: Puzzle,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Search */}
      <div className="px-2 md:px-4 pt-4">
        <SearchBar />
      </div>

      <div className="mt-4 px-4 text-xs font-medium text-[#67676D] tracking-wide mb-3 uppercase">
        Profile
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="px-3">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 text-left px-4 py-2.5 rounded-md text-sm transition-colors",
                  activeSection === section.id
                    ? "bg-zinc-800 text-white font-medium"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
