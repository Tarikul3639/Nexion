"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const INPUT_BUTTON_CLASSES =
  "bg-zinc-800 rounded border-neutral-700 text-white focus-visible:ring-0 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-within:shadow-xs focus-within:shadow-blue-500";

export function SecuritySection() {
  return (
    <div className="space-y-8">
      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div className="space-y-2">
          <Label htmlFor="current-password" className="text-white">
            Current Password
          </Label>
          <Input
            id="current-password"
            type="password"
            placeholder="Enter Your Current Password"
            className={INPUT_BUTTON_CLASSES}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-white">
            New Password
          </Label>
          <Input
            id="new-password"
            type="password"
            placeholder="Enter Your New Password"
            className={INPUT_BUTTON_CLASSES}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-white">
            Confirm New Password
          </Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Re-enter Your New Password"
            className={INPUT_BUTTON_CLASSES}
          />
        </div>

        <div className="flex justify-end">
          <Button className="text-sm bg-blue-600 hover:bg-blue-700 text-white active:scale-95 transition-all rounded">
            Update Password
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Two-Factor Authentication
          </h3>
          <p className="text-sm text-neutral-400 mb-4">
            Add an extra layer of security to your account
          </p>
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
          <div className="space-y-0.5">
            <Label className="text-white">2FA Status</Label>
            <p className="text-sm text-zinc-400">Not enabled</p>
          </div>
          <Button
            variant="outline"
            className="border-zinc-700 text-white hover:text-white hover:bg-zinc-800 bg-transparent active:scale-95 transition-all rounded"
          >
            Enable 2FA
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Active Sessions
          </h3>
          <p className="text-sm text-zinc-400">
            Manage devices where you&apos;re currently logged in
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg">
            <div>
              <p className="text-sm font-medium text-white">
                MacBook Pro - Chrome
              </p>
              <p className="text-xs text-zinc-400">
                San Francisco, CA • Current session
              </p>
            </div>
            <span className="text-xs text-blue-500 font-medium">Active</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg border border-zinc-700">
            <div>
              <p className="text-sm font-medium text-white">
                iPhone 14 - Safari
              </p>
              <p className="text-xs text-zinc-400">
                San Francisco, CA • 2 hours ago
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-500 hover:text-red-400 hover:bg-red-950/30"
            >
              Revoke
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}