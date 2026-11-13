import { featuredTechnologies, skillGroups } from "../../data/skills";
import { Badge } from "./Badge";
import { Reveal } from "./Reveal";

export function FeaturedSkills() {
  return (
    <ul
      aria-label="Featured core skills"
      className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5"
    >
      {featuredTechnologies.map((technology, index) => (
        <li
          key={technology}
          className={featuredTechnologies.length % 4 === 2 && index === featuredTechnologies.length - 2 ? "sm:col-start-2 md:col-auto" : undefined}
        >
          <Reveal delay={index * 0.025}>
            <div className="hover-chip surface flex min-h-14 items-center justify-center px-2 py-3 text-center text-[1rem] font-semibold transition-colors hover:border-accent">
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
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {skillGroups.map((group, index) => (
        <section
          key={group.name}
          className={`surface min-w-0 p-5 ${index === skillGroups.length - 1 && skillGroups.length % 2 === 1 ? "md:col-span-2 md:flex md:items-start md:gap-6" : ""} ${index === skillGroups.length - 1 && skillGroups.length % 3 === 1 ? "lg:col-span-3 lg:flex lg:items-start lg:gap-6" : ""}`}
        >
          <div className={index === skillGroups.length - 1 ? "md:w-64 md:shrink-0" : undefined}>
            <p className="eyebrow mb-2">0{index + 1}</p>
            <Heading className="mb-4 text-lg font-semibold leading-tight">{group.name}</Heading>
          </div>
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
