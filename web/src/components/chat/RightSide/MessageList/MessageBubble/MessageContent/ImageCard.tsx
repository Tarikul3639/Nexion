"use client";

import { Download } from "lucide-react";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { DraftMessage } from "@/types/message";
import { useChat } from "@/context/ChatContext";

// -----------------------
// ProgressButton Component
// -----------------------
interface ProgressButtonProps {
  progress: number;
  onClick: () => void;
  children: React.ReactNode;
}

const ProgressButton = ({
  progress,
  onClick,
  children,
}: ProgressButtonProps) => {
  const size = 40; // slightly bigger than button (button h-10 w-10 ~40px)
  const stroke = 2.5;
  const radius = size / 2 - stroke;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:outline-none"
    >
      {progress > 0 && progress < 100 && (
        <svg
          className="absolute -top-1 -left-1 w-12 h-12" // overlay outside button
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            stroke="#e5e7eb09"
            fill="transparent"
            strokeWidth={stroke}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            stroke="#3b82f6"
            fill="transparent"
            strokeWidth={stroke}
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
      )}
      {children}
    </button>
  );
};

// -----------------------
// Main ImageCard Component
// -----------------------
export default function ImageCard({ msg }: { msg: DraftMessage }) {
  const { uploadProgress } = useChat();
  const [downloadProgress, setDownloadProgress] = useState<{
    [key: string]: number;
  }>({});

  // Filter images
  if (!msg.attachments?.some((att) => att.type === "image")) return null;
  const images = msg.attachments.filter((att) => att.type === "image");

  // Download handler
  const handleDownload = async (img: any, index: number) => {
    const filename = img.name || img.file?.name || `image-${index + 1}`;
    const url = img.url || (img.file ? URL.createObjectURL(img.file) : "");

    try {
      const response = await fetch(url);
      const reader = response.body?.getReader();
      if (!reader) return;

      const contentLength = +response.headers.get("Content-Length")!;
      let receivedLength = 0;
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          receivedLength += value.length;
          const progress = Math.round((receivedLength / contentLength) * 100);
          setDownloadProgress((prev) => ({ ...prev, [filename]: progress }));
        }
      }

      // Combine into blob & download
      const blob = new Blob(chunks);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);

      // Reset progress
      setDownloadProgress((prev) => ({ ...prev, [filename]: 100 }));
      setTimeout(
        () => setDownloadProgress((prev) => ({ ...prev, [filename]: 0 })),
        500
      );
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // Grid layout
  let gridCols = "grid-cols-1 height-[100px]";
  if (images.length === 2) gridCols = "grid-cols-2";
  else if (images.length >= 3) gridCols = "grid-cols-2";

  return (
    <div className="min-w-[calc(100vw-150px)] sm:min-w-[calc(50vw-150px)] md:min-w-[calc(50vw-150px)] xl:min-w-[calc(40vw-150px)]">
      <div className={`grid ${gridCols} gap-2`}>
        {images.map((img, index) => {
          const uploadProg =
            uploadProgress[img.name || img.file?.name || ""] || 0;
          const filename = img.name || img.file?.name || `image-${index + 1}`;
          const downloadProg = downloadProgress[filename] || 0;

          return (
            <div
              key={index}
              className="relative group w-full overflow-hidden rounded-lg aspect-square"
            >
              {/* Download overlay */}
              <div
                className={`absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10 rounded-lg transition-opacity duration-300 ${
                  downloadProg > 0 && downloadProg < 100
                    ? "opacity-100"
                    : "opacity-0 hover:opacity-100"
                }`}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ProgressButton
                      progress={downloadProg}
                      onClick={() => handleDownload(img, index)}
                    >
                      <Download className="w-5 h-5 text-white z-10" />
                    </ProgressButton>
                  </TooltipTrigger>
                  <TooltipContent>Download image</TooltipContent>
                </Tooltip>
              </div>

              {/* Image */}
              <Image
                src={img.url || (img.file ? URL.createObjectURL(img.file) : "")}
                alt={img.alt || img.name || `image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Upload blur overlay */}
              {uploadProg < 100 &&
                uploadProgress[img.name || img.file?.name || ""] && (
                  <div
                    className="absolute inset-0 backdrop-blur-sm transition-all duration-300"
                    style={{
                      maskImage: `conic-gradient(transparent ${uploadProg}%, white 0)`,
                      WebkitMaskImage: `conic-gradient(transparent ${uploadProg}%, white 0)`,
                    }}
                  />
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
