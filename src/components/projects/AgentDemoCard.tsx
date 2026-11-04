import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { agentDemo } from "../../data/agentDemo";
import { Spotlight } from "../ui/Spotlight";

export function AgentDemoCard({
  headingLevel = "h3",
}: {
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <Spotlight className="surface h-full">
      <article className="flex flex-col gap-7 p-6 sm:flex-row sm:items-center sm:p-8">
        {imageFailed ? (
          <div className="flex aspect-square w-full max-w-64 shrink-0 items-center justify-center rounded-xl border border-dashed border-line bg-surface-raised p-5 text-center text-sm text-muted">
            Avatar unavailable — add the supplied avater image.
          </div>
        ) : (
          <img
            src={agentDemo.avatar}
            alt="AI Dental Receptionist avatar"
            width={agentDemo.avatarWidth}
            height={agentDemo.avatarHeight}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="w-full max-w-64 shrink-0 rounded-xl border border-line object-contain sm:w-64"
          />
        )}
        <div>
          <p className="eyebrow mb-3">Live agent demo</p>
          <Heading className="mb-3 text-2xl font-semibold leading-tight tracking-tight">
            {agentDemo.title}
          </Heading>
          <p className="mb-6 text-sm leading-7 text-muted">
            {agentDemo.description}
          </p>
          <a
            href={agentDemo.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-primary"
          >
            Talk with me
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </article>
    </Spotlight>
  );
}
