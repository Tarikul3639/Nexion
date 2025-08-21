"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  BookOpen,
  MessageCircle,
  Settings,
  Bell,
  Shield,
  LogOut,
  Loader2Icon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import { toast } from 'sonner'

// Define types
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const { logout, user, token } = useAuth();

  const [data, setData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    role: "Student",
  });

  // Profile context provider call
  const { updateProfile, isLoading } = useProfile();
  // Update profile
  const handleSaveProfile = async () => {
    if (!user) return;
    if (data.username.trim() === "" || 
    data.username.trim() === user.username) return;

    const response = await updateProfile(
      {id: user.id, username: data.username }, 
      token ?? ""
    );

    if (response.success) {
      setData((prev) => ({ ...prev, username: data.username }));
      toast.success("Profile updated successfully!");
    } else {
      console.error(response.message);
      toast.error(response.message);
    }
  };

  const classrooms = [
    {
      name: "Mathematics 101",
      role: "Student",
      joined: "Sep 2024",
      messages: 45,
    },
    { name: "Physics Lab", role: "Student", joined: "Sep 2024", messages: 23 },
    {
      name: "Computer Science",
      role: "Student",
      joined: "Aug 2024",
      messages: 67,
    },
    {
      name: "Literature Club",
      role: "Member",
      joined: "Oct 2024",
      messages: 12,
    },
  ];

  if (!user) return null;

  return (
    <div className="h-[calc(100dvh-4rem)] sm:h-[calc(100dvh)] overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-2xl uppercase font-semibold">
                {data?.username?.slice(0, 2) || data?.email?.slice(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user?.username || "User Profile"}
              </h1>
              <p className="text-gray-600 flex items-center space-x-2">
                <Badge
                  variant="secondary"
                  className={`${
                    data?.role === "teacher"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {data?.role || "Student"}
                </Badge>
                <span>•</span>
                <span className="text-base">{data?.email}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={data?.username || ""}
                      onChange={(e) =>
                        setData({ ...data, username: e.target.value })
                      }
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data?.email || ""}
                      className="h-11"
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className={`${
                        data?.role === "teacher"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {data?.role || "Student"}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Contact admin to change your role
                    </span>
                  </div>
                </div>
                <Button
                  variant="default"
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  {isLoading && <Loader2Icon className="animate-spin" />}
                  {isLoading ?  "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            {/* Activity Overview */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span>Activity Overview</span>
                </CardTitle>
                <CardDescription>
                  Your ChatFly activity and statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {classrooms.length}
                    </div>
                    <div className="text-sm text-blue-700">
                      Classrooms Joined
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {classrooms.reduce((sum, c) => sum + c.messages, 0)}
                    </div>
                    <div className="text-sm text-green-700">Messages Sent</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-sm text-purple-700">
                      AI Suggestions Used
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Classroom History */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  <span>Classroom History</span>
                </CardTitle>
                <CardDescription>
                  All classrooms you&apos;ve joined and your activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classrooms.map((classroom, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {classroom.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {classroom.role} • Joined {classroom.joined}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {classroom.messages} messages
                        </div>
                        <div className="text-xs text-gray-500">sent</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Preferences
                </Button>
                <Separator />
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-blue-800">Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Account Type</span>
                    <Badge className="bg-blue-100 text-blue-800">Free</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Member Since</span>
                    <span className="text-sm text-blue-800">Aug 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Get support or learn more about ChatFly features
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                  >
                    Help Center
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                  >
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
