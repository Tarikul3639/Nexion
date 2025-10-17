import { MessagesSquare , GraduationCap, Briefcase, Calendar } from "lucide-react"

export interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// Desktop sidebar items
export const NavigationItems: NavigationItem[] = [
  { id: "chats", icon: MessagesSquare , label: "All chats" },
  { id: "classroom", icon: GraduationCap, label: "Classroom" },
  { id: "work", icon: Briefcase, label: "Work" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
]

// Tab keys for easy reference
export const TAB_KEYS = {
  CHATS: "chats",
  BOTS: "bots",
  CLASSROOM: "classroom",
  WORK: "work",
  CALENDAR: "calendar",
  PROFILE: "profile",
  SETTINGS: "settings",
} as const

export type TabKey = typeof TAB_KEYS[keyof typeof TAB_KEYS]

