import { API_ENDPOINTS } from '@/utils/constants';

export interface AttachmentService {
  uploadFile(file: File): Promise<string>;
  uploadFiles(files: File[]): Promise<string[]>;
  deleteFile(fileUrl: string): Promise<void>;
  getFileMetadata(fileUrl: string): Promise<{ name: string; size: number; type: string }>;
}

class AttachmentServiceImpl implements AttachmentService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  async uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.UPLOAD}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async uploadFiles(files: File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file));
      return Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.UPLOAD}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: fileUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async getFileMetadata(fileUrl: string): Promise<{ name: string; size: number; type: string }> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.UPLOAD}/metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: fileUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to get file metadata');
      }

      return response.json();
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw error;
    }
  }
}

export const attachmentService = new AttachmentServiceImpl();
