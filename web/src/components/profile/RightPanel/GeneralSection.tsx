"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const INPUT_BUTTON_CLASSES =
  "bg-zinc-800 rounded border-zinc-700 text-white focus-visible:ring-0 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-within:shadow-xs focus-within:shadow-blue-500";

export function GeneralSection() {
  return (
    <div className="space-y-8">
      <Card className="p-6 bg-neutral-900 border-neutral-800">
        <div className="flex items-start gap-6">
          <div className="relative group rounded-2xl overflow-hidden">
            <Avatar className="w-24 h-24 rounded-2xl">
              <AvatarImage src="/placeholder.svg?height=96&width=96" />
              <AvatarFallback className="bg-blue-600 text-white text-3xl rounded-2xl uppercase font-bold">
                JD
              </AvatarFallback>
            </Avatar>
            <button className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-white hover:text-white bg-red-700 hover:bg-red-800 active:scale-95 transition-all rounded"
                onClick={() => console.log("Remove clicked")}
              >
                Remove
              </Button>
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
            defaultValue="John Doe"
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
                defaultValue="johndoe"
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
            defaultValue="john.doe@example.com"
            className={INPUT_BUTTON_CLASSES}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-white">
            Bio
          </Label>
          <Textarea
            id="bio"
            rows={3}
            defaultValue="Educator and AI enthusiast. Building the future of learning."
            className={`${INPUT_BUTTON_CLASSES} resize-none`}
          />
          <p className="text-xs text-neutral-500">
            Brief description for your profile
          </p>
        </div>

        <div className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded active:scale-95 transition-all">
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
