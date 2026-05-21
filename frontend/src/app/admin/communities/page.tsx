"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/api/client";
import { Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Community {
  id: string;
  name: string;
  category: string;
  creator: { username: string };
  visibility: string;
  createdAt: string;
}

export default function AdminCommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const res = await apiClient.get("/admin/communities");
      if (res.data.success) {
        setCommunities(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch communities", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this community? All posts inside it will be lost.")) return;
    try {
      const res = await apiClient.delete(`/admin/communities/${id}`);
      if (res.data.success) {
        setCommunities(communities.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete community", error);
      alert("Failed to delete community");
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
        <h1 className="text-2xl font-bold">Manage Communities</h1>
        <div className="text-sm text-zinc-400">Total: {communities.length}</div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800">
                <th className="p-4 font-medium text-zinc-400">Name</th>
                <th className="p-4 font-medium text-zinc-400">Category</th>
                <th className="p-4 font-medium text-zinc-400">Creator</th>
                <th className="p-4 font-medium text-zinc-400">Visibility</th>
                <th className="p-4 font-medium text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {communities.map((community) => (
                <tr key={community.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-zinc-200">c/{community.name}</td>
                  <td className="p-4 text-zinc-400 capitalize">{community.category}</td>
                  <td className="p-4 text-zinc-400">@{community.creator.username}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      community.visibility === 'PUBLIC' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {community.visibility}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link href={`/c/${community.name}`} target="_blank" className="inline-block p-2 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(community.id)}
                      className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Delete community"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {communities.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">
                    No communities found.
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
