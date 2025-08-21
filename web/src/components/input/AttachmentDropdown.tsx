"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Image as ImageIcon, Video } from "lucide-react";

interface AttachmentDropdownProps {
  showAttachmentMenu: boolean;
  setShowAttachmentMenu: (show: boolean) => void;
  activeInputType: 'none' | 'image' | 'video' | 'file' | 'voice';
  onFileSelect: (acceptType: string) => void;
  onToggle: () => void;
  disabled?: boolean;
}

export default function AttachmentDropdown({
  showAttachmentMenu,
  setShowAttachmentMenu,
  activeInputType,
  onFileSelect,
  onToggle,
  disabled = false,
}: AttachmentDropdownProps) {
  const attachmentMenuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close attachment menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const node = event.target as Node;

      if (
        attachmentMenuRef.current &&
        !attachmentMenuRef.current.contains(node)
      ) {
        setShowAttachmentMenu(false);
      }
    };

    if (showAttachmentMenu) {
      document.addEventListener("mouseup", handleClickOutside);
      return () => {
        document.removeEventListener("mouseup", handleClickOutside);
      };
    }
  }, [showAttachmentMenu, setShowAttachmentMenu]);

  return (
    <div className="relative">
      {/* Attachment Button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={onToggle}
        disabled={disabled}
        className={`text-gray-500 hover:text-gray-700 flex-shrink-0 mb-1 h-9 w-9 transition-all ${
          showAttachmentMenu
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
      >
        <Paperclip className="w-5 h-5" />
      </Button>

      {/* Attachment Menu */}
      {showAttachmentMenu && (
        <div
          ref={attachmentMenuRef}
          className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[140px] z-50"
        >
          <button
            onClick={() => onFileSelect("image/*")}
            disabled={activeInputType !== "none" && activeInputType !== "image"}
            className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 ${
              activeInputType !== "none" && activeInputType !== "image"
                ? "text-gray-400 cursor-not-allowed opacity-50"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ImageIcon
              className={`w-4 h-4 ${
                activeInputType === "image"
                  ? "text-blue-600"
                  : "text-blue-500"
              }`}
            />
            <span>Image</span>
            {activeInputType === "image" && (
              <span className="ml-auto text-xs text-blue-600">Active</span>
            )}
          </button>
          <button
            onClick={() => onFileSelect("video/*")}
            disabled={activeInputType !== "none" && activeInputType !== "video"}
            className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 ${
              activeInputType !== "none" && activeInputType !== "video"
                ? "text-gray-400 cursor-not-allowed opacity-50"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Video
              className={`w-4 h-4 ${
                activeInputType === "video"
                  ? "text-purple-600"
                  : "text-purple-500"
              }`}
            />
            <span>Video</span>
            {activeInputType === "video" && (
              <span className="ml-auto text-xs text-purple-600">
                Active
              </span>
            )}
          </button>
          <button
            onClick={() => onFileSelect("*/*")}
            disabled={activeInputType !== "none" && activeInputType !== "file"}
            className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 ${
              activeInputType !== "none" && activeInputType !== "file"
                ? "text-gray-400 cursor-not-allowed opacity-50"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Paperclip
              className={`w-4 h-4 ${
                activeInputType === "file"
                  ? "text-gray-600"
                  : "text-gray-500"
              }`}
            />
            <span>File</span>
            {activeInputType === "file" && (
              <span className="ml-auto text-xs text-gray-600">Active</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
