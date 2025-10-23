import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useChat } from "@/context/ChatContext/ChatProvider";
import { useSocket } from "@/context/SocketContext";

interface MessageDropdownProps {
  options?: string[];
  msgId: string;
}

const MessageDropdown: FC<MessageDropdownProps> = ({
  options = ["Reply", "Forward", "Copy", "Report", "Delete"],
  msgId,
}) => {
  const { setReplyToId, allMessages, setAllMessages } = useChat();
  const { socket } = useSocket();

  const onClick = (item: string) => {
    switch (item) {
      case "Reply":
        setReplyToId(msgId);
        break;

      case "Forward":
        // forward logic
        break;

      case "Copy":
        navigator.clipboard.writeText(
          allMessages.find((msg) => msg.id === msgId)?.content.text || ""
        );
        break;

      case "Edit":
        // edit logic
        break;

      case "Delete":
        if (socket) {
          socket.emit("deleteMessage", { messageId: msgId });

          socket.on("messageDeleted", ({ messageId }) => {
            setAllMessages((prev) =>
              prev.filter((msg) => msg.id !== messageId)
            );
          });
        }
        break;

      default:
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical
          className="text-gray-400 h-7 w-7 p-1 hover:bg-[#323438]/50 rounded-sm cursor-pointer"
          strokeWidth={2}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        className="bg-[#323438] px-0 py-2 text-gray-200 border border-neutral-600/50 rounded-md shadow-md"
      >
        {options.map((item) => (
          <DropdownMenuItem
            key={item}
            onClick={() => onClick(item)}
            className="text-gray-200 rounded-none data-[highlighted]:bg-[#3F4245] data-[highlighted]:text-white"
          >
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageDropdown;
