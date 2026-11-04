import { stackStatement } from "../data/skills";
import { SectionHeading } from "../components/ui/SectionHeading";
import {
  FeaturedSkills,
  GroupedSkills,
} from "../components/ui/TechnicalSkills";

export function SkillsPage() {
  return (
    <>
      <SectionHeading
        as="h1"
        label="The complete toolkit"
        title="Technical Stack"
      >
        {stackStatement}
      </SectionHeading>
      <FeaturedSkills />
      <div className="mt-10">
        <GroupedSkills headingLevel="h2" />
      </div>
    </>
  );
}
