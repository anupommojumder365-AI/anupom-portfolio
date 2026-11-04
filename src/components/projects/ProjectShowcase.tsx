import { lazy, Suspense, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { projects } from "../../data/projects";
import type { Project } from "../../types/project";
import { FeaturedProjectCard } from "./FeaturedProjectCard";
import { Reveal } from "../ui/Reveal";
import { AgentDemoCard } from "./AgentDemoCard";

const CaseStudyDrawer = lazy(() => import("./CaseStudyDrawer"));
const demoFilter = "Talk with one of my agents";
const filters = ["All", "Lead Gen", "Voice AI", "Agents", demoFilter] as const;

export function ProjectShowcase({
  headingLevel = "h3",
}: {
  headingLevel?: "h2" | "h3";
}) {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const visible = projects.filter(
    (project) =>
      project.featured &&
      (filter === "All" || project.showcaseGroup === filter),
  );
  return (
    <>
      <div
        role="group"
        aria-label="Filter featured projects"
        className="mb-8 flex flex-wrap gap-2"
      >
        {filters.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={`button px-5 ${filter === value ? "bg-ink text-white" : "border border-line bg-white text-muted hover:border-accent"}`}
          >
            {value}
          </button>
        ))}
      </div>
      <p role="status" className="sr-only">
        {filter === demoFilter
          ? "1 live agent demo shown"
          : `${visible.length} featured projects shown`}
      </p>
      <m.div layout className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <AnimatePresence initial={false}>
          {filter === demoFilter ? (
            <m.div
              key="dental-demo"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              className="lg:col-span-5"
            >
              <Reveal>
                <AgentDemoCard headingLevel={headingLevel} />
              </Reveal>
            </m.div>
          ) : null}
          {visible.map((project, index) => (
            <m.div
              key={project.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              className={
                project.featuredSize === "large"
                  ? "lg:col-span-3"
                  : "lg:col-span-2"
              }
            >
              <Reveal delay={index * 0.05} className="h-full">
                <FeaturedProjectCard
                  project={project}
                  index={index}
                  onOpen={setSelected}
                  headingLevel={headingLevel}
                />
              </Reveal>
            </m.div>
          ))}
        </AnimatePresence>
      </m.div>
      {selected ? (
        <Suspense
          fallback={
            <p
              role="status"
              className="fixed bottom-5 left-5 z-50 rounded-xl border border-line bg-white p-4 shadow-lg"
            >
              Opening case study…
            </p>
          }
        >
          <CaseStudyDrawer
            project={selected}
            onClose={() => setSelected(null)}
          />
        </Suspense>
      ) : null}
    </>
  );
}
