"use client"

import { DesktopSidebar } from "./DesktopSidebar"
import { MobileSidebar } from "./MobileSidebar"

interface SidebarWrapperProps {
  children: React.ReactNode
}

export function SidebarWrapper({ children }: SidebarWrapperProps) {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-[#131313]">
      {/* Desktop Sidebar */}
      <DesktopSidebar />
      {/* Main Content Area */}
      <main className="flex-1 flex">{children}</main>
      {/* Mobile Bottom Sidebar */}
      <MobileSidebar />
    </div>
  )
}
