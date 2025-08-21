// File size limits
export const MAX_FILE_SIZE_MB = 10;
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_VIDEO_SIZE_MB = 20;

// Allowed file types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

// Chat types
export const CHAT_TYPES = {
  PERSONAL: 'personal',
  GROUP: 'group',
  CLASSROOM: 'classroom',
} as const;

// Message status
export const MESSAGE_STATUS = {
  SENDING: 'sending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
} as const;

// Input types
export const INPUT_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'document',
  VOICE: 'voice',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  CHATS: '/api/chats',
  MESSAGES: '/api/messages',
  USERS: '/api/users',
  UPLOAD: '/api/upload',
} as const;
