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
import BackButton from "@/components/ui/BackButton";

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
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <BackButton />
          <div>
            <h2 className="text-xl font-semibold text-white mb-1 capitalize">
              {activeSection}
            </h2>
            <p className="text-sm text-zinc-400">
              {activeSection === "general" &&
                "Manage your profile information and public presence"}
              {activeSection === "account" &&
                "Manage your account settings and preferences"}
              {activeSection === "preferences" &&
                "Customize your Nexion experience"}
              {activeSection === "security" &&
                "Manage your security settings and authentication"}
              {activeSection === "notifications" &&
                "Control how you receive notifications"}
              {activeSection === "integrations" &&
                "Manage connected services and bots"}
            </p>
          </div>
        </div>
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
