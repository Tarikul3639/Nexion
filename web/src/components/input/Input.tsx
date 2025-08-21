"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Smile, Sparkles, Check } from "lucide-react";
import AttachmentPreview from "./AttachmentPreview";
import EmojiPickerComponent from "./EmojiPickerComponent";
import AISuggestionsComponent from "./AISuggestionsComponent";
import AttachmentDropdown from "./AttachmentDropdown";
import VoiceInputComponent from "./VoiceInputComponent";

interface MessageInputProps {
  message: string;
  setMessage: (v: string) => void;
  onSend: () => void;
  voice: Blob | null;
  setVoice: (v: Blob | null) => void;
  showAISuggestions: boolean;
  setShowAISuggestions: (v: boolean) => void;
  isRecording: boolean;
  setIsRecording: (v: boolean) => void;
  aiSuggestions: string[];
  onAISuggestion: (s: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  attachments?: File[];
  setAttachments?: (files: File[]) => void;
  isEditing?: boolean;
}
export default function MessageInput({
  message,
  setMessage,
  onSend,
  voice,
  setVoice,
  showAISuggestions,
  setShowAISuggestions,
  isRecording,
  setIsRecording,
  aiSuggestions,
  onAISuggestion,
  textareaRef,
  attachments = [],
  setAttachments,
  isEditing = false,
}: MessageInputProps) {
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [activeInputType, setActiveInputType] = useState<
    "none" | "image" | "video" | "file" | "voice"
  >("none");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (acceptType: string) => {
    let inputType: "image" | "video" | "file" = "file";

    if (acceptType === "image/*") inputType = "image";
    else if (acceptType === "video/*") inputType = "video";
    else inputType = "file";

    if (activeInputType === "none" || activeInputType === inputType) {
      setActiveInputType(inputType);

      if (fileInputRef.current) {
        fileInputRef.current.accept = acceptType;
        fileInputRef.current.click();
      }
      setShowAttachmentMenu(false);

      // Close other inputs
      setEmojiPickerVisible(false);
      setShowAISuggestions(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0 && setAttachments) {
      // Filter files based on active input type
      let filteredFiles = files;

      if (activeInputType === "image") {
        filteredFiles = files.filter((file) => file.type.startsWith("image/"));
      } else if (activeInputType === "video") {
        filteredFiles = files.filter((file) => file.type.startsWith("video/"));
      } else if (activeInputType === "file") {
        filteredFiles = files.filter(
          (file) =>
            !file.type.startsWith("image/") && !file.type.startsWith("video/")
        );
      }

      setAttachments([...attachments, ...filteredFiles]);
    }
    setActiveInputType("none");
    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    if (setAttachments) {
      const newAttachments = attachments.filter((_, i) => i !== index);
      setAttachments(newAttachments);

      // Reset active input type if no attachments left
      if (newAttachments.length === 0) {
        setActiveInputType("none");
      }
    }
  };

  // Check current attachment types to maintain active input type
  useEffect(() => {
    if (attachments.length > 0) {
      const hasImages = attachments.some((file) =>
        file.type.startsWith("image/")
      );
      const hasVideos = attachments.some((file) =>
        file.type.startsWith("video/")
      );
      const hasFiles = attachments.some(
        (file) =>
          !file.type.startsWith("image/") && !file.type.startsWith("video/")
      );

      if (hasImages && !hasVideos && !hasFiles) {
        setActiveInputType("image");
      } else if (hasVideos && !hasImages && !hasFiles) {
        setActiveInputType("video");
      } else if (hasFiles && !hasImages && !hasVideos) {
        setActiveInputType("file");
      }
    } else if (!isRecording) {
      setActiveInputType("none");
    }
  }, [attachments, isRecording]);

  return (
    <>
      <div className={`transition-opacity duration-300`}>
        {/* Attachments Preview */}
        <AttachmentPreview
          attachments={attachments}
          onRemoveAttachment={removeAttachment}
          setAttachments={setAttachments}
        />

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          multiple
        />

        <div className="flex items-end space-x-2 max-w-4xl p-2 md:p-4 mx-auto z-50">
          {/* Attachment Button */}
          <AttachmentDropdown
            showAttachmentMenu={showAttachmentMenu && !isRecording}
            setShowAttachmentMenu={setShowAttachmentMenu}
            activeInputType={activeInputType}
            onFileSelect={handleFileSelect}
            onToggle={() => {
              if (
                !isRecording &&
                (activeInputType === "none" ||
                  activeInputType === "image" ||
                  activeInputType === "video" ||
                  activeInputType === "file")
              ) {
                setShowAttachmentMenu(!showAttachmentMenu);
                setEmojiPickerVisible(false);
                setShowAISuggestions(false);
              }
            }}
            disabled={activeInputType === "voice" || isEditing || isRecording}
          />

          {/* Input Container */}
          <div className="flex-1 relative">
            <div className="flex items-end bg-gray-100 hover:bg-gray-200 transition-colors rounded-2xl px-4 py-2 min-h-[44px]">
              {!isRecording && (
                <Textarea
                  ref={textareaRef}
                  autoFocus
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isRecording
                      ? "Recording..."
                      : isEditing
                      ? "Edit your message..."
                      : "Type a message..."
                  }
                  className="flex-1 bg-transparent border-0 resize-none min-h-[28px] max-h-[120px] text-sm md:text-base placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 leading-6 hide-scrollbar shadow-none break-words overflow-wrap break-all"
                  rows={1}
                  disabled={isRecording}
                  aria-label={
                    isRecording
                      ? "Recording audio message"
                      : isEditing
                      ? "Edit message"
                      : "Type a message"
                  }
                />
              )}
              {/* Right side action buttons */}
              <div className={`flex items-center ${isRecording && "w-full"} space-x-1 ml-2 flex-shrink-0`}>
                {/* Emoji Button */}
                {!isRecording && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setShowAISuggestions(false);
                      setShowAttachmentMenu(false);
                      setEmojiPickerVisible(!emojiPickerVisible);
                    }}
                    className={`h-8 w-8 rounded-full transition-all ${
                      emojiPickerVisible
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                )}

                {/* AI Suggestions Button */}
                {!isRecording && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEmojiPickerVisible(false);
                      setShowAttachmentMenu(false);
                      setShowAISuggestions(!showAISuggestions);
                    }}
                    className={`h-8 px-2 rounded-full transition-all ${
                      showAISuggestions
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                  </Button>
                )}

                {/* Voice Record Button (shows when no text and not recording) */}
                <VoiceInputComponent
                  isOpen={isRecording}
                  setIsOpen={(recording) => {
                    setIsRecording(recording);
                    setActiveInputType(recording ? "voice" : "none");
                    if (recording) {
                      setEmojiPickerVisible(false);
                      setShowAISuggestions(false);
                      setShowAttachmentMenu(false);
                    }
                  }}
                  voice={voice}
                  setVoice={setVoice}
                  disabled={
                    activeInputType !== "none" && activeInputType !== "voice"
                  }
                />
              </div>
            </div>
          </div>

          {/* Send Button */}
          <Button
            size="icon"
            className={`rounded-full flex-shrink-0 h-11 w-11 transition-all duration-200 ${
              message.trim() || attachments.length > 0 || voice
                ? isEditing
                  ? "bg-green-500 hover:bg-green-600 scale-100 shadow-lg"
                  : "bg-blue-500 hover:bg-blue-600 scale-100 shadow-lg"
                : "bg-gray-300 cursor-not-allowed scale-95"
            }`}
            disabled={!message.trim() && attachments.length === 0 && !voice}
            onClick={onSend}
          >
            {isEditing ? (
              <Check className="w-5 h-5" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Character count indicator */}
        {message.length > 500 && !isRecording && (
          <div className="text-xs text-gray-400 text-right mt-2 px-2">
            {message.length}/1000
          </div>
        )}
      </div>

      {/* AI Suggestions - Hidden during recording */}
      {!isRecording && (
        <AISuggestionsComponent
          showAISuggestions={showAISuggestions}
          setShowAISuggestions={setShowAISuggestions}
          aiSuggestions={aiSuggestions}
          onAISuggestion={onAISuggestion}
        />
      )}

      {/* Emoji Picker - Hidden during recording */}
      {!isRecording && (
        <EmojiPickerComponent
          emojiPickerVisible={emojiPickerVisible}
          setEmojiPickerVisible={setEmojiPickerVisible}
          onEmojiClick={(emoji) => setMessage(message + emoji)}
        />
      )}
    </>
  );
}
