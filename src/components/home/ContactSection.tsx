import { ArrowUpRight, CalendarDays } from "lucide-react";
import { EmailControls } from "../contact/EmailControls";
import { ContactForm } from "../contact/ContactForm";
import { profile } from "../../data/profile";
import { isValidExternalUrl } from "../../lib/projects";

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="home-section pb-6!">
      <div className="mb-8 max-w-2xl">
        <p className="eyebrow mb-4">05 / Let’s Connect</p>
        <h2 id="contact-title" className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Let’s build something useful together.
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted">
          Get in touch about a role, a project, or an idea.
        </p>
      </div>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-8">
        <div className="rounded-2xl border border-line bg-surface-raised/50 p-5 sm:p-6">
          <h3 className="text-lg font-semibold tracking-tight">Get in touch</h3>
          <p className="mt-2 text-sm leading-7 text-muted">Choose the way that works for you.</p>
          <div className="mt-5 flex flex-wrap items-start gap-3">
            <EmailControls />
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="button button-secondary">
              LinkedIn <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            {isValidExternalUrl(profile.schedulingUrl) ? (
              <a href={profile.schedulingUrl} target="_blank" rel="noopener noreferrer" className="button button-secondary">
                <CalendarDays size={17} aria-hidden="true" /> Book a call
              </a>
            ) : (
              <span className="inline-flex flex-col gap-2">
                <button type="button" disabled className="button button-secondary cursor-not-allowed! opacity-60">Book a call</button>
                <span className="text-xs text-muted">Scheduling link coming soon.</span>
              </span>
            )}
          </div>
          <div className="mt-6 border-t border-line pt-4">
            <p className="text-xs leading-6 text-muted">Open to new projects and remote roles. Enquiries are reviewed manually.</p>
            {isValidExternalUrl(profile.githubUrl) ? (
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center gap-2 text-xs font-medium text-accent">
                GitHub <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
