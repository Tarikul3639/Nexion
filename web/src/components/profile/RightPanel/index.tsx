"use client";

import { useMemo } from "react";

// Types
import type { ProfileSection } from "@/components/profile/types";

// Context
import { usePanel } from "@/context/PanelContext";

// Profile section components
import { GeneralSection } from "./GeneralSection";
import { AccountSection } from "./AccountSection";
import { PreferencesSection } from "./PreferencesSection";
import { SecuritySection } from "./SecuritySection";
import { NotificationsSection } from "./NotificationsSection";
import { IntegrationsSection } from "./IntegrationsSection";

// Common components
import BackButton from "@/components/ui/BackButton";

// Section → Component mapping
const sectionComponents = {
  general: GeneralSection,
  account: AccountSection,
  preferences: PreferencesSection,
  security: SecuritySection,
  notifications: NotificationsSection,
  integrations: IntegrationsSection,
};

// Section descriptions for tooltips or help texts
const sectionDescriptions: Record<ProfileSection, string> = {
  general: "Manage your profile information and public presence",
  account: "Manage your account settings and preferences",
  preferences: "Customize your Nexion experience",
  security: "Manage your security settings and authentication",
  notifications: "Control how you receive notifications",
  integrations: "Manage connected services and bots",
};

export function ProfileRightPanel() {
  // Active profile section from global panel context
  const { activeProfile } = usePanel();

  // Determine which section to show (default: "general")
  const activeSection: ProfileSection = activeProfile || "general";

  // Determine the component to render dynamically
  const ActiveSectionComponent = useMemo(() => {
    return sectionComponents[activeSection];
  }, [activeSection]);

  return (
    <div className="flex-1 max-w-4xl mx-auto overflow-y-auto px-2 lg:px-6 pb-6 mt-2 lg:mt-6">
      {/* Header section */}
      <div className="sticky top-0 bg-neutral-900 z-10 flex items-center gap-3 pb-2 mb-6 border-b border-neutral-800">
        <BackButton />
        <div>
          <h2 className="text-xl font-semibold text-white mb-1 capitalize">
            {activeSection}
          </h2>
          <p className="text-sm text-zinc-400">
            {sectionDescriptions[activeSection]}
          </p>
        </div>
      </div>

      {/* Dynamic section rendering */}
      <ActiveSectionComponent />
    </div>
  );
}
