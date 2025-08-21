"use client";

import React from "react";
import NextImage from "next/image";

interface ImageAttachmentProps {
  images: { file: File; index: number }[];
  previewUrls: { [key: number]: string };
  isOwn: boolean;
  formatFileSize: (bytes: number) => string;
}

export default function ImageAttachment({
  images,
  previewUrls,
  isOwn,
  formatFileSize,
}: ImageAttachmentProps) {
  const openImageFullscreen = (startIndex: number) => {
    // Check if we're in the browser before using window
    if (typeof window === 'undefined') return;
    
    const newWindow = window.open();
    if (newWindow) {
      const imageUrls = images.map(({ index }) => previewUrls[index]);
      const imageNames = images.map(({ file }) => file.name);
      
      newWindow.document.write(`
        <html>
          <head>
            <title>Image Gallery</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                background: #000;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                font-family: Arial, sans-serif;
                overflow: hidden;
              }
              .gallery-container {
                position: relative;
                width: 100%;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .gallery-image {
                max-width: 90vw;
                max-height: 90vh;
                object-fit: contain;
                border-radius: 8px;
                transition: opacity 0.3s ease;
              }
              .nav-button {
                position: fixed;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                font-size: 30px;
                padding: 15px 20px;
                border-radius: 50%;
                cursor: pointer;
                backdrop-filter: blur(10px);
                transition: all 0.2s ease;
                z-index: 10;
              }
              .nav-button:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-50%) scale(1.1);
              }
              .nav-button:disabled {
                opacity: 0.3;
                cursor: not-allowed;
              }
              .prev-btn {
                left: 30px;
              }
              .next-btn {
                right: 30px;
              }
              .close-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                font-size: 24px;
                padding: 10px;
                border-radius: 50%;
                cursor: pointer;
                backdrop-filter: blur(10px);
                z-index: 10;
              }
              .close-btn:hover {
                background: rgba(255,255,255,0.3);
              }
              .image-counter {
                position: fixed;
                top: 20px;
                left: 20px;
                background: rgba(0,0,0,0.6);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                backdrop-filter: blur(10px);
                z-index: 10;
              }
              .image-name {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.6);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                backdrop-filter: blur(10px);
                z-index: 10;
                max-width: 80vw;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            </style>
          </head>
          <body>
            <div class="gallery-container">
              <button class="nav-button prev-btn" onclick="previousImage()" id="prevBtn">‹</button>
              <img id="galleryImage" class="gallery-image" alt="Gallery image">
              <button class="nav-button next-btn" onclick="nextImage()" id="nextBtn">›</button>
              <button class="close-btn" onclick="window.close()">&times;</button>
              <div class="image-counter" id="imageCounter"></div>
              <div class="image-name" id="imageName"></div>
            </div>
            
            <script>
              const images = ${JSON.stringify(imageUrls)};
              const names = ${JSON.stringify(imageNames)};
              let currentIndex = ${startIndex};
              
              function updateImage() {
                const img = document.getElementById('galleryImage');
                const counter = document.getElementById('imageCounter');
                const nameDipaiy = document.getElementById('imageName');
                const prevBtn = document.getElementById('prevBtn');
                const nextBtn = document.getElementById('nextBtn');
                
                img.src = images[currentIndex];
                counter.textContent = (currentIndex + 1) + ' / ' + images.length;
                nameDipaiy.textContent = names[currentIndex];
                
                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex === images.length - 1;
                
                if (images.length === 1) {
                  prevBtn.style.display = 'none';
                  nextBtn.style.display = 'none';
                }
              }
              
              function previousImage() {
                if (currentIndex > 0) {
                  currentIndex--;
                  updateImage();
                }
              }
              
              function nextImage() {
                if (currentIndex < images.length - 1) {
                  currentIndex++;
                  updateImage();
                }
              }
              
              // Keyboard navigation
              document.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowLeft') previousImage();
                if (e.key === 'ArrowRight') nextImage();
                if (e.key === 'Escape') window.close();
              });
              
              // Initialize
              updateImage();
            </script>
          </body>
        </html>
      `);
    }
  };

  const getGridLayout = () => {
    switch (images.length) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2 gap-1";
      case 3:
        return "grid-cols-2 gap-1";
      case 4:
        return "grid-cols-2 gap-1";
      default:
        return "grid-cols-2 gap-1";
    }
  };

  const getImageDimensions = (imageCount: number, imageIndex: number) => {
    switch (imageCount) {
      case 1:
        return "max-h-80 w-full min-h-[200px]";
      case 2:
        return "h-40 w-full min-w-[150px]";
      case 3:
        if (imageIndex === 0) return "h-40 w-full col-span-2";
        return "h-[78px] w-full";
      case 4:
        return "h-32 w-full min-w-[120px]";
      default:
        return "h-32 w-full min-w-[120px]";
    }
  };

  return (
    <div>
      {images.length > 0 && (
        <div className={`grid gap-1 ${getGridLayout()} w-full max-w-md rounded-lg overflow-hidden`}>
          {images.slice(0, 4).map(({ file, index }, imgIndex) => (
            <div
              key={index}
              className={`relative ${
                images.length === 3 && imgIndex === 0 ? "col-span-2" : ""
              } ${imgIndex > 3 ? "hidden" : ""}`}
            >
              <NextImage
                src={previewUrls[index]}
                alt={file.name}
                width={200}
                height={200}
                className={`${getImageDimensions(
                  images.length,
                  imgIndex
                )} object-cover rounded-sm cursor-pointer hover:opacity-95 transition-opacity bg-gray-100`}
                onClick={() => openImageFullscreen(imgIndex)}
              />
              
              {/* Overlay for additional images count */}
              {images.length > 4 && imgIndex === 3 && (
                <div
                  className="absolute rounded-sm inset-0 bg-black/60 flex items-center justify-center cursor-pointer"
                  onClick={() => openImageFullscreen(imgIndex)}
                >
                  <span className="text-white text-lg font-semibold">
                    +{images.length - 4}
                  </span>
                </div>
              )}

              {/* Image info overlay for single image */}
              {images.length === 1 && (
                <div
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${
                    isOwn
                      ? "from-blue-900/70 to-transparent"
                      : "from-black/70 to-transparent"
                  } p-3`}
                >
                  <p className="text-white text-xs font-medium truncate">
                    {file.name}
                  </p>
                  <p className="text-white/80 text-xs">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
