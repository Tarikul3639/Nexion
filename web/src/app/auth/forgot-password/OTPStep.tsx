"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound } from "lucide-react"

interface OTPStepProps {
  otp: string
  setOtp: (otp: string) => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
}

export const OTPStep: React.FC<OTPStepProps> = ({ otp, setOtp, onSubmit, isSubmitting }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="otp" className="text-neutral-300 text-sm">
          Enter OTP
        </Label>
        <div className="relative">
          <Input
            id="otp"
            type="text"
            placeholder="6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="pl-10 h-11 bg-neutral-800/80 border-neutral-600/50 text-neutral-100 placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-blue-500/50"
          />
          <KeyRound className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-blue-800 hover:bg-blue-700 text-white">
        {isSubmitting ? "Verifying..." : "Verify OTP"}
      </Button>
    </form>
  )
}
