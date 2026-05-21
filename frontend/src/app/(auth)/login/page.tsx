"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";
import { Users, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      if (res.data.success) {
        login(res.data.data.user, res.data.data.accessToken, res.data.data.refreshToken);
        router.push("/");
      } else {
        setError(res.data.message || "Failed to log in.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 glass-panel border-r border-subtle flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-theme-gradient flex items-center justify-center">
            <Users className="h-5 w-5 text-gray-900" />
          </div>
          <span className="text-xl font-bold">Community.</span>
        </Link>

        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Connect with your{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "var(--theme-gradient)" }}
            >
              favorite communities
            </span>
          </h2>
          <p className="text-dim text-lg">
            A premium space to share ideas, join discussions, and meet people who share your passions.
          </p>
        </div>

        <p className="text-xs text-dim">© 2025 Community. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center justify-center gap-2.5 mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-theme-gradient flex items-center justify-center">
              <Users className="h-5 w-5 text-gray-900" />
            </div>
            <span className="text-xl font-bold">Community.</span>
          </Link>

          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-dim mb-7">Sign in to your account to continue</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-10 px-3 bg-elevated border border-subtle rounded-lg text-sm text-foreground placeholder:text-dim focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-dim uppercase tracking-wider">
                  Password
                </label>
                <Link href="#" className="text-xs text-dim hover:text-foreground transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 px-3 pr-10 bg-elevated border border-subtle rounded-lg text-sm text-foreground placeholder:text-dim focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dim hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-theme-gradient text-gray-900 font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 mt-1"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-dim mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-foreground font-medium hover:underline underline-offset-2">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
