"use client";

import { useState, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";
import { ImagePlus, Send, X } from "lucide-react";

interface CreatePostBoxProps {
  communityId: string;
  onPostCreated?: (post: unknown) => void;
}

export function CreatePostBox({ communityId, onPostCreated }: CreatePostBoxProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isAuthenticated) return null;

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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("communityId", communityId);
      fd.append("title", title.trim());
      if (content.trim()) fd.append("content", content.trim());
      if (imageFile) fd.append("image", imageFile);

      const res = await apiClient.post("/post/create", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setTitle("");
        setContent("");
        setImageFile(null);
        setImagePreview(null);
        setIsExpanded(false);
        onPostCreated?.(res.data.data);
      }
    } catch {}
    finally { setIsSubmitting(false); }
  };

  if (!isExpanded) {
    return (
      <div
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-3 p-4 rounded-xl bg-elevated border border-subtle cursor-pointer hover:border-dim transition-colors group"
      >
        <div className="h-9 w-9 rounded-full overflow-hidden flex items-center justify-center bg-theme-gradient text-gray-900 text-sm font-bold shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt="you" className="h-full w-full object-cover" />
          ) : (
            user?.username?.[0]?.toUpperCase()
          )}
        </div>
        <span className="flex-1 text-sm text-dim group-hover:text-foreground transition-colors">
          Share something with the community...
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-subtle text-xs text-dim hover:text-foreground transition-colors"
        >
          <ImagePlus className="h-3.5 w-3.5" /> Image
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl bg-elevated border border-subtle overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-subtle">
        <div className="h-9 w-9 rounded-full overflow-hidden flex items-center justify-center bg-theme-gradient text-gray-900 text-sm font-bold shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt="you" className="h-full w-full object-cover" />
          ) : (
            user?.username?.[0]?.toUpperCase()
          )}
        </div>
        <span className="text-sm font-semibold flex-1">{user?.username}</span>
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="h-7 w-7 flex items-center justify-center rounded-lg text-dim hover:text-foreground hover:bg-surface transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <input
          autoFocus
          type="text"
          placeholder="An interesting title..."
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-base font-semibold text-foreground placeholder:text-dim placeholder:font-normal focus:outline-none border-b border-subtle pb-3"
        />
        <textarea
          placeholder="What's on your mind? (optional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full bg-transparent text-sm text-foreground placeholder:text-dim focus:outline-none resize-none leading-relaxed"
        />
        {imagePreview && (
          <div className="relative rounded-xl overflow-hidden border border-subtle">
            <img src={imagePreview} alt="Preview" className="w-full max-h-52 object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 h-7 w-7 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-subtle">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-dim hover:text-foreground hover:bg-surface transition-colors"
        >
          <ImagePlus className="h-4 w-4" />
          <span className="text-xs font-medium">Add Image</span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="px-4 py-2 text-sm text-dim hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-theme-gradient text-gray-900 font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </form>
  );
}
