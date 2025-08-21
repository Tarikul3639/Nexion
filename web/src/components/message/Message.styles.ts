// Message bubble styles based on message type and ownership
export const getMessageBubbleStyles = (isOwn: boolean, isPinned: boolean) => {
  const baseStyles = "rounded shadow-sm relative";
  const ownStyles = "bg-blue-500 text-white rounded-tr-none";
  const otherStyles = "bg-white text-gray-900 rounded-bl-none border border-gray-100";
  const pinnedStyles = "ring-2 ring-yellow-400/50";
  
  return `${baseStyles} ${isOwn ? ownStyles : otherStyles} ${isPinned ? pinnedStyles : ""}`;
};

// Avatar styles based on message ownership
export const getAvatarStyles = (isOwn: boolean) => {
  if (isOwn) return "";
  return "w-7 h-7 md:w-8 md:h-8 text-sm font-semibold flex-shrink-0";
};

// Message status icon styles
export const getStatusIconStyles = () => {
  return "w-5 h-5 flex items-center justify-center text-center text-blue-600";
};

// Reply preview styles
export const getReplyPreviewStyles = (isOwn: boolean) => {
  const baseStyles = "mb-2 p-2 rounded-lg border-l-4";
  const ownStyles = "bg-blue-600/20 border-blue-300 text-blue-100";
  const otherStyles = "bg-gray-100 border-gray-400 text-gray-600";
  
  return `${baseStyles} ${isOwn ? ownStyles : otherStyles}`;
};

// Role badge styles
export const getRoleBadgeStyles = (role: string) => {
  const baseStyles = "text-xs";
  
  switch (role) {
    case "teacher":
      return `${baseStyles} bg-purple-100 text-purple-600`;
    case "assistant":
      return `${baseStyles} bg-green-100 text-green-600`;
    case "admin":
      return `${baseStyles} bg-red-100 text-red-600`;
    default:
      return `${baseStyles} bg-gray-100 text-gray-600`;
  }
};
