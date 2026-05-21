"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { LayoutDashboard, Users, FileText, Component, MessageSquare, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (pathname !== "/admin/auth" && (!isAuthenticated || user?.role !== "ADMIN")) {
        router.push("/admin/auth");
      }
    }
  }, [mounted, isLoading, isAuthenticated, user, pathname, router]);

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  // If on auth page, don't show the sidebar
  if (pathname === "/admin/auth") {
    return <div className="min-h-screen bg-zinc-950">{children}</div>;
  }

  // Prevent flash of content before redirect
  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/admin/auth");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Posts", href: "/admin/posts", icon: FileText },
    { name: "Communities", href: "/admin/communities", icon: Component },
    { name: "Comments", href: "/admin/comments", icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6">
          <Link href="/admin">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400 font-medium"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-left text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-zinc-950 p-8">
        {children}
      </main>
    </div>
  );
}
