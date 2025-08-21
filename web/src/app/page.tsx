"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BotMessageSquare, Bot, Users, Sparkles, MessageSquareMore } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="container max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <BotMessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ChatFly
            </span>
          </div>
          <div className="space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                Sign Up
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 capitalize">
            Fly through conversations, <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              powered by AI
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Transform your classroom communication with intelligent messaging. Get AI-powered suggestions, organize
            discussions, and enhance learning collaboration.
          </p>

          {/* Hero Illustration */}
          <div className="relative mb-12">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* People chatting */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-bl-sm">Hey everyone! 👋</div>
                  </div>
                  <div className="flex items-center space-x-3 justify-end">
                    <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-br-sm">Ready for today&apos;s lesson?</div>
                    <div className="w-10 min-w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* AI Robot */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                      <Bot className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                </div>

                {/* AI Suggestions */}
                <div className="space-y-3">
                  <div className="text-sm text-gray-500 text-left">AI Suggestions:</div>
                  <div className="space-y-2">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-blue-100 transition-colors">
                      &quot;Great question! Let me explain...&quot;
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-blue-100 transition-colors">
                      &quot;I can help with that topic&quot;
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-blue-100 transition-colors">
                      &quot;Here&apos;s a helpful resource...&quot;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8 py-3 text-lg"
              >
                Open Dashboard
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                size="lg" 
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquareMore className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Chat</h3>
            <p className="text-gray-600">Instant messaging with threaded conversations and file sharing</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Suggestions</h3>
            <p className="text-gray-600">Smart reply suggestions to enhance communication and learning</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Classroom Management</h3>
            <p className="text-gray-600">Organize students and teachers in dedicated classroom spaces</p>
          </div>
        </div>
      </main>
    </div>
  )
}
