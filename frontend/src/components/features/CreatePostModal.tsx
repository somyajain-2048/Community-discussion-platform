"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";
import { X, ImagePlus, Send, ChevronDown } from "lucide-react";

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: (post: any) => void;
  defaultCommunityId?: string;
  defaultCommunityName?: string;
}

export function CreatePostModal({
  onClose,
  onPostCreated,
  defaultCommunityId = "",
  defaultCommunityName = "",
}: CreatePostModalProps) {
  const { user } = useAuthStore();
  const [communities, setCommunities] = useState<any[]>([]);
  const [communityId, setCommunityId] = useState(defaultCommunityId);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    apiClient
      .get("/community")
      .then((res) => {
        if (res.data.success) setCommunities(res.data.data || []);
      })
      .catch(() => {});
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!title.trim()) { setError("Title is required."); return; }

    setIsSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      if (communityId) fd.append("communityId", communityId);
      fd.append("title", title.trim());
      if (content.trim()) fd.append("content", content.trim());
      if (imageFile) fd.append("image", imageFile);

      const res = await apiClient.post("/post/create", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        onPostCreated(res.data.data);
        onClose();
      } else {
        setError(res.data.message || "Failed to create post.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 px-4 pb-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-elevated border border-subtle rounded-2xl shadow-2xl flex flex-col max-h-[calc(100vh-5rem)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-subtle shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full overflow-hidden flex items-center justify-center bg-theme-gradient text-gray-900 text-sm font-bold shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
              ) : (
                user?.username?.[0]?.toUpperCase()
              )}
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">{user?.username}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <select
                  value={communityId}
                  onChange={(e) => setCommunityId(e.target.value)}
                  className="text-xs text-dim bg-transparent focus:outline-none cursor-pointer hover:text-foreground transition-colors appearance-none pr-4"
                  style={{ backgroundImage: "none" }}
                >
                  <option value="" style={{ background: "#19192a" }}>
                    {defaultCommunityName ? `c/${defaultCommunityName}` : "No community (general)"}
                  </option>
                  {communities.map((c) => (
                    <option key={c.id} value={c.id} style={{ background: "#19192a" }}>
                      c/{c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3 w-3 text-dim pointer-events-none" />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-dim hover:text-foreground hover:bg-surface transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          {error && (
            <div className="px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <input
            ref={titleRef}
            type="text"
            placeholder="An interesting title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-lg font-semibold text-foreground placeholder:text-dim placeholder:font-normal focus:outline-none border-b border-subtle pb-3"
          />

          <textarea
            placeholder="What's on your mind? (optional)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-dim focus:outline-none resize-none leading-relaxed"
          />

          {imagePreview && (
            <div className="relative rounded-xl overflow-hidden border border-subtle">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-64 object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 h-7 w-7 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-subtle shrink-0">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-dim hover:text-foreground hover:bg-surface transition-colors"
          >
            <ImagePlus className="h-4 w-4" />
            <span className="text-xs font-medium">Add Image</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-dim hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-theme-gradient text-gray-900 font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
