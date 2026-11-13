import type { ReactNode } from "react";
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="hover-chip inline-flex rounded px-1 py-0.5 text-xs leading-6 text-muted">
      {children}
    </span>
  );
}
