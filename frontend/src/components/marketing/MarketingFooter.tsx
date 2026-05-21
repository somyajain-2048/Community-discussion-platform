import Link from "next/link";
import { Users } from "lucide-react";

const FOOTER_LINKS = [
  { label: "About",              href: "/about"   },
  { label: "Contact Us",         href: "/contact" },
  { label: "Privacy Policy",     href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms"   },
];

export function MarketingFooter() {
  return (
    <footer
      className="border-t border-purple-900/30 py-12"
      style={{ background: "rgba(7,9,15,0.98)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Community</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              A premium space to connect, share ideas, and build meaningful communities around the things you love.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Links</p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-slate-500 hover:text-purple-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-900/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Community Platform. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">Built with ❤️ for real communities.</p>
        </div>
      </div>
    </footer>
  );
}
