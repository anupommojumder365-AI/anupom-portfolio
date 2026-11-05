import {
  ArrowUpRight,
  ExternalLink,
  GitBranch,
  Mic,
  Network,
  Workflow,
} from "lucide-react";
import type { Project } from "../../types/project";
import { Badge } from "../ui/Badge";
import { AnimatedCounter } from "../ui/AnimatedCounter";
import { Spotlight } from "../ui/Spotlight";
import { isValidExternalUrl } from "../../lib/projects";

export function FeaturedProjectCard({
  project,
  index,
  onOpen,
  headingLevel = "h3",
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const Icon =
    project.showcaseGroup === "Voice AI"
      ? Mic
      : project.showcaseGroup === "Agents"
        ? Network
        : Workflow;
  return (
    <Spotlight
      className={`surface h-full ${project.clientWork ? "border-accent/30 bg-[#f1f5ef]" : ""}`}
    >
      <article className="flex h-full flex-col p-6 sm:p-8">
        <div className="mb-7 flex items-start justify-between gap-4">
          <span className="flex size-12 items-center justify-center rounded-xl border border-line bg-white text-accent">
            <Icon size={24} strokeWidth={1.4} aria-hidden="true" />
          </span>
          <span
            className={`font-mono text-[11px] uppercase tracking-wider ${project.clientWork ? "rounded-md bg-accent/10 px-2.5 py-1 font-semibold text-accent" : "text-muted"}`}
          >
            {project.clientWork
              ? "Client Work / Voice AI"
              : `Selected / 0${index + 1}`}
          </span>
        </div>
        <Heading className="mb-3 text-2xl font-semibold leading-tight tracking-tight">
          {project.title}
        </Heading>
        <p className="mb-5 text-sm leading-7 text-muted">
          {project.shortDescription}
        </p>
        <div className="mb-7 flex flex-wrap gap-1.5">
          {project.technologies.map((technology) => (
            <Badge key={technology}>{technology}</Badge>
          ))}
        </div>
        {project.metrics?.length ? (
          <dl className="mb-5 grid grid-cols-2 gap-5 border-y border-line py-5 sm:grid-cols-3">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <AnimatedCounter
                    value={metric.value}
                    className="block text-2xl font-semibold tracking-tight"
                  />
                  <span className="mt-1 block text-[11px] leading-5 text-muted">
                    {metric.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        {project.supportingNote ? (
          <p className="mb-4 text-xs leading-6 text-accent">
            {project.supportingNote}
          </p>
        ) : null}
        <p className="mb-6 text-[10px] leading-5 text-muted">
          Owner-supplied claims · measurement method, timeframe, and supporting evidence pending
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="button button-primary"
          >
            View Case Study
            <ArrowUpRight size={15} aria-hidden="true" />
          </button>
          {project.hideGithub ? null : isValidExternalUrl(project.githubUrl) ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-secondary"
            >
              <GitBranch size={15} aria-hidden="true" />
              GitHub
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="button button-secondary cursor-not-allowed! opacity-55"
              aria-label={`GitHub unavailable for ${project.title}`}
            >
              <GitBranch size={15} aria-hidden="true" />
              GitHub unavailable
            </button>
          )}
          {isValidExternalUrl(project.demoUrl) ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-secondary"
            >
              Try Live Demo
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </article>
    </Spotlight>
  );
}
