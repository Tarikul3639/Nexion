"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail } from "lucide-react"

interface EmailStepProps {
  email: string
  setEmail: (email: string) => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
}

export const EmailStep: React.FC<EmailStepProps> = ({ email, setEmail, onSubmit, isSubmitting }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-neutral-300 text-sm">
          Email Address
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 h-11 bg-neutral-800/80 border-neutral-600/50 text-neutral-100 placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-blue-500/50"
          />
          <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-blue-800 hover:bg-blue-700 text-white">
        {isSubmitting ? "Sending..." : "Send Reset Code"}
      </Button>
    </form>
  )
}
