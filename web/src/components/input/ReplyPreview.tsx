"use client";

import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon, Video, Paperclip } from "lucide-react";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  avatar: string;
  isOwn: boolean;
  attachments?: File[];
  replyTo?: Message;
  isPinned?: boolean;
  role?: string;
}

interface ReplyPreviewProps {
  replyingTo: Message;
  onCancel: () => void;
}

export default function ReplyPreview({
  replyingTo,
  onCancel,
}: ReplyPreviewProps) {
  // Helper function to get attachment summary
  const getAttachmentSummary = (attachments: File[]) => {
    if (!attachments || attachments.length === 0) return null;

    const images = attachments.filter(file => file.type.startsWith('image/'));
    const videos = attachments.filter(file => file.type.startsWith('video/'));
    const otherFiles = attachments.filter(file => 
      !file.type.startsWith('image/') && !file.type.startsWith('video/')
    );

    const parts = [];
    if (images.length > 0) {
      parts.push(`${images.length} image${images.length > 1 ? 's' : ''}`);
    }
    if (videos.length > 0) {
      parts.push(`${videos.length} video${videos.length > 1 ? 's' : ''}`);
    }
    if (otherFiles.length > 0) {
      parts.push(`${otherFiles.length} file${otherFiles.length > 1 ? 's' : ''}`);
    }

    return parts.join(', ');
  };

  // Helper function to get attachment icons
  const getAttachmentIcons = (attachments: File[]) => {
    if (!attachments || attachments.length === 0) return null;

    const hasImages = attachments.some(file => file.type.startsWith('image/'));
    const hasVideos = attachments.some(file => file.type.startsWith('video/'));
    const hasOtherFiles = attachments.some(file => 
      !file.type.startsWith('image/') && !file.type.startsWith('video/')
    );

    return (
      <div className="flex items-center space-x-1 ml-2">
        {hasImages && <ImageIcon className="w-3 h-3 text-blue-500" />}
        {hasVideos && <Video className="w-3 h-3 text-purple-500" />}
        {hasOtherFiles && <Paperclip className="w-3 h-3 text-gray-500" />}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 border-l-4 border-blue-500 px-4 py-3 mx-4 mb-2 rounded-r-md">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <p className="text-xs font-medium text-blue-600">
              Replying to {replyingTo.sender}
            </p>
            {replyingTo.attachments && replyingTo.attachments.length > 0 && 
              getAttachmentIcons(replyingTo.attachments)
            }
          </div>
          
          {/* Message content */}
          {replyingTo.content && (
            <p className="text-sm text-gray-600 truncate break-words whitespace-pre-wrap overflow-wrap break-all">
              {replyingTo.content}
            </p>
          )}
          
          {/* Attachment summary */}
          {replyingTo.attachments && replyingTo.attachments.length > 0 && (
            <p className="text-xs text-gray-500 mt-1 italic">
              📎 {getAttachmentSummary(replyingTo.attachments)}
            </p>
          )}
          
          {/* Show placeholder if no content and no attachments */}
          {!replyingTo.content && (!replyingTo.attachments || replyingTo.attachments.length === 0) && (
            <p className="text-sm text-gray-400 italic">
              Message has no content
            </p>
          )}
        </div>
        <Button
          onClick={onCancel}
          variant="ghost"
          className="ml-3 flex-shrink-0"
        >
          <X className="w-4 h-4 text-gray-500" />
        </Button>
      </div>
    </div>
  );
}
