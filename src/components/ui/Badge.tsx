import type { ReactNode } from "react";
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-md border border-line bg-canvas px-2.5 py-1 text-xs text-muted">
      {children}
    </span>
  );
}
