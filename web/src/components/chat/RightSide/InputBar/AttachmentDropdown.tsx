import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Image, Clapperboard, Folder } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChat } from "@/context/ChatContext";

// Attachment types for messages
export type AttachmentType = "image" | "video" | "file" | "audio";

// Configuration for each attachment type
interface AttachmentConfig {
  type: AttachmentType;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  accept?: string;
}

const attachmentConfig: AttachmentConfig[] = [
  { type: "image", label: "Image", icon: Image, accept: "image/*" },
  { type: "video", label: "Video", icon: Clapperboard, accept: "video/*" },
  { type: "file", label: "File", icon: Folder },
];

export default function AttachmentDropdown() {
  const { draftMessage, setDraftMessage } = useChat();

  const imageRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLInputElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleClick = (type: AttachmentType) => {
    if (type === "image") imageRef.current?.click();
    if (type === "video") videoRef.current?.click();
    if (type === "file") fileRef.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: AttachmentType
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newAttachments = Array.from(e.target.files).map((file) => {
      if (type === "image") {
        return {
          type: "image" as const,
          url: URL.createObjectURL(file), // for preview
          file, // raw File object
          name: file.name,
          size: file.size,
          extension: file.name.split(".").pop() || "",
        };
      } else if (type === "file") {
        return {
          type: "file" as const,
          url: URL.createObjectURL(file), // for preview
          file,
          name: file.name,
          size: file.size,
          extension: file.name.split(".").pop() || "",
        };
      } else if (type === "video") {
        return {
          type: "video" as const,
          url: URL.createObjectURL(file), // for preview
          file,
          name: file.name,
          size: file.size,
        };
      } else if (type === "audio") {
        return {
          type: "audio/webm" as const,
          url: URL.createObjectURL(file), // for preview
          file,
          name: file.name,
          size: file.size,
        };
      }
      throw new Error("Invalid attachment type");
    });

    setDraftMessage({
      text: draftMessage?.text || "",
      attachments: [...(draftMessage?.attachments || []), ...newAttachments],
    });

    e.target.value = "";
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-sm bg-transparent text-gray-300 hover:bg-[#2a2d31] hover:text-blue-100 active:bg-[#2a2d31] transition-colors duration-200 flex items-center">
            <Paperclip />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-[#1a1a1a] border border-neutral-800 text-gray-200 rounded-md shadow-lg">
          {attachmentConfig.map(({ type, label, icon: Icon }) => (
            <DropdownMenuItem
              key={type}
              onClick={() => handleClick(type)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-200 data-[highlighted]:bg-neutral-800 data-[highlighted]:text-gray-200 rounded-sm cursor-pointer"
            >
              <Icon className="text-gray-400" /> {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {attachmentConfig.map(({ type, accept }) => (
        <input
          key={type}
          type="file"
          accept={accept}
          multiple
          ref={
            type === "image" ? imageRef : type === "video" ? videoRef : fileRef
          }
          onChange={(e) => handleFileChange(e, type)}
          className="hidden"
        />
      ))}
    </>
  );
}
