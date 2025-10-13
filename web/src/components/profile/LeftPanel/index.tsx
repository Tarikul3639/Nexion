"use client";

import React from "react";
import SearchBar from "../../chat/LeftSide/SearchBar";
import { cn } from "@/lib/utils";

import type { ProfileSection } from "../types";

export function ProfileLeftPanel({
  activeSection,
  onSectionChange,
}: {
  activeSection: ProfileSection;
  onSectionChange: (section: ProfileSection) => void;
}) {
  const sections = [
    { id: "general" as ProfileSection, label: "General" },
    { id: "account" as ProfileSection, label: "Account" },
    { id: "preferences" as ProfileSection, label: "Preferences" },
    { id: "security" as ProfileSection, label: "Security" },
    { id: "notifications" as ProfileSection, label: "Notifications" },
    { id: "integrations" as ProfileSection, label: "Integrations" },
  ];

  return (
    <div className="flex flex-col">
      {/* Search */}
      <div className="px-2 md:px-4 pt-4">
        <SearchBar />
      </div>

      <div className="mt-4 px-4 text-xs font-medium text-[#67676D] tracking-wide mb-3">
        Profile
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="p-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "w-full text-left px-4 py-2.5 rounded-md text-sm transition-colors",
                activeSection === section.id
                  ? "bg-zinc-800 text-white font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              )}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
