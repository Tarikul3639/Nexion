"use client";

import React from "react";
import { cn } from "@/lib/utils";
import SearchBar from "../../chat/LeftSide/SearchBar";
import { User, Settings, Sliders, Shield, Bell, Puzzle } from "lucide-react";
import type { ProfileSection } from "@/types/profile";

export function ProfileLeftPanel({
  activeSection,
  onSectionChange,
}: {
  activeSection: ProfileSection | undefined;
  onSectionChange: (section: ProfileSection) => void;
}) {
  const sections = [
    {
      id: "general" as ProfileSection,
      label: "General",
      icon: User,
      desc: "Basic information & overview",
    },
    {
      id: "account" as ProfileSection,
      label: "Account",
      icon: Settings,
      desc: "Email, username & account settings",
    },
    {
      id: "preferences" as ProfileSection,
      label: "Preferences",
      icon: Sliders,
      desc: "Theme, language & layout options",
    },
    {
      id: "security" as ProfileSection,
      label: "Security",
      icon: Shield,
      desc: "Passwords, 2FA & protection settings",
    },
    {
      id: "notifications" as ProfileSection,
      label: "Notifications",
      icon: Bell,
      desc: "Alerts, sounds & email updates",
    },
    {
      id: "integrations" as ProfileSection,
      label: "Integrations",
      icon: Puzzle,
      desc: "Connect apps & third-party services",
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
        <nav className="px-3 space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "w-full flex items-start gap-3 text-left px-4 py-2.5 rounded-md transition-all duration-200",
                  isActive
                    ? "bg-zinc-800 text-white shadow-sm shadow-zinc-900"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/40"
                )}
              >
                <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isActive ? "text-white" : "text-zinc-300"
                    )}
                  >
                    {section.label}
                  </span>
                  <span
                    className={cn(
                      "text-xs",
                      isActive ? "text-zinc-400" : "text-zinc-500"
                    )}
                  >
                    {section.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
