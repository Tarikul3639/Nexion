export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface Message {
  id: string;
  sender: User;
  content: string;
  timestamp: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: User[];
  messages: Message[];
}
