"use client"
import React from "react"
import { usePanel } from "@/context/PanelContext"

const items = [
  { id: "u1", type: "user", name: "Rahim" },
  { id: "c1", type: "classroom", name: "CSE317 - SAD" },
  { id: "b1", type: "bot", name: "Image Bot" },
]

export default function LeftPanel() {
  const { setSelectedItem } = usePanel()

  return (
    <div className="w-full md:w-72 border-r bg-white">
      <div className="p-4 font-bold border-b">Lists</div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button
              className="w-full text-left p-3 hover:bg-gray-100"
              onClick={() => setSelectedItem(item.id)}
            >
              {item.type.toUpperCase()} : {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
