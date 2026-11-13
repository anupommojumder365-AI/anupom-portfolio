import { useState } from "react";
import { ArrowDown, ArrowUpRight, Phone } from "lucide-react";
import { AutomationVisual } from "../layout/AutomationVisual";
import { Reveal } from "../ui/Reveal";
import { aboutParagraphs, profile } from "../../data/profile";

const portraits = import.meta.glob<string>(
  "/selfpic.{jpg,jpeg,png,webp,avif}",
  { eager: true, query: "?url", import: "default" },
);
const portrait = Object.values(portraits)[0];

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="grid items-center gap-10 pb-16 pt-4 lg:grid-cols-[1.12fr_1fr] lg:gap-14 lg:pb-24"
    >
      <Reveal>
        <p className="eyebrow mb-7">
          Independent engineer / Intelligent operations
        </p>
        <h1
          id="hero-title"
          className="max-w-2xl text-[clamp(2.7rem,5.3vw,4.7rem)] font-semibold leading-[1.06] tracking-[-.055em]"
        >
          Autonomous AI systems for{" "}
          <span className="font-serif font-normal italic text-accent">
            modern operations
          </span>
        </h1>
        <p className="mt-7 max-w-lg text-base leading-8 text-muted sm:text-lg">
          I build AI agents, voice assistants, RAG systems, and connected
          workflows to help businesses reduce manual work and streamline operations.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href="#featured-projects" className="button button-primary">
            Explore My Work
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <a href="#contact" className="button button-secondary">
            Let’s Connect
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <button type="button" aria-label="Ask About Anupom — recruiter assistant" onClick={() => window.dispatchEvent(new Event("open-recruiter-assistant"))} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent">
          <Phone size={16} aria-hidden="true" /> Ask About Anupom
        </button>
        <p className="mt-7 flex items-center gap-3 text-xs text-muted">
          <span
            className="size-1.5 rounded-full bg-accent"
            aria-hidden="true"
          />
          Open to new projects and remote roles.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <AutomationVisual />
      </Reveal>
      <a
        href="#about"
        className="flex w-fit items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted lg:col-span-2"
      >
        A little more about me
        <ArrowDown size={13} aria-hidden="true" />
      </a>
    </section>
  );
}

export function AboutSection() {
  const [failed, setFailed] = useState(false);
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="home-section grid items-center gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-16"
    >
      <Reveal>
        <div className="rounded-[24px] border border-line bg-surface-raised p-3">
          <div className="relative aspect-[4/4.2] overflow-hidden rounded-2xl bg-[#e9e9e4]">
            {portrait && !failed ? (
              <img
                src={portrait}
                alt={`${profile.name}, AI Automation Engineer`}
                loading="lazy"
                width={1600}
                height={900}
                className="size-full object-cover object-[50%_35%]"
                onError={() => setFailed(true)}
              />
            ) : (
              <div className="flex size-full items-center justify-center p-8 text-center text-muted">
                Portrait placeholder — add selfpic with its actual image
                extension at the project root.
              </div>
            )}
            <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/70 bg-white/95 px-5 py-4">
              <p className="text-sm font-semibold">{profile.name}</p>
              <p className="mt-1 text-xs text-muted">AI Automation Engineer</p>
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal>
        <p className="eyebrow mb-4">01 / The engineer behind the systems</p>
        <h2
          id="about-title"
          className="mb-7 text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          About Me<span className="text-accent">.</span>
        </h2>
        <div className="max-w-prose space-y-4 text-sm leading-8 text-muted">
          {aboutParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-8 border-t border-line pt-5 text-xs font-medium text-accent">
          Business-first thinking. Engineering that follows through.
        </div>
      </Reveal>
    </section>
  );
}
