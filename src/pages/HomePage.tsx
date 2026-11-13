import { HeroSection, AboutSection } from "../components/home/IntroSections";
import {
  StackSection,
  StatisticsSection,
} from "../components/home/StackAndStats";
import { ServicesSection } from "../components/home/ServicesSection";
import { ContactSection } from "../components/home/ContactSection";
import { ProjectShowcase } from "../components/projects/ProjectShowcase";
import { SectionHeading } from "../components/ui/SectionHeading";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <StackSection />
      <StatisticsSection />
      <section
        id="featured-projects"
        aria-label="Featured projects"
        className="home-section"
      >
        <SectionHeading label="03 / Featured Projects" title="Selected Work">
          Explore AI agents and workflows built to address real business needs.
        </SectionHeading>
        <ProjectShowcase />
      </section>
      <ServicesSection />
      <ContactSection />
    </>
  );
}
