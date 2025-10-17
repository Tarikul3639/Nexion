"use client";

import axios from "axios";
import { IUser } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

interface UseGithubAuthProps {
  setUser: (user: IUser) => void;
  setToken: (token: string) => void;
}

export const useGithubAuth = ({ setUser, setToken }: UseGithubAuthProps) => {
  const router = useRouter();

  // Handle GitHub OAuth callback
  const handleGithubCallback = useCallback(
    async (code: string) => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/github-login`,
          { code }
        );

        const data = response.data as {
          success: boolean;
          message: string;
          data?: { token: string; user: IUser };
        };

        if (data.success && data.data) {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("user", JSON.stringify(data.data.user));
          setUser(data.data.user);
          setToken(data.data.token);

          // Clean URL
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          router.push("/");
        } else {
          console.error("GitHub login failed:", data.message);
        }
      } catch (error) {
        console.error("GitHub login error:", error);
      }
    },
    [router, setUser, setToken]
  );

  // Initiate GitHub login
  const loginWithGithub = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    if (!clientId) {
      console.error("GitHub Client ID not configured");
      return;
    }

    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("githubOAuthState", state);

    const githubUrl = new URL("https://github.com/login/oauth/authorize");
    githubUrl.searchParams.append("client_id", clientId);
    githubUrl.searchParams.append("redirect_uri", redirectUri);
    githubUrl.searchParams.append("state", state); // Added state parameter
    githubUrl.searchParams.append("scope", "user:email");

    window.location.href = githubUrl.toString();
  };

  // Check for OAuth callback code
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const savedState = localStorage.getItem("githubOAuthState");

    if (code && state === savedState) {
      handleGithubCallback(code);
    }
  }, [handleGithubCallback]);

  return { loginWithGithub };
};
