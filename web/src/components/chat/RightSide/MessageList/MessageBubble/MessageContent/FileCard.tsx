import { DraftMessage } from "@/types/message/indexs";
import { FileIcon } from "lucide-react";

export default function FileCard({ msg }: { msg: DraftMessage }) {
  if (!msg.attachments?.some(att => att.type === "file")) return null;

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-shrink-0">
        <FileIcon />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-50">{msg.attachments[0].name}</div>
        {/* <div className="text-xs text-gray-400">{formatFileSize(file.size)}</div> */}
      </div>
    </div>
  );
}
