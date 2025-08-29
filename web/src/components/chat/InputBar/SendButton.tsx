import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function SendButton() {
  return (
    <Button
      size="icon"
      className="rounded-sm flex items-center justify-center transition-all duration-200 bg-blue-600 hover:bg-blue-700 active:scale-95 focus:outline-none"
    >
      <Send className="w-4 h-4" />
    </Button>
  );
}
