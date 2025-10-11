"use client"

import React from "react"
import { Check } from "lucide-react"

interface StepperProps {
  currentStep: number
}

export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Email" },
    { number: 2, label: "Verify" },
    { number: 3, label: "Password" },
  ]

  return (
    <div className="w-full py-6 px-4">
      <div className="flex items-center justify-between max-w-sm mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  currentStep > step.number
                    ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/50"
                    : currentStep === step.number
                      ? "bg-blue-500 text-white ring-4 ring-blue-500/30"
                      : "bg-neutral-800/80 text-neutral-500 ring-1 ring-neutral-700/50"
                }`}
              >
                {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  currentStep >= step.number ? "text-neutral-300" : "text-neutral-500"
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mb-6">
                <div
                  className={`h-full transition-all duration-300 ${
                    currentStep > step.number ? "bg-blue-500/50" : "bg-neutral-700/50"
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
