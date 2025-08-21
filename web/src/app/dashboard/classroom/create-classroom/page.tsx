"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, ArrowLeft, Users, Key, BookOpen } from "lucide-react"

// Define types
interface User {
  id: number;
  name: string;
  email?: string;
  role?: string;
}

export default function CreateClassroomPage() {
  const [user, setUser] = useState<User | null>(null)
  const [classroomName, setClassroomName] = useState("")
  const [description, setDescription] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const router = useRouter()

  useEffect(() => {
    // const userData = localStorage.getItem("chatfly-user")
    const userData = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "student",
    };
    if (!userData) {
      router.push("/auth/login")
      return
    }
    setUser(userData)

    // Generate random invite code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setInviteCode(code)
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate classroom creation
    alert(`Classroom "${classroomName}" created successfully! Invite code: ${inviteCode}`)
    router.push("/classroom")
  }

  const generateNewCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setInviteCode(code)
  }

  if (!user) return null

  return (
    <div className="sm:h-screen flex overflow-y-auto pb-16 sm:pb-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container flex flex-col px-4 py-8 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/classroom">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Classroom</h1>
          </div>
          <p className="text-gray-600">Set up a new classroom space for your students</p>
        </div>

        <div className="flex flex-col md:flex-row space-y-6 md:space-x-6">
          <Card className="shadow-none sm:shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span>Classroom Details</span>
              </CardTitle>
              <CardDescription>Fill in the information below to create your classroom</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="classroomName">Classroom Name *</Label>
                  <Input
                    id="classroomName"
                    type="text"
                    placeholder="e.g., Mathematics 101, Physics Lab, Literature Club"
                    value={classroomName}
                    onChange={(e) => setClassroomName(e.target.value)}
                    required
                    className="h-11"
                  />
                  <p className="text-xs text-gray-500">Choose a clear, descriptive name for your classroom</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this classroom is about, topics covered, or any important information for students..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500">Help students understand what this classroom is for</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Invite Code</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="inviteCode"
                      type="text"
                      value={inviteCode}
                      readOnly
                      className="h-11 bg-gray-50 font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateNewCode}
                      className="h-11 px-4 bg-transparent"
                    >
                      <Key className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Students will use this code to join your classroom. Click the key icon to generate a new code.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">Classroom Features</h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Real-time messaging with AI-powered suggestions</li>
                        <li>• Member management and role assignments</li>
                        <li>• Message threads and pinned announcements</li>
                        <li>• Chat summaries and note-taking tools</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 h-11 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  >
                    Create Classroom
                  </Button>
                  <Link href="/dashboard">
                    <Button type="button" variant="outline" className="h-11 px-8 bg-transparent">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="border-0 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="text-lg text-green-800">💡 Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Use clear, descriptive names that students can easily identify</li>
                <li>• Include course codes or semester information in the name</li>
                <li>• Write a detailed description to set expectations</li>
                <li>• Share the invite code securely with your students</li>
                <li>• You can always edit classroom details after creation</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
