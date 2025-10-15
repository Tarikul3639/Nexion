"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

const SWITCH_CLASSES =
  "data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-zinc-600 transition-all duration-300";

export function PreferencesSection() {
  return (
    <div className="space-y-8">
      <Card className="p-6 bg-neutral-900 border-neutral-800 space-y-0.5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Dark Mode</Label>
            <p className="text-sm text-zinc-400">
              Use dark theme across the app
            </p>
          </div>
          <Switch defaultChecked className={SWITCH_CLASSES} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Compact View</Label>
            <p className="text-sm text-zinc-400">
              Show more content in less space
            </p>
          </div>
          <Switch className={SWITCH_CLASSES} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Auto-play Videos</Label>
            <p className="text-sm text-zinc-400">
              Automatically play videos in feed
            </p>
          </div>
          <Switch className={SWITCH_CLASSES} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Show Online Status</Label>
            <p className="text-sm text-zinc-400">
              Let others see when you're online
            </p>
          </div>
          <Switch defaultChecked className={SWITCH_CLASSES} />
        </div>
      </Card>

      <Card className="p-6 bg-neutral-900 border-neutral-800 space-y-0.5">
        <h3 className="text-lg font-semibold text-white">
          Content Preferences
        </h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Show Read Messages</Label>
            <p className="text-sm text-zinc-400">
              Display messages you've already read
            </p>
          </div>
          <Switch defaultChecked className={SWITCH_CLASSES} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Enable Animations</Label>
            <p className="text-sm text-zinc-400">
              Show smooth transitions and effects
            </p>
          </div>
          <Switch defaultChecked className={SWITCH_CLASSES} />
        </div>
      </Card>
    </div>
  );
}
