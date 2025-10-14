"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

export function NotificationsSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">
          Notifications
        </h2>
        <p className="text-sm text-zinc-400">
          Control how you receive notifications
        </p>
      </div>

      <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-6">
        <h3 className="text-lg font-semibold text-white">
          Email Notifications
        </h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Messages</Label>
            <p className="text-sm text-zinc-400">
              Get notified about new messages
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Classroom Updates</Label>
            <p className="text-sm text-zinc-400">
              Notifications about class activities
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Bot Completions</Label>
            <p className="text-sm text-zinc-400">
              When your bot tasks are finished
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Weekly Summary</Label>
            <p className="text-sm text-zinc-400">Weekly activity digest</p>
          </div>
          <Switch />
        </div>
      </Card>

      <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-6">
        <h3 className="text-lg font-semibold text-white">Push Notifications</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Direct Messages</Label>
            <p className="text-sm text-zinc-400">Push notifications for DMs</p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Mentions</Label>
            <p className="text-sm text-zinc-400">When someone mentions you</p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Assignments</Label>
            <p className="text-sm text-zinc-400">
              New assignments in classroom
            </p>
          </div>
          <Switch defaultChecked />
        </div>
      </Card>

      <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-6">
        <h3 className="text-lg font-semibold text-white">Do Not Disturb</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Enable Do Not Disturb</Label>
            <p className="text-sm text-zinc-400">Mute all notifications</p>
          </div>
          <Switch />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Schedule</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dnd-start" className="text-sm text-zinc-400">
                Start Time
              </Label>
              <Input
                id="dnd-start"
                type="time"
                defaultValue="22:00"
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dnd-end" className="text-sm text-zinc-400">
                End Time
              </Label>
              <Input
                id="dnd-end"
                type="time"
                defaultValue="08:00"
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}