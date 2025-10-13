"use client";

import { useState } from "react";
import { Camera, Copy } from "lucide-react";
import type { ProfileSection } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { usePanel } from "@/context/PanelContext";

export function ProfileRightPanel() {
  const [copied, setCopied] = useState(false)
  const { selectedProfile } = usePanel();
    const activeSection = selectedProfile ? (selectedProfile.tabName as ProfileSection) : "general"

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        {activeSection === "general" && <GeneralSection onCopy={handleCopy} copied={copied} />}
        {activeSection === "account" && <AccountSection />}
        {activeSection === "preferences" && <PreferencesSection />}
        {activeSection === "security" && <SecuritySection />}
        {activeSection === "notifications" && <NotificationsSection />}
        {activeSection === "integrations" && <IntegrationsSection />}
      </div>
    </div>
  )
}

function GeneralSection({ onCopy, copied }: { onCopy: (text: string) => void; copied: boolean }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">General</h2>
        <p className="text-sm text-zinc-400">Manage your profile information and public presence</p>
      </div>

      <Card className="p-6 bg-zinc-900 border-zinc-800">
        <div className="flex items-start gap-6">
          <div className="relative group">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" />
              <AvatarFallback className="bg-blue-600 text-white text-2xl">JD</AvatarFallback>
            </Avatar>
            <button className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">Profile Picture</h3>
            <p className="text-sm text-zinc-400 mb-4">Upload a new profile picture. Recommended size: 400x400px</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-zinc-700 text-white hover:bg-zinc-800 bg-transparent"
              >
                Upload New
              </Button>
              <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-950/30">
                Remove
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Full Name
          </Label>
          <Input id="name" defaultValue="John Doe" className="bg-zinc-800 border-zinc-700 text-white" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-white">
            Username
          </Label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-zinc-800 border border-zinc-700 rounded-md px-3">
              <span className="text-zinc-500 text-sm">nexion.app/</span>
              <input
                id="username"
                defaultValue="johndoe"
                className="flex-1 bg-transparent border-0 outline-none text-white px-1 py-2"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            defaultValue="john.doe@example.com"
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-white">
            Bio
          </Label>
          <textarea
            id="bio"
            rows={4}
            defaultValue="Educator and AI enthusiast. Building the future of learning."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white placeholder:text-zinc-500 resize-none"
          />
          <p className="text-xs text-zinc-500">Brief description for your profile</p>
        </div>

        <div className="flex justify-end pt-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
        </div>
      </Card>
    </div>
  )
}

function AccountSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Account</h2>
        <p className="text-sm text-zinc-400">Manage your account settings and preferences</p>
      </div>

      <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-6">
        <div className="space-y-2">
          <Label className="text-white">Account ID</Label>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white font-mono">
              usr_NWqN5Qzi9M7jSxriFoQwSJTwtF
            </code>
            <Button
              size="icon"
              variant="outline"
              className="border-zinc-700 text-white hover:bg-zinc-800 bg-transparent"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language" className="text-white">
            Language
          </Label>
          <select id="language" className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone" className="text-white">
            Timezone
          </Label>
          <select id="timezone" className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white">
            <option>UTC-8 (Pacific Time)</option>
            <option>UTC-5 (Eastern Time)</option>
            <option>UTC+0 (GMT)</option>
            <option>UTC+1 (Central European Time)</option>
          </select>
        </div>

        <div className="flex justify-end pt-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
        </div>
      </Card>

      <Card className="p-6 bg-zinc-900 border-red-900/50">
        <h3 className="text-lg font-semibold text-white mb-2">Danger Zone</h3>
        <p className="text-sm text-zinc-400 mb-4">Irreversible actions that affect your account</p>
        <div className="space-y-3">
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
        </div>
      </Card>
    </div>
  )
}

function PreferencesSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Preferences</h2>
        <p className="text-sm text-zinc-400">Customize your Nexion experience</p>
      </div>

      <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Dark Mode</Label>
            <p className="text-sm text-zinc-400">Use dark theme across the app</p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Compact View</Label>
            <p className="text-sm text-zinc-400">Show more content in less space</p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Auto-play Videos</Label>
            <p className="text-sm text-zinc-400">Automatically play videos in feed</p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Show Online Status</Label>
            <p className="text-sm text-zinc-400">Let others see when you're online</p>
          </div>
          <Switch defaultChecked />
        </div>
      </Card>

      <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-6">
        <h3 className="text-lg font-semibold text-white">Content Preferences</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Show Read Messages</Label>
            <p className="text-sm text-zinc-400">Display messages you've already read</p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Enable Animations</Label>
            <p className="text-sm text-zinc-400">Show smooth transitions and effects</p>
          </div>
          <Switch defaultChecked />
        </div>
      </Card>
    </div>
  )
}

function SecuritySection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Security</h2>
        <p className="text-sm text-zinc-400">Manage your security settings and authentication</p>
      </div>

      <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="current-password" className="text-white">
            Current Password
          </Label>
          <Input id="current-password" type="password" className="bg-zinc-800 border-zinc-700 text-white" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-white">
            New Password
          </Label>
          <Input id="new-password" type="password" className="bg-zinc-800 border-zinc-700 text-white" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-white">
            Confirm New Password
          </Label>
          <Input id="confirm-password" type="password" className="bg-zinc-800 border-zinc-700 text-white" />
        </div>

        <div className="flex justify-end pt-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Update Password</Button>
        </div>
      </Card>

      <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Two-Factor Authentication</h3>
          <p className="text-sm text-zinc-400 mb-4">Add an extra layer of security to your account</p>
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
          <div className="space-y-0.5">
            <Label className="text-white">2FA Status</Label>
            <p className="text-sm text-zinc-400">Not enabled</p>
          </div>
          <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 bg-transparent">
            Enable 2FA
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Active Sessions</h3>
          <p className="text-sm text-zinc-400">Manage devices where you're currently logged in</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg">
            <div>
              <p className="text-sm font-medium text-white">MacBook Pro - Chrome</p>
              <p className="text-xs text-zinc-400">San Francisco, CA • Current session</p>
            </div>
            <span className="text-xs text-blue-500 font-medium">Active</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg border border-zinc-700">
            <div>
              <p className="text-sm font-medium text-white">iPhone 14 - Safari</p>
              <p className="text-xs text-zinc-400">San Francisco, CA • 2 hours ago</p>
            </div>
            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-950/30">
              Revoke
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

function NotificationsSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Notifications</h2>
        <p className="text-sm text-zinc-400">Control how you receive notifications</p>
      </div>

      <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-6">
        <h3 className="text-lg font-semibold text-white">Email Notifications</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Messages</Label>
            <p className="text-sm text-zinc-400">Get notified about new messages</p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Classroom Updates</Label>
            <p className="text-sm text-zinc-400">Notifications about class activities</p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Bot Completions</Label>
            <p className="text-sm text-zinc-400">When your bot tasks are finished</p>
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
            <p className="text-sm text-zinc-400">New assignments in classroom</p>
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
  )
}

function IntegrationsSection() {
  const integrations = [
    {
      name: "Background Remover",
      description: "AI-powered background removal for images",
      status: "active",
      icon: "🖼️",
    },
    {
      name: "PDF to Doc Converter",
      description: "Convert PDF files to editable documents",
      status: "active",
      icon: "📄",
    },
    {
      name: "Google Drive",
      description: "Sync files with Google Drive",
      status: "inactive",
      icon: "📁",
    },
    {
      name: "Slack",
      description: "Connect with your Slack workspace",
      status: "inactive",
      icon: "💬",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Integrations</h2>
        <p className="text-sm text-zinc-400">Manage connected services and bots</p>
      </div>

      <div className="grid gap-4">
        {integrations.map((integration) => (
          <Card key={integration.name} className="p-6 bg-zinc-900 border-zinc-800">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-2xl">
                  {integration.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">{integration.name}</h3>
                  <p className="text-sm text-zinc-400">{integration.description}</p>
                  {integration.status === "active" && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-xs text-blue-500 font-medium">Connected</span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant={integration.status === "active" ? "outline" : "default"}
                size="sm"
                className={
                  integration.status === "active"
                    ? "border-zinc-700 text-white hover:bg-zinc-800"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }
              >
                {integration.status === "active" ? "Manage" : "Connect"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-zinc-900 border-zinc-800">
        <h3 className="text-lg font-semibold text-white mb-2">API Access</h3>
        <p className="text-sm text-zinc-400 mb-4">Generate API keys to integrate Nexion with your applications</p>
        <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 bg-transparent">
          Generate API Key
        </Button>
      </Card>
    </div>
  )
}