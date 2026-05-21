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
  createdAt: string;
  sender: { id: string; username: string; avatar?: string };
}

interface CommunityChatProps {
  communityId: string;
  isMember: boolean;
  /** Override the root container className (e.g. when embedded in Messages page) */
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

export function CommunityChat({ communityId, isMember, className }: CommunityChatProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Track last known message count for polling dedup
  const knownIds = useRef<Set<string>>(new Set());

  // Merge helper — adds only messages not already known
  const mergeMessages = useCallback((incoming: ChatMessage[]) => {
    setMessages((prev) => {
      const existing = new Set(prev.map((m) => m.id));
      const fresh = incoming.filter((m) => !existing.has(m.id));
      if (fresh.length === 0) return prev;
      return [...prev, ...fresh];
    });
    incoming.forEach((m) => knownIds.current.add(m.id));
  }, []);

  // ─── Initial load ────────────────────────────────────────
  useEffect(() => {
    setIsLoading(true);
    knownIds.current = new Set();
    apiClient
      .get(`/message/community/${communityId}`)
      .then((res) => {
        if (res.data.success) {
          const data: ChatMessage[] = res.data.data || [];
          setMessages(data);
          data.forEach((m) => knownIds.current.add(m.id));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [communityId]);

  // ─── Socket setup — re-runs whenever user or communityId changes ─
  useEffect(() => {
    // We need user to join a room
    if (!user) return;

    const socket = getSocket();

    const joinRoom = () => {
      socket.emit("join_community", { userId: user.id, communityId });
    };

    const onMessage = (msg: ChatMessage) => {
      setMessages((prev) => {
        // Skip if already in list OR already added via REST response
        if (prev.some((m) => m.id === msg.id)) return prev;
        if (knownIds.current.has(msg.id)) return prev;
        knownIds.current.add(msg.id);
        return [...prev, msg];
      });
    };

    // Join room after connection
    socket.on("connect", joinRoom);
    socket.on("receive_group_message", onMessage);

    if (!socket.connected) {
      socket.connect();
    } else {
      // Already connected — join immediately
      joinRoom();
    }

    return () => {
      socket.off("connect", joinRoom);
      socket.off("receive_group_message", onMessage);
    };
  }, [user?.id, communityId]); // re-run when user becomes available

  // ─── Reconnect sync — refetch once after socket reconnects to fill gaps ─
  useEffect(() => {
    if (!user) return;
    const socket = getSocket();

    const onReconnect = () => {
      socket.emit("join_community", { userId: user.id, communityId });
      apiClient
        .get(`/message/community/${communityId}`)
        .then((res) => {
          if (res.data.success) mergeMessages(res.data.data || []);
        })
        .catch(() => {});
    };

    socket.io.on("reconnect", onReconnect);
    return () => { socket.io.off("reconnect", onReconnect); };
  }, [user?.id, communityId, mergeMessages]);

  // ─── Auto-scroll ─────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !user || !isMember) return;

    const content = input.trim();
    setInput("");
    inputRef.current?.focus();

    try {
      const res = await apiClient.post("/message/community", { communityId, content });
      if (res.data.success) {
        const real: ChatMessage = res.data.data;
        knownIds.current.add(real.id);
        setMessages((prev) => {
          if (prev.some((m) => m.id === real.id)) return prev;
          return [...prev, real];
        });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "Unknown error";
      console.error("[CommunityChat] send failed:", msg, err?.response?.status);
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
      {/* Header */}
      <div className="px-4 py-3 border-b border-subtle flex items-center gap-2 shrink-0">
        <MessageSquare className="h-4 w-4 text-accent" />
        <span className="text-sm font-semibold">Community Discussion</span>
        <span className="ml-auto text-xs text-dim">{messages.length} messages</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="h-10 w-10 text-dim mb-3" />
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs text-dim mt-1">Be the first to start the discussion!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isOwn = msg.sender?.id === user?.id || msg.senderId === user?.id;
            const prevMsg = messages[i - 1];
            const isSameAuthor =
              prevMsg &&
              (prevMsg.sender?.id === msg.sender?.id || prevMsg.senderId === msg.senderId);
            const showAvatar = !isSameAuthor || !prevMsg;

            return (
              <div key={msg.id} className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
                {showAvatar ? (
                  <Link href={`/profile/${msg.sender?.id || msg.senderId}`}>
                    <Avatar user={msg.sender || { username: "?" }} />
                  </Link>
                ) : (
                  <div className="w-8 shrink-0" />
                )}

                <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                  {showAvatar && (
                    <div className={`flex items-center gap-2 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}>
                      <Link
                        href={`/profile/${msg.sender?.id || msg.senderId}`}
                        className="text-xs font-semibold hover:text-accent transition-colors"
                      >
                        {msg.sender?.username || "Unknown"}
                      </Link>
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
                  {!showAvatar && (
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
        {isAuthenticated && isMember ? (
          <div className="flex items-center gap-2">
            {user && <Avatar user={user} />}
            <div className="flex-1 flex items-center gap-2 bg-surface border border-subtle rounded-xl px-3 py-2 focus-within:border-accent transition-colors">
              <input
                ref={inputRef}
                type="text"
                placeholder="Message the community..."
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
        ) : (
          <div className="text-center py-2 text-sm text-dim">
            {isAuthenticated
              ? "Join this community to participate in discussions"
              : <><Link href="/login" className="text-foreground font-medium hover:underline">Sign in</Link> to chat</>}
          </div>
        )}
      </div>
    </div>
  );
}
