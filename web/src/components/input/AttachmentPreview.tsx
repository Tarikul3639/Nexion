"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Image as ImageIcon, Video, X } from "lucide-react";
import NextImage from "next/image";

interface AttachmentPreviewProps {
  attachments: File[];
  onRemoveAttachment: (index: number) => void;
  setAttachments?: (files: File[]) => void;
}

export default function AttachmentPreview({
  attachments,
  onRemoveAttachment,
  setAttachments,
}: AttachmentPreviewProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  if (attachments.length === 0) return null;

  // Separate files by type
  const imageFiles = attachments.filter((file) =>
    file.type.startsWith("image/")
  );
  const videoFiles = attachments.filter((file) =>
    file.type.startsWith("video/")
  );
  const otherFiles = attachments.filter(
    (file) => !file.type.startsWith("image/") && !file.type.startsWith("video/")
  );

  const renderFileSection = (
    files: File[],
    title: string,
    icon: React.ReactNode
  ) => {
    if (files.length === 0) return null;

    return (
      <div>
        <div className="w-full flex justify-between items-center">
        <div className="flex items-center space-x-2 mb-2">
          {icon}
          <span className="text-sm font-medium text-gray-700">
            {title} ({files.length})
          </span>
        </div>
        <Button
          variant="destructive"
          className="h-7 w-7 rounded-sm cursor-pointer"
          onClick={() => setAttachments && setAttachments([])}>
          <X />
        </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {files.map((file) => {
            const originalIndex = attachments.indexOf(file);
            return (
              <div
                key={originalIndex}
                className="relative bg-white border border-gray-200 rounded-lg overflow-hidden max-w-xs"
              >
                {file.type.startsWith("image/") ? (
                  <div className="relative">
                    <NextImage
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      width={300}
                      height={160}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                      <p className="text-white text-xs font-medium truncate">
                        {file.name}
                      </p>
                    </div>
                  </div>
                ) : file.type.startsWith("video/") ? (
                  <div className="relative">
                    <video
                      src={URL.createObjectURL(file)}
                      className="w-full h-40 object-cover"
                      controls
                    />
                    <div className="absolute top-1 left-0 right-0 bg-gradient-to-t from-transparent to-black/60 p-1 pointer-events-none">
                      <p className="text-white text-xs font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-white/80 text-xs">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 flex items-center space-x-2">
                      <div className="px-1 py-0.5 rounded text-xs font-bold text-white bg-gray-600 text-[8px]">
                        {file.name.split(".").pop()?.toUpperCase() || "FILE"}
                      </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                )}
                <Button
                  variant="destructive"
                  onClick={() => onRemoveAttachment(originalIndex)}
                  className="absolute -top-0 -right-0 h-6 w-6 rounded-none rounded-bl-sm"
                >
                  <X />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-gray-50 rounded-lg p-3 space-y-3">
        {/* Images Section */}
        {renderFileSection(
          imageFiles,
          "Images",
          <ImageIcon className="w-4 h-4 text-blue-500" />
        )}

        {/* Videos Section */}
        {renderFileSection(
          videoFiles,
          "Videos",
          <Video className="w-4 h-4 text-purple-500" />
        )}

        {/* Other Files Section */}
        {renderFileSection(
          otherFiles,
          "Files",
          <Paperclip className="w-4 h-4 text-gray-500" />
        )}
      </div>
    </div>
  );
}
