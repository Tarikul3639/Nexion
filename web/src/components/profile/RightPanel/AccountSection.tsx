"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Copy } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SELECTED_ITEM_CLASSES = "focus:bg-neutral-700 rounded focus:text-neutral-300"

export function AccountSection() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Account</h2>
        <p className="text-sm text-zinc-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Account Info */}
      <Card className="p-6 bg-neutral-900 border-neutral-800">
        {/* Account ID */}
        <div className="space-y-2">
          <Label className="text-white">Account ID</Label>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white font-mono">
              usr_NWqN5Qzi9M7jSxriFoQwSJTwtF
            </code>
            <Button
              size="icon"
              variant="outline"
              className="rounded border-neutral-700 text-white hover:text-neutral-300 hover:bg-neutral-800 bg-neutral-800 active:scale-95 transition-all"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Language Select */}
        <div className="space-y-2">
          <Label htmlFor="language" className="text-white">
            Language
          </Label>
          <Select defaultValue="english">
            <SelectTrigger
              id="language"
              className="w-full bg-neutral-800 border border-neutral-700 text-white rounded"
            >
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700 text-white rounded">
              <SelectItem value="english" className={SELECTED_ITEM_CLASSES}>English</SelectItem>
              <SelectItem value="spanish" className={SELECTED_ITEM_CLASSES}>Spanish</SelectItem>
              <SelectItem value="french" className={SELECTED_ITEM_CLASSES}>French</SelectItem>
              <SelectItem value="german" className={SELECTED_ITEM_CLASSES}>German</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Timezone Select */}
        <div className="space-y-2">
          <Label htmlFor="timezone" className="text-white">
            Timezone
          </Label>
          <Select defaultValue="utc0">
            <SelectTrigger
              id="timezone"
              className="w-full bg-neutral-800 border border-neutral-700 text-white rounded"
            >
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700 text-white rounded">
              <SelectItem value="utc-8" className={SELECTED_ITEM_CLASSES}>UTC-8 (Pacific Time)</SelectItem>
              <SelectItem value="utc-5" className={SELECTED_ITEM_CLASSES}>UTC-5 (Eastern Time)</SelectItem>
              <SelectItem value="utc0" className={SELECTED_ITEM_CLASSES}>UTC+0 (GMT)</SelectItem>
              <SelectItem value="utc+1" className={SELECTED_ITEM_CLASSES}>UTC+1 (Central European Time)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded active:scale-95 transition-all">
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 bg-neutral-900 border-red-900/50">
        <h3 className="text-lg font-semibold text-white">Danger Zone</h3>
        <p className="text-sm text-neutral-400">
          Irreversible actions that affect your account
        </p>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start text-red-500 border-red-900/50 hover:bg-red-950/30 bg-transparent"
          >
            Export Account Data
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-red-500 border-red-900/50 hover:bg-red-950/30 bg-transparent"
          >
            Delete Account
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-red-500 border-red-900/50 hover:bg-red-950/30 bg-transparent"
          >
            Log Out from All Devices
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-red-500 border-red-900/50 hover:bg-red-950/30 bg-transparent"
          >
            Log Out from Other Devices
          </Button>
        </div>
      </Card>
    </div>
  );
}
