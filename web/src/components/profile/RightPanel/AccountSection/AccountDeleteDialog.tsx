"use client";

import type React from "react";
import { useState } from "react";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { StorageClear } from "@/context/AuthContext/StorageClear";

const DANGER_BUTTON_CLASSES =
  "w-full justify-start text-red-500 hover:text-red-500 border-red-900/50 hover:bg-red-950/30 bg-transparent active:scale-99 transition-all rounded";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DeleteAccountResponse {
  success: boolean;
  message: string;
}

export const AccountDeleteDialog: React.FC<Props> = ({
  open,
  onOpenChange,
}) => {
  const { token, setUser } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete<DeleteAccountResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/delete-account`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200 && response.data.success) {
        onOpenChange(false);
        StorageClear();
        setUser(null);
      }
      setError(response.data.message);
    } catch (error: unknown) {
      console.error("Error deleting account:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to delete account. Please try again later.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className={DANGER_BUTTON_CLASSES}>
          Delete Account
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-neutral-900 border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-200">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-zinc-400">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>

          {/* Error message Display */}
          {error && (
            <div
              className={`px-3 py-1.5 text-sm rounded bg-blue-900/20 border ${
                error
                  ? "border-red-500/50 text-red-400 bg-red-500/5"
                  : "border-blue-500/50 text-blue-400"
              }`}
            >
              {error}
            </div>
          )}
        </DialogHeader>

        <div className="flex justify-end items-center gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs text-zinc-300 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 active:scale-95 transition-all duration-200 rounded border-neutral-700"
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700 rounded"
            onClick={handleDeleteAccount}
          >
            {isDeleting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
