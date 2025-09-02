"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
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

const SOCIALS = [
  {
    label: "Google",
    icon: (
      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
    onClick: () => {
      // Implement Google sign-in logic here
    },
  },
  {
    label: "Facebook",
    icon: (
      <svg
        className="w-4 h-4 mr-2"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    onClick: () => {
      // Implement Facebook sign-in logic here
    },
  },
];

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { success, message } = await login(email, password, rememberMe);
      if (success) {
        // Get redirect URL from query params or default to dashboard
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirect') || '/';
        router.push(redirectTo);
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

  return (
    <div className="min-h-screen bg-primary flex">
      {/* Left Section */}
      <aside className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 p-12 items-center justify-center rounded-tr-[10rem]">
        <section className="text-center text-white max-w-md">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <BotMessageSquare className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome back to ChatFly</h2>
          <p className="text-blue-100 text-lg">
            Continue your learning journey with AI-powered classroom & chat conversations
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-3 text-blue-100">
              <Users className="w-5 h-5" />
              <span>Connect with classmates</span>
            </div>
            <div className="flex items-center space-x-3 text-blue-100">
              <GraduationCap className="w-5 h-5" />
              <span>Enhanced learning experience</span>
            </div>
            <div className="flex items-center space-x-3 text-blue-100">
              <Sparkles className="w-5 h-5" />
              <span>Smart AI suggestions</span>
            </div>
          </div>
        </section>
      </aside>

      {/* Right Section - Login Form */}
      <main className="w-full lg:w-1/2 flex items-center justify-center p-2 sm:p-8">
        <div className="w-full max-w-md">
          <Card className="sm:shadow-md sm:border border-neutral-800 pb-8 bg-neutral-900">
            <CardHeader className="bg-primary">
              <div className="text-center">
                <Link
                  href="/"
                  className="flex items-center justify-center space-x-2 mb-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <BotMessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Nexion
                  </span>
                </Link>
                <h1 className="text-2xl font-bold text-gray-300">
                  Sign in to your account
                </h1>
                <p className="text-gray-400 mt-2">
                  Welcome back! Please enter your details.
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4 text-gray-300">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-400 text-sm">
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
                      className="pl-10 h-11 border-gray-600 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 rounded"
                    />
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-400 text-sm">
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
                      className="px-10 h-11 border-gray-600 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 rounded"
                    />
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockKeyhole className="h-4 w-4 text-gray-400" />
                    </span>
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                      {!showPassword ? (
                        <Eye
                          className="h-4 w-4 text-gray-400 hover:text-gray-500"
                          onClick={() => setShowPassword(true)}
                        />
                      ) : (
                        <EyeOff
                          className="h-4 w-4 text-gray-400 hover:text-gray-500"
                          onClick={() => setShowPassword(false)}
                        />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="flex items-center text-gray-400 text-sm">
                    <Input
                      id="remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    <span className="ml-2">Remember Me</span>
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Don&rsquo;t have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>

              {/* Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-500" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-neutral-900 text-gray-500">
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
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150 ease-in-out"
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