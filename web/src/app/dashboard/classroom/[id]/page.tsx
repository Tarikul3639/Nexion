"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  MoreVertical,
  Pin,
  Reply,
  CheckCheck,
  LoaderCircle,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

// Define types
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Message {
  id: number;
  user: string;
  role: string;
  content: string;
  timestamp: string;
  avatar: string;
}

interface Member {
  name: string;
  role: string;
  status: string;
  avatar: string;
}

export default function ClassroomPage() {
  const params = useParams();
  const router = useRouter();
  const optionsRef = useRef<HTMLDivElement>(null);
  const chatSummaryRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [timestamp, setTimestamp] = useState("");
  const [showChatSummary, setShowChatSummary] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState<number | null>(null);
  const [showMembers, setShowMembers] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: "Dr. Smith",
      role: "teacher",
      content:
        "Welcome everyone! Today we'll be discussing advanced calculus concepts. Feel free to ask questions anytime.",
      timestamp: "10:30 AM",
      avatar: "DS",
    },
    {
      id: 2,
      user: "Alice Johnson",
      role: "student",
      content:
        "Thank you professor! I'm excited to learn about derivatives today.",
      timestamp: "10:32 AM",
      avatar: "AJ",
    },
    {
      id: 3,
      user: "Bob Wilson",
      role: "student",
      content:
        "Could you explain the chain rule again? I'm still a bit confused about it.",
      timestamp: "10:35 AM",
      avatar: "BW",
    },
    {
      id: 4,
      user: "Dr. Smith",
      role: "teacher",
      content:
        "Of course! The chain rule is used when you have a composite function. If you have f(g(x)), then the derivative is f'(g(x)) × g'(x).",
      timestamp: "10:37 AM",
      avatar: "DS",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiSuggestions = [
    "That's a great explanation! Could you provide an example?",
    "I understand now, thank you for clarifying!",
    "Could you elaborate on that concept a bit more?",
  ];

  const members: Member[] = [
    { name: "Dr. Smith", role: "teacher", status: "online", avatar: "DS" },
    { name: "Alice Johnson", role: "student", status: "online", avatar: "AJ" },
    { name: "Bob Wilson", role: "student", status: "online", avatar: "BW" },
    { name: "Carol Davis", role: "student", status: "away", avatar: "CD" },
    { name: "David Lee", role: "student", status: "offline", avatar: "DL" },
    { name: "Emma Brown", role: "student", status: "online", avatar: "EB" },
    { name: "Frank White", role: "student", status: "online", avatar: "FW" },
    { name: "Grace Green", role: "student", status: "away", avatar: "GG" },
    { name: "Hannah Black", role: "student", status: "offline", avatar: "HB" },
    { name: "Ian Gray", role: "student", status: "online", avatar: "IG" },
    { name: "Jack Blue", role: "student", status: "online", avatar: "JB" },
    { name: "Kathy Red", role: "student", status: "away", avatar: "KR" },
    { name: "Liam Yellow", role: "student", status: "offline", avatar: "LY" },
    { name: "Mia Purple", role: "student", status: "online", avatar: "MP" },
    { name: "Noah Orange", role: "student", status: "online", avatar: "NO" },
    { name: "Olivia Pink", role: "student", status: "away", avatar: "OP" },
    { name: "Paul Cyan", role: "student", status: "offline", avatar: "PC" },
    { name: "Quinn Magenta", role: "student", status: "online", avatar: "QM" },
    { name: "Rachel Teal", role: "student", status: "online", avatar: "RT" },
    { name: "Sam Brown", role: "student", status: "away", avatar: "SB" },
  ];

  const classroom = {
    id: params.id,
    name: "Mathematics 101",
    description: "Advanced calculus and algebra",
    members: members.length,
  };

  // Check if user is logged in
  useEffect(() => {
    // const userData = localStorage.getItem("chatfly-user")
    const userData = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "student",
    };
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(userData);
  }, [router]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Outside click handler for closing suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMoreOptions &&
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowMoreOptions(null);
      }

      if (
        showChatSummary &&
        chatSummaryRef.current &&
        !chatSummaryRef.current.contains(event.target as Node)
      ) {
        setShowChatSummary(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMoreOptions, showChatSummary]);

  // Generate timestamp on client side
  useEffect(() => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    setTimestamp(time);
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      user: user?.name || "You",
      role: user?.role || "student",
      content: message,
      timestamp: timestamp, // Use client-generated timestamp
      avatar:
        user?.name
          ?.split(" ")
          .map((n: string) => n[0])
          .join("") || "U",
    };

    setMessages([...messages, newMessage]);
    setMessage("");
    setShowAISuggestions(false);

    // Optionally regenerate new timestamp for next message
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    setTimestamp(time);
  };

  const handleAISuggestion = (suggestion: string) => {
    setMessage(suggestion);
    setShowAISuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) return null;

  return (
    <div className="h-[calc(100vh)] w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Main Chat Area */}
      <div className="relative flex flex-col w-full">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/classroom">
                <Button variant="ghost" size="default">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {classroom.name}
                </h1>
                <p className="text-sm text-gray-500">
                  {classroom.members} members{" "}
                  <span className="text-green-500">• Active now</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Pin className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChatSummary(!showChatSummary)}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isOwnMessage = msg.user === user.name;

            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 group ${
                  isOwnMessage ? "justify-end text-right" : ""
                }`}
              >
                {!isOwnMessage && (
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback
                      className={`text-xs font-semibold ${
                        msg.role === "teacher"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {msg.avatar}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="flex flex-col max-w-[70%] md:max-w-xs lg:max-w-md">
                  <div
                    className={`flex items-center space-x-2 mb-1 ${
                      isOwnMessage
                        ? "justify-start flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {msg.user}
                    </span>
                    {msg.role === "teacher" && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-purple-100 text-purple-600"
                      >
                        Teacher
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {msg.timestamp}
                    </span>
                  </div>
                  <div
                    className={`relative rounded-lg p-3 shadow-sm border flex flex-row space-x-2 ${
                      isOwnMessage
                        ? "bg-blue-100 border-blue-200 text-gray-800 self-end"
                        : "bg-white border-gray-100 text-gray-800"
                    }`}
                  >
                    {/* Message Content */}
                    <p className="text-sm break-words whitespace-pre-wrap break-words overflow-wrap break-all">
                      {msg.content}
                    </p>

                    {/* More Options */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute top-1/2 -translate-y-1/2 transition-opacity group-hover:opacity-100 
                      ${isOwnMessage ? "left-[-3rem]" : "right-[-3rem]"} 
                      ${
                        showMoreOptions === msg.id ? "opacity-100" : "opacity-0"
                      }`}
                      onClick={() =>
                        setShowMoreOptions(
                          showMoreOptions === msg.id ? null : msg.id
                        )
                      }
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>

                    {/* Dropdown (show only for this msg) */}
                    {showMoreOptions === msg.id && (
                      <div
                        ref={optionsRef}
                        className={`absolute top-1/2 ${
                          isOwnMessage ? "-left-[3rem]" : "-right-[3rem]"
                        } translate-y-6 mt-2 z-50 w-32 bg-white border border-gray-200 shadow-md rounded-md`}
                      >
                        <Button
                          variant="ghost"
                          className="block w-full text-left px-4 text-sm text-xs"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          className="block w-full text-left px-4 text-sm text-xs"
                        >
                          Delete
                        </Button>
                        <Button
                          variant="ghost"
                          className="block w-full text-left px-4 text-sm text-xs"
                        >
                          Report
                        </Button>
                      </div>
                    )}

                    {/* Message Status */}
                    {isOwnMessage && (
                      <div className="absolute bottom-3.5 right-1.5">
                        {/* Message delivered */}
                        {isOwnMessage && (
                          <CheckCheck className="w-3 h-3 text-center text-blue-600" />
                        )}
                        {/* Message sending */}
                        {!isOwnMessage && (
                          <LoaderCircle className="w-3 h-3 text-gray-400 animate-spin" />
                        )}
                        {/* Message send status */}
                        {/* {isOwnMessage && (
                          <Check className="w-3 h-3 text-blue-600" />
                        )} */}
                      </div>
                    )}
                  </div>

                  {/* Reply Button */}
                  <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                    >
                      <Reply className="w-3 h-3 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>

                {/* Avatar */}
                {isOwnMessage && (
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="text-xs font-semibold bg-blue-100 text-blue-600">
                      {msg.avatar}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 safe-area-bottom">
          <div className="flex items-end space-x-3 p-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="pr-20 py-3 rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAISuggestions(!showAISuggestions)}
                    className={`h-8 px-2 ${
                      showAISuggestions
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-400 hover:text-blue-600"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-full p-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* AI Suggestions Bar */}
          {showAISuggestions && (
            <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  AI Suggestions
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {aiSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleAISuggestion(suggestion)}
                    className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors flex flex-center space-x-2"
                  >
                    <span className="text-left">{suggestion}</span>
                    <div className="flex space-x-1">
                      <ThumbsUp className="w-3 h-3 text-gray-400 hover:text-green-500 cursor-pointer" />
                      <ThumbsDown className="w-3 h-3 text-gray-400 hover:text-red-500 cursor-pointer" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Chat Summary */}
      {showChatSummary && (
        <div
          ref={chatSummaryRef}
          className="absolute right-0 w-80 bg-white shadow-lg border-l border-gray-200 h-screen flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Chat Summary</h3>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {/* AI Insights */}
            <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>AI Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600">
                  Main topics discussed: Chain rule, derivatives, composite
                  functions
                </p>
              </CardContent>
            </Card>

            {/* Quick Notes */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Quick Notes
              </h4>
              <div className="space-y-2">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                  <p className="text-xs text-yellow-800">
                    Chain rule formula: f&apos;(g(x)) × g&apos;(x)
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                  <p className="text-xs text-green-800">
                    Practice problems assigned for homework
                  </p>
                </div>
              </div>
            </div>

            {/* Pinned Messages */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2 border-b border-gray-200 pb-2">
                Pinned Messages
              </h4>
              <div className="text-xs text-gray-500">
                No pinned messages yet
              </div>
            </div>

            {/* Members */}
            <div className="flex flex-col bg-white rounded-md">
              <div
                className={`flex flex-row justify-between border-b border-gray-200 py-2`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex justify-between text-xs text-gray-500 hover:text-blue-600"
                  onClick={() => setShowMembers(!showMembers)}
                >
                  <span>Members ({members.length})</span>
                  {showMembers ? <ChevronDown /> : <ChevronRight />}
                </Button>
              </div>
              <div
                className={`p-4 space-y-3 ${showMembers ? "block" : "hidden"}`}
              >
                {members.map((member, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback
                          className={`text-xs font-semibold ${
                            member.role === "teacher"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          member.status === "online"
                            ? "bg-green-400"
                            : member.status === "away"
                            ? "bg-yellow-400"
                            : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
