"use client";

import React, { useState, useEffect } from "react";
import ImageAttachment from "./ImageAttachment";
import VideoAttachment from "./VideoAttachment";
import AudioAttachment from "./AudioAttachment";
import FileAttachment from "./FileAttachment";
import ClientOnly from "@/components/ui/ClientOnly";

interface AttachmentDisplayProps {
  attachments: File[];
  isOwn: boolean;
}

export default function AttachmentDisplay({
  attachments,
  isOwn,
}: AttachmentDisplayProps) {
  const [previewUrls, setPreviewUrls] = useState<{ [key: number]: string }>({});

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileExtension = (filename: string): string => {
    const ext = filename.split(".").pop()?.toUpperCase();
    return ext || "FILE";
  };

  useEffect(() => {
    const urls: { [key: number]: string } = {};
    attachments.forEach((file, index) => {
      if (file.type.startsWith("image/") || file.type.startsWith("video/") || file.type.startsWith("audio/")) {
        try {
          urls[index] = URL.createObjectURL(file);
        } catch (error) {
          console.warn('Failed to create object URL for file:', file.name, error);
        }
      }
    });
    setPreviewUrls(urls);

    // Only cleanup URLs when component unmounts or attachments change significantly
    return () => {
      // Don't revoke URLs immediately for audio files as they might still be playing
      const audioIndices = attachments
        .map((file, index) => file.type.startsWith("audio/") ? index : -1)
        .filter(index => index !== -1);
      
      Object.entries(urls).forEach(([key, url]) => {
        const index = Number(key);
        if (!audioIndices.includes(index)) {
          try {
            URL.revokeObjectURL(url);
          } catch (error) {
            console.warn('Failed to revoke object URL:', error);
          }
        }
      });
    };
  }, [attachments]);

  // Separate images, videos, audio, and other files
  const images = attachments
    .filter((file) => file.type.startsWith("image/"))
    .map((file) => ({ file, index: attachments.indexOf(file) }));
  const videos = attachments
    .filter((file) => file.type.startsWith("video/"))
    .map((file) => ({ file, index: attachments.indexOf(file) }));
  const audioFiles = attachments
    .filter((file) => file.type.startsWith("audio/"))
    .map((file) => ({ file, index: attachments.indexOf(file) }));
  const otherFiles = attachments
    .filter(
      (file) =>
        !file.type.startsWith("image/") && 
        !file.type.startsWith("video/") && 
        !file.type.startsWith("audio/")
    )
    .map((file) => ({ file, index: attachments.indexOf(file) }));

  return (
    <ClientOnly fallback={
      <div className="mt-2 p-1 space-y-1">
        <div className="animate-pulse bg-gray-200 h-20 w-full rounded"></div>
      </div>
    }>
      <div className="mt-2 p-1 space-y-1">
        {/* Images */}
        <ImageAttachment
          images={images}
          previewUrls={previewUrls}
          isOwn={isOwn}
          formatFileSize={formatFileSize}
        />

        {/* Videos */}
        <VideoAttachment
          videos={videos}
          previewUrls={previewUrls}
          isOwn={isOwn}
          formatFileSize={formatFileSize}
        />

        {/* Audio Files */}
        <AudioAttachment
          audioFiles={audioFiles}
          previewUrls={previewUrls}
          isOwn={isOwn}
          formatFileSize={formatFileSize}
        />

        {/* Other Files */}
        <FileAttachment
          otherFiles={otherFiles}
          isOwn={isOwn}
          formatFileSize={formatFileSize}
          getFileExtension={getFileExtension}
        />
      </div>
    </ClientOnly>
  );
}
