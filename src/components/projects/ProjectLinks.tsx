import { ExternalLink, GitBranch } from "lucide-react";
import type { Project } from "../../types/project";
import { isValidExternalUrl } from "../../lib/projects";

export function ProjectLinks({ project }: { project: Project }) {
  const demo = isValidExternalUrl(project.demoUrl);
  const github = !project.hideGithub && isValidExternalUrl(project.githubUrl);
  if (!demo && !github) return null;
  return (
    <div className="mb-9 flex flex-wrap gap-3" aria-label="Project links">
      {demo ? (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="button button-primary"
        >
          Try Live Demo
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      ) : null}
      {github ? (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="button button-secondary"
        >
          <GitBranch size={16} aria-hidden="true" />
          GitHub
        </a>
      ) : null}
    </div>
  );
}
