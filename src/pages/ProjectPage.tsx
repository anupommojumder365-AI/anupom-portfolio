import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { projects } from "../data/projects";
import { CaseStudyContent } from "../components/projects/CaseStudyContent";
import { FoundationPage } from "./FoundationPage";
import { SectionHeading } from "../components/ui/SectionHeading";
import { ProjectShowcase } from "../components/projects/ProjectShowcase";
import { ProjectLinks } from "../components/projects/ProjectLinks";

export function ProjectsPage() {
  return (
    <>
      <SectionHeading
        as="h1"
        label="Portfolio / Documented work"
        title="Selected Work"
      >
        Explore projects, workflows, and case studies across AI and automation.
      </SectionHeading>
      <ProjectShowcase headingLevel="h2" />
    </>
  );
}
export function ProjectPage() {
  const { slug } = useParams();
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) return <FoundationPage kind="missing" />;
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/projects"
        className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-accent"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to projects
      </Link>
      <p className="eyebrow mb-4">
        {project.category} /{" "}
        {project.caseStudyPublished ? "Case study" : "Case study preview"}
      </p>
      <h1 className="mb-10 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        {project.title}
      </h1>
      <ProjectLinks project={project} />
      <CaseStudyContent project={project} headingLevel="h2" />
    </div>
  );
}
