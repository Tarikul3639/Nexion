"use client";

import React, { useState, useEffect } from "react";

interface AudioFileInfo {
  file: File;
  index: number;
}

interface AudioAttachmentProps {
  audioFiles: AudioFileInfo[];
  previewUrls: { [key: number]: string };
  isOwn: boolean;
  formatFileSize: (bytes: number) => string;
}

export default function AudioAttachment({
  audioFiles,
  previewUrls,
  isOwn,
  formatFileSize,
}: AudioAttachmentProps) {
  const [audioUrls, setAudioUrls] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    console.log("AudioAttachment - audioFiles:", audioFiles);
    console.log("AudioAttachment - previewUrls:", previewUrls);
    
    const urls: { [key: number]: string } = {};
    audioFiles.forEach(({ file, index }) => {
      // Use previewUrl if available, otherwise create a new blob URL
      const url = previewUrls[index] || URL.createObjectURL(file);
      urls[index] = url;
      console.log(`Audio URL for index ${index}:`, url);
    });
    setAudioUrls(urls);

    // Cleanup function - don't revoke URLs too early
    return () => {
      Object.entries(urls).forEach(([key, url]) => {
        if (url.startsWith('blob:') && !previewUrls[Number(key)]) {
          // Only revoke URLs we created, not ones from previewUrls
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [audioFiles, previewUrls]);

  if (audioFiles.length === 0) return null;

  return (
    <div className="space-y-2">
      {audioFiles.map(({ file, index }) => (
        <div
          key={index}
          className={`flex items-center space-x-3 p-3 rounded-lg border ${
            isOwn
              ? "bg-blue-50 border-blue-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >

          {/* Audio Info and Player */}
          <div className="flex-1 min-w-70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 truncate">
                {file.name.includes('voice-') ? 'Voice Message' : file.name}
              </span>
              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                {formatFileSize(file.size)}
              </span>
            </div>
            
            {/* Default HTML Audio Player */}
            {audioUrls[index] && (
              <audio 
                controls 
                className="w-full h-8"
                preload="metadata"
                src={audioUrls[index]}
                onLoadStart={() => console.log(`Audio ${index} load start, src:`, audioUrls[index])}
                onCanPlay={() => console.log(`Audio ${index} can play`)}
                onError={(e) => console.error(`Audio ${index} error:`, e, 'src:', audioUrls[index])}
                style={{
                  outline: 'none',
                  borderRadius: '4px',
                }}
              >
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
