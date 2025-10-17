import axios from "axios";
import { IUser } from "@/types/auth";

interface ILoginResponseUser {
  id: string;
  email: string;
  username: string;
}

interface ILoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: ILoginResponseUser;
  };
}

// Login function
export const loginUser = async (
  email: string,
  password: string,
  rememberMe: boolean,
  setUser: (user: IUser | null) => void,
  setToken: (token: string | null) => void,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
      { email, password, device: navigator.userAgent },
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
      setToken(token); // Also set the token in the context
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
  }
};
