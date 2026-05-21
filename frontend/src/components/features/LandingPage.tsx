"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users, MessageSquare, Zap, Globe, Shield, TrendingUp,
  ArrowRight, Hash, Star, CheckCircle, ChevronRight, Sparkles,
  Heart, BookOpen, Bell,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Section } from "@/components/marketing/Section";
import { Counter } from "@/components/marketing/Counter";
import { fadeUp, PAGE_BG } from "@/components/marketing/animations";

/* ── Mock post floating card ───────────────────────────────── */
function MockCard({ delay = 0, colorCls, tag, title, likes }: {
  delay?: number; colorCls: string; tag: string; title: string; likes: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay, duration: 0.6 } }}
      className="rounded-2xl border border-purple-500/20 bg-[#0e1020]/90 backdrop-blur-sm p-4 w-52 shadow-xl"
    >
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold mb-2 ${colorCls}`}>
        <Hash className="h-2.5 w-2.5" />{tag}
      </div>
      <p className="text-sm font-semibold text-white leading-snug mb-3">{title}</p>
      <div className="flex items-center gap-3 text-slate-400 text-xs">
        <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{likes}</span>
        <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />12</span>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LANDING PAGE — renders as full-screen overlay for guests
══════════════════════════════════════════════════════════════ */
export function LandingPage() {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={PAGE_BG}>
      <MarketingNav />

      {/* ── HERO ─────────────────────────────── id: home ──── */}
      <section id="home" className="relative overflow-hidden pt-20 pb-28">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-600/20 to-purple-800/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-700/15 to-blue-600/10 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <Section>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold mb-6">
              <Sparkles className="h-3.5 w-3.5" /> The platform for real communities
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Build &amp; Grow<br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Your Perfect
              </span>
              <br />Community
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-slate-400 leading-relaxed max-w-md mb-8">
              Connect with like-minded people, share ideas, join discussions, and build meaningful relationships — all in one beautiful space.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-10">
              <Link href="/register" className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm transition-all shadow-lg shadow-violet-900/50 hover:-translate-y-0.5">
                Start for free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-white font-bold text-sm transition-all">
                Sign in
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-5">
              {[
                { icon: CheckCircle, text: "Free to join" },
                { icon: Shield,      text: "Privacy first" },
                { icon: Zap,         text: "Instant setup" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-sm text-slate-400">
                  <Icon className="h-4 w-4 text-violet-400" /> {text}
                </div>
              ))}
            </motion.div>
          </Section>

          {/* Illustration */}
          <div className="relative hidden lg:flex items-center justify-center h-[480px]">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-indigo-600/30 via-violet-600/25 to-purple-700/20 blur-3xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative w-64 h-64 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 shadow-2xl flex items-center justify-center"
              style={{ boxShadow: "0 0 60px rgba(123,92,246,0.4),0 25px 50px rgba(0,0,0,0.5)" }}
            >
              <div className="text-center text-white">
                <Users className="h-16 w-16 mx-auto mb-3 opacity-90" />
                <p className="font-bold text-xl">50K+</p>
                <p className="text-sm opacity-75">Active Members</p>
              </div>
            </motion.div>

            <div className="absolute -top-4 -left-8">
              <MockCard delay={0.3} colorCls="bg-indigo-500/20 text-indigo-300" tag="Technology" title="AI is reshaping how we build software" likes={142} />
            </div>
            <div className="absolute -bottom-4 -right-8">
              <MockCard delay={0.5} colorCls="bg-violet-500/20 text-violet-300" tag="Design" title="Design systems that scale with your team" likes={98} />
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute top-12 -right-4 flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 border border-purple-500/20"
              style={{ background: "rgba(14,16,32,0.95)", backdropFilter: "blur(12px)" }}
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">New follower!</p>
                <p className="text-[11px] text-slate-400">Alex joined your community</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="absolute bottom-16 -left-12 flex items-center gap-1.5 rounded-2xl px-3.5 py-2 border border-purple-500/20"
              style={{ background: "rgba(14,16,32,0.95)", backdropFilter: "blur(12px)" }}
            >
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />)}
              <span className="text-xs font-semibold text-slate-300 ml-1">Loved by thousands</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="border-y border-purple-900/30 py-10" style={{ background: "rgba(99,79,235,0.08)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Members",  value: 50000,  suffix: "+" },
              { label: "Communities",     value: 2400,   suffix: "+" },
              { label: "Posts Created",   value: 180000, suffix: "+" },
              { label: "Daily Messages",  value: 95000,  suffix: "+" },
            ].map(({ label, value, suffix }) => (
              <div key={label}>
                <p className="text-3xl font-extrabold mb-1 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  <Counter target={value} suffix={suffix} />
                </p>
                <p className="text-sm text-slate-400 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────── id: features ─ */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Section className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-sm font-bold text-violet-400 tracking-widest uppercase mb-3">Why Choose Us</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-white mb-4">Everything you need to thrive</motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-400 max-w-xl mx-auto">
              From rich discussions to real-time messaging, we give your community the tools to grow and engage.
            </motion.p>
          </Section>

          <Section className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users,          gradient: "from-indigo-500 to-violet-600", glow: "rgba(99,79,235,0.35)",   title: "Thriving Communities", desc: "Create or join communities around any topic. Manage members, set roles, and grow your audience." },
              { icon: MessageSquare,  gradient: "from-cyan-500 to-blue-600",     glow: "rgba(6,182,212,0.30)",   title: "Real-time Chat",       desc: "Community channels and private DMs powered by WebSockets — conversations that feel instant." },
              { icon: TrendingUp,     gradient: "from-emerald-500 to-teal-600",  glow: "rgba(16,185,129,0.30)",  title: "Rich Discussions",     desc: "Threads, nested replies, likes, and saves. Your community knowledge stays organized." },
              { icon: Globe,          gradient: "from-pink-500 to-rose-600",     glow: "rgba(236,72,153,0.30)",  title: "Discover People",      desc: "Find and follow interesting people. Build your network alongside your community presence." },
              { icon: Bell,           gradient: "from-amber-500 to-orange-600",  glow: "rgba(245,158,11,0.30)",  title: "Smart Notifications",  desc: "Stay in the loop with personalized alerts for likes, comments, mentions, and follows." },
              { icon: Shield,         gradient: "from-slate-500 to-slate-700",   glow: "rgba(100,116,139,0.25)", title: "Safe & Secure",        desc: "Privacy-first design with JWT auth, secure uploads, and moderation tools built in." },
            ].map(({ icon: Icon, gradient, glow, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group p-7 rounded-2xl border border-purple-900/30 bg-[#0e1020]/60 hover:border-purple-500/40 transition-all cursor-default"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                  style={{ boxShadow: `0 0 20px ${glow}` }}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* ── COMMUNITIES ──────────────────── id: communities ── */}
      <section id="communities" className="py-24 border-t border-purple-900/20" style={{ background: "rgba(99,79,235,0.04)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <Section className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-sm font-bold text-violet-400 tracking-widest uppercase mb-3">Explore</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-white mb-4">Thousands of communities await</motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-400 max-w-xl mx-auto">
              Whatever you&apos;re passionate about, there&apos;s a community for you. Or start your own.
            </motion.p>
          </Section>

          <Section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { name: "Technology", members: "12.4K", emoji: "💻", gradient: "from-indigo-600 to-violet-700" },
              { name: "Design",     members: "8.7K",  emoji: "🎨", gradient: "from-pink-600 to-rose-700"    },
              { name: "Gaming",     members: "15.2K", emoji: "🎮", gradient: "from-emerald-600 to-teal-700"  },
              { name: "Finance",    members: "6.1K",  emoji: "📈", gradient: "from-amber-600 to-orange-700"  },
              { name: "Science",    members: "9.3K",  emoji: "🔬", gradient: "from-cyan-600 to-blue-700"     },
              { name: "Art",        members: "4.8K",  emoji: "🖌️", gradient: "from-violet-600 to-purple-700" },
              { name: "Music",      members: "7.5K",  emoji: "🎵", gradient: "from-rose-600 to-pink-700"     },
              { name: "Sports",     members: "11.2K", emoji: "⚽", gradient: "from-teal-600 to-emerald-700"  },
            ].map(({ name, members, emoji, gradient }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                className="group rounded-2xl border border-purple-900/30 bg-[#0e1020]/60 p-5 text-center cursor-pointer hover:border-purple-500/40 transition-all"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  {emoji}
                </div>
                <p className="text-sm font-bold text-white mb-1">{name}</p>
                <p className="text-xs text-slate-400">{members} members</p>
              </motion.div>
            ))}
          </Section>

          <div className="text-center">
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-900/40">
              Browse all communities <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-24 border-t border-purple-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <Section className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-sm font-bold text-violet-400 tracking-widest uppercase mb-3">Get started in minutes</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-white">Three steps to your community</motion.h2>
          </Section>

          <Section className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[22%] right-[22%] h-px bg-gradient-to-r from-indigo-500/40 via-violet-500/40 to-purple-500/40" />
            {[
              { step: "01", icon: BookOpen,      gradient: "from-indigo-600 to-violet-700", title: "Create your account",       desc: "Sign up in seconds — no credit card required. Pick a username and you're ready to go." },
              { step: "02", icon: Users,          gradient: "from-violet-600 to-purple-700", title: "Join or build a community",  desc: "Browse hundreds of existing communities or create your own around any topic you love." },
              { step: "03", icon: MessageSquare,  gradient: "from-purple-600 to-pink-600",   title: "Start connecting",           desc: "Post threads, reply, chat in real time, and follow people who inspire you." },
            ].map(({ step, icon: Icon, gradient, title, desc }) => (
              <motion.div key={step} variants={fadeUp} className="flex flex-col items-center text-center">
                <div
                  className={`relative h-24 w-24 rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6`}
                  style={{ boxShadow: "0 0 30px rgba(123,92,246,0.35)" }}
                >
                  <Icon className="h-10 w-10 text-white" />
                  <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full border border-purple-500/30 bg-[#0e1020] flex items-center justify-center text-xs font-black text-violet-400">
                    {step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs">{desc}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-24 border-t border-purple-900/20" style={{ background: "rgba(99,79,235,0.04)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <Section className="text-center mb-14">
            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-white mb-4">Loved by communities worldwide</motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-400">Real people, real connections, real results.</motion.p>
          </Section>

          <Section className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Priya S.",  role: "Community Creator", avatar: "P", gradient: "from-indigo-500 to-violet-600", quote: "I launched my design community here and went from 0 to 2,000 members in two months. The tools are incredible." },
              { name: "Marcus T.", role: "Tech Enthusiast",   avatar: "M", gradient: "from-cyan-500 to-blue-600",     quote: "The real-time chat changed everything for our dev group. Conversations feel alive, not like a 2005 message board." },
              { name: "Aisha K.",  role: "Community Manager", avatar: "A", gradient: "from-pink-500 to-rose-600",     quote: "Managing members, posting updates, moderating threads — it all just works. My team loves the clean interface." },
            ].map(({ name, role, avatar, gradient, quote }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                className="p-7 rounded-2xl border border-purple-900/30 bg-[#0e1020]/60"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm`}>
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{name}</p>
                    <p className="text-xs text-slate-400">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden border-t border-purple-900/20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-violet-900/30 to-purple-900/20" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle,rgba(139,92,246,1) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <Section>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold mb-8">
              <Sparkles className="h-3.5 w-3.5" /> Join thousands building together
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
              Your community is<br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                waiting for you
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg mb-9 max-w-xl mx-auto">
              Join thousands of creators, enthusiasts, and leaders already building something meaningful.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base transition-all shadow-xl shadow-violet-900/50 hover:-translate-y-0.5">
                Get started free <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/login" className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-white font-bold text-base transition-all">
                Already have an account?
              </Link>
            </motion.div>
          </Section>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
