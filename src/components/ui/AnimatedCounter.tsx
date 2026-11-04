import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export function AnimatedCounter({
  value,
  className = "",
}: {
  value: string | number;
  className?: string;
}) {
  const text = String(value);
  const match = text.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const numeric = Boolean(match);
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const frame = useRef(0);
  useEffect(() => {
    if (!visible || reduced || !numeric) return;
    const start = performance.now();
    const tick = (now: number) => {
      const amount = Math.min((now - start) / 850, 1);
      setProgress(1 - (1 - amount) ** 3);
      if (amount < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [visible, reduced, numeric, text]);
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {reduced || !match
          ? text
          : `${Math.round(target * progress)}${match[2]}`}
      </span>
    </span>
  );
}
