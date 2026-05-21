import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { PAGE_BG } from "@/components/marketing/animations";

export const metadata: Metadata = {
  title: { template: "%s — Community", default: "Community" },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ ...PAGE_BG, minHeight: "100vh" }}>
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
      
    </div>
  );
}
