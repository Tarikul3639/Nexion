import { Button } from "@/components/ui/button";
import { Paperclip, Image, Clapperboard, Folder } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AttachmentDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:outline-none">
        <Button className="rounded-sm bg-transparent text-gray-300 hover:bg-[#2a2d31] hover:text-blue-100 active:bg-[#2a2d31] transition-colors duration-200 flex items-center">
          <Paperclip />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-[#1a1a1a] border border-neutral-800 text-gray-200 rounded-md shadow-lg">
        <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm text-gray-200 data-[highlighted]:bg-neutral-800 data-[highlighted]:text-gray-200 rounded-sm cursor-pointer">
          <Image className="text-gray-400" /> Image
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm text-gray-200 data-[highlighted]:bg-neutral-800 data-[highlighted]:text-gray-200 rounded-sm cursor-pointer">
          <Clapperboard className="text-gray-400" /> Video
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm text-gray-200 data-[highlighted]:bg-neutral-800 data-[highlighted]:text-gray-200 rounded-sm cursor-pointer">
          <Folder className="text-gray-400" /> File
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
