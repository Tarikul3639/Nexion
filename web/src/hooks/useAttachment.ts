import { useState, useCallback } from 'react';
import { isValidFileType, isValidFileSize } from '@/utils/validators';
import { 
  MAX_FILE_SIZE_MB, 
  ALLOWED_IMAGE_TYPES, 
  ALLOWED_VIDEO_TYPES, 
  ALLOWED_DOCUMENT_TYPES 
} from '@/utils/constants';

export interface UseAttachmentReturn {
  attachments: File[];
  previewUrls: { [key: number]: string };
  activeInputType: string | null;
  addAttachments: (files: FileList, type: string) => void;
  removeAttachment: (index: number) => void;
  clearAttachments: () => void;
  setActiveInputType: (type: string | null) => void;
}

export const useAttachment = (): UseAttachmentReturn => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<{ [key: number]: string }>({});
  const [activeInputType, setActiveInputType] = useState<string | null>(null);

  const addAttachments = useCallback((files: FileList, type: string) => {
    const newFiles = Array.from(files);
    const validFiles: File[] = [];

    newFiles.forEach(file => {
      let isValid = false;
      
      switch (type) {
        case 'image':
          isValid = isValidFileType(file, ALLOWED_IMAGE_TYPES) && 
                   isValidFileSize(file, MAX_FILE_SIZE_MB);
          break;
        case 'video':
          isValid = isValidFileType(file, ALLOWED_VIDEO_TYPES) && 
                   isValidFileSize(file, MAX_FILE_SIZE_MB);
          break;
        case 'document':
          isValid = isValidFileType(file, ALLOWED_DOCUMENT_TYPES) && 
                   isValidFileSize(file, MAX_FILE_SIZE_MB);
          break;
        default:
          isValid = isValidFileSize(file, MAX_FILE_SIZE_MB);
      }

      if (isValid) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setAttachments(prev => [...prev, ...validFiles]);
      
      // Create preview URLs for images and videos
      const newUrls: { [key: number]: string } = {};
      validFiles.forEach((file, index) => {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          const currentIndex = attachments.length + index;
          newUrls[currentIndex] = URL.createObjectURL(file);
        }
      });
      
      setPreviewUrls(prev => ({ ...prev, ...newUrls }));
    }
  }, [attachments.length]);

  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => {
      const newAttachments = prev.filter((_, i) => i !== index);
      
      // Clean up preview URL
      if (previewUrls[index]) {
        URL.revokeObjectURL(previewUrls[index]);
        setPreviewUrls(prevUrls => {
          const newUrls = { ...prevUrls };
          delete newUrls[index];
          return newUrls;
        });
      }
      
      return newAttachments;
    });
  }, [previewUrls]);

  const clearAttachments = useCallback(() => {
    // Clean up all preview URLs
    Object.values(previewUrls).forEach(url => {
      URL.revokeObjectURL(url);
    });
    
    setAttachments([]);
    setPreviewUrls({});
    setActiveInputType(null);
  }, [previewUrls]);

  return {
    attachments,
    previewUrls,
    activeInputType,
    addAttachments,
    removeAttachment,
    clearAttachments,
    setActiveInputType,
  };
};
