export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  online: boolean;
  lastSeen?: string;
  role?: string;
}

export interface UserProfile extends User {
  bio?: string;
  phone?: string;
  location?: string;
  joinedAt: string;
}
