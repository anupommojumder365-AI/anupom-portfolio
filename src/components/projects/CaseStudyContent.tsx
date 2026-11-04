import { Workflow } from "lucide-react";
import type { Project } from "../../types/project";
import { Badge } from "../ui/Badge";
import { ScreenshotGallery } from "./ScreenshotGallery";

export function CaseStudyContent({
  project,
  headingLevel = "h3",
}: {
  project: Project;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <div className="space-y-9 text-sm leading-7">
      <section>
        <Heading className="mb-3 text-lg font-semibold">
          Project Overview
        </Heading>
        {project.clientWork ? (
          <p className="mb-3">
            <Badge>Client Work / Voice AI</Badge>
          </p>
        ) : null}
        <p className="text-muted">{project.shortDescription}</p>
        <p className="mt-3 text-xs text-muted">
          {project.caseStudyPublished
            ? "Published case study"
            : "Case study preview · documentation in progress"}
          . Project status has not been independently verified.
        </p>
      </section>
      <section>
        <Heading className="mb-3 text-lg font-semibold">
          Business Problem
        </Heading>
        <p className="text-muted">
          {project.problem ??
            "Business challenge documentation is pending. Add the confirmed problem statement to project data."}
        </p>
      </section>
      <section>
        <Heading className="mb-3 text-lg font-semibold">
          Workflow Architecture
        </Heading>
        <div className="rounded-xl border border-dashed border-line bg-surface-raised p-7 text-center">
          <Workflow className="mx-auto mb-3 text-accent" aria-hidden="true" />
          <p className="text-muted">
            {project.architectureDescription ??
              "Architecture diagram placeholder — actual workflow asset to be supplied."}
          </p>
          {project.architectureFlow?.length ? (
            <ol
              aria-label="Workflow architecture and data flow"
              className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm"
            >
              {project.architectureFlow.map((step, index) => (
                <li key={step} className="flex items-center gap-2">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-accent">
                      →
                    </span>
                  ) : null}
                  <span className="rounded-lg border border-line bg-white px-3 py-2">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </section>
      <section>
        <Heading className="mb-3 text-lg font-semibold">
          Solution and Approach
        </Heading>
        <p className="text-muted">
          {project.solution ?? "Detailed solution documentation is pending."}
        </p>
        {project.supportingNote ? (
          <p className="mt-3 text-accent">{project.supportingNote}</p>
        ) : null}
      </section>
      <section>
        <Heading className="mb-3 text-lg font-semibold">Workflow Steps</Heading>
        {project.workflowSteps.length ? (
          <ol className="list-decimal space-y-3 pl-5">
            {project.workflowSteps.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                <p className="text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-muted">
            Step-by-step implementation will be added when workflow
            documentation is supplied.
          </p>
        )}
      </section>
      <section>
        <Heading className="mb-3 text-lg font-semibold">Technologies</Heading>
        <div className="flex flex-wrap gap-2">
          {project.technologies.length ? (
            project.technologies.map((technology) => (
              <Badge key={technology}>{technology}</Badge>
            ))
          ) : (
            <p className="text-muted">Technology stack pending.</p>
          )}
        </div>
      </section>
      <section>
        <Heading className="mb-3 text-lg font-semibold">
          Challenges and Solutions
        </Heading>
        {project.challenges.length ? (
          <dl className="space-y-4">
            {project.challenges.map((entry) => (
              <div key={entry.challenge}>
                <dt className="font-semibold">{entry.challenge}</dt>
                <dd className="mt-1 text-muted">{entry.solution}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-muted">
            Challenge and resolution details have not yet been supplied.
          </p>
        )}
      </section>
      <section>
        <Heading className="mb-3 text-lg font-semibold">
          Reliability and Error Handling
        </Heading>
        <p className="text-muted">
          {project.reliability ??
            "Reliability and error-handling documentation has not yet been supplied."}
        </p>
      </section>
      <section>
        <Heading className="mb-3 text-lg font-semibold">
          Business Impact
        </Heading>
        <p className="text-muted">
          {project.businessValue ??
            "Business impact documentation is pending. Available owner-supplied metrics are listed below."}
        </p>
      </section>
      <section>
        <Heading className="mb-3 text-lg font-semibold">Results</Heading>
        {project.metrics?.length ? (
          <>
            <p className="mb-4 text-xs text-muted">
              The following claims were supplied by the portfolio owner. They
              have not been independently verified; supporting evidence is
              pending.
            </p>
            <ul className="space-y-2">
              {project.metrics.map((metric) => (
                <li key={metric.label}>
                  <strong className="text-accent">{metric.value}</strong>{" "}
                  {metric.label}
                </li>
              ))}
            </ul>
          </>
        ) : project.verifiedResults.length === 0 ? (
          <p className="text-muted">
            No outcome measurements have been supplied.
          </p>
        ) : null}
        {project.verifiedResults.length ? (
          <ul>
            {project.verifiedResults.map((result) => (
              <li key={result}>{result}</li>
            ))}
          </ul>
        ) : null}
      </section>
      <section>
        <Heading className="mb-3 text-lg font-semibold">
          Screenshot Gallery
        </Heading>
        <ScreenshotGallery key={project.id} screenshots={project.screenshots} />
      </section>
    </div>
  );
}
