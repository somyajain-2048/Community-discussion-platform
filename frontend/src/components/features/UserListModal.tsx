"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface ListUser {
  id: string;
  username: string;
  avatar?: string;
}

interface UserListModalProps {
  title: string;
  users: ListUser[];
  onClose: () => void;
}

export function UserListModal({ title, users, onClose }: UserListModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-elevated border border-subtle rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-subtle">
          <h3 className="font-semibold text-sm">{title}</h3>
          <button
            onClick={onClose}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-dim hover:text-foreground hover:bg-surface transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User list */}
        <div className="overflow-y-auto max-h-80">
          {users.length > 0 ? (
            users.map((u) => (
              <Link
                key={u.id}
                href={`/profile/${u.id}`}
                onClick={onClose}
                className="flex items-center gap-3 px-5 py-3 hover:bg-surface transition-colors"
              >
                <div className="h-9 w-9 rounded-full overflow-hidden flex items-center justify-center bg-theme-gradient text-gray-900 text-sm font-bold shrink-0">
                  {u.avatar ? (
                    <img src={u.avatar} alt={u.username} className="h-full w-full object-cover" />
                  ) : (
                    u.username?.[0]?.toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{u.username}</p>
                  <p className="text-xs text-dim">@{u.username}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm text-dim">No users yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
