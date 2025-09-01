import { Download } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import Image from "next/image";
import { ImageMessage } from "@/types/message";

export default function ImageCard({ message }: { message: ImageMessage }) {
  // Check inside the card
  if (message.type !== "image" || !message.content.images?.length) return null;

  const images = message.content.images;

  // Responsive grid
  let gridCols = "grid-cols-1";
  if (images.length === 2) gridCols = "grid-cols-2";
  else if (images.length >= 3) gridCols = "grid-cols-2";

  return (
    <div className="xs:min-w-64">
      <div className={`grid ${gridCols} gap-2`}>
        {images.map((img, index) => (
          <div key={index} className="relative group w-full overflow-hidden rounded-lg aspect-square">
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gray-900/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 rounded-lg">
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
              src={img.url}
              alt={img.alt || `image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
