"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Zap, Globe, Shield } from "lucide-react";
import { Section } from "@/components/marketing/Section";
import { fadeUp } from "@/components/marketing/animations";

const VALUES = [
  { icon: Heart,   title: "People first",     desc: "Every decision we make starts with how it affects the people in our communities. Technology is the tool, community is the purpose." },
  { icon: Globe,   title: "Open & inclusive", desc: "We believe the best communities are ones where everyone feels welcome. We design for diversity from day one." },
  { icon: Zap,     title: "Move fast",         desc: "We ship quickly, listen to feedback, and improve constantly. We'd rather iterate in public than perfect in private." },
  { icon: Shield,  title: "Privacy matters",  desc: "Your data is yours. We collect only what's necessary, never sell it, and make it easy to control your own information." },
];

export function AboutContent() {
  return (
    <div className="text-white">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 border-b border-purple-900/20">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-600/15 to-purple-800/10 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <Section>
            <motion.p variants={fadeUp} className="text-sm font-bold text-violet-400 tracking-widest uppercase mb-4">Our story</motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl font-extrabold mb-6 leading-tight">
              We believe every passion<br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                deserves a community
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Community was built out of frustration with platforms that prioritise engagement metrics over genuine connection.
              We wanted a space where real conversations happen — where people find their tribe, not just their timeline.
            </motion.p>
          </Section>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <Section>
            <motion.p variants={fadeUp} className="text-sm font-bold text-violet-400 tracking-widest uppercase mb-3">Our mission</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl font-extrabold mb-5">
              Making meaningful connection the default, not the exception
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 leading-relaxed mb-4">
              Most social platforms are designed to keep you scrolling. We&apos;re designed to help you belong. Whether
              you&apos;re a developer sharing code, an artist sharing work, or a runner sharing miles — we want you to
              find the people who get it.
            </motion.p>
            <motion.p variants={fadeUp} className="text-slate-400 leading-relaxed">
              We started in 2024 with a simple idea: what if online communities felt as good as the best ones in real
              life? Small, focused, high-signal, and run by people who actually care about the topic.
            </motion.p>
          </Section>

          <Section className="grid grid-cols-2 gap-4">
            {[
              { value: "50K+",   label: "Active members" },
              { value: "2,400+", label: "Communities"    },
              { value: "180K+",  label: "Posts created"  },
              { value: "4.9★",   label: "User rating"    },
            ].map(({ value, label }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="p-6 rounded-2xl border border-purple-900/30 bg-[#0e1020]/60 text-center"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <p className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-1">{value}</p>
                <p className="text-sm text-slate-400">{label}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────── */}
      <section className="py-20 border-t border-purple-900/20" style={{ background: "rgba(99,79,235,0.04)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <Section className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-sm font-bold text-violet-400 tracking-widest uppercase mb-3">What we stand for</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-extrabold">Our values</motion.h2>
          </Section>

          <Section className="grid md:grid-cols-2 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="flex gap-5 p-6 rounded-2xl border border-purple-900/30 bg-[#0e1020]/60"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <div
                  className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shrink-0"
                  style={{ boxShadow: "0 0 18px rgba(99,79,235,0.4)" }}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 border-t border-purple-900/20" style={{ background: "rgba(99,79,235,0.06)" }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Section>
            <motion.h2 variants={fadeUp} className="text-3xl font-extrabold mb-4">Ready to find your community?</motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 mb-8">
              Join thousands of people already building meaningful connections.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm transition-all shadow-lg shadow-violet-900/40">
                Get started free
              </Link>
              <Link href="/contact" className="px-6 py-3 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-white font-bold text-sm transition-all">
                Get in touch
              </Link>
            </motion.div>
          </Section>
        </div>
      </section>

    </div>
  );
}
