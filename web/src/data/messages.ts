import { MessageItem } from "@/types/message";

export const messages: MessageItem[] = [
  {
    id: "1",
    senderId: "u1",
    senderName: "Tarikul",
    senderAvatar: "https://i.pravatar.cc/100?img=1",
    type: "text",
    content: { text: "Assalamu Alaikum!" },
    timestamp: "2025-08-30T09:30:00Z",
    status: "seen",
    isMe: true,
  },
  {
    id: "3",
    senderId: "u1",
    senderName: "Tarikul",
    senderAvatar: "https://i.pravatar.cc/100?img=1",
    type: "image",
    content: {
      images: [
        {
          url: "https://images.unsplash.com/photo-1676607185077-f6f289c669e9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXNsYW1jfGVufDB8fDB8fHww",
          alt: "Sample Image 1",
          width: 800,
          height: 600,
        },
        {
          url: "https://images.unsplash.com/photo-1706881974584-1be54aaa3de2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aXNsYW1jfGVufDB8fDB8fHww",
          width: 800,
          height: 600,
        },
        {
          url: "https://images.unsplash.com/photo-1676607185077-f6f289c669e9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXNsYW1jfGVufDB8fDB8fHww",
          alt: "Sample Image 1",
          width: 800,
          height: 600,
        },
        {
          url: "https://images.unsplash.com/photo-1706881974584-1be54aaa3de2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aXNsYW1jfGVufDB8fDB8fHww",
          width: 800,
          height: 600,
        },
      ],
    },
    timestamp: "2025-08-30T09:32:00Z",
    status: "sent",
    isMe: true,
  },
  {
    id: "5",
    senderId: "u1",
    senderName: "Tarikul",
    senderAvatar: "https://i.pravatar.cc/100?img=1",
    type: "file",
    content: {
      files: [
        {
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          name: "dummy.pdf",
        },
        {
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy2.pdf",
          name: "dummy2.pdf",
        },
      ],
    },
    timestamp: "2025-08-30T09:34:00Z",
    status: "sent",
    isMe: false,
  },
  {
    id: "6",
    senderId: "u2",
    senderName: "John Doe",
    senderAvatar: "https://i.pravatar.cc/100?img=2",
    type: "image",
    content: {
      images: [
        {
          url: "https://images.unsplash.com/photo-1706881974584-1be54aaa3de2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aXNsYW1jfGVufDB8fDB8fHww",
          width: 800,
          height: 600,
        },
      ],
    },
    timestamp: "2025-08-30T09:36:00Z",
    status: "sent",
    isMe: false,
  },
  {
    id: "7",
    senderId: "u2",
    senderName: "John Doe",
    senderAvatar: "https://i.pravatar.cc/100?img=2",
    type: "audio",
    content: {
      audio: {
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        duration: 120,
        waveform: [],
      },
    },
    timestamp: "2025-08-30T09:36:00Z",
    status: "sent",
    isMe: false,
  },
];
