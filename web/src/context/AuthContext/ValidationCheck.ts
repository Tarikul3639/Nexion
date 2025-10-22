import axios, { AxiosError } from "axios";
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

    if (!storedUser || !storedToken) return;

    const response = await axios.get<IVerifyResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`,
      {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
        validateStatus: (status) => status < 500, // Handle 4xx, let 5xx go to catch block (or handle 5xx here)
      }
    );

    const data = response.data;
    const status = response.status;

    if (status === 200 && data.success && data.data.user) {
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
    } // 2. FAILURE: Handle all non-successful outcomes (4xx, or 200/!success)
    else {
      // Clear runtime state for all verification failures
      setUser(null);
      setToken(null);

      // 🛑 CRITICAL LOGOUT DECISION: Clear storage ONLY on definitive auth failure
      if (status === 401 || status === 403 || !data.success) {
        console.warn(`Auth failure (Status: ${status}). Hard logout.`);
        StorageClear();
      } else {
        console.error(
          `Unexpected verification failure (Status: ${status}). State cleared, token kept.`
        );
      }
    }
  } catch (error) {
    // 🚨 NETWORK ERROR or 5xx SERVER ERROR (if not handled by validateStatus)
    const axiosError = error as AxiosError;

    if (
      axiosError.code === "ERR_NETWORK" ||
      (axiosError.response && axiosError.response.status >= 500)
    ) {
      console.error(
        "Auth check failed (Network/Server Error). Token kept.",
        axiosError.message
      ); // 💡 Do nothing with Storage. User stays logged in but temporarily disconnected.
      setUser(null);
      setToken(null);
    } else {
      // Handle other unexpected errors by logging out (e.g., severe client-side config issue)
      console.error(
        "Auth check failed (Fatal Error). Logging out.",
        axiosError
      );
      StorageClear();
    }
  } finally {
    setIsLoading(false);
  }
};
