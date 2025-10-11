"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock } from "lucide-react"

interface PasswordStepProps {
  newPassword: string
  setNewPassword: (password: string) => void
  confirmPassword: string
  setConfirmPassword: (password: string) => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
}

export const PasswordStep: React.FC<PasswordStepProps> = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-neutral-300 text-sm">
          New Password
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="pl-10 h-11 bg-neutral-800/80 border-neutral-600/50 text-neutral-100"
          />
          <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-neutral-300 text-sm">
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="pl-10 h-11 bg-neutral-800/80 border-neutral-600/50 text-neutral-100"
          />
          <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-blue-800 hover:bg-blue-700 text-white">
        {isSubmitting ? "Updating..." : "Update Password"}
      </Button>
    </form>
  )
}
