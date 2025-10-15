"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

const SWITCH_CLASSES =
  "data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-zinc-600 transition-all duration-300";

export function NotificationsSection() {
  return (
    <div className="space-y-8">
      <Card className="p-6 bg-neutral-900 border-neutral-800 space-y-0.5">
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
          <Switch defaultChecked className={SWITCH_CLASSES} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Classroom Updates</Label>
            <p className="text-sm text-zinc-400">
              Notifications about class activities
            </p>
          </div>
          <Switch defaultChecked className={SWITCH_CLASSES} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Bot Completions</Label>
            <p className="text-sm text-zinc-400">
              When your bot tasks are finished
            </p>
          </div>
          <Switch defaultChecked className={SWITCH_CLASSES} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Weekly Summary</Label>
            <p className="text-sm text-zinc-400">Weekly activity digest</p>
          </div>
          <Switch defaultChecked className={SWITCH_CLASSES} />
        </div>
      </Card>

      <Card className="p-6 bg-neutral-900 border-neutral-800 space-y-0.5">
        <h3 className="text-lg font-semibold text-white">Push Notifications</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Direct Messages</Label>
            <p className="text-sm text-zinc-400">Push notifications for DMs</p>
          </div>
          <Switch defaultChecked className={SWITCH_CLASSES} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Mentions</Label>
            <p className="text-sm text-zinc-400">When someone mentions you</p>
          </div>
          <Switch defaultChecked className={SWITCH_CLASSES} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Assignments</Label>
            <p className="text-sm text-zinc-400">
              New assignments in classroom
            </p>
          </div>
          <Switch defaultChecked className={SWITCH_CLASSES} />
        </div>
      </Card>

      <Card className="p-6 bg-neutral-900 border-neutral-800 space-y-0.5">
        <h3 className="text-lg font-semibold text-white">Do Not Disturb</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Enable Do Not Disturb</Label>
            <p className="text-sm text-zinc-400">Mute all notifications</p>
          </div>
          <Switch defaultChecked className={SWITCH_CLASSES} />
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
                className="bg-zinc-800 border-zinc-700 text-white mt-1 rounded"
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
                className="bg-zinc-800 border-zinc-700 text-white mt-1 rounded"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}