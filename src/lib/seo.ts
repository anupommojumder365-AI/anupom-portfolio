import { profile } from "../data/profile.ts";
import { projects } from "../data/projects.ts";

export function siteOrigin(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    )
      return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

export const publicRoutes = [
  "/",
  "/projects",
  "/skills",
  ...projects.map((project) => `/projects/${project.slug}`),
];

export function pageSeo(pathname: string) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const project = projects.find((entry) => path === `/projects/${entry.slug}`);
  const known = publicRoutes.includes(path);
  const page =
    path === "/"
      ? "AI Automation Engineer"
      : path === "/projects"
        ? "Selected Work"
        : path === "/skills"
          ? "Technical Stack"
          : (project?.title ?? "Page not found");
  const description =
    project?.shortDescription ??
    (path === "/projects"
      ? "Explore Anupom Mojumder’s documented AI agents, voice systems, and automation projects."
      : path === "/skills"
        ? "Explore Anupom Mojumder’s technical stack for AI agents, workflow automation, voice AI, and integrations."
        : path === "/"
          ? "Anupom Mojumder, AI Automation Engineer. AI agents, voice systems, and business workflow automation."
          : "This address does not match a portfolio page. Explore Anupom Mojumder’s AI automation work.");
  return { title: `${page} | ${profile.name}`, description, path, known };
}
