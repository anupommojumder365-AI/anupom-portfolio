import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { SectionHeading } from "../ui/SectionHeading";
import { Spotlight } from "../ui/Spotlight";
import { Badge } from "../ui/Badge";
import { Reveal } from "../ui/Reveal";
import { services } from "../../data/services";
import { profile } from "../../data/profile";
import { isValidExternalUrl } from "../../lib/projects";
import { ServiceVisual } from "./ServiceVisual";

export function SchedulingLink({
  label = "Book a Strategy Call",
}: {
  label?: string;
}) {
  return isValidExternalUrl(profile.schedulingUrl) ? (
    <a
      className="button button-primary"
      href={profile.schedulingUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  ) : (
    <span className="inline-flex flex-col gap-2">
      <button
        type="button"
        disabled
        className="button button-secondary cursor-not-allowed! opacity-60"
      >
        {label}
      </button>
      <span className="text-[10px] text-muted">
        Scheduling link coming soon.
      </span>
    </span>
  );
}

export function ServicesSection() {
  return (
    <section id="services" aria-label="Services" className="home-section">
      <SectionHeading
        label="04 / How I Can Help"
        title="Systems that remove manual work."
      >
        Four ways I help businesses automate, scale, and save time.
      </SectionHeading>
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service, index) => (
          <Reveal
            key={service.kind}
            delay={index * 0.05}
            className="h-full min-w-0"
          >
            <Spotlight className="service-card surface h-full p-5 sm:p-6">
              <article className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted">
                    SERVICE / 0{index + 1}
                  </span>
                  <span className="text-xl text-accent" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <ServiceVisual kind={service.kind} />
                <h3 className="mb-3 text-xl font-semibold leading-tight tracking-tight">
                  {service.title}
                </h3>
                <p className="mb-4 text-[1rem] leading-7 text-muted">
                  {service.description}
                </p>
                {"proof" in service ? (
                  <div className="mb-5 rounded-xl bg-accent/5 p-3 text-[0.95rem] leading-6 font-medium text-accent">
                    <p>{service.proof}</p>
                  </div>
                ) : (
                  <p className="mb-5 text-[0.95rem] leading-6 text-accent">
                    {"context" in service ? service.context : ""}
                  </p>
                )}
                <div className="service-details mt-auto border-t border-line pt-4">
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {service.technologies.map((technology) => (
                      <Badge key={technology}>{technology}</Badge>
                    ))}
                  </div>
                  <Link
                    to={`/projects/${service.project}`}
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent"
                  >
                    Explore related project
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </Spotlight>
          </Reveal>
        ))}
      </div>
      <ol className="my-16 grid gap-7 md:grid-cols-3">
        {[
          {
            title: "Discover",
            description:
              "Map the business process, bottlenecks, costs, and expected ROI.",
          },
          {
            title: "Build",
            description:
              "Design, develop, test, and deploy a working automation system.",
          },
          {
            title: "Support",
            description: "Monitor performance, improve reliability, and scale.",
          },
        ].map((step, index) => (
          <li
            key={step.title}
            className="relative border-l border-accent/30 pl-6 md:border-l-0 md:border-t md:pl-0 md:pt-6"
          >
            <span className="mb-3 block font-mono text-xs text-accent">
              0{index + 1}
            </span>
            <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
            <p className="max-w-xs text-sm leading-7 text-muted">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-surface-raised p-7 sm:p-10">
        <h3 className="max-w-lg text-2xl font-semibold tracking-tight sm:text-3xl">
          Have a process that eats your time?
        </h3>
        <SchedulingLink />
      </div>
    </section>
  );
}
