import { Textarea } from "@/components/ui/textarea";

export default function MessageTextarea({ placeholder = "Type your message..." }) {
  return (
    <Textarea
      className="w-full text-gray-200 min-h-0 max-h-40 resize-none rounded-sm border border-gray-700 text-sm md:text-base leading-tight break-words overflow-wrap break-all"
      placeholder={placeholder}
    />
  );
}
