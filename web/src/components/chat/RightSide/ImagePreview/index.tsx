"use client";

import type React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/context/ChatContext/ChatProvider";
import { useMemo } from "react";

const ImagePreview: React.FC = () => {
  const { draftMessage, setDraftMessage } = useChat();

  const attachments = useMemo(() => {
    return (
      draftMessage?.attachments?.filter((att) => att.type === "image") || []
    );
  }, [draftMessage]);

  const onRemove = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setDraftMessage((prev) => ({
      ...prev,
      attachments: newAttachments,
    }));
  };
  if (!attachments.length) return null;

  return (
    <div className="rounded-sm p-2 border border-neutral-700/50 mx-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          {attachments.length} image{attachments.length > 1 ? "s" : ""} selected
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {attachments.map((attachment, index) => (
          <div
            key={index}
            className="relative group bg-background rounded-sm overflow-hidden border border-neutral-700/50 transition-all duration-200"
            style={{ width: "120px", height: "120px" }}
          >
            <Image
              src={attachment.url || "/placeholder.svg"}
              alt={attachment.name || `Preview ${index + 1}`}
              width={120} // fixed size
              height={120} // fixed size
              className="object-cover w-full h-full"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              {onRemove && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => onRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* File name if available */}
            {attachment.name && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                {attachment.name}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePreview;
