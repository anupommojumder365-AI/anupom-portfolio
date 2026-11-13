import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { LinkButton } from "../ui/LinkButton";
import { Reveal } from "../ui/Reveal";
import { AnimatedCounter } from "../ui/AnimatedCounter";
import { FeaturedSkills, GroupedSkills } from "../ui/TechnicalSkills";
import { stackStatement } from "../../data/skills";
import { portfolioStatistics } from "../../data/profile";

export function StackSection() {
  return (
    <section id="skills" aria-label="Technical stack" className="home-section">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeading label="02 / The toolkit" title="Technical Stack">
          The right tools, connected with intention.
        </SectionHeading>
        <LinkButton to="/skills" variant="secondary">
          Explore Full Tech Stack
          <ArrowUpRight size={16} aria-hidden="true" />
        </LinkButton>
      </div>
      <FeaturedSkills />
      <div className="mt-6">
        <GroupedSkills />
      </div>
      <p className="mt-6 text-center text-sm leading-7 text-muted">
        {stackStatement}
      </p>
    </section>
  );
}

export function StatisticsSection() {
  return (
    <section aria-labelledby="stats-title" className="home-section">
      <h2
        id="stats-title"
        className="mb-9 text-3xl font-semibold tracking-tight"
      >
        The portfolio, at a glance.
      </h2>
      <dl className="grid gap-5 sm:grid-cols-3">
        {portfolioStatistics.map(({ label, value }, index) => (
          <Reveal
            key={label}
            className="surface p-6 sm:p-7"
            delay={index * 0.05}
          >
            <dt>
              <span className="eyebrow mb-3 block">0{index + 1}</span>
              <span className="text-sm text-muted">{label}</span>
            </dt>
            <dd className="mt-4">
              <AnimatedCounter
                value={value}
                className="text-5xl font-semibold tracking-tight"
              />
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
