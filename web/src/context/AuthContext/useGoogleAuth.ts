"use client";

import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { IUser } from "@/types/auth";
import { useRouter } from "next/navigation";

interface UseGoogleAuthProps {
  setUser: (user: IUser) => void;
  setToken: (token: string) => void;
}

interface GoogleUserInfo {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

export const useGoogleAuth = ({ setUser, setToken }: UseGoogleAuthProps) => {
  const router = useRouter();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch user info from Google
        const googleUserInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userInfo = googleUserInfo.data as GoogleUserInfo;
        // console.log("Google user info fetched:", userInfo);

        // Send token to backend for verification/login
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google-login`,
            {
              token: tokenResponse.access_token,
              email: userInfo.email,
              name: userInfo.name,
              googleId: userInfo.sub,
              avatar: userInfo.picture,
            }
          );

          const data = response.data as {
            success: boolean;
            message: string;
            data?: {
              token: string;
              user: IUser;
            };
          };

          if (data.success && data.data) {
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("user", JSON.stringify(data.data.user));
            setUser(data.data.user);
            setToken(data.data.token);
            router.push("/");
          } else {
            console.error("Google login failed:", data.message);
          }
        } catch (backendError) {
          console.error("Backend authentication error:", backendError);
        }
      } catch (error) {
        console.error("Google user info fetch error:", error);
      }
    },
    onError: (errorResponse) => {
      console.error("Google login error:", errorResponse);
    },
  });

  return { loginWithGoogle };
};
