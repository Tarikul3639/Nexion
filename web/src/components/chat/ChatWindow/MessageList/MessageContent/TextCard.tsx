import { TextMessage } from "@/types/message";

export default function TextCard({ message }: { message: TextMessage }) {
  if (message.type !== "text") return null;

  return (
    <div className="relative text-base text-gray-50 space-y-2.5 leading-relaxed whitespace-pre-wrap break-words">
      {message.content.text && <p>{message.content.text}</p>}
    </div>
  );
}
