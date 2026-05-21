"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/api/client";
import { Trash2 } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  author: { username: string };
  post: { title: string };
  createdAt: string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await apiClient.get("/admin/comments");
      if (res.data.success) {
        setComments(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await apiClient.delete(`/admin/comments/${id}`);
      if (res.data.success) {
        setComments(comments.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete comment", error);
      alert("Failed to delete comment");
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
        <h1 className="text-2xl font-bold">Manage Comments</h1>
        <div className="text-sm text-zinc-400">Total: {comments.length}</div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800">
                <th className="p-4 font-medium text-zinc-400">Content</th>
                <th className="p-4 font-medium text-zinc-400">Author</th>
                <th className="p-4 font-medium text-zinc-400">Post</th>
                <th className="p-4 font-medium text-zinc-400">Created At</th>
                <th className="p-4 font-medium text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {comments.map((comment) => (
                <tr key={comment.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-200 truncate max-w-[250px]" title={comment.content}>
                    {comment.content}
                  </td>
                  <td className="p-4 text-zinc-400">@{comment.author.username}</td>
                  <td className="p-4 text-zinc-400 truncate max-w-[150px]" title={comment.post.title}>
                    {comment.post.title}
                  </td>
                  <td className="p-4 text-zinc-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {comments.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">
                    No comments found.
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
