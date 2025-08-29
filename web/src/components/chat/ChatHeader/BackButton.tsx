"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      size="icon"
      variant="ghost"
      className="md:hidden text-gray-300 hover:text-white hover:bg-[#323438]"
      onClick={onClick}
    >
      <ArrowLeft className="w-5 h-5" />
    </Button>
  );
}
