"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";
import { CreatePostModal } from "./CreatePostModal";
import {
  Home, Users, Bookmark,
  HelpCircle, Plus, MessageSquare, PenSquare, UserRound,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Feed", href: "/", icon: Home, exact: true },
  { label: "Communities", href: "/communities", icon: Users },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "People", href: "/people", icon: UserRound },
  { label: "Saved", href: "/saved", icon: Bookmark },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const [myCommunities, setMyCommunities] = useState<{ id: string; name: string }[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    apiClient
      .get("/community")
      .then((res) => {
        if (res.data.success) {
          const joined = (res.data.data || []).filter((c: { members?: { userId: string }[] }) =>
            c.members?.some((m) => m.userId === user.id)
          );
          setMyCommunities(joined.slice(0, 6));
        }
      })
      .catch(() => {});
  }, [isAuthenticated, user]);

  return (
    <>
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onPostCreated={() => setShowCreatePost(false)}
        />
      )}

      <aside
        className="w-52 shrink-0 h-full flex flex-col border-r border-purple-900/30 overflow-y-auto"
        style={{ background: "rgba(7,9,15,0.85)", backdropFilter: "blur(18px)" }}
      >
        <div className="p-3 flex-1">

          {/* Create Post button */}
          {isAuthenticated && (
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 mb-4 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)",
                boxShadow: "0 4px 20px rgba(123,92,246,0.35)",
              }}
            >
              <PenSquare className="h-4 w-4 shrink-0" />
              Create Post
            </button>
          )}

          {/* General nav */}
          <p className="px-3 mb-2 mt-1 text-[10px] font-bold text-purple-900/80 uppercase tracking-widest">
            General
          </p>
          <nav className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-white bg-violet-600/20 border border-violet-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-violet-400" />
                  )}
                  <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-violet-400" : ""}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Your communities */}
          {isAuthenticated && (
            <div className="mt-6">
              <div className="flex items-center justify-between px-3 mb-2">
                <p className="text-[10px] font-bold text-purple-900/80 uppercase tracking-widest">
                  Your Communities
                </p>
                <Link
                  href="/c/create"
                  className="text-slate-500 hover:text-violet-400 transition-colors"
                  title="Create community"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="space-y-0.5">
                {myCommunities.length > 0 ? (
                  myCommunities.map((c) => {
                    const isActive = pathname === `/c/${c.id}`;
                    return (
                      <Link
                        key={c.id}
                        href={`/c/${c.id}`}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                          isActive
                            ? "text-white bg-violet-600/15 border border-violet-500/25"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="h-5 w-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                          style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                          {c.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="truncate">{c.name}</span>
                      </Link>
                    );
                  })
                ) : (
                  <p className="px-3 py-2 text-xs text-slate-500">
                    No communities joined yet
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Help at bottom */}
        <div className="p-3 border-t border-purple-900/30">
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <HelpCircle className="h-4 w-4 shrink-0" />
            Help Center
          </Link>
        </div>
      </aside>
    </>
  );
}
