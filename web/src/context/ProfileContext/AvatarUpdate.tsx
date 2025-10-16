// utils/uploadProfilePhoto.ts
import axios from "axios";

export interface IPhotoUploadResponse {
  success: boolean;
  message: string;
  url?: string;
  avatar?: string;
}

export const AvatarUpdate = async (
  file: File,
  token: string
): Promise<{ success: boolean; message: string; url?: string }> => {
  try {
    if (!file || !file.type.startsWith("image/")) {
      return { success: false, message: "Invalid file type. Please upload an image." };
    }

    const formData = new FormData();
    formData.append("avatar", file);
    
    const response = await axios.post<IPhotoUploadResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/avatar`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status >= 200 && response.status < 300 && response.data.success) {
      return {
        success: true,
        message: "Profile photo uploaded successfully",
        url: response.data.url || response.data.avatar || undefined,
      };
    }

    return { success: false, message: response.data.message || "Failed to upload profile photo" };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message: string } }; message?: string };
    return { success: false, message: err.response?.data?.message || err.message || "Failed to upload profile photo" };
  }
};
