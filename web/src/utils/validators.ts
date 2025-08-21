/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate file type for attachments
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => file.type.startsWith(type));
};

/**
 * Validate file size
 */
export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * Validate message content
 */
export const isValidMessage = (content: string, attachments?: File[]): boolean => {
  const trimmedContent = content.trim();
  return trimmedContent.length > 0 || Boolean(attachments && attachments.length > 0);
};

/**
 * Validate chat name
 */
export const isValidChatName = (name: string): boolean => {
  const trimmedName = name.trim();
  return trimmedName.length >= 2 && trimmedName.length <= 50;
};
