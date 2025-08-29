import { useRef } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Paperclip, Image, Clapperboard, Folder } from "lucide-react";
import { AttachmentType, LocalAttachment } from "@/types/chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AttachmentConfig {
  type: AttachmentType;
  label: string;
  icon: React.FC<any>;
  accept?: string;
}

const attachmentConfig: AttachmentConfig[] = [
  { type: "image", label: "Image", icon: Image, accept: "image/*" },
  { type: "video", label: "Video", icon: Clapperboard, accept: "video/*" },
  { type: "file", label: "File", icon: Folder },
];

export default function AttachmentDropdown() {
  const { setMessage } = useChat();

  const inputRefs = {
    image: useRef<HTMLInputElement>(null),
    video: useRef<HTMLInputElement>(null),
    file: useRef<HTMLInputElement>(null),
  };

  const handleClick = (type: AttachmentType) => {
    inputRefs[type].current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: AttachmentType
  ) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray: LocalAttachment[] = Array.from(files).map((file) => ({
      file,
      type,
      name: file.name,
      size: file.size,
    }));

    setMessage((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...filesArray],
    }));

    e.target.value = ""; // reset input
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

      {/* Hidden inputs */}
      {attachmentConfig.map(({ type, accept }) => (
        <input
          key={type}
          type="file"
          accept={accept}
          ref={inputRefs[type]}
          onChange={(e) => handleFileChange(e, type)}
          className="hidden"
        />
      ))}
    </>
  );
}
