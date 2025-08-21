export interface Chat {
  id: number;
  username: string;
  type: string;
  avatar: string;
  online: boolean;
  members?: number;
}

export interface ChatWithMessages extends Chat {
  lastMessage?: string;
  timestamp?: string;
  unread?: number;
}

export interface MessageType {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  avatar: string;
  isOwn: boolean;
  replyTo?: MessageType;
  attachments?: File[];
  role?: string;
  isPinned?: boolean;
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
    reacted: boolean;
  }>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Shared chat data
export const chats: Chat[] = [
  {
    id: 1,
    username: "Mathematics 101",
    type: "classroom",
    avatar: "M1",
    online: true,
    members: 24,
  },
  {
    id: 2,
    username: "Physics Lab",
    type: "classroom",
    avatar: "PL",
    online: true,
    members: 18,
  },
  {
    id: 3,
    username: "Dr. Smith",
    type: "direct",
    avatar: "DS",
    online: true,
  },
  {
    id: 4,
    username: "Study Group",
    type: "group",
    avatar: "SG",
    online: false,
    members: 6,
  },
  {
    id: 5,
    username: "Computer Science",
    type: "classroom",
    avatar: "CS",
    online: true,
    members: 32,
  },
];

// Chat data with additional message info for the list view
export const chatsWithMessages: ChatWithMessages[] = [
  {
    id: 1,
    username: "Mathematics 101",
    type: "classroom",
    lastMessage: "Dr. Smith: Great question about derivatives!",
    timestamp: "2 min",
    unread: 3,
    avatar: "M1",
    online: true,
    members: 24,
  },
  {
    id: 2,
    username: "Physics Lab",
    type: "classroom",
    lastMessage: "Remember to submit your lab reports",
    timestamp: "1h",
    unread: 1,
    avatar: "PL",
    online: true,
    members: 18,
  },
  {
    id: 3,
    username: "Dr. Smith",
    type: "direct",
    lastMessage: "Thank you for the great presentation!",
    timestamp: "3h",
    unread: 0,
    avatar: "DS",
    online: true,
  },
  {
    id: 4,
    username: "Study Group",
    type: "group",
    lastMessage: "See you all tomorrow for the review session",
    timestamp: "1d",
    unread: 2,
    avatar: "SG",
    online: false,
    members: 6,
  },
  {
    id: 5,
    username: "Computer Science",
    type: "classroom",
    lastMessage: "Next week we'll cover algorithms",
    timestamp: "2d",
    unread: 0,
    avatar: "CS",
    online: true,
    members: 32,
  },
  {
    id: 6,
    username: "Group Project",
    type: "group",
    lastMessage: "Let's finalize the presentation slides",
    timestamp: "2d",
    unread: 2,
    avatar: "GP",
    online: false,
    members: 10,
  },
  {
    id: 7,
    username: "History Discussion",
    type: "classroom",
    lastMessage: "Discussion on World War II",
    timestamp: "3d",
    unread: 0,
    avatar: "HD",
    online: false,
    members: 15,
  },
  {
    id: 8,
    username: "Chemistry Club",
    type: "group",
    lastMessage: "Next meeting on Friday",
    timestamp: "4d",
    unread: 0,
    avatar: "CC",
    online: false,
    members: 20,
  },
  {
    id: 9,
    username: "Art Appreciation",
    type: "classroom",
    lastMessage: "Don't forget to submit your art projects",
    timestamp: "5d",
    unread: 1,
    avatar: "AA",
    online: true,
    members: 12,
  },
  {
    id: 10,
    username: "Music Theory",
    type: "classroom",
    lastMessage: "Practice your scales for next class",
    timestamp: "6d",
    unread: 0,
    avatar: "MT",
    online: true,
    members: 8,
  },
  {
    id: 11,
    username: "Philosophy Debate",
    type: "group",
    lastMessage: "Interesting points raised in the last debate",
    timestamp: "7d",
    unread: 0,
    avatar: "PD",
    online: false,
    members: 5,
  },
];

// Sample messages data
export const sampleMessages: MessageType[] = [
  {
    id: 1,
    sender: "Dr. Smith",
    content:
      "Good morning everyone! Today we'll be covering advanced calculus concepts.",
    timestamp: "10:30 AM",
    avatar: "DS",
    isOwn: false,
    role: "teacher",
    isPinned: true,
    reactions: [
      {
        emoji: "🔥",
        count: 8,
        users: ["Alice Johnson", "Mike Chen", "You", "Sarah Wilson", "John Doe", "Emma Davis", "Tom Brown", "Lisa Garcia"],
        reacted: true
      },
      {
        emoji: "📚",
        count: 4,
        users: ["Teaching Assistant", "Prof. Wilson", "Emma Davis", "You"],
        reacted: true
      }
    ],
  },
  {
    id: 2,
    sender: "You",
    content: "Thank you professor! I'm ready to learn.",
    timestamp: "10:32 AM",
    avatar: "YU",
    isOwn: true,
    role: "student",
  },
  {
    id: 3,
    sender: "Alice Johnson",
    content:
      "Could you explain the chain rule again? I'm still confused about it.",
    timestamp: "10:35 AM",
    avatar: "AJ",
    isOwn: false,
    role: "admin",
  },
  {
    id: 4,
    sender: "Prof. Wilson",
    content: "Great question Alice! Let me break down the chain rule step by step.",
    timestamp: "10:37 AM",
    avatar: "PW",
    isOwn: false,
    role: "teacher",
    replyTo: {
      id: 3,
      sender: "Alice Johnson",
      content: "Could you explain the chain rule again? I'm still confused about it.",
      timestamp: "10:35 AM",
      avatar: "AJ",
      isOwn: false,
      role: "admin",
    },
  },
  {
    id: 5,
    sender: "Mike Chen",
    content: "I have the same question. Thanks for asking Alice!",
    timestamp: "10:39 AM",
    avatar: "MC",
    isOwn: false,
    role: "student",
    replyTo: {
      id: 3,
      sender: "Alice Johnson",
      content: "Could you explain the chain rule again? I'm still confused about it.",
      timestamp: "10:35 AM",
      avatar: "AJ",
      isOwn: false,
      role: "admin",
    },
  },
  {
    id: 6,
    sender: "Teaching Assistant",
    content: "I've shared some additional resources in the files section.",
    timestamp: "10:42 AM",
    avatar: "TA",
    isOwn: false,
    role: "assistant",
    isPinned: true,
    reactions: [
      {
        emoji: "🙏",
        count: 6,
        users: ["You", "Alice Johnson", "Mike Chen", "Sarah Wilson", "John Doe", "Emma Davis"],
        reacted: true
      },
      {
        emoji: "📖",
        count: 2,
        users: ["Prof. Wilson", "Dr. Smith"],
        reacted: false
      }
    ],
  },
  {
    id: 7,
    sender: "You",
    content: "These resources are very helpful! Thank you so much.",
    timestamp: "10:45 AM",
    avatar: "YU",
    isOwn: true,
    role: "student",
    replyTo: {
      id: 6,
      sender: "Teaching Assistant",
      content: "I've shared some additional resources in the files section.",
      timestamp: "10:42 AM",
      avatar: "TA",
      isOwn: false,
      role: "assistant",
    },
    isPinned: true,
  },
  {
    id: 8,
    sender: "Dr. Smith",
    content: "Perfect! I'm glad everyone is engaged. Any other questions?",
    reactions: [
      {
        emoji: "👍",
        count: 5,
        users: ["Alice Johnson", "Mike Chen", "You", "Sarah Wilson", "John Doe"],
        reacted: true
      },
      {
        emoji: "😊",
        count: 3,
        users: ["Teaching Assistant", "Prof. Wilson", "Emma Davis"],
        reacted: false
      }
    ],
    timestamp: "10:48 AM",
    avatar: "DS",
    isOwn: false,
    role: "teacher",
    replyTo: {
      id: 7,
      sender: "You",
      content: "These resources are very helpful! Thank you so much.",
      timestamp: "10:45 AM",
      avatar: "YU",
      isOwn: true,
      role: "student",
    },
  },
];
