"use client";

import { useChat } from '@/hooks/useChat';
import ChatHeader from './ChatHeader';
import { Message } from '@/components/message';
import MessageInput from '@/components/input/Input';
import { useRef, useEffect, useState } from 'react';
import { Message as MessageType } from '@/types/message.types';

export default function Chat() {
  const {
    selectedChat,
    messages,
    loading,
    error,
    sendMessage,
    deleteMessage,
    pinMessage,
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState('');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voice, setVoice] = useState<Blob | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleReply = (message: MessageType) => {
    // Handle reply functionality
    console.log('Reply to:', message);
  };

  const handlePin = (message: MessageType) => {
    pinMessage(message.id);
  };

  const handleEdit = (message: MessageType) => {
    // Handle edit - would need additional UI for editing
    console.log('Edit message:', message);
  };

  const handleDelete = (messageId: number) => {
    deleteMessage(messageId);
  };

  const handleReaction = (id: number, emoji: string) => {
    // Handle reaction functionality
    console.log('Reaction to message:', id, 'with emoji:', emoji);
    // TODO: Implement reaction logic - add/remove reactions to/from the message
  };

  const handleSend = async () => {
    console.log('Sending message:', voice);
    if (message.trim() || attachments.length > 0 || voice) {
      // Convert voice blob to file if it exists
      const allAttachments = [...attachments];
      if (voice) {
        const voiceFile = new File([voice], `voice-${Date.now()}.webm`, {
          type: voice.type || 'audio/webm'
        });
        allAttachments.push(voiceFile);
      }
      
      await sendMessage(message, allAttachments);
      setMessage('');
      setAttachments([]);
      setVoice(null);
    }
  };

  const handleAISuggestion = (suggestion: string) => {
    setMessage(suggestion);
    setShowAISuggestions(false);
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Select a chat to start messaging
          </h3>
          <p className="text-gray-500">
            Choose from your existing conversations or start a new one
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader 
        selectedChat={selectedChat} 
        onBack={() => {}} 
      />
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <Message
          messages={messages}
          messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
          onReply={handleReply}
          onPin={handlePin}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReaction={handleReaction}
        />
      )}
      
      <MessageInput 
        message={message}
        setMessage={setMessage}
        onSend={handleSend}
        voice={voice}
        setVoice={setVoice}
        showAISuggestions={showAISuggestions}
        setShowAISuggestions={setShowAISuggestions}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        aiSuggestions={[]}
        onAISuggestion={handleAISuggestion}
        textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
        attachments={attachments}
        setAttachments={setAttachments}
      />
    </div>
  );
}
