"use client";

import { useState } from "react";
import type { ProfileSection } from "@/components/profile/types";
import { usePanel } from "@/context/PanelContext";
import { GeneralSection } from "./GeneralSection";
import { AccountSection } from "./AccountSection";
import { PreferencesSection } from "./PreferencesSection";
import { SecuritySection } from "./SecuritySection";
import { NotificationsSection } from "./NotificationsSection";
import { IntegrationsSection } from "./IntegrationsSection";

export function ProfileRightPanel() {
  const [copied, setCopied] = useState(false);
  const { selectedProfile } = usePanel();
  const activeSection = selectedProfile
    ? (selectedProfile as ProfileSection)
    : "general";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        {activeSection === "general" && (
          <GeneralSection onCopy={handleCopy} copied={copied} />
        )}
        {activeSection === "account" && <AccountSection />}
        {activeSection === "preferences" && <PreferencesSection />}
        {activeSection === "security" && <SecuritySection />}
        {activeSection === "notifications" && <NotificationsSection />}
        {activeSection === "integrations" && <IntegrationsSection />}
      </div>
    </div>
  );
}
