import axios from "axios";
import { IUser } from "@/types/auth";
import { StorageClear } from "./StorageClear";

interface IVerifyUser {
  id: string;
  name?: string;
  username: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
}

interface IVerifyResponse {
  success: boolean;
  message: string;
  data: {
    user: IVerifyUser;
  };
}

export const ValidationCheck = async (
  storedUser: string | null,
  storedToken: string | null,
  setUser: (user: IUser | null) => void,
  setToken: (token: string | null) => void,
  setIsLoading: (isLoading: boolean) => void
): Promise<void> => {
  try {
    setIsLoading(true);

    if (storedUser && storedToken) {
      const response = await axios.get<IVerifyResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      const data = response.data;

      if (response.status === 200 && data.success && data.data.user) {
        setToken(storedToken);
        setUser({
          id: data.data.user.id,
          email: data.data.user.email,
          name: data.data.user.name,
          username: data.data.user.username,
          avatar: data.data.user.avatar ?? undefined,
          bio: data.data.user.bio ?? undefined,
        });

        document.cookie = `token=${storedToken}; path=/; max-age=${
          7 * 24 * 60 * 60
        }; Secure; SameSite=Strict`;
      } else {
        StorageClear();
      }
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    StorageClear();
  } finally {
    setIsLoading(false);
  }
};
