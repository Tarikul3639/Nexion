"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { MessageInput, ReplyPreview, EditPreview } from "@/components/input";
import { Message } from "@/components/message";
import { ChatHeader } from "@/components/chat";
import { Message as MessageType, ChatFriend } from "@/types";
import Loading from "@/components/ui/loading";
import { useSocket } from "@/context/SocketContext";

export default function ChatConversationPage() {
  // Router and params
  const router = useRouter();
  const params = useParams();

  // State for chat data
  const [selectedChat, setSelectedChat] = useState<ChatFriend | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);

  // State for scroll behavior
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [newMessageCount, setNewMessageCount] = useState(0);

  // State for message input
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [voice, setVoice] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const currentUserId = JSON.parse(
    localStorage.getItem("chatfly-user") || "{}"
  ).id;

  // State for message interactions
  const [replyingTo, setReplyingTo] = useState<MessageType | null>(null);
  const [editingMessage, setEditingMessage] = useState<MessageType | null>(
    null
  );

  // State for AI features
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null!);
  const messagesContainerRef = useRef<HTMLDivElement>(null!);
  const textareaRef = useRef<HTMLTextAreaElement>(null!);
  //  Socket context
  const { socket } = useSocket();

  // Constants
  const aiSuggestions = [
    "That's a great explanation! Could you provide an example?",
    "I understand now, thank you for clarifying!",
    "Could you elaborate on that concept a bit more?",
  ];

  // Scroll utility functions
  const scrollToBottom = useCallback(
    (force = false, smooth = true) => {
      if (force || isAtBottom) {
        messagesEndRef.current?.scrollIntoView({
          behavior: smooth ? "smooth" : "auto",
          block: "end",
        });
      }
    },
    [isAtBottom]
  );

  const checkIfAtBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return true;

    const threshold = 100; // pixels from bottom
    const isBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold;
    setIsAtBottom(isBottom);

    // Reset new message count when at bottom
    if (isBottom && newMessageCount > 0) {
      setNewMessageCount(0);
    }

    return isBottom;
  }, [newMessageCount]);

  const handleScrollToNewMessages = () => {
    scrollToBottom(true);
    setNewMessageCount(0);
  };

  const handleDeleteMessage = (messageId: number) => {
    setMessages(messages.filter((msg) => msg.id !== messageId));
  };

  const handleEditMessage = (messageToEdit: MessageType) => {
    setEditingMessage(messageToEdit);
    setMessage(messageToEdit.content);
    setReplyingTo(null); // Clear reply when editing
    // Focus the textarea after state updates
    setTimeout(() => {
      if (textareaRef?.current && !textareaRef.current.disabled) {
        textareaRef.current.focus();
        // Also ensure the textarea is scrolled into view
        textareaRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 500); // Increased timeout to allow state updates to complete
  };

  const handlePinMessage = (message: MessageType) => {
    setMessages(
      messages.map((msg) =>
        msg.id === message.id ? { ...msg, isPinned: !msg.isPinned } : msg
      )
    );
  };

  const handleReaction = (id: number, emoji: string) => {
    // Update message reactions
    setMessages(
      messages.map((msg) => {
        if (msg.id === id) {
          let reactions = msg.reactions || [];

          // Remove previous reaction from this user (if any)
          reactions = reactions
            .map((r) => ({
              ...r,
              users: r.users.filter((user) => user !== "You"),
              count: r.users.includes("You") ? r.count - 1 : r.count,
            }))
            .filter((r) => r.count > 0); // Remove if count is 0

          // Check if new emoji already exists in reactions
          const existingReaction = reactions.find((r) => r.emoji === emoji);

          if (existingReaction) {
            // Add current user to this reaction
            existingReaction.users.push("You");
            existingReaction.count += 1;
          } else {
            // Add new reaction
            reactions.push({
              emoji,
              count: 1,
              users: ["You"],
              reacted: true,
            });
          }

          return { ...msg, reactions };
        }
        return msg;
      })
    );
  };

  // Reply and edit handling functions
  const handleReply = (messageToReply: MessageType) => {
    if (editingMessage) {
      setEditingMessage(null);
      setMessage("");
    }
    setReplyingTo(messageToReply);
    textareaRef?.current?.focus();
    // Ensure input is visible when replying
    setTimeout(() => {
      textareaRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 500);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setMessage("");
  };

  // AI suggestion functions
  const handleAISuggestion = (suggestion: string) => {
    setMessage(suggestion);
    setShowAISuggestions(false);
    textareaRef?.current?.focus();
  };

  // useEffect hooks

  // Initial scroll to bottom when chat loads
  useEffect(() => {
    if (selectedChat && messages.length > 0) {
      setTimeout(() => {
        scrollToBottom(true, false);
        setIsAtBottom(true);
      }, 100);
    }
  }, [selectedChat, messages.length, scrollToBottom]);

  // Scroll management for message updates
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.isOwn) {
        // Always scroll for own messages (instant)
        setTimeout(() => scrollToBottom(true, false), 0);
      } else {
        // For others' messages, check if user is at bottom
        const wasAtBottom = isAtBottom;
        if (wasAtBottom) {
          setTimeout(() => scrollToBottom(true), 100);
        } else {
          setNewMessageCount((prev) => prev + 1);
        }
      }
    }
  }, [messages, messages.length, isAtBottom, scrollToBottom]);

  // Add scroll listener to container
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      checkIfAtBottom();
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [checkIfAtBottom]);

  const handleSendMessage = () => {
    if (!message.trim() && attachments.length === 0 && !voice) return;

    if (editingMessage) {
      // Update existing message
      setMessages(
        messages.map((msg) =>
          msg.id === editingMessage.id
            ? { ...msg, content: message.trim(), isEdited: true }
            : msg
        )
      );
      setEditingMessage(null);
    } else {
      // Prepare attachments
      const allAttachments = [...attachments];
      if (voice) {
        const voiceFile = new File([voice], `voice-${Date.now()}.webm`, {
          type: voice.type || "audio/webm",
        });
        allAttachments.push(voiceFile);
      }

      const senderId = JSON.parse(
        localStorage.getItem("chatfly-user") || "{}"
      ).id;

      // Emit message to server
      socket?.emit("sendMessage", {
        senderId,
        receiverId: params.id,
        text: message,
        attachments: allAttachments.length > 0 ? allAttachments : undefined,
        replyTo: replyingTo?.id || null,
        timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
      });
    }

    // Reset
    setMessage("");
    setIsRecording(false);
    setAttachments([]);
    setVoice(null);
    setReplyingTo(null);
    textareaRef?.current?.focus();
  };

  // 2) single newMessage listener (useEffect)
  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (data: any) => {
      const msg = data.message;

      setMessages((prevMessages) => {
        // If message already exists, avoid duplicate
        if (prevMessages.some((m) => m.id === msg._id)) return prevMessages;

        const newMessage = {
          id: msg._id,
          sender: msg.sender._id,
          content: msg.content,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          avatar: msg.sender.avatar,
          isOwn: msg.sender._id === currentUserId,
          attachments: msg.attachments || [],
          replyTo: msg.replyTo || undefined,
          role: "student",
          isPinned: msg.isPinned,
        };

        return [...prevMessages, newMessage];
      });

      // auto-scroll if at bottom
      if (isAtBottom) setTimeout(() => scrollToBottom(true, false), 30);
    };

    socket.on("newMessage", onNewMessage);
    return () => {
      socket.off("newMessage", onNewMessage);
    };
  }, [socket, currentUserId, isAtBottom, scrollToBottom]);

  // replace your existing socket-useEffect with this block
  // --- SOCKET: join/create conversation & load messages (robust) ---
  useEffect(() => {
    if (!socket || !params?.id) return;

    const currentUserId = JSON.parse(
      localStorage.getItem("chatfly-user") || "{}"
    ).id;
    const friendId = params.id;

    // Listener আগে বসানো
    const handleConversationFound = (friend: ChatFriend) => {
      console.log(friend);
      setSelectedChat({
        _id: friend._id,
        username: friend.username,
        avatar: friend.avatar,
        status: friend.status,
      });
      setMessages([]);
      scrollToBottom(true, false);
    };

    socket.on("conversationNotFound", handleConversationFound);
    socket.on("conversationFound", (data) => {
      console.log("Conversation found:", data);
      setSelectedChat({
        _id: data.conversation._id,
        username: data.conversation.username,
        avatar: data.conversation.avatar,
        status: data.conversation.status,
      });
      setMessages(
        data.messages.map((msg: any) => ({
          id: msg._id,
          isOwn: msg.sender._id === currentUserId,
          content: msg.content,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          isPinned: msg.isPinned,
        }))
      );
      scrollToBottom(true, false);
    });

    // Emit পরে
    socket.emit("getConversation", { currentUserId, friendId });

    // Cleanup
    return () => {
      socket.off("conversationFound", handleConversationFound);
    };
  }, [socket, params?.id]);

  // Render loading state
  if (!selectedChat) {
    return <Loading />;
  }

  // Main render
  return (
    <div className="flex h-[calc(100dvh)] flex-col w-full z-50 bg-white">
      {/* Chat Header */}
      <ChatHeader selectedChat={selectedChat} />

      {/* Messages */}
      <div className="flex-1 overflow-auto">
        <Message
          messages={messages}
          messagesEndRef={messagesEndRef}
          messagesContainerRef={messagesContainerRef}
          onReply={handleReply}
          onDelete={handleDeleteMessage}
          onEdit={handleEditMessage}
          onPin={handlePinMessage}
          onReaction={handleReaction}
        />

        {/* New messages notification */}
        {!isAtBottom && newMessageCount > 0 && (
          <div className="fixed top-26 left-1/2 transform -translate-x-1/2 z-10">
            <button
              onClick={handleScrollToNewMessages}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-200 flex items-center space-x-2 animate-bounce"
            >
              <span className="text-sm font-medium">
                {newMessageCount} new message{newMessageCount > 1 ? "s" : ""}
              </span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200">
        {/* Edit Preview */}
        {editingMessage && (
          <EditPreview editingMessage={editingMessage} onCancel={cancelEdit} />
        )}

        {/* Reply Preview */}
        {replyingTo && !editingMessage && (
          <ReplyPreview replyingTo={replyingTo} onCancel={cancelReply} />
        )}

        <MessageInput
          message={message}
          setMessage={setMessage}
          onSend={handleSendMessage}
          voice={voice}
          setVoice={setVoice}
          showAISuggestions={showAISuggestions}
          setShowAISuggestions={setShowAISuggestions}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          aiSuggestions={aiSuggestions}
          onAISuggestion={handleAISuggestion}
          textareaRef={textareaRef}
          attachments={attachments}
          setAttachments={setAttachments}
          isEditing={!!editingMessage}
        />
      </div>
    </div>
  );
}
