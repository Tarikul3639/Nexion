"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function SecuritySection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Security</h2>
        <p className="text-sm text-zinc-400">
          Manage your security settings and authentication
        </p>
      </div>

      <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="current-password" className="text-white">
            Current Password
          </Label>
          <Input
            id="current-password"
            type="password"
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-white">
            New Password
          </Label>
          <Input
            id="new-password"
            type="password"
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-white">
            Confirm New Password
          </Label>
          <Input
            id="confirm-password"
            type="password"
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Update Password
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Two-Factor Authentication
          </h3>
          <p className="text-sm text-zinc-400 mb-4">
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
            className="border-zinc-700 text-white hover:bg-zinc-800 bg-transparent"
          >
            Enable 2FA
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Active Sessions
          </h3>
          <p className="text-sm text-zinc-400">
            Manage devices where you're currently logged in
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