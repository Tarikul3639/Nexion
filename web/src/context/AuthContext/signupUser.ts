import axios from "axios";
import { ISignupResponse } from "@/types/auth";

// Signup function
export const signupUser = async (
  email: string,
  password: string,
  username: string,
  setIsLoading: (val: boolean) => void
): Promise<{ success: boolean; message: string }> => {
  try {
    setIsLoading(true);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
      { email, password, username }
    );

    const data = response.data as ISignupResponse;

    if (response.status === 201 && data.success) {
      return { success: true, message: data.message };
    }

    return { success: false, message: data.message };
  } catch (error: unknown) {
    const message = "Signup failed";

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
