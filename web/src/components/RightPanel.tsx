"use client"
import React from "react"
import { usePanel } from "@/context/PanelContext"

const items = [
  { id: "u1", type: "user", name: "Rahim" },
  { id: "c1", type: "classroom", name: "CSE317 - SAD" },
  { id: "b1", type: "bot", name: "Image Bot" },
]

export default function RightPanel() {
  const { selectedItem, setSelectedItem } = usePanel()
  const active = items.find((i) => i.id === selectedItem)

  if (!selectedItem) {
    return (
      <div className="flex-1 hidden md:flex items-center justify-center text-gray-500">
        Select an item from the left panel
      </div>
    )
  }

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="p-3 flex items-center gap-2">
        <button
          className="md:hidden px-3 py-1 bg-gray-200 rounded"
          onClick={() => setSelectedItem(null)}
        >
          ← Back
        </button>
        <h2 className="font-semibold">Activity of {active?.name}</h2>
      </div>

      {/* Content */}
      <div className="p-4">
        <p>Showing activity/details of <b>{active?.name}</b>.</p>
      </div>
    </div>
  )
}
