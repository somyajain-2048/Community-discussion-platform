"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";
import { CommunityChat } from "@/components/features/CommunityChat";
import { PrivateChat } from "@/components/features/PrivateChat";
import { MessageSquare, Search, ArrowLeft, Users, UserRound } from "lucide-react";
import Link from "next/link";

interface Community {
  id: string;
  name: string;
  category: string;
  members: { userId: string }[];
  _count?: { members: number };
}

interface DMUser {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
}

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as "community" | "direct") ?? "community";
  const selectedCommunityId = searchParams.get("community");
  const selectedUserId = searchParams.get("user");

  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const userId = user?.id;

  const [communities, setCommunities] = useState<Community[]>([]);
  const [dmUsers, setDmUsers] = useState<DMUser[]>([]);
  const [commSearch, setCommSearch] = useState("");
  const [dmSearch, setDmSearch] = useState("");
  const [loadingComm, setLoadingComm] = useState(!!userId);
  const [loadingDM, setLoadingDM] = useState(!!userId);

  const selectedCommunity = useMemo(
    () => communities.find((c) => c.id === selectedCommunityId) ?? null,
    [communities, selectedCommunityId]
  );

  const selectedDMUser = useMemo(
    () => dmUsers.find((u) => u.id === selectedUserId) ?? null,
    [dmUsers, selectedUserId]
  );

  // Load joined communities
  useEffect(() => {
    if (!userId) return;
    apiClient
      .get("/community")
      .then((res) => {
        if (res.data.success) {
          const joined = (res.data.data as Community[]).filter((c) =>
            c.members?.some((m) => m.userId === userId)
          );
          setCommunities(joined);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingComm(false));
  }, [userId]);

  // Load DM users (people I follow)
  useEffect(() => {
    if (!userId) return;
    apiClient
      .get("/message/dm-users")
      .then((res) => {
        if (res.data.success) setDmUsers(res.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoadingDM(false));
  }, [userId]);

  const setTab = (t: "community" | "direct") => {
    router.replace(`/messages?tab=${t}`, { scroll: false });
  };

  const pickCommunity = (c: Community) =>
    router.replace(`/messages?tab=community&community=${c.id}`, { scroll: false });

  const pickDMUser = (u: DMUser) =>
    router.replace(`/messages?tab=direct&user=${u.id}`, { scroll: false });

  const back = () =>
    router.replace(`/messages?tab=${tab}`, { scroll: false });

  const hasRightPanel =
    (tab === "community" && selectedCommunity) ||
    (tab === "direct" && selectedDMUser);

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <MessageSquare className="h-12 w-12 text-dim" />
        <h2 className="text-xl font-bold">Messages</h2>
        <p className="text-sm text-dim">Sign in to view your messages.</p>
        <Link
          href="/login"
          className="px-5 py-2.5 bg-theme-gradient text-gray-900 font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const filteredCommunities = communities.filter((c) =>
    c.name.toLowerCase().includes(commSearch.toLowerCase())
  );

  const filteredDMUsers = dmUsers.filter((u) =>
    u.username.toLowerCase().includes(dmSearch.toLowerCase())
  );

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left panel ──────────────────────────────────────── */}
      <div
        className={`w-72 shrink-0 border-r border-subtle flex flex-col ${
          hasRightPanel ? "hidden sm:flex" : "flex"
        }`}
      >
        {/* Header + tabs */}
        <div className="p-4 border-b border-subtle">
          <h2 className="font-semibold mb-3">Messages</h2>
          <div className="flex gap-1 p-1 bg-elevated rounded-lg">
            <button
              onClick={() => setTab("community")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === "community"
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-dim hover:text-foreground"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Communities
            </button>
            <button
              onClick={() => setTab("direct")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === "direct"
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-dim hover:text-foreground"
              }`}
            >
              <UserRound className="h-3.5 w-3.5" />
              Direct
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-2 border-b border-subtle">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dim pointer-events-none" />
            <input
              type="text"
              placeholder={tab === "community" ? "Search communities..." : "Search people..."}
              value={tab === "community" ? commSearch : dmSearch}
              onChange={(e) =>
                tab === "community"
                  ? setCommSearch(e.target.value)
                  : setDmSearch(e.target.value)
              }
              className="w-full h-8 pl-8 pr-3 bg-elevated border border-subtle rounded-lg text-xs placeholder:text-dim focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {tab === "community" ? (
            loadingComm ? (
              <div className="flex justify-center pt-10">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-subtle border-t-accent" />
              </div>
            ) : filteredCommunities.length > 0 ? (
              filteredCommunities.map((c) => (
                <button
                  key={c.id}
                  onClick={() => pickCommunity(c)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-elevated transition-colors ${
                    selectedCommunityId === c.id ? "bg-elevated border-r-2 border-accent" : ""
                  }`}
                >
                  <div className="h-10 w-10 rounded-xl bg-theme-gradient flex items-center justify-center text-gray-900 text-base font-black shrink-0">
                    {c.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">c/{c.name}</p>
                    <p className="text-xs text-dim flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {c._count?.members ?? c.members?.length ?? 0} members · {c.category}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center px-4 gap-2">
                <p className="text-sm text-dim">
                  {communities.length === 0
                    ? "Join communities to start chatting"
                    : "No communities match your search"}
                </p>
                {communities.length === 0 && (
                  <Link href="/communities" className="text-xs text-accent hover:underline">
                    Browse communities →
                  </Link>
                )}
              </div>
            )
          ) : (
            // Direct messages list
            loadingDM ? (
              <div className="flex justify-center pt-10">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-subtle border-t-accent" />
              </div>
            ) : filteredDMUsers.length > 0 ? (
              filteredDMUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => pickDMUser(u)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-elevated transition-colors ${
                    selectedUserId === u.id ? "bg-elevated border-r-2 border-accent" : ""
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-theme-gradient flex items-center justify-center text-gray-900 text-base font-bold shrink-0 overflow-hidden">
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.username} className="h-full w-full object-cover" />
                    ) : (
                      u.username[0].toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.username}</p>
                    {u.bio && (
                      <p className="text-xs text-dim truncate">{u.bio}</p>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center px-4 gap-2">
                <p className="text-sm text-dim">
                  {dmUsers.length === 0
                    ? "Follow people to start a private chat"
                    : "No people match your search"}
                </p>
                {dmUsers.length === 0 && (
                  <Link href="/people" className="text-xs text-accent hover:underline">
                    Find people →
                  </Link>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* ── Right panel ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {tab === "community" && selectedCommunity ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-subtle shrink-0">
              <button
                onClick={back}
                className="sm:hidden h-8 w-8 flex items-center justify-center rounded-lg text-dim hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <Link
                href={`/c/${selectedCommunity.id}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="h-8 w-8 rounded-lg bg-theme-gradient flex items-center justify-center text-gray-900 text-sm font-black shrink-0">
                  {selectedCommunity.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold">c/{selectedCommunity.name}</p>
                  <p className="text-xs text-dim">{selectedCommunity.category}</p>
                </div>
              </Link>
            </div>
            <div className="flex-1 min-h-0 p-4 overflow-hidden">
              <CommunityChat
                communityId={selectedCommunity.id}
                isMember={true}
                className="flex flex-col h-full bg-elevated border border-subtle rounded-xl overflow-hidden"
              />
            </div>
          </div>
        ) : tab === "direct" && selectedDMUser ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-subtle shrink-0">
              <button
                onClick={back}
                className="sm:hidden h-8 w-8 flex items-center justify-center rounded-lg text-dim hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <Link
                href={`/profile/${selectedDMUser.id}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="h-8 w-8 rounded-full bg-theme-gradient flex items-center justify-center text-gray-900 text-sm font-bold shrink-0 overflow-hidden">
                  {selectedDMUser.avatar ? (
                    <img src={selectedDMUser.avatar} alt={selectedDMUser.username} className="h-full w-full object-cover" />
                  ) : (
                    selectedDMUser.username[0].toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">{selectedDMUser.username}</p>
                  <p className="text-xs text-dim">Click to view profile</p>
                </div>
              </Link>
            </div>
            <div className="flex-1 min-h-0 p-4 overflow-hidden">
              <PrivateChat
                otherUser={selectedDMUser}
                className="flex flex-col h-full bg-elevated border border-subtle rounded-xl overflow-hidden"
              />
            </div>
          </div>
        ) : (
          <div className="hidden sm:flex flex-col items-center justify-center h-full text-center gap-3">
            <div className="h-16 w-16 rounded-2xl bg-elevated border border-subtle flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-dim" />
            </div>
            <h3 className="font-semibold">
              {tab === "community" ? "Community Messages" : "Direct Messages"}
            </h3>
            <p className="text-sm text-dim max-w-xs">
              {tab === "community"
                ? "Select a community on the left to view its group discussion."
                : "Select a person on the left to start a private conversation."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-subtle border-t-accent" />
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
