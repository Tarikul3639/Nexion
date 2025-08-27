"use client"

import { DesktopSidebar } from "./DesktopSidebar"
import { MobileSidebar } from "./MobileSidebar"
import { usePanel } from "@/context/PanelContext"

interface SidebarWrapperProps {
  children: React.ReactNode
}

export function SidebarWrapper({ children }: SidebarWrapperProps) {
  const { activeTab, setActiveTab, selectedItem, setSelectedItem } = usePanel();
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <DesktopSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
      {/* Main Content Area */}
      <main className="flex-1 flex">{children}</main>
      {/* Mobile Bottom Sidebar */}
      <MobileSidebar />
    </div>
  )
}
