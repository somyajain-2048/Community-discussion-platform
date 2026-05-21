"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Users, ChevronRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home",        scrollId: "home",        href: "/"            },
  { label: "Features",    scrollId: "features",    href: "/"            },
  { label: "Communities", scrollId: "communities", href: "/communities" },
] as const;

const linkCls =
  "text-sm text-slate-400 hover:text-purple-400 transition-colors font-medium";

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === "/";

  function handleClick(
    e: React.MouseEvent,
    scrollId: string | null,
  ) {
    if (isLanding && scrollId) {
      e.preventDefault();
      document.getElementById(scrollId)?.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  }

  return (
    <nav
      className="sticky top-0 z-40 border-b border-purple-900/30"
      style={{ background: "rgba(7,9,15,0.85)", backdropFilter: "blur(18px)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
            <Users className="h-4 w-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Community</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, scrollId, href }) => (
            <Link
              key={label}
              href={href}
              onClick={(e) => handleClick(e, scrollId)}
              className={linkCls}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/login"
            className={`hidden sm:block ${linkCls} px-4 py-2`}
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-900/40"
          >
            Get Started <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden px-6 pb-4 pt-2 flex flex-col gap-1 border-t border-purple-900/20">
          {NAV_LINKS.map(({ label, scrollId, href }) => (
            <Link
              key={label}
              href={href}
              onClick={(e) => { handleClick(e, scrollId); setOpen(false); }}
              className={`${linkCls} py-2.5 border-b border-purple-900/10 last:border-0`}
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-3 pt-3">
            <Link href="/login" className="flex-1 text-center py-2.5 rounded-xl border border-purple-500/30 text-white text-sm font-semibold hover:bg-purple-500/10 transition-colors">
              Log in
            </Link>
            <Link href="/register" className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
