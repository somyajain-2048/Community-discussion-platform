import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms & Conditions" };

const LAST_UPDATED = "1 May 2025";

const SECTIONS = [
  {
    heading: "1. Acceptance of terms",
    body: `By creating an account or using Community in any way, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the platform. We reserve the right to update these terms at any time; continued use after a change takes effect constitutes acceptance.`,
  },
  {
    heading: "2. Eligibility",
    body: `You must be at least 13 years old to use Community. If you are under 18, you represent that a parent or legal guardian has reviewed and agreed to these terms on your behalf. Accounts registered with false eligibility information will be terminated.`,
  },
  {
    heading: "3. Your account",
    body: `You are responsible for maintaining the confidentiality of your password and for all activity that occurs under your account. You agree to notify us immediately of any unauthorised use. We are not liable for any loss resulting from unauthorised account access that is not our fault.`,
  },
  {
    heading: "4. Content you post",
    body: `You retain ownership of the content you post. By posting, you grant Community a worldwide, non-exclusive, royalty-free licence to display and distribute that content within the platform. You are solely responsible for your content and confirm it does not infringe any third-party rights or violate any law.`,
  },
  {
    heading: "5. Prohibited conduct",
    body: `You agree not to: post content that is unlawful, hateful, harassing, or deceptive; impersonate any person or entity; spam or scrape the platform; attempt to gain unauthorised access to other accounts or systems; or use the platform to distribute malware or conduct phishing attacks. Violations may result in immediate account termination.`,
  },
  {
    heading: "6. Community guidelines",
    body: `Each community on the platform may have its own rules set by its moderators, in addition to these terms. Violating community-specific rules may result in removal from that community. Community-wide violations may result in platform-wide suspension.`,
  },
  {
    heading: "7. Intellectual property",
    body: `Community and its logos, designs, and software are our exclusive property. You may not copy, modify, distribute, or create derivative works from our platform or branding without our prior written consent.`,
  },
  {
    heading: "8. Disclaimer of warranties",
    body: `Community is provided "as is" without warranties of any kind, express or implied. We do not guarantee that the platform will be error-free, uninterrupted, or secure. Your use of the platform is at your sole risk.`,
  },
  {
    heading: "9. Limitation of liability",
    body: `To the fullest extent permitted by law, Community and its team will not be liable for any indirect, incidental, special, or consequential damages arising out of your use of, or inability to use, the platform, even if we have been advised of the possibility of such damages.`,
  },
  {
    heading: "10. Termination",
    body: `We may suspend or terminate your account at any time for violation of these terms, with or without notice. You may delete your account at any time from account settings. Upon termination, your licence to use the platform ends immediately.`,
  },
  {
    heading: "11. Governing law",
    body: `These terms are governed by the laws of India. Any disputes will be resolved in the courts of Bengaluru, Karnataka, India. If you are a consumer in the EU, you may also benefit from mandatory consumer-protection provisions of your country.`,
  },
  {
    heading: "12. Contact",
    body: `Questions about these terms? Email legal@community.app or visit our contact page.`,
  },
];

export default function TermsPage() {
  return (
    <div className="text-white">
      {/* Hero */}
      <section className="py-16 border-b border-purple-900/20">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm font-bold text-violet-400 tracking-widest uppercase mb-3">Legal</p>
          <h1 className="text-4xl font-extrabold mb-3">Terms &amp; Conditions</h1>
          <p className="text-slate-400 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* Body */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          {/* Intro */}
          <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-900/10 mb-10">
            <p className="text-sm text-slate-300 leading-relaxed">
              Please read these terms carefully before using Community. By using our platform, you agree to them in full. For questions, see our{" "}
              <Link href="/contact" className="text-violet-400 hover:text-violet-300 underline">contact page</Link>{" "}
              or read our{" "}
              <Link href="/privacy" className="text-violet-400 hover:text-violet-300 underline">Privacy Policy</Link>.
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
            <Link href="/privacy" className="text-violet-400 hover:text-violet-300 transition-colors">
              Privacy Policy →
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
