"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/marketing/Section";
import { fadeUp } from "@/components/marketing/animations";
import { Mail, MessageSquare, MapPin, Clock, Send, CheckCircle } from "lucide-react";

const INFO = [
  { icon: Mail,          label: "Email us",       value: "support@community.app",   sub: "We reply within 24 hours"      },
  { icon: MessageSquare, label: "Live chat",       value: "Available in the app",    sub: "Mon–Fri, 9 am – 6 pm IST"     },
  { icon: MapPin,        label: "Headquarters",   value: "Bengaluru, India",        sub: "Building the internet together" },
  { icon: Clock,         label: "Response time",  value: "< 24 hours",              sub: "For all support requests"      },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    /* In production, POST to your backend here */
    setSent(true);
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-purple-900/40 bg-[#0e1020]/70 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500/60 focus:bg-[#0e1020] transition-all";

  return (
    <div className="text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 border-b border-purple-900/20">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-600/15 to-purple-800/10 blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <Section>
            <motion.p variants={fadeUp} className="text-sm font-bold text-violet-400 tracking-widest uppercase mb-4">Get in touch</motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl font-extrabold mb-4">
              We&apos;d love to{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                hear from you
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-slate-400">
              Questions, feedback, partnership ideas? Our team is ready to help.
            </motion.p>
          </Section>
        </div>
      </section>

      {/* Main content */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-14">
          {/* Info cards */}
          <Section className="space-y-4">
            <motion.h2 variants={fadeUp} className="text-2xl font-extrabold mb-6">Contact information</motion.h2>
            {INFO.map(({ icon: Icon, label, value, sub }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="flex items-start gap-4 p-5 rounded-2xl border border-purple-900/30 bg-[#0e1020]/60"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shrink-0" style={{ boxShadow: "0 0 16px rgba(99,79,235,0.4)" }}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
                  <p className="text-sm font-bold text-white">{value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
                </div>
              </motion.div>
            ))}
          </Section>

          {/* Contact form */}
          <Section>
            <motion.h2 variants={fadeUp} className="text-2xl font-extrabold mb-6">Send a message</motion.h2>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center p-10 rounded-2xl border border-emerald-500/30 bg-emerald-900/10"
              >
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-5" style={{ boxShadow: "0 0 24px rgba(16,185,129,0.4)" }}>
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Message sent!</h3>
                <p className="text-slate-400 text-sm">Thanks for reaching out. We&apos;ll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full name</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email address</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Subject</label>
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className={inputCls}
                  >
                    <option value="" disabled>Select a topic…</option>
                    <option value="general">General inquiry</option>
                    <option value="support">Technical support</option>
                    <option value="billing">Billing question</option>
                    <option value="partnership">Partnership / Press</option>
                    <option value="report">Report an issue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what's on your mind…"
                    className={`${inputCls} resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm transition-all shadow-lg shadow-violet-900/40 hover:-translate-y-0.5"
                >
                  Send message <Send className="h-4 w-4" />
                </button>
              </motion.form>
            )}
          </Section>
        </div>
      </section>
    </div>
  );
}
