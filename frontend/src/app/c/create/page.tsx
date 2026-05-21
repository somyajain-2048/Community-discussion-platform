"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/api/client";
import { useAuthStore } from "@/store/useAuthStore";
import { Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  "Technology", "Gaming", "Science", "Sports", "Entertainment",
  "Music", "Art", "Lifestyle", "Politics", "Education", "Other",
];

export default function CreateCommunityPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center px-4">
        <div className="h-14 w-14 rounded-2xl bg-elevated border border-subtle flex items-center justify-center">
          <Users className="h-7 w-7 text-dim" />
        </div>
        <h2 className="text-xl font-bold">Sign in required</h2>
        <p className="text-sm text-dim max-w-xs">You must be logged in to create a community.</p>
        <Link
          href="/login"
          className="px-5 py-2.5 bg-theme-gradient text-gray-900 font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    const finalCategory = category === "Other" ? customCategory : category;
    if (!finalCategory.trim()) { setError("Please select or enter a category."); return; }

    setIsLoading(true);
    try {
      const res = await apiClient.post("/community/create", {
        name,
        description,
        category: finalCategory,
      });
      if (res.data.success) {
        router.push(`/c/${res.data.data.id}`);
      } else {
        setError(res.data.message || "Failed to create community.");
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href="/communities"
        className="inline-flex items-center gap-1.5 text-sm text-dim hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Communities
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Create a Community</h1>
        <p className="text-sm text-dim">Build a space for people to connect, share, and discuss.</p>
      </div>

      <div className="bg-elevated border border-subtle rounded-2xl p-6">
        {error && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">
              Community Name
            </label>
            <div className="flex items-center gap-2 h-10 px-3 bg-surface border border-subtle rounded-lg focus-within:border-accent transition-colors">
              <span className="text-sm text-dim font-medium shrink-0">c/</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value.replace(/\s+/g, "-").toLowerCase())}
                placeholder="community-name"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-dim focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-dim mt-1.5">No spaces. Use hyphens to separate words.</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell people what this community is about..."
              rows={4}
              className="w-full bg-surface border border-subtle rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-dim focus:outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    category === cat
                      ? "bg-accent/15 border-accent/30 text-accent"
                      : "bg-surface border-subtle text-dim hover:text-foreground hover:border-dim"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {category === "Other" && (
              <input
                type="text"
                placeholder="Enter custom category..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="mt-3 w-full h-10 px-3 bg-surface border border-subtle rounded-lg text-sm text-foreground placeholder:text-dim focus:outline-none focus:border-accent transition-colors"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2.5 text-sm text-dim hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name || !description || !category}
              className="px-6 py-2.5 bg-theme-gradient text-gray-900 font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {isLoading ? "Creating..." : "Create Community"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
