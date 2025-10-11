"use client";

import axios from "axios";
import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BotMessageSquare, ArrowLeft } from "lucide-react";
import { Stepper } from "./Stepper";
import { EmailStep } from "./EmailStep";
import { OTPStep } from "./OTPStep";
import { PasswordStep } from "./PasswordStep";
import { SuccessStep } from "./SuccessStep";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const [passwordResetToken, setPasswordResetToken] = useState<string | null>(null);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError(false);

    try {
      const response = await axios.post<{ success: boolean; message?: string }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgot-password`,
        { email }
      );

      if (response.status === 200 && response.data.success) {
        // console.log("Response:", response);
        setStep(2);
        setMessage("OTP sent successfully! Please check your email.");
      } else {
        setMessage(response.data.message || "Failed to send OTP. Try again.");
        setError(true);
      }
    } catch (err: any) {
      // Safely read an error message from the Axios error if present, otherwise use a fallback.
      setMessage(
        err?.response?.data?.message || "Failed to send OTP. Try again."
      );
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError(false);

    try {
      const response = await axios.post<{ success: boolean; message?: string; passwordResetToken: string }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-otp`,
        { email, otp }
      );
      if (response.status === 200 && response.data.success) {
        setStep(3);
        setMessage("OTP verified successfully! Set your new password.");
        console.log("Response:", response.data.passwordResetToken);
        setPasswordResetToken(response.data.passwordResetToken);
      } else {
        setMessage(response.data.message || "Invalid OTP. Try again.");
        setError(true);
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Invalid OTP. Try again.");
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError(false);

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsSubmitting(false);
      setError(true);
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setIsSubmitting(false);
      setError(true);
      return;
    }

    try {
      const response = await axios.post<{ success: boolean; message?: string; }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password`,
        { email, newPassword, passwordResetToken }
      );

      if (response.status === 200 && response.data.success) {
        setStep(4);
        setMessage("");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2500);
      } else {
        setMessage(
          response.data.message || "Failed to reset password. Try again."
        );
        setError(true);
      }
    } catch (err: any) {
      setMessage(
        err?.response?.data?.message || "Failed to reset password. Try again."
      );
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] flex items-center justify-center p-4">
      <Card className="border-none pb-8 bg-neutral-900/50 ring-1 ring-neutral-800 w-full max-w-md gap-0">
        <CardHeader className="text-center p-4 space-y-2">
          <Link href="/" className="flex justify-center items-center group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-sm flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              <BotMessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold ml-2 bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
              Nexion
            </span>
          </Link>

          <div className="space-y-1">
            <h1 className="text-[18px] font-semibold text-neutral-100 tracking-tight">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Verify 6-Digit OTP"}
              {step === 3 && "Set New Password"}
              {step === 4 && "Password Reset Successful"}
            </h1>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm mx-auto">
              {step === 1 && "Enter your email to receive a reset code."}
              {step === 2 && "Enter the OTP sent to your email."}
              {step === 3 && "Enter and confirm your new password."}
              {step === 4 && "Your password has been reset successfully."}
            </p>
          </div>
        </CardHeader>

        {step !== 4 && <Stepper currentStep={step} />}

        <CardContent>
          {message && (
            <div
              className={`mb-4 p-3 text-sm rounded-md bg-blue-900/20 border ${
                error
                  ? "border-red-500/50 text-red-400 bg-red-500/5"
                  : "border-blue-500/50 text-blue-400"
              }`}
            >
              {message}
            </div>
          )}

          {step === 1 && (
            <EmailStep
              email={email}
              setEmail={setEmail}
              onSubmit={handleSendOTP}
              isSubmitting={isSubmitting}
            />
          )}

          {step === 2 && (
            <OTPStep
              otp={otp}
              setOtp={setOtp}
              onSubmit={handleVerifyOTP}
              isSubmitting={isSubmitting}
            />
          )}

          {step === 3 && (
            <PasswordStep
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              onSubmit={handleSetPassword}
              isSubmitting={isSubmitting}
            />
          )}

          {step === 4 && <SuccessStep />}

          <Link
            href="/auth/login"
            className="text-blue-500 hover:text-blue-400 font-medium text-sm flex items-center justify-center"
          >
            <ArrowLeft className="inline w-4 h-4 mr-1" />
            Back to Login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
