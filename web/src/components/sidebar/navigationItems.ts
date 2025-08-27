import { MessageCircle, GraduationCap, User, Briefcase, Calendar } from "lucide-react"

export interface NavigationItem {
  id: string
  label: string
  icon: any
}

// Desktop sidebar items
export const desktopNavigationItems: NavigationItem[] = [
  { id: "chat", icon: MessageCircle, label: "All chats" },
  { id: "classroom", icon: GraduationCap, label: "Classroom" },
  { id: "work", icon: Briefcase, label: "Work" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
  { id: "profile", icon: User, label: "Profile" },
]

// Mobile sidebar items
export const mobileNavigationItems: NavigationItem[] = [
  { id: "chats", icon: MessageCircle, label: "Chats" },
  { id: "classroom", icon: GraduationCap, label: "Classroom" },
  { id: "profile", icon: User, label: "Profile" },
]

// Tab keys for easy reference
export const TAB_KEYS = {
  CHATS: "chats",
  CLASSROOM: "classroom",
  WORK: "work",
  CALENDAR: "calendar",
  PROFILE: "profile",
  SETTINGS: "settings",
} as const

export type TabKey = typeof TAB_KEYS[keyof typeof TAB_KEYS]

