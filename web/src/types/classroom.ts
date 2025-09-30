export interface Classroom {
  id: string;
  name: string;
  subject?: string;
  teacher?: string;
  avatar?: string;
  type?: "classroom";
  participants: {
    _id: string;
    username: string;
    avatar?: string;
    status: "online" | "offline" | "away" | "busy";
    lastSeen?: string;
  }[];
}
