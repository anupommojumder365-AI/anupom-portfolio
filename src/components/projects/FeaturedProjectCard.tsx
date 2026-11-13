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
      <article className="flex h-full min-w-0 flex-col p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-accent">
            <Icon size={20} strokeWidth={1.4} aria-hidden="true" />
          </span>
          <span
            className={`font-mono text-[11px] uppercase tracking-wider ${project.clientWork ? "hover-chip rounded-md bg-accent/10 px-2.5 py-1 font-semibold text-accent" : "text-muted"}`}
          >
            {project.clientWork
              ? "Client Work / Voice AI"
              : `Selected / 0${index + 1}`}
          </span>
        </div>
        <Heading className="mb-3 text-xl font-semibold leading-tight tracking-tight">
          {project.title}
        </Heading>
        <p className="mb-4 max-w-prose text-[1rem] leading-7 text-muted">
          {project.shortDescription}
        </p>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.technologies.map((technology) => (
            <Badge key={technology}>{technology}</Badge>
          ))}
        </div>
        {project.metrics?.length ? (
          <dl className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(85px,1fr))] gap-x-4 gap-y-3 border-y border-line py-3">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="min-w-0">
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <AnimatedCounter
                    value={metric.value}
                    className="block text-lg font-semibold leading-tight tracking-tight"
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
        <div className="mt-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="button button-primary px-3 text-[0.95rem]"
          >
            View Case Study
            <ArrowUpRight size={15} aria-hidden="true" />
          </button>
          {project.hideGithub ? null : isValidExternalUrl(project.githubUrl) ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-secondary px-3 text-[0.95rem]"
            >
              <GitBranch size={15} aria-hidden="true" />
              GitHub
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="button button-secondary cursor-not-allowed! px-3 text-[0.95rem] opacity-55"
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
              className="button button-secondary px-3 text-[0.95rem]"
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
