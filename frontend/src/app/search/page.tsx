"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/api/client";
import { PostCard } from "@/components/features/PostCard";
import { Search, Users, FileText, User as UserIcon } from "lucide-react";
import Link from "next/link";

type Tab = "posts" | "communities" | "people";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";

  const [tab, setTab] = useState<Tab>("posts");
  const [results, setResults] = useState<{ posts: any[]; communities: any[]; users: any[] }>({
    posts: [],
    communities: [],
    users: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    apiClient
      .get(`/search?query=${encodeURIComponent(query)}`)
      .then((res) => {
        if (res.data.success) setResults(res.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query]);

  const TABS: { key: Tab; label: string; icon: React.ElementType; count: number }[] = [
    { key: "posts", label: "Posts", icon: FileText, count: results.posts.length },
    { key: "communities", label: "Communities", icon: Users, count: results.communities.length },
    { key: "people", label: "People", icon: UserIcon, count: results.users.length },
  ];

  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
        <Search className="h-10 w-10 text-dim" />
        <p className="text-sm text-dim">Type something in the search bar to get started.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-5">
      <h1 className="text-lg font-bold mb-1">
        Results for <span className="text-accent">"{query}"</span>
      </h1>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-subtle mb-5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t.key
                ? "border-accent text-foreground"
                : "border-transparent text-dim hover:text-foreground"
            }`}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
            <span className="text-[11px] bg-surface px-1.5 py-0.5 rounded-full">{t.count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center pt-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-subtle border-t-accent" />
        </div>
      ) : (
        <>
          {/* Posts tab */}
          {tab === "posts" && (
            <div className="space-y-4">
              {results.posts.length === 0 ? (
                <p className="text-center text-sm text-dim py-12">No posts found for "{query}".</p>
              ) : (
                results.posts.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    content={post.content}
                    image={post.image}
                    author={post.author || { id: "unknown", username: "unknown" }}
                    community={post.community}
                    createdAt={post.createdAt}
                    _count={post._count}
                  />
                ))
              )}
            </div>
          )}

          {/* Communities tab */}
          {tab === "communities" && (
            <div className="space-y-3">
              {results.communities.length === 0 ? (
                <p className="text-center text-sm text-dim py-12">No communities found for "{query}".</p>
              ) : (
                results.communities.map((c) => (
                  <Link key={c.id} href={`/c/${c.id}`}>
                    <div className="flex items-center gap-4 p-4 bg-elevated border border-subtle rounded-xl hover:border-dim transition-colors">
                      <div className="h-11 w-11 rounded-xl bg-theme-gradient flex items-center justify-center text-gray-900 text-lg font-black shrink-0">
                        {c.name[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">c/{c.name}</p>
                        <p className="text-xs text-dim truncate mt-0.5">{c.description}</p>
                      </div>
                      <span className="text-xs font-semibold text-accent shrink-0">{c.category}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* People tab */}
          {tab === "people" && (
            <div className="space-y-3">
              {results.users.length === 0 ? (
                <p className="text-center text-sm text-dim py-12">No people found for "{query}".</p>
              ) : (
                results.users.map((u) => (
                  <Link key={u.id} href={`/profile/${u.id}`}>
                    <div className="flex items-center gap-4 p-4 bg-elevated border border-subtle rounded-xl hover:border-dim transition-colors">
                      <div className="h-11 w-11 rounded-full bg-theme-gradient flex items-center justify-center text-gray-900 text-sm font-bold shrink-0 overflow-hidden">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.username} className="h-full w-full object-cover" />
                        ) : (
                          u.username?.[0]?.toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">@{u.username}</p>
                        {u.bio && <p className="text-xs text-dim truncate mt-0.5">{u.bio}</p>}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-subtle border-t-accent" />
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
