import { featuredTechnologies, skillGroups } from "../../data/skills";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "./Badge";
import { Reveal } from "./Reveal";

const relatedProjects: Record<string, string> = {
  "Voice AI": "ai-voice-receptionist",
  "Workflow Automation": "b2b-lead-automation-engine",
  "Backend and Databases": "ai-networking-intelligence-agent",
};

export function FeaturedSkills() {
  return (
    <ul
      aria-label="Featured core skills"
      className="grid grid-cols-2 gap-x-5 sm:grid-cols-4 md:grid-cols-5"
    >
      {featuredTechnologies.map((technology, index) => (
        <li
          key={technology}
          className={featuredTechnologies.length % 4 === 2 && index === featuredTechnologies.length - 2 ? "sm:col-start-2 md:col-auto" : undefined}
        >
          <Reveal delay={index * 0.025}>
            <div className="hover-chip flex min-h-12 items-center border-b border-line px-1 py-2 text-[1rem] font-medium transition-colors">
              {technology}
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export function GroupedSkills({
  headingLevel = "h3",
}: {
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <div className="grid items-start gap-3 md:grid-cols-2 lg:grid-cols-3">
      {skillGroups.map((group, index) => (
        <section
          key={group.name}
          className={`surface min-w-0 p-5 ${index === skillGroups.length - 1 && skillGroups.length % 2 === 1 ? "md:col-span-2 md:flex md:items-start md:gap-6" : ""} ${index === skillGroups.length - 1 && skillGroups.length % 3 === 1 ? "lg:col-span-3 lg:flex lg:items-start lg:gap-6" : ""}`}
        >
          <div className={index === skillGroups.length - 1 ? "md:w-64 md:shrink-0" : undefined}>
            <Heading className="mb-3 text-lg font-semibold leading-tight">{group.name}</Heading>
          </div>
          <div>
            <ul className="-ml-1 flex flex-wrap gap-x-3 gap-y-1">
              {group.skills.map((skill) => (
                <li key={skill}>
                  <Badge>{skill}</Badge>
                </li>
              ))}
            </ul>
            {relatedProjects[group.name] ? (
              <Link to={`/projects/${relatedProjects[group.name]}`} aria-label={`View related project for ${group.name}`} className="mt-3 inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-accent">
                View related project <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </section>
      ))}
    </div>
  );
}
