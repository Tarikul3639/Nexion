// src/utils/auth/logoutUser.ts (New File)

import { StorageClear } from "./StorageClear"; // Assuming this path is correct
import axios from 'axios';
import { NextRouter } from 'next/router'; // Next.js 12 router type
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'; // Next.js 13/14 router type

// Use a union type to support both Next.js router versions
type RouterInstance = NextRouter | AppRouterInstance;

/**
 * Handles the client-side logout process:
 * 1. Clears client-side state (user, token).
 * 2. Revokes the session token on the server side (asynchronously).
 * 3. Clears client storage (localStorage/cookies).
 * 4. Redirects the user to the login page.
 */
export const logoutUser = async (
  currentToken: string | null,
  setUser: (user: any | null) => void, // Use 'any' or your specific IUser type
  setToken: (token: string | null) => void,
  router: RouterInstance
): Promise<void> => {

  // --------------------------------
  // 1. IMMEDIATE CLIENT-SIDE CLEARING (For responsive UI)
  // --------------------------------
  setUser(null);
  setToken(null);
  StorageClear();
  
  // Redirect immediately without waiting for the server response
  router.push("/auth/login"); 

  // --------------------------------
  // 2. ASYNCHRONOUS SERVER-SIDE REVOCATION (Security)
  // --------------------------------
  if (currentToken) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${currentToken}`,
          },
        }
      );
      console.log("Server session successfully revoked.");
    } catch (error) {
      // If the server call fails, it means the token was likely already expired
      // or the server is temporarily down. Since the client is logged out,
      // we just log the error and continue.
      console.error("Failed to revoke server session:", (error as any).message);
    }
  }
};