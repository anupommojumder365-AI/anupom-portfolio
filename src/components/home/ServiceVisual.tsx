import { useRef } from "react";
import type { CSSProperties } from "react";
import { useInView } from "motion/react";
import { Bot, Check, Database, FileSearch, Workflow } from "lucide-react";

export function ServiceVisual({
  kind,
}: {
  kind: "voice" | "leads" | "rag" | "agents";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div
      ref={ref}
      className="service-visual my-3 flex h-16 items-center"
      data-active={visible}
      aria-hidden="true"
    >
      {kind === "voice" ? (
        <div className="service-art" data-kind="voice">
          {Array.from({ length: 18 }, (_, i) => (
            <span
              key={i}
              style={
                {
                  "--bar-height": `${14 + ((i * 17) % 42)}px`,
                  "--bar-index": i,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ) : kind === "leads" ? (
        <div className="flex w-full items-center gap-2">
          {["Capture", "Qualify", "Score", "CRM"].map((label, index) => (
            <div key={label} className="relative flex-1">
              <div className="mb-2 flex items-center gap-1.5 text-[10px] text-muted">
                <span className="size-1.5 rounded-full bg-accent" />
                {label}
              </div>
              <div
                className="pipeline-line h-1.5 origin-left rounded-full bg-accent/50"
                style={{ animationDelay: `${index * 150}ms` }}
              />
            </div>
          ))}
        </div>
      ) : kind === "rag" ? (
        <div className="flex min-w-0 items-center gap-2 text-accent">
          <FileSearch size={26} strokeWidth={1.3} />
          <span className="text-line">→</span>
          <div className="min-w-0">
            <p className="retrieval-text w-fit overflow-hidden whitespace-nowrap border-r border-accent pr-2 font-mono text-[10px]">
              Retrieving context…
            </p>
            <p className="mt-2 text-[10px] text-muted">
              Knowledge → grounded answer
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-accent">
          {[Workflow, Bot, Database, Check].map((Icon, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="execution-node rounded-xl border border-accent/25 bg-accent/5 p-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <Icon size={16} strokeWidth={1.5} />
              </span>
              {index < 3 ? <span className="h-px w-2 bg-accent/30" /> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
