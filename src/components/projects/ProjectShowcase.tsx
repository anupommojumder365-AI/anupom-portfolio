import { lazy, Suspense, useState } from "react";
import { Phone } from "lucide-react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { projects } from "../../data/projects";
import type { Project } from "../../types/project";
import { FeaturedProjectCard } from "./FeaturedProjectCard";
import { Reveal } from "../ui/Reveal";
import { AgentDemoCard } from "./AgentDemoCard";

const CaseStudyDrawer = lazy(() => import("./CaseStudyDrawer"));
const demoFilter = "Agent Demos";
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
            title={value === demoFilter ? "Filter to show the live agent demo" : undefined}
            className={`button px-4 ${filter === value ? "bg-ink text-white" : value === demoFilter ? "border border-accent/40 bg-accent/5 text-accent" : "border border-line bg-white text-muted hover:border-accent"}`}
          >
            {value === demoFilter ? <Phone size={16} aria-hidden="true" /> : null}
            {value}
          </button>
        ))}
      </div>
      <p role="status" className="sr-only">
        {filter === demoFilter
          ? "1 live agent demo shown"
          : `${visible.length} featured projects shown`}
      </p>
      <m.div layout className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
        <AnimatePresence initial={false}>
          {filter === demoFilter ? (
            <m.div
              key="dental-demo"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              className="w-full max-w-3xl justify-self-center md:col-span-2"
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
                visible.length % 2 === 1 && index === visible.length - 1
                  ? "w-full md:col-span-2 md:mx-auto md:max-w-[calc((100%-1rem)/2)]"
                  : undefined
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
