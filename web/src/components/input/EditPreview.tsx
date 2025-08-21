"use client";

import { X, Edit } from "lucide-react";
import { Message as MessageType } from "@/types";

interface EditPreviewProps {
  editingMessage: MessageType;
  onCancel: () => void;
}

export default function EditPreview({ editingMessage, onCancel }: EditPreviewProps) {
  return (
    <div className="px-4 py-3 bg-amber-50 border-t border-amber-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="p-1 bg-amber-200 rounded-full">
            <Edit className="w-3 h-3 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-amber-700">
                Edit Message
              </span>
            </div>
            <p className="text-sm text-amber-600 truncate mt-1">
              {editingMessage.content}
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-amber-200 rounded-full transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4 text-amber-600" />
        </button>
      </div>
    </div>
  );
}
