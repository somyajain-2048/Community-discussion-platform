"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";
import { PostCard } from "@/components/features/PostCard";
import { Bookmark } from "lucide-react";
import Link from "next/link";

export default function SavedPage() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.push("/login"); return; }

    apiClient
      .get("/saved/my-posts")
      .then((res) => {
        if (res.data.success) setPosts(res.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-subtle border-t-accent" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Bookmark className="h-5 w-5 text-accent" />
        <h1 className="text-lg font-bold">Saved Posts</h1>
        <span className="ml-auto text-xs text-dim">{posts.length} saved</span>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-subtle rounded-xl">
          <Bookmark className="h-10 w-10 text-dim mx-auto mb-3" />
          <h3 className="font-medium mb-1">No saved posts yet</h3>
          <p className="text-sm text-dim mb-5">Posts you save will appear here.</p>
          <Link
            href="/"
            className="inline-flex px-4 py-2 bg-elevated border border-subtle text-sm rounded-lg hover:bg-surface transition-colors"
          >
            Browse posts
          </Link>
        </div>
      ) : (
        posts.map((item) => {
          const post = item.post;
          if (!post) return null;
          return (
            <PostCard
              key={item.id}
              id={post.id}
              title={post.title}
              content={post.content}
              image={post.image}
              author={post.author || { id: "unknown", username: "unknown" }}
              community={post.community}
              createdAt={post.createdAt}
              _count={post._count}
              isLikedInitially={post.isLiked ?? false}
              isSavedInitially={true}
              onDelete={(deletedId) =>
                setPosts((p) => p.filter((x) => x.post?.id !== deletedId))
              }
              onUnsave={(unsavedId) =>
                setPosts((p) => p.filter((x) => x.post?.id !== unsavedId))
              }
            />
          );
        })
      )}
    </div>
  );
}
