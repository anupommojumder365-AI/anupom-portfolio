import type { ReactNode } from "react";
import { m, useReducedMotion } from "motion/react";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.45, delay: reduced ? 0 : delay }}
    >
      {children}
    </m.div>
  );
}
