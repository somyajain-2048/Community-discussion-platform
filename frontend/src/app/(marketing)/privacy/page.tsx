import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy Policy" };

const LAST_UPDATED = "1 May 2025";

const SECTIONS = [
  {
    heading: "1. Information we collect",
    body: `We collect information you provide directly — such as your username, email address, profile photo, and any content you post (threads, comments, messages). We also collect limited usage data automatically, including pages visited, features used, and general device information (browser type, operating system). We do not collect your precise location.`,
  },
  {
    heading: "2. How we use your information",
    body: `We use your information to operate and improve the platform, personalise your feed and recommendations, send account-related emails (password resets, notifications you opt into), and detect and prevent abuse. We do not use your data to train AI models or sell it to advertisers.`,
  },
  {
    heading: "3. Sharing of information",
    body: `We do not sell, rent, or share your personal information with third parties for marketing purposes. We may share data with service providers who help us run the platform (e.g. cloud hosting, email delivery) under strict data processing agreements. We may disclose information when required by law or to protect the safety of users.`,
  },
  {
    heading: "4. Cookies & tracking",
    body: `We use session cookies to keep you logged in and preference cookies to remember your settings. We do not use third-party advertising cookies or cross-site tracking. You can control cookies through your browser settings; disabling session cookies will require you to log in on every visit.`,
  },
  {
    heading: "5. Data retention",
    body: `We retain your account information for as long as your account is active. If you delete your account, your profile and public posts are removed within 30 days. Backups may retain data for up to 90 days for disaster-recovery purposes.`,
  },
  {
    heading: "6. Your rights",
    body: `You have the right to access, correct, or delete your personal data at any time from your account settings. You may also request a copy of your data in a machine-readable format. To exercise any of these rights, contact us at privacy@community.app. We will respond within 30 days.`,
  },
  {
    heading: "7. Children's privacy",
    body: `Community is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.`,
  },
  {
    heading: "8. Changes to this policy",
    body: `We may update this policy from time to time. When we make material changes, we will notify you via email or an in-app notice at least 14 days before the change takes effect. Continued use of the platform after the effective date constitutes acceptance of the updated policy.`,
  },
  {
    heading: "9. Contact",
    body: `If you have questions about this policy, please email privacy@community.app or write to: Community Platform, Bengaluru, India.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="text-white">
      {/* Hero */}
      <section className="py-16 border-b border-purple-900/20">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm font-bold text-violet-400 tracking-widest uppercase mb-3">Legal</p>
          <h1 className="text-4xl font-extrabold mb-3">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Body */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          {/* Intro */}
          <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-900/10 mb-10">
            <p className="text-sm text-slate-300 leading-relaxed">
              Your privacy is important to us. This policy explains what data Community collects, why we collect it, and how you can control it. We have written it in plain language — if anything is unclear, please{" "}
              <Link href="/contact" className="text-violet-400 hover:text-violet-300 underline">contact us</Link>.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {SECTIONS.map(({ heading, body }) => (
              <div key={heading}>
                <h2 className="text-lg font-bold mb-2">{heading}</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* Footer nav */}
          <div className="mt-14 pt-8 border-t border-purple-900/20 flex flex-wrap gap-4 text-sm">
            <Link href="/terms" className="text-violet-400 hover:text-violet-300 transition-colors">
              Terms &amp; Conditions →
            </Link>
            <Link href="/contact" className="text-violet-400 hover:text-violet-300 transition-colors">
              Contact Us →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
