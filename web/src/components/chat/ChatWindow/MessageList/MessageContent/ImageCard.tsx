import { Download } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import Image from "next/image";

export default function ImageCard({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  // Responsive grid columns
  let gridCols = "grid-cols-1";
  if (images.length === 2) gridCols = "grid-cols-2";
  else if (images.length >= 3) gridCols = "grid-cols-2";

  return (
    <div className={`grid ${gridCols} gap-2`}>
      {images.map((src, index) => (
        <div
          key={index}
          className={`relative w-full rounded-lg group aspect-square`}
        >
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 rounded-lg">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none focus:ring-gray-50">
                  <Download className="w-5 h-5 text-white" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Download image</TooltipContent>
            </Tooltip>
          </div>

          <Image
            src={src}
            alt={`image ${index + 1}`}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
