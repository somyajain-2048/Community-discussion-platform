"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";
import Link from "next/link";
import {
  Calendar, UserPlus, UserCheck, Pencil, X, Camera, Trash2,
  Users, Heart, FileText, TrendingUp, Crown,
} from "lucide-react";

interface Community {
  id: string;
  name: string;
  category: string;
  _count?: { members: number };
}

interface TopPost {
  id: string;
  title: string;
  likes: number;
  comments: number;
  communityName?: string;
}

interface MonthStat {
  month: string;
  count: number;
}

interface Profile {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  totalLikesReceived?: number;
  followersCount?: number;
  followingCount?: number;
  posts?: { id: string }[];
  monthlyStats?: MonthStat[];
  topPosts?: TopPost[];
  joinedCommunities?: Community[];
}

interface ListUser {
  id: string;
  username: string;
  avatar?: string;
}

function EditProfileModal({
  profile,
  onClose,
  onSaved,
}: {
  profile: Profile;
  onClose: () => void;
  onSaved: (updated: Profile) => void;
}) {
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(profile.avatar || null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("bio", bio);
      if (avatarFile) fd.append("avatar", avatarFile);
      const res = await apiClient.patch("/profile/update", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        onSaved(res.data.data);
        onClose();
      }
    } catch {}
    finally { setSaving(false); }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-elevated border border-subtle rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-subtle">
          <h3 className="font-semibold text-sm">Edit Profile</h3>
          <button onClick={onClose} className="h-7 w-7 flex items-center justify-center rounded-lg text-dim hover:text-foreground hover:bg-surface transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-20 w-20">
              <div className="h-20 w-20 rounded-2xl overflow-hidden bg-theme-gradient flex items-center justify-center text-gray-900 text-3xl font-black">
                {preview ? (
                  <img src={preview} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  profile.username[0].toUpperCase()
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-accent flex items-center justify-center text-gray-900 hover:opacity-90 transition-opacity"
              >
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <p className="text-xs text-dim">Click the camera to change avatar</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-dim mb-1.5">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={200}
              placeholder="Tell people about yourself..."
              className="w-full bg-surface border border-subtle rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-dim focus:outline-none focus:border-accent transition-colors resize-none"
            />
            <p className="text-right text-[10px] text-dim mt-1">{bio.length}/200</p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 bg-theme-gradient text-gray-900 font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivityChart({ data }: { data: MonthStat[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-2 h-24 w-full">
      {data.map((d) => (
        <div key={d.month} className="flex flex-col items-center gap-1.5 flex-1">
          <span className="text-[10px] text-dim font-medium">{d.count > 0 ? d.count : ""}</span>
          <div className="w-full rounded-t-md transition-all" style={{
            height: `${Math.max((d.count / max) * 64, d.count > 0 ? 6 : 2)}px`,
            background: d.count > 0 ? "var(--theme-gradient)" : "rgba(255,255,255,0.08)",
          }} />
          <span className="text-[10px] text-dim">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user: me, setUser } = useAuthStore();
  const isOwnProfile = me?.id === id;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [followers, setFollowers] = useState<ListUser[]>([]);
  const [following, setFollowing] = useState<ListUser[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isActing, setIsActing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    const load = async () => {
      try {
        const [profileRes, followersRes, followingRes] = await Promise.all([
          apiClient.get(`/profile/${id}`),
          apiClient.get(`/follow/followers/${id}`),
          apiClient.get(`/follow/following/${id}`),
        ]);

        if (profileRes.data.success) {
          setProfile(profileRes.data.data);
        }

        if (followersRes.data.success) {
          const list: ListUser[] = followersRes.data.data?.followers || [];
          setFollowers(list);
          if (me) setIsFollowing(list.some((u) => u.id === me.id));
        }

        if (followingRes.data.success) {
          setFollowing(followingRes.data.data?.following || []);
        }
      } catch {}
      finally { setIsLoading(false); }
    };
    load();
  }, [id, me?.id]);

  const handleToggleFollow = async () => {
    if (!me) { router.push("/login"); return; }
    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setFollowers((prev) =>
      wasFollowing
        ? prev.filter((u) => u.id !== me.id)
        : [...prev, { id: me.id, username: me.username, avatar: me.avatar }]
    );
    setIsActing(true);
    try {
      await apiClient.post(`/follow/toggle/${id}`);
    } catch {
      setIsFollowing(wasFollowing);
      setFollowers((prev) =>
        wasFollowing
          ? [...prev, { id: me.id, username: me.username, avatar: me.avatar }]
          : prev.filter((u) => u.id !== me.id)
      );
    } finally {
      setIsActing(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    setIsDeletingAccount(true);
    try {
      await apiClient.delete("/profile/delete");
      useAuthStore.getState().logout();
      router.replace("/register");
    } catch {
      setIsDeletingAccount(false);
    }
  };

  const handleProfileSaved = (updated: Profile) => {
    setProfile((p) => p ? { ...p, ...updated } : p);
    if (me) {
      setUser({ ...me, avatar: updated.avatar ?? me.avatar, bio: updated.bio ?? me.bio });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-subtle border-t-accent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <h2 className="text-xl font-bold">Profile not found</h2>
      </div>
    );
  }

  const postsCount = profile.posts?.length ?? 0;
  const likesCount = profile.totalLikesReceived ?? 0;
  const followersCount = profile.followersCount ?? followers.length;
  const followingCount = profile.followingCount ?? following.length;
  const monthlyStats = profile.monthlyStats ?? [];
  const topPosts = profile.topPosts ?? [];
  const communities = profile.joinedCommunities ?? [];

  const stats = [
    { label: "Posts", value: postsCount, icon: FileText, color: "text-accent" },
    { label: "Likes Received", value: likesCount, icon: Heart, color: "text-pink-400" },
    { label: "Followers", value: followersCount, icon: Users, color: "text-violet-400" },
    { label: "Following", value: followingCount, icon: TrendingUp, color: "text-emerald-400" },
  ];

  return (
    <>
      {showEdit && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEdit(false)}
          onSaved={handleProfileSaved}
        />
      )}

      <div className="overflow-y-auto h-full">
        {/* Banner */}
        <div
          className="h-36 w-full shrink-0 relative overflow-hidden"
          style={{ backgroundImage: "var(--theme-gradient)" }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 left-1/4 h-32 w-32 rounded-full bg-white/5" />
        </div>

        <div className="px-6 pb-10">
          {/* Profile header card */}
          <div className="-mt-10 p-5 bg-[rgba(20,20,20,0.92)] backdrop-blur-xl border border-subtle rounded-2xl shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end justify-between">
              <div className="flex items-end gap-4">
                <div className="h-20 w-20 rounded-2xl overflow-hidden flex items-center justify-center bg-theme-gradient text-gray-900 text-3xl font-black ring-4 ring-[rgba(20,20,20,0.92)] shrink-0 -mt-10">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.username} className="h-full w-full object-cover" />
                  ) : (
                    profile.username[0].toUpperCase()
                  )}
                </div>
                <div className="mb-1">
                  <h1 className="text-xl font-bold">{profile.username}</h1>
                  <p className="text-sm text-dim">@{profile.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isOwnProfile ? (
                  <button
                    onClick={() => setShowEdit(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-subtle rounded-lg text-sm font-medium text-dim hover:text-foreground hover:border-foreground/30 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleToggleFollow}
                    disabled={isActing}
                    className={`group relative flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 min-w-[110px] ${
                      isFollowing
                        ? "border border-subtle text-dim hover:border-red-400/40 hover:text-red-400 hover:bg-red-500/5"
                        : "bg-theme-gradient text-gray-900 hover:opacity-90"
                    }`}
                  >
                    {isActing ? (
                      <span className="flex items-center gap-2">
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {isFollowing ? "Unfollowing..." : "Following..."}
                      </span>
                    ) : isFollowing ? (
                      <>
                        <span className="flex items-center gap-2 group-hover:opacity-0 group-hover:absolute">
                          <UserCheck className="h-4 w-4" />
                          Following
                        </span>
                        <span className="opacity-0 absolute flex items-center gap-2 group-hover:opacity-100 group-hover:static">
                          Unfollow
                        </span>
                      </>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Follow
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {profile.bio ? (
              <p className="mt-4 text-sm text-dim leading-relaxed">{profile.bio}</p>
            ) : isOwnProfile ? (
              <button onClick={() => setShowEdit(true)} className="mt-4 text-sm text-dim hover:text-accent transition-colors">
                + Add a bio
              </button>
            ) : null}

            <div className="flex items-center gap-1.5 text-xs text-dim mt-3">
              <Calendar className="h-3.5 w-3.5" />
              Joined {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>
          </div>

          {/* Dashboard grid */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Left column (2/3) */}
            <div className="lg:col-span-2 space-y-4">

              {/* Stats cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="bg-[rgba(20,20,20,0.7)] backdrop-blur-md border border-subtle rounded-2xl p-4">
                    <div className={`${s.color} mb-2`}>
                      <s.icon className="h-4 w-4" />
                    </div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-dim mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Activity chart */}
              <div className="bg-[rgba(20,20,20,0.7)] backdrop-blur-md border border-subtle rounded-2xl p-5">
                <h3 className="text-sm font-semibold mb-4">Post Activity</h3>
                {monthlyStats.length > 0 ? (
                  <ActivityChart data={monthlyStats} />
                ) : (
                  <p className="text-xs text-dim text-center py-8">No activity data yet</p>
                )}
              </div>

              {/* Top posts */}
              <div className="bg-[rgba(20,20,20,0.7)] backdrop-blur-md border border-subtle rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="h-4 w-4 text-yellow-400" />
                  <h3 className="text-sm font-semibold">Top Posts</h3>
                </div>
                {topPosts.length > 0 ? (
                  <div className="space-y-2">
                    {topPosts.map((post, i) => (
                      <Link
                        key={post.id}
                        href={`/post/${post.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors group"
                      >
                        <span className="text-xs font-bold text-dim w-4 shrink-0">#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">{post.title}</p>
                          {post.communityName && (
                            <p className="text-[11px] text-dim mt-0.5">c/{post.communityName}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0 text-[11px] text-dim">
                          <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-pink-400" />{post.likes}</span>
                          <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{post.comments}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-dim text-center py-6">No posts yet</p>
                )}
              </div>
            </div>

            {/* Right column (1/3) */}
            <div className="space-y-4">

              {/* Communities */}
              <div className="bg-[rgba(20,20,20,0.7)] backdrop-blur-md border border-subtle rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4 text-accent" />
                  <h3 className="text-sm font-semibold">Communities</h3>
                  <span className="ml-auto text-xs text-dim">{communities.length}</span>
                </div>
                {communities.length > 0 ? (
                  <div className="space-y-2">
                    {communities.map((c) => (
                      <Link
                        key={c.id}
                        href={`/c/${c.id}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface transition-colors group"
                      >
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-theme-gradient text-gray-900 text-xs font-bold shrink-0">
                          {c.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate group-hover:text-accent transition-colors">c/{c.name}</p>
                          <p className="text-[10px] text-dim">{c.category}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-dim text-center py-4">Not in any communities</p>
                )}
              </div>

              {/* Account management — own profile only */}
              {isOwnProfile && (
                <div className="bg-[rgba(20,20,20,0.7)] backdrop-blur-md border border-subtle rounded-2xl p-5">
                  <h3 className="text-sm font-semibold mb-4">Account</h3>
                  <div className="space-y-2">
                    <div className="px-3 py-2.5 rounded-xl bg-surface border border-subtle">
                      <p className="text-[10px] text-dim uppercase tracking-wider mb-0.5">Email</p>
                      <p className="text-xs font-medium truncate">{profile.email}</p>
                    </div>
                    <button
                      onClick={() => setShowEdit(true)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-subtle text-sm font-medium text-dim hover:text-foreground hover:border-foreground/30 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-red-500/20 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {isDeletingAccount ? "Deleting..." : "Delete Account"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
