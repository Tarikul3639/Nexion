export interface Bot {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  type?: "user" | "bot";
  status?: "online" | "offline" | "away" | "busy";
  lastSeen?: string;
}
