"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/api/client";
import { useAuthStore } from "@/store/useAuthStore";
import { PostCard } from "@/components/features/PostCard";
import { CreatePostModal } from "@/components/features/CreatePostModal";
import { CommunityChat } from "@/components/features/CommunityChat";
import {
  Users, Calendar, Info, CheckCircle, Plus,
  MessageSquare, LayoutList,
} from "lucide-react";
import Link from "next/link";

interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  creatorId: string;
  createdAt: string;
  members: { userId: string }[];
  _count?: { members: number };
}

interface Post {
  id: string;
  title: string;
  content?: string;
  image?: string;
  createdAt: string;
  author: { id: string; username: string; avatar?: string };
  _count?: { comments: number; likes: number };
  isLiked?: boolean;
  isSaved?: boolean;
}

type Tab = "posts" | "chat";

export default function CommunityPage() {
  const params = useParams();
  const router = useRouter();
  const communityId = params.communityId as string;
  const { isAuthenticated, user, isLoading: authLoading } = useAuthStore();

  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActing, setIsActing] = useState(false);
  const [leaveError, setLeaveError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("posts");

  useEffect(() => {
    if (!communityId) return;
    const fetchData = async () => {
      try {
        const [commRes, postsRes] = await Promise.all([
          apiClient.get(`/community/${communityId}`),
          apiClient.get(`/post/community/${communityId}`),
        ]);
        if (commRes.data.success) setCommunity(commRes.data.data);
        if (postsRes.data.success) setPosts(postsRes.data.data || []);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [communityId]);

  // Wait for auth to resolve before computing membership — avoids false negatives
  const isMember = !authLoading && !!user && (community?.members?.some((m) => m.userId === user.id) ?? false);
  const memberCount = community?._count?.members ?? community?.members?.length ?? 0;

  const handleJoin = async () => {
    if (!isAuthenticated) { router.push("/login"); return; }
    setIsActing(true);
    try {
      await apiClient.post(`/community/join/${communityId}`);
      const res = await apiClient.get(`/community/${communityId}`);
      if (res.data.success) setCommunity(res.data.data);
    } catch {
    } finally {
      setIsActing(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm("Leave this community?")) return;
    setIsActing(true);
    setLeaveError("");
    try {
      await apiClient.delete(`/community/leave/${communityId}`);
      const res = await apiClient.get(`/community/${communityId}`);
      if (res.data.success) setCommunity(res.data.data);
    } catch (err: any) {
      setLeaveError(err?.response?.data?.message ?? "Could not leave community.");
    } finally {
      setIsActing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-subtle border-t-accent" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <h2 className="text-xl font-bold">Community not found</h2>
        <Link href="/communities" className="text-sm text-dim hover:text-foreground transition-colors">
          ← Browse communities
        </Link>
      </div>
    );
  }

  return (
    <>
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onPostCreated={(post) => { setPosts((p) => [post as Post, ...p]); setActiveTab("posts"); }}
          defaultCommunityId={communityId}
          defaultCommunityName={community.name}
        />
      )}

      <div className="flex flex-col h-full overflow-y-auto">

        {/* ── Banner ─────────────────────────────────────────── */}
        <div
          className="h-36 w-full shrink-0 relative overflow-hidden"
          style={{ backgroundImage: "var(--theme-gradient)" }}
        >
          {/* subtle noise overlay for depth */}
          <div className="absolute inset-0 bg-black/20" />
          {/* decorative circles */}
          <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 left-1/3 h-32 w-32 rounded-full bg-white/5" />
        </div>

        {/* ── Community header card ──────────────────────────── */}
        <div className="px-6">
          <div className="-mt-10 p-5 bg-[rgba(20,20,20,0.92)] backdrop-blur-xl border border-subtle rounded-2xl shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-start justify-between">

              {/* Left: avatar + info */}
              <div className="flex items-start gap-4">
                <div
                  className="h-18 w-18 rounded-2xl flex items-center justify-center text-gray-900 text-3xl font-black shrink-0 shadow-lg ring-4 ring-[rgba(20,20,20,0.92)]"
                  style={{ backgroundImage: "var(--theme-gradient)", height: 72, width: 72 }}
                >
                  {community.name[0]?.toUpperCase()}
                </div>

                <div className="pt-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-xl font-bold">c/{community.name}</h1>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                      {community.category}
                    </span>
                    {isMember && (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Joined
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-dim leading-relaxed max-w-lg line-clamp-2 mb-2">
                    {community.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-dim">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      <span className="font-semibold text-foreground">{memberCount}</span>
                      {memberCount === 1 ? "member" : "members"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(community.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: actions */}
              <div className="flex items-center gap-2 shrink-0 sm:pt-1">
                {isMember ? (
                  <>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-theme-gradient text-gray-900 text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      New Post
                    </button>
                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={handleLeave}
                        disabled={isActing}
                        className="flex items-center gap-1.5 px-4 py-2 border border-subtle rounded-xl text-sm font-medium text-dim hover:text-red-400 hover:border-red-400/30 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        {isActing ? "Leaving..." : "Leave"}
                      </button>
                      {leaveError && <p className="text-xs text-red-400">{leaveError}</p>}
                    </div>
                  </>
                ) : (
                  <button
                    onClick={handleJoin}
                    disabled={isActing}
                    className="flex items-center gap-1.5 px-5 py-2 bg-theme-gradient text-gray-900 font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {isActing ? "Joining..." : "Join Community"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Tabs ──────────────────────────────────────────── */}
          <div className="flex items-center gap-1 mt-4 p-1 bg-elevated border border-subtle rounded-xl">
            {([
              { key: "posts", label: "Posts", icon: LayoutList, count: posts.length },
              { key: "chat", label: "Discussion", icon: MessageSquare },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-accent/15 text-accent"
                    : "text-dim hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {"count" in tab && tab.count > 0 && (
                  <span className="text-[11px] bg-surface px-1.5 py-0.5 rounded-full font-semibold">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex flex-1 gap-0 px-6 pt-5 pb-6">
          {activeTab === "chat" ? (
            <div className="flex-1 min-w-0">
              <CommunityChat communityId={communityId} isMember={isMember} />
            </div>
          ) : (
            <>
              {/* Posts */}
              <div className="flex-1 min-w-0 space-y-4 pr-6">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      id={post.id}
                      title={post.title}
                      content={post.content}
                      image={post.image}
                      author={post.author || { id: "unknown", username: "unknown" }}
                      community={{ id: community.id, name: community.name }}
                      createdAt={post.createdAt}
                      _count={post._count}
                      isLikedInitially={post.isLiked ?? false}
                      isSavedInitially={post.isSaved ?? false}
                      onDelete={(id) => setPosts((p) => p.filter((x) => x.id !== id))}
                    />
                  ))
                ) : (
                  <div className="text-center py-16 border border-dashed border-subtle rounded-xl">
                    <p className="text-dim text-sm mb-3">No posts yet in this community.</p>
                    {isMember && (
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-elevated border border-subtle text-sm rounded-lg hover:bg-surface transition-colors"
                      >
                        <Plus className="h-4 w-4" /> Create the first post
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* About sidebar */}
              <div className="w-64 shrink-0 hidden lg:block space-y-3">
                <div className="bg-[rgba(20,20,20,0.7)] backdrop-blur-md border border-subtle rounded-2xl overflow-hidden sticky top-4">
                  <div className="px-4 py-3 border-b border-subtle flex items-center gap-2">
                    <Info className="h-3.5 w-3.5 text-accent" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-dim">About</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-dim leading-relaxed mb-4">{community.description}</p>
                    <div className="space-y-2.5 text-xs border-t border-subtle pt-4">
                      {[
                        { label: "Members", value: memberCount },
                        { label: "Posts", value: posts.length },
                        { label: "Category", value: community.category },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <span className="text-dim">{item.label}</span>
                          <span className="font-semibold text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    {!isMember && (
                      <button
                        onClick={handleJoin}
                        disabled={isActing}
                        className="w-full mt-4 py-2 bg-theme-gradient text-gray-900 font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {isActing ? "Joining..." : "Join Community"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
