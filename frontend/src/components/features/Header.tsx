"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotifications } from "@/hooks/useNotifications";
import { Search, Bell, Users, LogOut, ChevronDown, User as UserIcon, Heart, MessageSquare, UserPlus, CheckCheck, Shield } from "lucide-react";

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const NOTIF_ICON: Record<string, React.ElementType> = {
  LIKE: Heart,
  COMMENT: MessageSquare,
  REPLY: MessageSquare,
  FOLLOW: UserPlus,
};

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [query, setQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?query=${encodeURIComponent(query.trim())}`);
  };

  const handleNotifClick = (notif: (typeof notifications)[0]) => {
    if (!notif.isRead) markRead(notif.id);
    setShowNotifs(false);
    if (notif.post) router.push(`/post/${notif.post.id}`);
    else if (notif.sender) router.push(`/profile/${notif.sender.id}`);
  };

  return (
    <header className="h-14 shrink-0 flex items-center gap-4 px-4 glass-panel border-b border-subtle z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 w-52 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-theme-gradient">
          <Users className="h-4 w-4 text-gray-900" />
        </div>
        <span className="text-base font-bold tracking-tight">Community.</span>
      </Link>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dim pointer-events-none" />
          <input
            type="text"
            placeholder="Search communities, posts, people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-elevated border border-subtle rounded-lg text-sm text-foreground placeholder:text-dim focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </form>

      {/* Right controls */}
      <div className="ml-auto flex items-center gap-1">
        {isAuthenticated ? (
          <>
            {/* Notifications bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifs((v) => !v)}
                className="relative h-9 w-9 flex items-center justify-center rounded-lg text-dim hover:text-foreground hover:bg-elevated transition-colors"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold leading-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 top-full mt-1.5 w-80 bg-[#1a1a1a] border border-subtle rounded-xl shadow-2xl overflow-hidden z-50">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
                    <p className="text-sm font-semibold">Notifications</p>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="flex items-center gap-1 text-xs text-accent hover:opacity-80 transition-opacity"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 gap-2">
                        <Bell className="h-8 w-8 text-dim" />
                        <p className="text-sm text-dim">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const Icon = NOTIF_ICON[n.type] ?? Bell;
                        return (
                          <button
                            key={n.id}
                            onClick={() => handleNotifClick(n)}
                            className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${
                              !n.isRead ? "bg-accent/5" : ""
                            }`}
                          >
                            {/* Sender avatar */}
                            <div className="relative shrink-0">
                              <div className="h-9 w-9 rounded-full bg-theme-gradient flex items-center justify-center text-gray-900 text-xs font-bold overflow-hidden">
                                {n.sender?.avatar ? (
                                  <img src={n.sender.avatar} alt={n.sender.username} className="h-full w-full object-cover" />
                                ) : (
                                  n.sender?.username?.[0]?.toUpperCase() ?? "?"
                                )}
                              </div>
                              <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
                                <Icon className="h-2.5 w-2.5 text-accent" />
                              </div>
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs leading-relaxed">
                                <span className="font-semibold">{n.sender?.username ?? "Someone"}</span>
                                {" "}{n.message}
                                {n.post && (
                                  <span className="text-dim"> · "{n.post.title}"</span>
                                )}
                              </p>
                              <p className="text-[10px] text-dim mt-0.5">{timeAgo(n.createdAt)}</p>
                            </div>

                            {/* Unread dot */}
                            {!n.isRead && (
                              <div className="h-2 w-2 rounded-full bg-accent shrink-0 mt-1.5" />
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative ml-1" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu((v) => !v)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg hover:bg-elevated transition-colors"
              >
                <div className="h-7 w-7 rounded-full bg-theme-gradient overflow-hidden flex items-center justify-center text-gray-900 text-xs font-bold shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                  ) : (
                    user?.username?.[0]?.toUpperCase()
                  )}
                </div>
                <span className="text-sm font-medium max-w-[100px] truncate">{user?.username}</span>
                <ChevronDown className="h-3 w-3 text-dim" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#1a1a1a] border border-subtle rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-subtle">
                    <p className="text-sm font-semibold truncate">{user?.username}</p>
                    <p className="text-xs text-dim truncate">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <Link
                      href={`/profile/${user?.id}`}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-surface transition-colors"
                    >
                      <UserIcon className="h-3.5 w-3.5 text-dim" />
                      View Profile
                    </Link>
                    {user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-indigo-400 rounded-lg hover:bg-surface transition-colors"
                      >
                        <Shield className="h-3.5 w-3.5" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-surface transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-1.5 text-sm text-dim hover:text-foreground transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-4 py-1.5 bg-theme-gradient text-gray-900 text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
