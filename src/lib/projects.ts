import type { Project } from "../types/project";

export function isValidExternalUrl(value?: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return (
      ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export function getProjectStatistics(projects: readonly Project[]) {
  return {
    total: projects.length,
    totalBuilt: projects.filter((project) => project.builtVerified).length,
    live: projects.filter((project) => isValidExternalUrl(project.demoUrl))
      .length,
    completed: projects.filter((project) => project.status === "Completed")
      .length,
    publishedCaseStudies: projects.filter(
      (project) => project.caseStudyPublished,
    ).length,
  };
}
