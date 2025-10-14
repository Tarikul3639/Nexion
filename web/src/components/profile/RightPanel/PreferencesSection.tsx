"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

export function PreferencesSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Preferences</h2>
        <p className="text-sm text-zinc-400">
          Customize your Nexion experience
        </p>
      </div>

      <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Dark Mode</Label>
            <p className="text-sm text-zinc-400">
              Use dark theme across the app
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Compact View</Label>
            <p className="text-sm text-zinc-400">
              Show more content in less space
            </p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Auto-play Videos</Label>
            <p className="text-sm text-zinc-400">
              Automatically play videos in feed
            </p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Show Online Status</Label>
            <p className="text-sm text-zinc-400">
              Let others see when you're online
            </p>
          </div>
          <Switch defaultChecked />
        </div>
      </Card>

      <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-6">
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
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Enable Animations</Label>
            <p className="text-sm text-zinc-400">
              Show smooth transitions and effects
            </p>
          </div>
          <Switch defaultChecked />
        </div>
      </Card>
    </div>
  );
}