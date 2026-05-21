"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/api/client";
import { Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  author: { username: string };
  community: { name: string } | null;
  createdAt: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await apiClient.get("/admin/posts");
      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await apiClient.delete(`/admin/posts/${id}`);
      if (res.data.success) {
        setPosts(posts.filter((post) => post.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete post", error);
      alert("Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Posts</h1>
        <div className="text-sm text-zinc-400">Total: {posts.length}</div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800">
                <th className="p-4 font-medium text-zinc-400">Title</th>
                <th className="p-4 font-medium text-zinc-400">Author</th>
                <th className="p-4 font-medium text-zinc-400">Community</th>
                <th className="p-4 font-medium text-zinc-400">Created At</th>
                <th className="p-4 font-medium text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-200 truncate max-w-[200px]" title={post.title}>
                    {post.title}
                  </td>
                  <td className="p-4 text-zinc-400">@{post.author.username}</td>
                  <td className="p-4 text-zinc-400">
                    {post.community ? `c/${post.community.name}` : <span className="text-zinc-600">Global</span>}
                  </td>
                  <td className="p-4 text-zinc-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link href={`/post/${post.id}`} target="_blank" className="inline-block p-2 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">
                    No posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
