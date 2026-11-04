import { m, LazyMotion, domAnimation } from "motion/react";
import { ArrowRight, Layers3 } from "lucide-react";
import { LinkButton } from "../components/ui/LinkButton";
import { Badge } from "../components/ui/Badge";

const content = {
  home: {
    title: "A foundation for thoughtful automation.",
    description:
      "Anupom Mojumdar · AI Automation Engineer. The portfolio foundation is ready; the homepage will be built in Phase 2.",
  },
  projects: {
    title: "Project showcase",
    description:
      "Route foundation only. Project cards, search, and filters are scheduled for Phase 3.",
  },
  details: {
    title: "Project details",
    description:
      "Route foundation only. Verified project content and the reusable case study template are scheduled for Phase 4.",
  },
  missing: {
    title: "Page not found",
    description:
      "This address does not match a portfolio page. Use the navigation or return home.",
  },
};
export function FoundationPage({ kind }: { kind: keyof typeof content }) {
  const { title, description } = content[kind];
  return (
    <LazyMotion features={domAnimation}>
      <m.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="max-w-3xl"
      >
        <p className="eyebrow mb-7">
          {kind === "missing" ? "404 / Portfolio" : "Portfolio / Phase 01"}
        </p>
        <h1 className="mb-6 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
          {title}
        </h1>
        <p className="max-w-xl text-base leading-8 text-muted sm:text-lg">
          {description}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <LinkButton to={kind === "home" ? "/projects" : "/"}>
            {kind === "home" ? "Preview project route" : "Return home"}
            <ArrowRight size={16} aria-hidden="true" />
          </LinkButton>
        </div>
        {kind === "home" ? (
          <div className="surface mt-16 p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <Layers3 size={20} className="text-accent" aria-hidden="true" />
              <h2 className="text-lg font-semibold">
                Design system foundation
              </h2>
            </div>
            <p className="mb-6 text-sm leading-7 text-muted">
              Charcoal surfaces, restrained accents, responsive typography, and
              accessible controls. This temporary preview demonstrates the
              shared visual language.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge>React + TypeScript</Badge>
              <Badge>Tailwind CSS</Badge>
              <Badge>Motion</Badge>
            </div>
          </div>
        ) : null}
      </m.section>
    </LazyMotion>
  );
}
