"use client"

import type React from "react"
import { CheckCircle2 } from "lucide-react"

export const SuccessStep: React.FC = () => {
  return (
    <div className="text-center py-8 pb-10">
      <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/10 rounded-full flex items-center justify-center ring-1 ring-emerald-500/30">
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
      </div>
      <p className="text-emerald-400 text-lg font-medium">Password Reset Successful!</p>
      <p className="text-neutral-400 text-sm mt-2">Redirecting to login page...</p>
    </div>
  )
}
