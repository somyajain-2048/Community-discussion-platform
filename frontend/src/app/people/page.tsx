"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";
import { UserRound, UserPlus, UserCheck, Search, Users } from "lucide-react";
import Link from "next/link";

interface Person {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
}

export default function PeoplePage() {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const router = useRouter();
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.push("/login"); return; }

    apiClient
      .get("/profile/users/all")
      .then((res) => {
        if (res.data.success) setPeople(res.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoading, isAuthenticated, router]);

  const handleToggleFollow = async (personId: string, isFollowing: boolean) => {
    // Optimistic update
    setPeople((prev) =>
      prev.map((p) =>
        p.id === personId
          ? {
              ...p,
              isFollowing: !isFollowing,
              followersCount: isFollowing ? p.followersCount - 1 : p.followersCount + 1,
            }
          : p
      )
    );
    setActing(personId);
    try {
      await apiClient.post(`/follow/toggle/${personId}`);
    } catch {
      // Revert on failure
      setPeople((prev) =>
        prev.map((p) =>
          p.id === personId
            ? {
                ...p,
                isFollowing,
                followersCount: isFollowing ? p.followersCount + 1 : p.followersCount - 1,
              }
            : p
        )
      );
    } finally {
      setActing(null);
    }
  };

  const filtered = people.filter((p) =>
    p.username.toLowerCase().includes(search.toLowerCase()) ||
    (p.bio ?? "").toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading || loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-subtle border-t-accent" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-5 w-5 text-accent" />
          <h1 className="text-xl font-bold">People</h1>
          <span className="ml-auto text-xs text-dim px-2 py-0.5 rounded-full bg-elevated border border-subtle">
            {people.length} members
          </span>
        </div>
        <p className="text-sm text-dim">Discover and connect with people in the community</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dim pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name or bio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 bg-elevated border border-subtle rounded-xl text-sm text-foreground placeholder:text-dim focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-subtle rounded-2xl">
          <UserRound className="h-10 w-10 text-dim mx-auto mb-3" />
          <p className="text-sm text-dim">
            {search ? `No people match "${search}".` : "No other users yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((person) => (
            <div
              key={person.id}
              className="flex items-center gap-4 p-4 bg-elevated border border-subtle rounded-2xl hover:border-dim transition-colors"
            >
              {/* Avatar */}
              <Link href={`/profile/${person.id}`} className="shrink-0">
                <div className="h-12 w-12 rounded-full bg-theme-gradient flex items-center justify-center text-gray-900 text-base font-bold overflow-hidden">
                  {person.avatar ? (
                    <img src={person.avatar} alt={person.username} className="h-full w-full object-cover" />
                  ) : (
                    person.username?.[0]?.toUpperCase()
                  )}
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${person.id}`}>
                  <p className="text-sm font-semibold hover:text-accent transition-colors truncate">
                    {person.username}
                  </p>
                </Link>
                {person.bio && (
                  <p className="text-xs text-dim truncate mt-0.5">{person.bio}</p>
                )}
                {/* Follower / Following counts */}
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[11px] text-dim">
                    <span className="font-semibold text-foreground">{person.followersCount}</span>
                    {" "}follower{person.followersCount !== 1 ? "s" : ""}
                  </span>
                  <span className="text-[11px] text-dim">
                    <span className="font-semibold text-foreground">{person.followingCount}</span>
                    {" "}following
                  </span>
                </div>
              </div>

              {/* Follow / Unfollow button — hide for own account */}
              {person.id !== user?.id && (
                <button
                  onClick={() => handleToggleFollow(person.id, person.isFollowing)}
                  disabled={acting === person.id}
                  className={`group relative flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all disabled:opacity-50 min-w-[90px] ${
                    person.isFollowing
                      ? "border border-subtle text-dim hover:border-red-400/40 hover:text-red-400 hover:bg-red-500/5"
                      : "bg-theme-gradient text-gray-900 hover:opacity-90"
                  }`}
                >
                  {person.isFollowing ? (
                    <>
                      {/* Default state */}
                      <span className="flex items-center gap-1.5 group-hover:opacity-0 group-hover:absolute">
                        <UserCheck className="h-3.5 w-3.5" />
                        Following
                      </span>
                      {/* Hover state */}
                      <span className="opacity-0 absolute flex items-center gap-1.5 group-hover:opacity-100 group-hover:static">
                        Unfollow
                      </span>
                    </>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <UserPlus className="h-3.5 w-3.5" />
                      Follow
                    </span>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
