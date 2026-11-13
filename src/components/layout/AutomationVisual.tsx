import {
  ArrowRight,
  Bell,
  Bot,
  Check,
  Database,
  Network,
  Sparkles,
} from "lucide-react";
import { Spotlight } from "../ui/Spotlight";

export function AutomationVisual() {
  return (
    <Spotlight className="agent-visual rounded-[28px] border border-line bg-surface-raised/70 p-5 sm:p-8">
      <figure aria-label="Illustrative agent workflow: Business Request to AI Agent, Reasoning and Tool Calling, Business Systems, and Automated Result">
        <div className="mb-8 flex items-center justify-between text-[10px] uppercase tracking-[.15em] text-muted">
          <span>Inside the system</span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-accent" />
            Concept preview
          </span>
        </div>
        <div className="relative mx-auto max-w-md py-4">
          <svg
            viewBox="0 0 400 330"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 size-full"
            aria-hidden="true"
          >
            <path
              d="M200 48V280M200 150H65V230M200 150H335V230"
              fill="none"
              stroke="#bac7b9"
              strokeWidth="1.5"
            />
            <path
              className="flow-path"
              d="M200 48V280M200 150H65V230M200 150H335V230"
              fill="none"
              stroke="#1F6F4A"
              strokeWidth="1.5"
            />
          </svg>
          <div className="relative mx-auto mb-8 flex w-fit items-center gap-3 rounded-xl border border-line bg-white px-5 py-3 text-xs shadow-sm">
            <Bell size={16} className="text-accent" aria-hidden="true" />
            Business Request
            <ArrowRight size={12} aria-hidden="true" />
          </div>
          <div className="relative mx-auto mb-10 max-w-60 rounded-2xl border border-accent/30 bg-white p-5 text-center shadow-[0_10px_30px_-18px_#1f6f4a55]">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-accent text-white">
              <Bot size={26} strokeWidth={1.4} aria-hidden="true" />
            </div>
            <p className="text-lg font-semibold">AI Agent</p>
            <p className="mt-2 text-[11px] text-muted">
              Reasoning & Tool Calling
            </p>
            <div className="mt-3 flex justify-center gap-1.5">
              <span className="rounded bg-secondary px-2 py-1 text-[10px]">
                Plan
              </span>
              <span className="rounded bg-surface-raised px-2 py-1 text-[10px]">
                Execute
              </span>
              <span className="rounded bg-surface-raised px-2 py-1 text-[10px]">
                Review
              </span>
            </div>
          </div>
          <div className="relative grid grid-cols-3 gap-2">
            {[
              { name: "CRM", Icon: Network },
              { name: "Database", Icon: Database },
              { name: "API & Tasks", Icon: Sparkles },
            ].map(({ name, Icon }) => (
              <div
                key={name}
                className="rounded-xl border border-line bg-white px-1 py-4 text-center"
              >
                <Icon
                  size={19}
                  className="mx-auto mb-2 text-accent"
                  aria-hidden="true"
                />
                <p className="text-[10px] font-medium sm:text-xs">{name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between gap-3 rounded-xl bg-accent/5 p-3">
          <p className="text-xs text-accent">
            Business systems → Automated Result
          </p>
          <Check
            size={16}
            className="shrink-0 text-accent"
            aria-hidden="true"
          />
        </div>
        <figcaption className="mt-4 text-center text-[10px] text-muted">
          Illustrative architecture · not a live execution
        </figcaption>
      </figure>
    </Spotlight>
  );
}
