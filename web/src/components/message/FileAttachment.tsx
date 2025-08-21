"use client";

import { Download, FileText, File, Archive, Music, Image as ImageIcon } from "lucide-react";
import React from "react";

interface FileAttachmentProps {
  otherFiles: { file: File; index: number }[];
  isOwn: boolean;
  formatFileSize: (bytes: number) => string;
  getFileExtension: (filename: string) => string;
}

export default function FileAttachment({
  otherFiles,
  isOwn,
  formatFileSize,
  getFileExtension,
}: FileAttachmentProps) {
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileText className="w-5 h-5" />;
      case 'zip':
      case 'rar':
      case '7z':
        return <Archive className="w-5 h-5" />;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <Music className="w-5 h-5" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const getFileTypeColor = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return isOwn ? 'bg-red-500/30 text-red-200' : 'bg-red-100 text-red-600';
      case 'doc':
      case 'docx':
        return isOwn ? 'bg-blue-500/30 text-blue-200' : 'bg-blue-100 text-blue-600';
      case 'zip':
      case 'rar':
      case '7z':
        return isOwn ? 'bg-purple-500/30 text-purple-200' : 'bg-purple-100 text-purple-600';
      case 'mp3':
      case 'wav':
      case 'ogg':
        return isOwn ? 'bg-green-500/30 text-green-200' : 'bg-green-100 text-green-600';
      default:
        return isOwn ? 'bg-gray-500/30 text-gray-200' : 'bg-gray-100 text-gray-600';
    }
  };

  const downloadFile = (file: File) => {
    // Check if we're in the browser before using DOM APIs
    if (typeof window === 'undefined') return;
    
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {otherFiles.map(({ file, index }) => (
        <div
          key={index}
          className={`group relative rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md max-w-sm ${
            isOwn
              ? "bg-blue-600/10 border-blue-300/30 hover:bg-blue-600/20"
              : "bg-white border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md"
          }`}
          onClick={() => downloadFile(file)}
        >
          <div className="p-3">
            <div className="flex items-center space-x-3">
              {/* File icon */}
              <div
                className={`p-3 rounded-xl ${getFileTypeColor(file.name)} relative`}
              >
                {getFileIcon(file.name)}
                
                {/* File extension badge */}
                <div
                  className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-xs font-bold text-white ${
                    isOwn ? "bg-blue-600" : "bg-gray-600"
                  }`}
                  style={{ fontSize: '10px' }}
                >
                  {getFileExtension(file.name)}
                </div>
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    isOwn ? "text-blue-100" : "text-gray-900"
                  }`}
                  title={file.name}
                >
                  {file.name}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <p
                    className={`text-xs ${
                      isOwn ? "text-blue-200" : "text-gray-500"
                    }`}
                  >
                    {formatFileSize(file.size)}
                  </p>
                  <span
                    className={`text-xs ${
                      isOwn ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    •
                  </span>
                  <div className="flex items-center space-x-1">
                    <Download
                      className={`w-3 h-3 ${
                        isOwn ? "text-blue-200" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        isOwn ? "text-blue-200" : "text-gray-500"
                      }`}
                    >
                      Download
                    </span>
                  </div>
                </div>
              </div>

              {/* Download indicator */}
              <div
                className={`opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full ${
                  isOwn ? "hover:bg-blue-500/20" : "hover:bg-gray-100"
                }`}
              >
                <Download
                  className={`w-4 h-4 ${
                    isOwn ? "text-blue-300" : "text-gray-600"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* WhatsApp-like download progress bar (placeholder) */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent group-hover:bg-gray-200/50 rounded-b-lg">
            <div
              className={`h-full w-0 ${
                isOwn ? "bg-blue-400" : "bg-green-500"
              } rounded-b-lg transition-all duration-300`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
