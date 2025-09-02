import axios from "axios";
import { IVerifyResponse, IUser } from "@/types/auth";
import { clearAuthData } from "./clearAuthData";

export const checkAuthStatus = async (
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
          username: data.data.user.username,
          avatar: data.data.user.avatar ?? undefined,
        });

        document.cookie = `token=${storedToken}; path=/; max-age=${
          7 * 24 * 60 * 60
        }; Secure; SameSite=Strict`;
      } else {
        clearAuthData();
      }
    } 
  } catch (error) {
    console.error("Auth check failed:", error);
    clearAuthData();
  } finally {
    setIsLoading(false);
  }
};
