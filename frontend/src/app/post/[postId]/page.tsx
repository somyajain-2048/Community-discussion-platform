"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/api/client";
import { PostCard } from "@/components/features/PostCard";
import { CommentSection } from "@/components/features/CommentSection";
import { ArrowLeft } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content?: string;
  image?: string;
  createdAt: string;
  author: { id: string; username: string; avatar?: string };
  community: { id: string; name: string };
  comments: Comment[];
  _count?: { comments: number; likes: number };
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; username: string; avatar?: string };
  replies?: Comment[];
}

export default function PostPage() {
  const params = useParams();
  const postId = params.postId as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    apiClient
      .get(`/post/${postId}`)
      .then((res) => {
        if (res.data.success) setPost(res.data.data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));

    apiClient
      .get(`/comment/post/${postId}`)
      .then((res) => {
        if (res.data.success) setComments(res.data.data);
      })
      .catch(() => {});
  }, [postId]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-subtle border-t-accent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <h2 className="text-xl font-bold">Post not found</h2>
        <Link href="/" className="text-sm text-dim hover:text-foreground transition-colors">
          ← Back to feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back link */}
      <Link
        href={post.community?.id ? `/c/${post.community.id}` : "/"}
        className="inline-flex items-center gap-1.5 text-sm text-dim hover:text-foreground transition-colors mb-5"
      >
        <ArrowLeft className="h-4 w-4" />
        {post.community?.name ? `c/${post.community.name}` : "Back to feed"}
      </Link>

      {/* Post */}
      <PostCard
        id={post.id}
        title={post.title}
        content={post.content}
        image={post.image}
        author={post.author ?? { id: "unknown", username: "unknown" }}
        community={post.community ?? { id: "unknown", name: "unknown" }}
        createdAt={post.createdAt}
        _count={post._count}
      />

      {/* Comments */}
      <div className="mt-4 rounded-xl border border-subtle bg-elevated p-5">
        <CommentSection postId={post.id} initialComments={comments} />
      </div>
    </div>
  );
}
