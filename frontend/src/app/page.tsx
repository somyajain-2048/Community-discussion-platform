"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";
import { PostCard } from "@/components/features/PostCard";
import { CreatePostModal } from "@/components/features/CreatePostModal";
import { LandingPage } from "@/components/features/LandingPage";
import {
  Users, PenSquare, ArrowRight, TrendingUp, Hash, Compass, Flame, Clock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Post { id: string; title: string; content: string; image?: string; author: { id: string; username: string; avatar?: string }; community?: { id: string; name: string }; createdAt: string; _count?: { likes: number; comments: number }; isLiked?: boolean; isSaved?: boolean; }
interface Community { id: string; name: string; _count?: { members: number }; members?: unknown[]; }

const TRENDING = [
  { tag: "Technology", count: "90K" },
  { tag: "Gaming", count: "9.9K" },
  { tag: "Science", count: "7.9K" },
  { tag: "Design", count: "3.1K" },
  { tag: "Finance", count: "1.9K" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  const [posts, setPosts] = useState<Post[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"latest" | "popular">("latest");

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    const load = async () => {
      try {
        const [postsRes, commRes] = await Promise.all([
          apiClient.get("/post/feed/personalized").catch(() => apiClient.get("/post/")),
          apiClient.get("/community"),
        ]);
        if (postsRes.data.success) setPosts(postsRes.data.data || []);
        if (commRes.data.success) setCommunities((commRes.data.data || []).slice(0, 6));
      } catch {
        try {
          const res = await apiClient.get("/post/");
          if (res.data.success) setPosts(res.data.data || []);
        } catch {}
      } finally {
        setFeedLoading(false);
      }
    };
    load();
  }, [isLoading, isAuthenticated]);

  const handlePostCreated = (newPost: Post) => setPosts((p) => [newPost, ...p]);

  const displayPosts = activeTab === "popular"
    ? [...posts].sort((a, b) => (b._count?.likes ?? 0) - (a._count?.likes ?? 0))
    : posts;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-purple-900/40 border-t-violet-500" />
      </div>
    );
  }

  if (!isAuthenticated) return <LandingPage />;

  return (
    <>
      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      <div className="flex h-full">

        {/* ── Main feed ─────────────────────────────────────── */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-5 py-6 space-y-5">

            {/* Feed header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-0.5">{getGreeting()},</p>
                <h1 className="text-xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                    {user?.username ?? "there"}
                  </span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">Latest discussions from your communities</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  boxShadow: "0 4px 16px rgba(123,92,246,0.35)",
                }}
              >
                <PenSquare className="h-3.5 w-3.5" />
                New Thread
              </button>
            </div>

            {/* Create bar */}
            <button
              onClick={() => setShowModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-purple-900/30 bg-[#0e1020]/60 hover:border-purple-500/40 transition-all text-left group"
              style={{ backdropFilter: "blur(8px)" }}
            >
              <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-bold shrink-0 ring-1 ring-purple-500/20"
                style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                {user?.avatar
                  ? <Image src={user.avatar} alt="you" width={32} height={32} className="h-full w-full object-cover" />
                  : user?.username?.[0]?.toUpperCase()}
              </div>
              <span className="flex-1 text-sm text-slate-500 group-hover:text-slate-400 transition-colors">
                Add a new thread...
              </span>
              <div className="h-7 w-7 rounded-full border border-violet-500/30 bg-violet-500/10 flex items-center justify-center text-violet-400">
                <PenSquare className="h-3.5 w-3.5" />
              </div>
            </button>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl border border-purple-900/30 bg-[#0e1020]/60">
              {([
                { key: "latest", label: "Latest", icon: Clock },
                { key: "popular", label: "Most Popular", icon: Flame },
              ] as const).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === key
                      ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </button>
              ))}
            </div>

            {/* Feed */}
            {feedLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-44 rounded-2xl border border-purple-900/20 bg-[#0e1020]/40 animate-pulse" />
                ))}
              </div>
            ) : displayPosts.length > 0 ? (
              <div className="space-y-3">
                {displayPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    content={post.content}
                    image={post.image}
                    author={post.author || { id: "unknown", username: "unknown" }}
                    community={post.community}
                    createdAt={post.createdAt}
                    _count={post._count}
                    isLikedInitially={post.isLiked ?? false}
                    isSavedInitially={post.isSaved ?? false}
                    onDelete={(id) => setPosts((p) => p.filter((x) => x.id !== id))}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 rounded-2xl border border-dashed border-purple-900/30">
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg, rgba(79,70,229,0.15), rgba(124,58,237,0.15))", border: "1px solid rgba(139,92,246,0.2)" }}
                >
                  <Users className="h-7 w-7 text-violet-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">No posts yet</h3>
                <p className="text-sm text-slate-500 mb-5 max-w-xs mx-auto">
                  Join communities or follow people to fill your feed.
                </p>
                <Link
                  href="/communities"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-purple-900/30 bg-violet-600/10 text-violet-400 text-sm hover:bg-violet-600/20 transition-colors"
                >
                  <Compass className="h-3.5 w-3.5" />
                  Explore Communities
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── Right sidebar ─────────────────────────────────── */}
        <div className="w-72 shrink-0 border-l border-purple-900/30 overflow-y-auto hidden lg:block">
          <div className="p-4 space-y-4">

            {/* Trending Topics */}
            <div
              className="rounded-2xl border border-purple-900/30 overflow-hidden"
              style={{ background: "rgba(14,16,32,0.7)", backdropFilter: "blur(8px)" }}
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-purple-900/25">
                <TrendingUp className="h-3.5 w-3.5 text-violet-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400">Trending</h3>
              </div>
              <div className="p-3 space-y-0.5">
                {TRENDING.map((t, i) => (
                  <button
                    key={t.tag}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-violet-500/8 transition-colors text-left group"
                  >
                    <span
                      className="text-[10px] font-black w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-violet-400"
                      style={{ background: "rgba(124,58,237,0.15)" }}
                    >
                      {i + 1}
                    </span>
                    <Hash className="h-3 w-3 text-slate-600 shrink-0" />
                    <span className="flex-1 text-sm font-medium text-slate-300 group-hover:text-violet-300 transition-colors">{t.tag}</span>
                    <span className="text-[11px] text-slate-600 shrink-0">{t.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Communities */}
            {communities.length > 0 && (
              <div
                className="rounded-2xl border border-purple-900/30 overflow-hidden"
                style={{ background: "rgba(14,16,32,0.7)", backdropFilter: "blur(8px)" }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-purple-900/25">
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-violet-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400">Communities</h3>
                  </div>
                  <Link href="/communities" className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors font-medium">
                    See all
                  </Link>
                </div>
                <div className="p-3 space-y-0.5">
                  {communities.map((c) => (
                    <Link
                      key={c.id}
                      href={`/c/${c.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-violet-500/8 transition-colors group"
                    >
                      <div
                        className="h-8 w-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", boxShadow: "0 2px 8px rgba(123,92,246,0.3)" }}
                      >
                        {c.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-300 truncate group-hover:text-violet-300 transition-colors">
                          c/{c.name}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          {c._count?.members ?? (c.members as unknown[])?.length ?? 0} members
                        </p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-600 opacity-0 group-hover:opacity-100 group-hover:text-violet-400 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Start a community CTA */}
            <div
              className="rounded-2xl p-4 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(79,70,229,0.15) 0%, rgba(124,58,237,0.10) 100%)",
                border: "1px solid rgba(139,92,246,0.25)",
              }}
            >
              {/* Glow blob */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-violet-600/10 blur-xl pointer-events-none" />
              <p className="text-sm font-semibold text-white mb-1 relative">Start a Community</p>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed relative">
                Have a passion to share? Create your own space and invite people.
              </p>
              <Link
                href="/c/create"
                className="block w-full text-center py-2 rounded-xl text-white text-xs font-bold transition-all hover:-translate-y-0.5 relative"
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  boxShadow: "0 4px 16px rgba(123,92,246,0.30)",
                }}
              >
                Create Community
              </Link>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
