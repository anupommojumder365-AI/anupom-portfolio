import type { ReactNode } from "react";

export function Spotlight({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`spotlight ${className}`}
      onPointerMove={(event) => {
        if (
          event.pointerType !== "mouse" ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        const bounds = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty(
          "--pointer-x",
          `${event.clientX - bounds.left}px`,
        );
        event.currentTarget.style.setProperty(
          "--pointer-y",
          `${event.clientY - bounds.top}px`,
        );
      }}
    >
      {children}
    </div>
  );
}
