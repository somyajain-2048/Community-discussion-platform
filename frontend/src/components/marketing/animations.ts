import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

export const stagger = (delay = 0.1): Variants => ({
  show: { transition: { staggerChildren: delay } },
});

export const PAGE_BG = {
  background:
    "radial-gradient(ellipse 80% 50% at 10% 0%, rgba(99,79,235,0.18) 0%, transparent 60%)," +
    "radial-gradient(ellipse 60% 40% at 90% 100%, rgba(139,68,220,0.14) 0%, transparent 60%)," +
    "#07090f",
  fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
};
