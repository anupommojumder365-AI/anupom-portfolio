import type { Project } from "../../types/project";
import { Spotlight } from "../ui/Spotlight";

export function FeaturedProjectCard({
  project,
  onOpen,
  headingLevel = "h3",
}: {
  project: Project;
  onOpen: (project: Project) => void;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <Spotlight className="surface h-full">
      <article className="flex h-full min-w-0 flex-col p-5 sm:p-6">
        <Heading className="mb-2 text-xl font-semibold leading-tight tracking-tight">
          {project.title}
        </Heading>
        <p className="mb-4 text-[1rem] leading-6 text-muted">
          {project.cardTagline ?? project.shortDescription}
        </p>
        <button type="button" onClick={() => onOpen(project)} className="mt-auto inline-flex min-h-11 w-fit items-center text-sm font-semibold text-accent">
          View Case Study
        </button>
      </article>
    </Spotlight>
  );
}
