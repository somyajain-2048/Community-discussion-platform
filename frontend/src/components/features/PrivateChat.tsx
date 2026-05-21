"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";
import { getSocket } from "@/hooks/useSocket";
import { Send, MessageSquare } from "lucide-react";
import Link from "next/link";

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId?: string;
  createdAt: string;
  sender: { id: string; username: string; avatar?: string };
}

interface PrivateChatProps {
  otherUser: { id: string; username: string; avatar?: string };
  className?: string;
}

function Avatar({ user }: { user: { username: string; avatar?: string } }) {
  return (
    <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center bg-theme-gradient text-gray-900 text-xs font-bold shrink-0">
      {user.avatar ? (
        <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
      ) : (
        user.username?.[0]?.toUpperCase()
      )}
    </div>
  );
}

function timeLabel(date: string) {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function PrivateChat({ otherUser, className }: PrivateChatProps) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const knownIds = useRef<Set<string>>(new Set());

  const mergeMessages = useCallback((incoming: ChatMessage[]) => {
    setMessages((prev) => {
      const existing = new Set(prev.map((m) => m.id));
      const fresh = incoming.filter((m) => !existing.has(m.id));
      if (fresh.length === 0) return prev;
      return [...prev, ...fresh];
    });
    incoming.forEach((m) => knownIds.current.add(m.id));
  }, []);

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    setMessages([]);
    knownIds.current = new Set();
    apiClient
      .get(`/message/private/${otherUser.id}`)
      .then((res) => {
        if (res.data.success) {
          const data: ChatMessage[] = res.data.data || [];
          setMessages(data);
          data.forEach((m) => knownIds.current.add(m.id));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [otherUser.id]);

  // Socket — join personal room, listen for incoming private messages
  useEffect(() => {
    if (!user) return;

    const socket = getSocket();

    const joinRoom = () => {
      socket.emit("join", user.id);
    };

    const onMessage = (msg: ChatMessage) => {
      // Only show messages belonging to this conversation
      const isThisConversation =
        (msg.senderId === otherUser.id && msg.receiverId === user.id) ||
        (msg.senderId === user.id && msg.receiverId === otherUser.id);
      if (!isThisConversation) return;

      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        if (knownIds.current.has(msg.id)) return prev;
        knownIds.current.add(msg.id);
        return [...prev, msg];
      });
    };

    socket.on("connect", joinRoom);
    socket.on("receive_private_message", onMessage);

    if (!socket.connected) {
      socket.connect();
    } else {
      joinRoom();
    }

    return () => {
      socket.off("connect", joinRoom);
      socket.off("receive_private_message", onMessage);
    };
  }, [user?.id, otherUser.id]);

  // Reconnect sync — refetch once after socket reconnects to fill gaps
  useEffect(() => {
    if (!user) return;
    const socket = getSocket();

    const onReconnect = () => {
      apiClient
        .get(`/message/private/${otherUser.id}`)
        .then((res) => {
          if (res.data.success) mergeMessages(res.data.data || []);
        })
        .catch(() => {});
    };

    socket.io.on("reconnect", onReconnect);
    return () => { socket.io.off("reconnect", onReconnect); };
  }, [user?.id, otherUser.id, mergeMessages]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !user) return;
    const content = input.trim();
    setInput("");
    inputRef.current?.focus();

    try {
      const res = await apiClient.post("/message/private", {
        receiverId: otherUser.id,
        content,
      });
      if (res.data.success) {
        const msg: ChatMessage = res.data.data;
        knownIds.current.add(msg.id);
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    } catch (err: any) {
      console.error("[PrivateChat] send failed:", err?.response?.data?.message ?? err?.message);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-subtle border-t-accent" />
      </div>
    );
  }

  return (
    <div className={className ?? "flex flex-col h-[calc(100vh-280px)] min-h-[400px] bg-elevated border border-subtle rounded-xl overflow-hidden"}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-2">
            <MessageSquare className="h-10 w-10 text-dim" />
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs text-dim">Say hi to {otherUser.username}!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isOwn = msg.senderId === user?.id;
            const prevMsg = messages[i - 1];
            const isSameAuthor = prevMsg && prevMsg.senderId === msg.senderId;
            const showMeta = !isSameAuthor;

            return (
              <div key={msg.id} className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
                {showMeta ? (
                  <Link href={`/profile/${msg.sender?.id ?? msg.senderId}`}>
                    <Avatar user={msg.sender ?? { username: "?" }} />
                  </Link>
                ) : (
                  <div className="w-8 shrink-0" />
                )}

                <div className={`max-w-[70%] flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                  {showMeta && (
                    <div className={`flex items-center gap-2 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}>
                      <span className="text-xs font-semibold">
                        {msg.sender?.username ?? (isOwn ? user?.username : otherUser.username)}
                      </span>
                      <span className="text-[10px] text-dim">{timeLabel(msg.createdAt)}</span>
                    </div>
                  )}
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      isOwn
                        ? "bg-accent/20 text-foreground rounded-tr-sm"
                        : "bg-surface text-foreground rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {!showMeta && (
                    <span className="text-[10px] text-dim mt-0.5">{timeLabel(msg.createdAt)}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-subtle p-3 shrink-0">
        <div className="flex items-center gap-2">
          {user && <Avatar user={user} />}
          <div className="flex-1 flex items-center gap-2 bg-surface border border-subtle rounded-xl px-3 py-2 focus-within:border-accent transition-colors">
            <input
              ref={inputRef}
              type="text"
              placeholder={`Message ${otherUser.username}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-dim focus:outline-none"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="h-7 w-7 flex items-center justify-center rounded-lg bg-theme-gradient text-gray-900 disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
