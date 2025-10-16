// utils/updateProfile.ts
import axios from "axios";

export interface IUser {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatar?: string;
}

interface IUpdateResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    username: string;
    avatar?: string | null;
  };
}

export const ProfileFromUpdate = async (
  userData: Partial<IUser>,
  token: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.put<IUpdateResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/me`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (response.status === 200 && data.success) {
      return { success: true, message: data.message };
    }

    return { success: false, message: data.message };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message: string } };
      message?: string;
    };

    return {
      success: false,
      message: err.response?.data?.message || err.message || "Update failed",
    };
  }
};
