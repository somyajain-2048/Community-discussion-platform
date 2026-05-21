"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Heart, Bookmark, Share2, Check, MoreHorizontal, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";

interface PostCardProps {
  id: string;
  title: string;
  content?: string;
  image?: string;
  author: { id: string; username: string; avatar?: string };
  community?: { id: string; name: string };
  createdAt: string;
  _count?: { comments: number; likes: number };
  isLikedInitially?: boolean;
  isSavedInitially?: boolean;
  onDelete?: (id: string) => void;
  onUnsave?: (id: string) => void;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function PostCard({
  id, title, content, image, author, community, createdAt, _count,
  isLikedInitially = false, isSavedInitially = false, onDelete, onUnsave,
}: PostCardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(isLikedInitially);
  const [likeCount, setLikeCount] = useState(_count?.likes || 0);
  const [isSaved, setIsSaved] = useState(isSavedInitially);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated) return;
    setIsLiked(!isLiked);
    setLikeCount((p) => isLiked ? p - 1 : p + 1);
    try { await apiClient.post("/like/toggle", { postId: id }); }
    catch { setIsLiked(isLiked); setLikeCount(likeCount); }
  };

  const handleSave = async () => {
    if (!isAuthenticated) return;
    const was = isSaved;
    setIsSaved(!was);
    try {
      await apiClient.post("/saved/toggle", { postId: id });
      if (was) onUnsave?.(id);
    } catch { setIsSaved(was); }
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/post/${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      const res = await apiClient.delete(`/post/${id}`);
      if (res.data.success) onDelete?.(id);
    } catch {}
  };

  return (
    <article
      className="relative rounded-2xl border border-purple-900/30 bg-[#0e1020]/70 overflow-hidden transition-all duration-300 group hover:border-purple-500/40"
      style={{ backdropFilter: "blur(8px)" }}
    >
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5">

        {/* ── Top row: title + community pill + menu ── */}
        <div className="flex items-start gap-3 mb-3">
          <Link href={`/post/${id}`} className="flex-1 min-w-0">
            <h2 className="text-[15px] font-bold leading-snug group-hover:text-violet-300 transition-colors duration-200 line-clamp-2">
              {title}
            </h2>
          </Link>

          <div className="flex items-center gap-2 shrink-0 mt-0.5">
            {community && (
              <Link
                href={`/c/${community.id}`}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/25 hover:bg-violet-500/20 hover:border-violet-400/40 transition-all whitespace-nowrap"
              >
                {community.name}
              </Link>
            )}

            {(user?.id === author.id || user?.role === "ADMIN") && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu((v) => !v)}
                  className="h-7 w-7 flex items-center justify-center rounded-lg text-dim hover:text-foreground hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {showMenu && (
                  <div
                    className="absolute right-0 top-8 z-20 w-36 border border-purple-900/40 rounded-xl shadow-2xl shadow-black/60 overflow-hidden"
                    style={{ background: "rgba(14,16,32,0.98)", backdropFilter: "blur(12px)" }}
                  >
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete post
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Author row ── */}
        <div className="flex items-center gap-2.5 mb-3">
          <Link href={`/profile/${author.id}`} className="shrink-0">
            <div className="h-7 w-7 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold ring-1 ring-purple-500/20">
              {author.avatar
                ? <img src={author.avatar} alt={author.username} className="h-full w-full object-cover" />
                : author.username?.[0]?.toUpperCase()}
            </div>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-dim">
            <Link href={`/profile/${author.id}`} className="font-semibold text-slate-300 hover:text-violet-400 transition-colors">
              {author.username}
            </Link>
            <span className="text-purple-900/80">·</span>
            <span>{timeAgo(createdAt)}</span>
          </div>
        </div>

        {/* ── Content preview ── */}
        {content && (
          <Link href={`/post/${id}`} className="block mb-3">
            <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{content}</p>
          </Link>
        )}

        {/* ── Image ── */}
        {image && (
          <Link href={`/post/${id}`} className="block mb-4 rounded-xl overflow-hidden border border-purple-900/30 max-h-72">
            <img src={image} alt="Post" className="w-full object-cover max-h-72 hover:scale-[1.01] transition-transform duration-300" />
          </Link>
        )}

        {/* ── Action bar ── */}
        <div className="flex items-center gap-1 pt-3 border-t border-purple-900/25">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isLiked
                ? "text-rose-400 bg-rose-500/10 hover:bg-rose-500/15"
                : "text-dim hover:text-rose-400 hover:bg-rose-500/8"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 transition-transform ${isLiked ? "fill-current scale-110" : ""}`} />
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>

          <Link
            href={`/post/${id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-dim hover:text-violet-400 hover:bg-violet-500/8 transition-colors"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {(_count?.comments || 0) > 0 && <span>{_count?.comments}</span>}
            <span>{(_count?.comments || 0) === 0 ? "Respond" : "Responses"}</span>
          </Link>

          <div className="flex-1" />

          <button
            onClick={handleShare}
            title={copied ? "Copied!" : "Copy link"}
            className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all ${
              copied ? "text-violet-400 bg-violet-500/15" : "text-dim hover:text-violet-400 hover:bg-violet-500/10"
            }`}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
          </button>

          <button
            onClick={handleSave}
            className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all ${
              isSaved ? "text-violet-400 bg-violet-500/15 hover:bg-violet-500/20" : "text-dim hover:text-violet-400 hover:bg-violet-500/10"
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </article>
  );
}
