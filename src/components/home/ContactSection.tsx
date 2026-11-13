import { ArrowUpRight } from "lucide-react";
import { EmailControls } from "../contact/EmailControls";
import { ContactForm } from "../contact/ContactForm";
import { SchedulingLink } from "./ServicesSection";
import { profile } from "../../data/profile";
import { isValidExternalUrl } from "../../lib/projects";
import { configuredSupabase } from "../../lib/contact";

export function ContactSection() {
  const formAvailable = Boolean(configuredSupabase());
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="home-section pb-6!"
    >
      <div className="mb-8 max-w-2xl">
        <p className="eyebrow mb-4">05 / Let’s Connect</p>
        <h2
          id="contact-title"
          className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
        >
          Let’s build something useful together.
        </h2>
        <p className="mt-5 leading-8 text-muted">
          Tell me what you want to automate, or book a call to discuss your project.
        </p>
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-14">
        <div>
          <p className="mb-7 flex items-center gap-2 text-sm text-accent">
            <span
              className="size-1.5 rounded-full bg-accent"
              aria-hidden="true"
            />
            Open to new projects and remote roles.
          </p>
          <EmailControls />
          <div className="mt-4 flex flex-wrap gap-5 text-sm">
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-accent"
            >
              LinkedIn
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            {isValidExternalUrl(profile.githubUrl) ? (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-accent"
              >
                GitHub
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            ) : (
              <span className="flex min-h-11 items-center text-muted">
                GitHub · coming soon
              </span>
            )}
          </div>
          <p className="mt-4 text-xs text-muted">
            Enquiries are reviewed manually.
          </p>
          <div className="my-7 border-t border-line pt-7">
            <h3 className="mb-6 text-lg font-semibold">What happens next</h3>
            <ol className="space-y-4">
              {[
                formAvailable ? "Send your enquiry using the form." : "Email me or book a call to share your enquiry.",
                "I can review your process and discuss the next steps with you.",
                "If it is a good fit, we can scope the build together.",
              ].map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line bg-white font-mono text-[10px] text-accent">
                    0{index + 1}
                  </span>
                  <p className="text-sm leading-7 text-muted">{step}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="border-t border-line pt-7">
            <p className="mb-4 text-sm">Prefer to talk now?</p>
            <SchedulingLink label="Book a call" />
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
