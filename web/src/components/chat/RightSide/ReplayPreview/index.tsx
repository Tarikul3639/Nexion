"use client";

import { Button } from "@/components/ui/button";
import {
  X,
  Image as ImageIcon,
  Video,
  Paperclip,
  AudioLines,
} from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { DraftMessage } from "@/types/message/indexs";

export default function ReplyPreview() {
  const { replyToId, setReplyToId, allMessages } = useChat();
  if (!replyToId) return null;

  const replyingTo = allMessages.find((msg) => msg.id === replyToId);
  if (!replyingTo) return null;

  const attachments = replyingTo.content?.attachments || [];

  // -----------------------------
  // Identify attachment types
  // -----------------------------
  const getAttachmentTypes = (
    attachments: DraftMessage["attachments"] = []
  ) => {
    return {
      images: attachments.filter((f) => f.type.startsWith("image")),
      videos: attachments.filter((f) => f.type.startsWith("video")),
      audios: attachments.filter((f) => f.type.startsWith("audio")),
      files: attachments.filter((f) => f.type.startsWith("file")),
    };
  };

  const { images, videos, audios, files } = getAttachmentTypes(attachments);

  // -----------------------------
  // Get attachment summary
  // -----------------------------
  const getAttachmentSummary = () => {
    const parts: string[] = [];
    if (images.length) parts.push(`${images.length} image${images.length > 1 ? "s" : ""}`);
    if (videos.length) parts.push(`${videos.length} video${videos.length > 1 ? "s" : ""}`);
    if (audios.length) parts.push(`${audios.length} audio${audios.length > 1 ? "s" : ""}`);
    if (files.length) parts.push(`${files.length} file${files.length > 1 ? "s" : ""}`);
    return parts.join(", ");
  };

  // -----------------------------
  // Get attachment icons
  // -----------------------------
  const getAttachmentIcons = () => (
    <div className="flex items-center space-x-1">
      {images.length > 0 && <ImageIcon className="w-3 h-3 text-blue-500" />}
      {videos.length > 0 && <Video className="w-3 h-3 text-purple-500" />}
      {audios.length > 0 && <AudioLines className="w-3 h-3 text-green-500" />}
      {files.length > 0 && <Paperclip className="w-3 h-3 text-gray-500" />}
    </div>
  );

  const onCancel = () => setReplyToId(null);

  return (
    <div className="bg-[#1c1c1c] border-l-4 border-blue-500 px-4 py-3 rounded-r-md mb-2">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Sender & icons */}
          <div className="flex items-center space-x-2 mb-1">
            <p className="text-xs font-medium text-blue-600">
              Replying to {replyingTo.senderName}
            </p>
            {attachments.length > 0 && getAttachmentIcons()}
          </div>

          {/* Message content */}
          {replyingTo.content?.text && (
            <p className="text-sm text-gray-500 truncate break-words whitespace-pre-wrap overflow-wrap break-all">
              {replyingTo.content.text}
            </p>
          )}

          {/* Attachment summary */}
          {attachments.length > 0 && (
            <div className="flex items-center space-x-1">
              {getAttachmentIcons()}
              <p className="text-xs text-gray-500 italic">{getAttachmentSummary()}</p>
            </div>
          )}

          {/* Placeholder if no content or attachments */}
          {!replyingTo.content?.text && attachments.length === 0 && (
            <p className="text-sm text-gray-400 italic">Message has no content</p>
          )}
        </div>

        {/* Cancel button */}
        <Button
          onClick={onCancel}
          size="icon"
          variant="ghost"
          className="ml-3 flex-shrink-0 bg-transparent hover:bg-white/3 text-gray-500 hover:text-gray-100"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
