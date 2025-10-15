"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Camera, Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext/index";

const INPUT_BUTTON_CLASSES =
  "bg-zinc-800 rounded border-zinc-700 text-white focus-visible:ring-0 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-within:shadow-xs focus-within:shadow-blue-500";

export function GeneralSection() {
  const { user, setUser, token } = useAuth();
  const { uploadProfilePhoto, updateProfile } = useProfile();
  
  // Avatar states
  const [avatarError, setAvatarError] = useState<boolean>(false);
  const [avatarMessage, setAvatarMessage] = useState<string | null>(null);
  const [avatarIsLoading, setAvatarIsLoading] = useState(false);
  
  // Profile update states
  const [profileError, setProfileError] = useState<boolean>(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || "Nexion",
    username: user?.username || "Nexion",
    bio:
      user?.bio ||
      "Educator and AI enthusiast. Building the future of learning.",
  });
  
  //  Avatar input button ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle avatar uploading
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return null;

    if (!user?.id || !token) {
      setAvatarError(true);
      setAvatarMessage("User information not available");
      return;
    }

    setAvatarIsLoading(true);
    setAvatarMessage(null);

    try {
      const response = await uploadProfilePhoto(file, user.id, token);

      if (response.success) {
        setAvatarError(false);
        setAvatarIsLoading(false);
        setAvatarMessage("Profile photo uploaded successfully");
        setUser((prevUser) =>
          prevUser
            ? { ...prevUser, avatar: response.url || prevUser.avatar }
            : prevUser
        );
        // You might want to refresh user data here or handle UI updates
      } else {
        setAvatarError(true);
        setAvatarIsLoading(false);
        setAvatarMessage(response.message || "Failed to upload photo");
      }
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message: string } };
        message?: string;
      };
      setAvatarIsLoading(false);
      setAvatarError(true);
      setAvatarMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload photo"
      );
    }
  };

  // Handle profile info update
  const handleInfoChange = async () => {
    if (!token) {
      setProfileError(true);
      setProfileMessage("Authentication token not found. Please login again.");
      return;
    }

    setIsUpdating(true);
    setProfileMessage(null);

    try {
      // Prepare data for the API
      const profileData = {
        id: user?.id,
        name: userData.name,
        username: userData.username,
        bio: userData.bio,
      };

      // Call the updateProfile method from ProfileContext
      const response = await updateProfile(profileData, token);

      if (response.success) {
        setProfileError(false);
        setProfileMessage("Profile updated successfully");

        // Update the global user state if needed
        if (user && setUser) {
          setUser((prevUser) => {
            if (!prevUser) return null;
            return {
              ...prevUser,
              name: userData.name,
              username: userData.username,
              bio: userData.bio,
            };
          });
        }
      } else {
        setProfileError(true);
        setProfileMessage(response.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setProfileError(true);
      setProfileMessage("An error occurred while updating your profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div className="flex items-start gap-6">
          <div className="relative group rounded-2xl overflow-hidden">
            <Avatar className="w-24 h-24 rounded-2xl">
              <AvatarImage
                src={user?.avatar || "/placeholder.svg?height=96&width=96"}
              />
              <AvatarFallback className="bg-blue-600 text-white text-3xl rounded-2xl uppercase font-bold">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">
              Profile Picture
            </h3>
            <p className="text-sm text-zinc-400 mb-3">
              Upload a new profile picture. Recommended size: 400x400px
            </p>
            {avatarMessage && (
              <div
                className={`mb-4 p-3 text-sm rounded bg-blue-900/20 border ${
                  avatarError
                    ? "border-red-500/50 text-red-400 bg-red-500/5"
                    : "border-blue-500/50 text-blue-400"
                }`}
              >
                {avatarMessage}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-white hover:text-white bg-zinc-800 hover:bg-zinc-700 active:scale-95 transition-all duration-200 rounded border border-neutral-800"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarIsLoading}
              >
                {avatarIsLoading ? <Loader className="animate-spin" /> : "Upload"}
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Full Name
          </Label>
          <Input
            id="name"
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
            value={userData.name}
            className={INPUT_BUTTON_CLASSES}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-white">
            Username
          </Label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-zinc-800 border border-neutral-700 rounded px-3 focus-within:ring-0 focus-within:ring-blue-500 focus-within:border-blue-500 focus-within:shadow-xs focus-within:shadow-blue-500 text-base">
              <span className="text-neutral-500">nexion.app/</span>
              <input
                id="username"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, username: e.target.value }))
                }
                value={userData.username}
                className="flex-1 bg-transparent border-0 outline-none text-white px-1 py-2"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            defaultValue={user?.email || ""}
            className={INPUT_BUTTON_CLASSES}
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-white">
            Bio
          </Label>
          <Textarea
            id="bio"
            rows={3}
            name="bio"
            onChange={(e) => {
              setUserData((prev) => ({ ...prev, bio: e.target.value }));
            }}
            value={userData.bio}
            className={`${INPUT_BUTTON_CLASSES} resize-none`}
          />
          <p className="text-xs text-neutral-500">
            Brief description for your profile
          </p>
        </div>

        {profileMessage && (
          <div
            className={`mb-4 p-3 text-sm rounded bg-blue-900/20 border ${
              profileError
                ? "border-red-500/50 text-red-400 bg-red-500/5"
                : "border-blue-500/50 text-blue-400"
            }`}
          >
            {profileMessage}
          </div>
        )}
        <div className="flex justify-end">
          <Button
            onClick={handleInfoChange}
            disabled={isUpdating}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded active:scale-95 transition-all"
          >
            {isUpdating ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
