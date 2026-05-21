"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { stagger } from "./animations";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function Section({ children, className = "", delay = 0.1 }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      variants={stagger(delay)}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}
