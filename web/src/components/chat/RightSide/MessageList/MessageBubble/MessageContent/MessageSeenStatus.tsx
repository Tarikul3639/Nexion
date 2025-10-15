import { MessageItem } from "@/types/message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MessageSeenStatus({
  message,
}: {
  message: MessageItem;
}) {
  const readBy = message.readBy?.filter((user) => user.id !== message.senderId);
  if (!readBy || readBy.length === 0) return null;
  return (
    <div
      className={`text-xs text-gray-400 mt-1 ${
        message.isMe ? "text-right" : "text-left"
      }`}
    >
      {readBy.map((user) => (
        <Avatar key={user.id} className="w-4 h-4 rounded-sm text-xs font-semibold flex-shrink-0 inline-block align-middle mr-1">
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback className="rounded-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[9px] font-bold">
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}
