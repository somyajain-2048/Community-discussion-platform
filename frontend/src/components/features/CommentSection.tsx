"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";
import { ChevronDown, MoreHorizontal, Send, MessageSquare } from "lucide-react";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; username: string; avatar?: string };
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return `${Math.floor(diff / 60000)}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
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

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;
    setIsSubmitting(true);
    try {
      const res = await apiClient.post("/comment/create", { postId, content: newComment });
      if (res.data.success) {
        setComments((prev) => [res.data.data, ...prev]);
        setNewComment("");
      }
    } catch {}
    finally { setIsSubmitting(false); }
  };

  const handleReplySubmit = async (e: { preventDefault: () => void }, parentId: string) => {
    e.preventDefault();
    if (!replyContent.trim() || !isAuthenticated) return;
    setIsSubmittingReply(true);
    try {
      const res = await apiClient.post("/comment/create", { postId, content: replyContent, parentId });
      if (res.data.success) {
        const newReply = res.data.data;
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: [...(c.replies ?? []), newReply] }
              : c
          )
        );
        setExpandedReplies((prev) => new Set(prev).add(parentId));
        setReplyingTo(null);
        setReplyContent("");
      }
    } catch {}
    finally { setIsSubmittingReply(false); }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    try {
      const res = await apiClient.delete(`/comment/${commentId}`);
      if (res.data.success) {
        const remove = (list: Comment[]): Comment[] =>
          list
            .filter((c) => c.id !== commentId)
            .map((c) => ({ ...c, replies: c.replies ? remove(c.replies) : undefined }));
        setComments((prev) => remove(prev));
        setActiveDropdown(null);
      }
    } catch {}
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`flex gap-3 ${isReply ? "ml-10 mt-3" : "mt-4"}`}>
      <Link href={`/profile/${comment.author.id}`}>
        <Avatar user={comment.author} />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="bg-surface border border-subtle rounded-xl rounded-tl-none px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 mb-1">
              <Link
                href={`/profile/${comment.author.id}`}
                className="text-sm font-semibold hover:text-accent transition-colors"
              >
                {comment.author.username}
              </Link>
              <span className="text-[11px] text-dim">{timeAgo(comment.createdAt)}</span>
            </div>

            {(user?.id === comment.author.id || user?.role === "ADMIN") && (
              <div className="relative shrink-0">
                <button
                  onClick={() =>
                    setActiveDropdown(activeDropdown === comment.id ? null : comment.id)
                  }
                  className="h-6 w-6 flex items-center justify-center rounded text-dim hover:text-foreground hover:bg-elevated transition-colors"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
                {activeDropdown === comment.id && (
                  <div className="absolute right-0 top-7 w-28 bg-elevated border border-subtle rounded-lg shadow-xl z-10 overflow-hidden">
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-surface transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-1 ml-1">
          {isAuthenticated && (
            <button
              onClick={() => {
                setReplyingTo(replyingTo === comment.id ? null : comment.id);
                setReplyContent("");
              }}
              className="text-[11px] font-semibold text-dim hover:text-foreground transition-colors"
            >
              Reply
            </button>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <button
              onClick={() => toggleReplies(comment.id)}
              className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-foreground transition-colors"
            >
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-200 ${
                  expandedReplies.has(comment.id) ? "rotate-180" : ""
                }`}
              />
              {expandedReplies.has(comment.id) ? "Hide" : "View"}{" "}
              {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>

        {/* Reply box */}
        {replyingTo === comment.id && isAuthenticated && user && (
          <form
            onSubmit={(e) => handleReplySubmit(e, comment.id)}
            className="flex gap-3 mt-3"
          >
            <Avatar user={user} />
            <div className="flex-1 relative">
              <textarea
                autoFocus
                placeholder={`Reply to ${comment.author.username}...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className="w-full bg-surface border border-subtle rounded-xl px-3 py-2 pr-20 text-sm text-foreground placeholder:text-dim focus:outline-none focus:border-accent transition-colors resize-none"
              />
              <div className="absolute bottom-2 right-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="px-2 py-1 text-xs text-dim hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReply || !replyContent.trim()}
                  className="px-2.5 py-1 bg-theme-gradient text-gray-900 text-xs font-semibold rounded-lg disabled:opacity-40 hover:opacity-90 transition-opacity"
                >
                  {isSubmittingReply ? "..." : "Reply"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Nested replies — shown only when expanded */}
        {expandedReplies.has(comment.id) &&
          comment.replies?.map((reply) => renderComment(reply, true))}
      </div>
    </div>
  );

  return (
    <div>
      <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
        <MessageSquare className="h-4 w-4 text-accent" />
        Comments
        <span className="text-dim font-normal">({comments.length})</span>
      </h3>

      {isAuthenticated && user ? (
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <Avatar user={user} />
          <div className="flex-1 relative">
            <textarea
              placeholder="What are your thoughts?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="w-full bg-surface border border-subtle rounded-xl px-3 py-2.5 pr-20 text-sm text-foreground placeholder:text-dim focus:outline-none focus:border-accent transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-3 py-1.5 bg-theme-gradient text-gray-900 text-xs font-semibold rounded-lg disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              <Send className="h-3 w-3" />
              {isSubmitting ? "..." : "Post"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 px-4 py-3 rounded-xl bg-surface border border-subtle text-center">
          <p className="text-sm text-dim">
            <Link href="/login" className="text-foreground font-medium hover:underline">
              Sign in
            </Link>{" "}
            to leave a comment
          </p>
        </div>
      )}

      <div>
        {comments.length > 0 ? (
          comments.map((c) => renderComment(c))
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-dim">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}
