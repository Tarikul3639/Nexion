import { MessageItem } from "@/types/message/message";

export const messages: MessageItem[] = [
  // 📝 Text message
  {
    id: "1",
    senderId: "u1",
    senderName: "Tarikul",
    senderAvatar: "https://i.pravatar.cc/100?img=1",
    content: {
      text: "Assalamu Alaikum!",
    },
    timestamp: "2025-08-30T09:30:00Z",
    status: "seen",
    isMe: true,
  },

  // 🖼️ Image message
  {
    id: "2",
    senderId: "u1",
    senderName: "Tarikul",
    senderAvatar: "https://i.pravatar.cc/100?img=1",
    content: {
      attachments: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1676607185077-f6f289c669e9?w=600",
          alt: "Sample Image 1"
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1706881974584-1be54aaa3de2?w=600",
          alt: "Sample Image 2"
        },
      ],
    },
    timestamp: "2025-08-30T09:32:00Z",
    status: "sent",
    isMe: true,
    replyToId: "1",
  },

  // 📄 File message
  {
    id: "3",
    senderId: "u2",
    senderName: "John Doe",
    senderAvatar: "https://i.pravatar.cc/100?img=2",
    content: {
      attachments: [
        {
          type: "file",
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          name: "dummy.pdf",
        },
        {
          type: "file",
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy2.pdf",
          name: "dummy2.pdf",
        },
      ],
    },
    timestamp: "2025-08-30T09:34:00Z",
    status: "sent",
    isMe: false,
  },

  // 🎵 Audio message
  {
    id: "4",
    senderId: "u2",
    senderName: "John Doe",
    senderAvatar: "https://i.pravatar.cc/100?img=2",
    content: {
      attachments: [
        {
          type: "audio/webm",
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          duration: 120,
          waveform: [0.2, 0.5, 0.7, 0.4, 0.6],
        },
      ],
    },
    timestamp: "2025-08-30T09:36:00Z",
    status: "sent",
    isMe: false,
    replyToId: "3",
  },
  {
    id: "5",
    senderId: "u1",
    senderName: "Tarikul",
    senderAvatar: "https://i.pravatar.cc/100?img=1",
    content: {
      text: "This is a reply to a message",
    },
    timestamp: "2025-08-30T09:38:00Z",
    status: "sent",
    isMe: true,
    replyToId: "4",
  }
];
