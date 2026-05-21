"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";
import { Users, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuthStore();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await apiClient.post("/auth/register", { username, email, password });
      if (res.data.success) {
        login(res.data.data.user, res.data.data.accessToken, res.data.data.refreshToken);
        router.push("/");
      } else {
        setError(res.data.message || "Failed to create account.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during registration.");
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
            Join thousands of{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "var(--theme-gradient)" }}
            >
              passionate communities
            </span>
          </h2>
          <p className="text-dim text-lg">
            Create an account to start sharing, exploring, and connecting with people who share your interests.
          </p>

          <div className="mt-8 space-y-3">
            {["Share your ideas with the world", "Join communities that matter to you", "Connect with like-minded people"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-theme-gradient flex items-center justify-center shrink-0">
                  <svg className="h-3 w-3 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-dim">{item}</span>
              </div>
            ))}
          </div>
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

          <h1 className="text-2xl font-bold mb-1">Create account</h1>
          <p className="text-sm text-dim mb-7">Join the community today — it&apos;s free</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="w-full h-10 px-3 bg-elevated border border-subtle rounded-lg text-sm text-foreground placeholder:text-dim focus:outline-none focus:border-accent transition-colors"
              />
            </div>

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
              <label className="block text-xs font-semibold text-dim uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
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
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-dim mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-foreground font-medium hover:underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
