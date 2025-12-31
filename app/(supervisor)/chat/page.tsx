"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Plus,
  Send,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  User,
  Bot,
} from "lucide-react";
import { chatConversations as initialConversations } from "@/lib/mock-data";
import { format, parseISO } from "date-fns";
import { ChatConversation, ChatMessage } from "@/lib/types";

export default function ChatPage() {
  const [conversations, setConversations] =
    useState<ChatConversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(initialConversations[0]?.id || null);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages]);

  const createNewConversation = () => {
    const newConversation: ChatConversation = {
      id: `chat-${Date.now()}`,
      title: "New Conversation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newConversation.id);
  };

  const deleteConversation = (id: string) => {
    setConversations(conversations.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(conversations[0]?.id || null);
    }
  };

  const startEditingTitle = (conversation: ChatConversation) => {
    setEditingTitleId(conversation.id);
    setEditingTitle(conversation.title);
  };

  const saveTitle = () => {
    if (editingTitleId) {
      setConversations(
        conversations.map((c) =>
          c.id === editingTitleId
            ? { ...c, title: editingTitle, updatedAt: new Date().toISOString() }
            : c
        )
      );
      setEditingTitleId(null);
    }
  };

  const cancelEditingTitle = () => {
    setEditingTitleId(null);
    setEditingTitle("");
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !activeConversationId) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    const currentInput = inputMessage;
    const currentConversation = conversations.find(
      (c) => c.id === activeConversationId
    );

    // Add user message
    setConversations(
      conversations.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              messages: [...c.messages, userMessage],
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
    setInputMessage("");
    setIsLoading(true);

    try {
      // Call the real Gemini API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...(currentConversation?.messages || []), userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                messages: [...c.messages, assistantMessage],
                updatedAt: new Date().toISOString(),
                // Update title for new conversations
                title:
                  c.messages.length === 0
                    ? currentInput.slice(0, 30) +
                      (currentInput.length > 30 ? "..." : "")
                    : c.title,
              }
            : c
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content:
          "❌ Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                messages: [...c.messages, errorMessage],
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-0px)]">
      {/* Sidebar - Conversation List */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <button
            onClick={createNewConversation}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <p className="text-center text-slate-700 py-8 text-sm">
              No conversations yet
            </p>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative rounded-lg transition-colors ${
                    activeConversationId === conversation.id
                      ? "bg-orange-50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  {editingTitleId === conversation.id ? (
                    <div className="flex items-center gap-1 p-2">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-slate-200 rounded"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveTitle();
                          if (e.key === "Escape") cancelEditingTitle();
                        }}
                      />
                      <button
                        onClick={saveTitle}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditingTitle}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveConversationId(conversation.id)}
                      className="w-full text-left p-3"
                    >
                      <div className="flex items-start gap-2">
                        <MessageSquare
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            activeConversationId === conversation.id
                              ? "text-orange-500"
                              : "text-slate-400"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              activeConversationId === conversation.id
                                ? "text-orange-700"
                                : "text-slate-700"
                            }`}
                          >
                            {conversation.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {format(
                              parseISO(conversation.updatedAt),
                              "MMM d, h:mm a"
                            )}
                          </p>
                        </div>
                      </div>
                    </button>
                  )}

                  {editingTitleId !== conversation.id && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingTitle(conversation);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conversation.id);
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">
                    {activeConversation.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Powered by Gemini 2.0 Flash
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeConversation.messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Safety AI Assistant
                  </h3>
                  <p className="text-slate-700 max-w-md mb-6">
                    Ask me about compliance rates, incident analysis, training
                    status, or any safety-related questions about your
                    organization.
                  </p>
                  <div className="grid grid-cols-2 gap-3 max-w-lg">
                    {[
                      "What is our current compliance rate?",
                      "Show me recent incidents",
                      "Who has overdue training?",
                      "Which employees are at risk?",
                    ].map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => setInputMessage(suggestion)}
                        className="p-3 text-left text-sm text-slate-700 bg-white rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {activeConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${
                        message.role === "user" ? "justify-end" : ""
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-orange-500" />
                        </div>
                      )}
                      <div
                        className={`max-w-2xl rounded-xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-orange-500 text-white"
                            : "bg-white shadow-sm"
                        }`}
                      >
                        <div
                          className={`text-sm whitespace-pre-line ${
                            message.role === "user"
                              ? "text-white"
                              : "text-slate-700"
                          }`}
                        >
                          {message.content.split("\n").map((line, i) => {
                            if (line.startsWith("**") && line.endsWith("**")) {
                              return (
                                <p
                                  key={i}
                                  className="font-semibold mt-3 first:mt-0"
                                >
                                  {line.replace(/\*\*/g, "")}
                                </p>
                              );
                            }
                            if (line.match(/^\d+\./)) {
                              return (
                                <p key={i} className="ml-4">
                                  {line}
                                </p>
                              );
                            }
                            if (line.startsWith("- ")) {
                              return (
                                <p key={i} className="ml-4">
                                  {line}
                                </p>
                              );
                            }
                            return <p key={i}>{line}</p>;
                          })}
                        </div>
                        <p
                          className={`text-xs mt-2 ${
                            message.role === "user"
                              ? "text-orange-200"
                              : "text-slate-500"
                          }`}
                        >
                          {format(parseISO(message.timestamp), "h:mm a")}
                        </p>
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-slate-600" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-orange-500" />
                      </div>
                      <div className="bg-white shadow-sm rounded-xl px-4 py-3">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="bg-white border-t border-slate-200 p-4">
              <div className="max-w-4xl mx-auto flex gap-4">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask about compliance, incidents, training, or employees..."
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-700">
                Select a conversation or start a new chat
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
