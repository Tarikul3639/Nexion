import axios from "axios";
import { ILoginResponse, IUser } from "@/types/auth";

// Login function
export const loginUser = async (
  email: string,
  password: string,
  rememberMe: boolean,
  setUser: (user: IUser | null) => void,
  setIsLoading: (val: boolean) => void
): Promise<{ success: boolean; message: string }> => {
  try {
    setIsLoading(true);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
      { email, password }
    );

    const data = response.data as ILoginResponse;

    if (response.status === 200 && data.success) {
      const { user, token } = data.data;

      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("token", token);
      }

      document.cookie = `token=${token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }; Secure; SameSite=Strict`;

      setUser(user);
      return { success: true, message: data.message };
    }

    return { success: false, message: data.message };
  } catch (error: unknown) {
    const message = "Login failed";
    const err = error as {
      response?: { data?: { message: string } };
      message?: string;
    };
    return {
      success: false,
      message: err.response?.data?.message || err.message || message,
    };
  } finally {
    setIsLoading(false);
  }
};
