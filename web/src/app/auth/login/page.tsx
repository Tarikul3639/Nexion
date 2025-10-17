"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  BotMessageSquare,
  Users,
  GraduationCap,
  Eye,
  LockKeyhole,
  Mail,
  EyeOff,
  Sparkles,
} from "lucide-react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const { login, isLoading, loginWithGoogle, loginWithGithub } =
    useAuth();

   useEffect(() => {
    // If token exists, redirect to home or previous page
    const token = localStorage.getItem("token");
    if (token) {
      // redirect back to previous page
      router.replace("/"); // replace makes back button not go to login page
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { success, message } = await login(email, password, rememberMe);
      if (success) {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get("redirect") || "/";
        
        // Small delay to ensure context updates are propagated before navigation
        setTimeout(() => {
          router.push(redirectTo);
        }, 100);
      } else {
        setError(message);
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      console.error("Login error:", (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SOCIALS = [
    {
      label: "Google",
      icon: (
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
          <path
            fill="#4285F4" // Google blue
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853" // Google green
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05" // Google yellow
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335" // Google red
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      ),
      onClick: () => {
        loginWithGoogle();
      },
    },
    // {
    //   label: "Facebook",
    //   icon: (
    //     <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
    //       <path
    //         fill="#1877F2" // Facebook blue
    //         d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    //       />
    //     </svg>
    //   ),
    //   onClick: () => {
    //     // Facebook sign-in logic
    //   },
    // },
    {
      label: "Github",
      icon: (
        <svg
          className="w-4 h-4 mr-2"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#FFFFFF" // GitHub white
            d="M12 0.297C5.373 0.297 0 5.67 0 12.297c0 5.302 3.438 9.8 8.205 11.387.6.111.82-.261.82-.58 
       0-.287-.011-1.244-.017-2.255-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756
       -1.09-.745.083-.729.083-.729 1.205.085 1.84 1.238 1.84 1.238 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.304.76-1.604
       -2.665-.303-5.466-1.332-5.466-5.93 0-1.31.468-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23
       .957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23
       .655 1.652.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.805 5.625-5.478 5.921.43.372.814 1.102.814 2.222
       0 1.604-.015 2.896-.015 3.289 0 .322.217.697.825.579C20.565 22.092 24 17.594 24 12.297
       24 5.67 18.627.297 12 .297z"
          />
        </svg>
      ),
      onClick: () => {
        loginWithGithub();
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#131313] flex">
      {/* Left Section */}
      <aside className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-neutral-800 to-neutral-950 p-12 items-center justify-center rounded-tr-[10rem] border-r border-blue-500/10">
        <section className="text-center text-neutral-100 max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/25">
            <BotMessageSquare className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
            Welcome back to ChatFly
          </h2>
          <p className="text-neutral-300 text-lg">
            Continue your learning journey with AI-powered classroom & chat
            conversations
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-3 text-neutral-300">
              <Users className="w-5 h-5 text-blue-400" />
              <span>Connect with classmates</span>
            </div>
            <div className="flex items-center space-x-3 text-neutral-300">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              <span>Enhanced learning experience</span>
            </div>
            <div className="flex items-center space-x-3 text-neutral-300">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>Smart AI suggestions</span>
            </div>
          </div>
        </section>
      </aside>

      {/* Right Section - Login Form */}
      <main className="w-full lg:w-1/2 flex items-center justify-center p-2 sm:p-8">
        <div className="w-full max-w-md">
          <Card className="border-none pb-8 bg-neutral-900/50 ring-1 ring-neutral-800">
            <CardHeader className="bg-[#131313]">
              <div className="text-center">
                <Link
                  href="/"
                  className="flex items-center justify-center space-x-2 mb-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-sm flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <BotMessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                    Nexion
                  </span>
                </Link>
                <h1 className="text-2xl font-bold text-neutral-200">
                  Sign in to your account
                </h1>
                <p className="text-neutral-400 mt-2">
                  Welcome back! Please enter your details.
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-md text-red-400 text-sm">
                  {error}
                </div>
              )}
              <form
                onSubmit={handleSubmit}
                className="space-y-4 text-neutral-200"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-neutral-300 text-sm">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-11 bg-neutral-800/80 border-neutral-600/50 text-neutral-100 placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/70 rounded transition-colors"
                    />
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-blue-400" />
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-neutral-300 text-sm"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="px-10 h-11 bg-neutral-800/80 border-neutral-600/50 text-neutral-100 placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/70 rounded transition-colors"
                    />
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockKeyhole className="h-4 w-4 text-blue-400" />
                    </span>
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                      {!showPassword ? (
                        <Eye
                          className="h-4 w-4 text-neutral-500 hover:text-blue-400 transition-colors"
                          onClick={() => setShowPassword(true)}
                        />
                      ) : (
                        <EyeOff
                          className="h-4 w-4 text-neutral-500 hover:text-blue-400 transition-colors"
                          onClick={() => setShowPassword(false)}
                        />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="flex items-center text-neutral-300 text-sm">
                    <Input
                      id="remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 accent-blue-500 bg-neutral-700 border-neutral-600"
                    />
                    <span className="ml-2">Remember Me</span>
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-neutral-400 hover:text-blue-400 text-sm font-medium transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-blue-500/25 transition-all duration-200"
                >
                  {isSubmitting || isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-neutral-400">
                  Don&rsquo;t have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>

              {/* Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-700/50" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-neutral-900/50 text-neutral-400">
                      Or continue with
                    </span>
                  </div>
                </div>
                {/* Social Login Buttons */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {SOCIALS.map(({ label, icon, onClick }) => (
                    <button
                      key={label}
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-neutral-700 rounded-md shadow-sm bg-neutral-800/50 text-sm font-medium text-neutral-300 hover:bg-neutral-800 transition duration-150 ease-in-out"
                      onClick={onClick}
                    >
                      {icon}
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
