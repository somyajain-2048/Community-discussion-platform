"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/api/client";
import { Users, Plus, Search } from "lucide-react";

interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  _count?: { members: number };
  members?: { userId: string }[];
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filtered, setFiltered] = useState<Community[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/community")
      .then((res) => {
        if (res.data.success) {
          setCommunities(res.data.data || []);
          setFiltered(res.data.data || []);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      communities.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q)
      )
    );
  }, [search, communities]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Discover Communities</h1>
          <p className="text-sm text-dim mt-0.5">Find and join communities that match your interests.</p>
        </div>
        <Link
          href="/c/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-theme-gradient text-gray-900 text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="h-4 w-4" />
          Create Community
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dim pointer-events-none" />
        <input
          type="text"
          placeholder="Search communities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 bg-elevated border border-subtle rounded-lg text-sm text-foreground placeholder:text-dim focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 rounded-xl bg-elevated border border-subtle animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <CommunityCard key={c.id} community={c} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-subtle rounded-xl">
          <Users className="h-10 w-10 text-dim mx-auto mb-3" />
          <h3 className="font-medium mb-1">
            {search ? "No communities found" : "No communities yet"}
          </h3>
          <p className="text-sm text-dim mb-5">
            {search
              ? `No results for "${search}". Try a different search.`
              : "Be the first to create a community!"}
          </p>
          <Link
            href="/c/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-elevated border border-subtle text-sm rounded-lg hover:bg-surface transition-colors"
          >
            <Plus className="h-4 w-4" /> Create Community
          </Link>
        </div>
      )}
    </div>
  );
}

function CommunityCard({ community: c }: { community: Community }) {
  const memberCount = c._count?.members ?? c.members?.length ?? 0;

  return (
    <Link href={`/c/${c.id}`} className="block group">
      <div className="h-full bg-elevated border border-subtle rounded-xl p-5 hover:border-dim transition-colors flex flex-col gap-3">
        {/* Top */}
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-theme-gradient flex items-center justify-center text-gray-900 font-black text-lg shrink-0">
            {c.name[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm group-hover:text-accent transition-colors truncate">
              c/{c.name}
            </h3>
            <span className="text-[11px] text-dim bg-surface border border-subtle px-2 py-0.5 rounded-full mt-0.5 inline-block">
              {c.category}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-dim line-clamp-2 leading-relaxed flex-1">{c.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-subtle">
          <div className="flex items-center gap-1.5 text-xs text-dim">
            <Users className="h-3.5 w-3.5" />
            <span>{memberCount} {memberCount === 1 ? "member" : "members"}</span>
          </div>
          <span className="text-xs font-semibold text-accent group-hover:underline underline-offset-2">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
