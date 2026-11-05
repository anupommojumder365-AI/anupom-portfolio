import { featuredTechnologies, skillGroups } from "../../data/skills";
import { Badge } from "./Badge";
import { Reveal } from "./Reveal";

export function FeaturedSkills() {
  return (
    <ul
      aria-label="Featured core skills"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
    >
      {featuredTechnologies.map((technology, index) => (
        <li key={technology}>
          <Reveal delay={index * 0.025}>
            <div className="hover-chip surface flex min-h-24 items-center justify-center px-3 py-5 text-center text-sm font-semibold transition-colors hover:border-accent">
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
    <div className="grid gap-5 md:grid-cols-2">
      {skillGroups.map((group, index) => (
        <section key={group.name} className="surface p-7">
          <p className="eyebrow mb-3">0{index + 1}</p>
          <Heading className="mb-5 text-xl font-semibold">{group.name}</Heading>
          <ul className="flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <li key={skill}>
                <Badge>{skill}</Badge>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
