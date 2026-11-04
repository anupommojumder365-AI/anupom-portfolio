import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, X } from "lucide-react";
import { useReducedMotion } from "motion/react";
import type { Project } from "../../types/project";
import { CaseStudyContent } from "./CaseStudyContent";
import { ProjectLinks } from "./ProjectLinks";
import { lockPageScroll } from "../../lib/scrollLock";

export default function CaseStudyDrawer({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [closing, setClosing] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const dialog = ref.current!;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    dialog.showModal();
    const unlock = lockPageScroll();
    closeRef.current?.focus();
    return () => {
      dialog.close();
      unlock();
      previous?.focus();
    };
  }, []);
  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(onClose, reduced ? 0 : 180);
    return () => window.clearTimeout(timer);
  }, [closing, onClose, reduced]);
  const close = () => setClosing(true);
  return (
    <dialog
      ref={ref}
      className="case-drawer"
      aria-labelledby="case-study-title"
      data-closing={closing}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClick={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.target === event.currentTarget &&
          (event.clientX < bounds.left || event.clientX > bounds.right)
        )
          close();
      }}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-canvas/95 px-6 py-4 backdrop-blur-sm">
        <p className="eyebrow">
          {project.caseStudyPublished ? "Case study" : "Case study / Preview"}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          className="button button-secondary px-3"
          aria-label="Close case study"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="p-6 sm:p-10">
        <h2
          id="case-study-title"
          className="mb-5 text-3xl font-semibold tracking-tight"
        >
          {project.title}
        </h2>
        <Link
          to={`/projects/${project.slug}`}
          onClick={onClose}
          className="mb-9 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent"
        >
          Open dedicated project page
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
        <ProjectLinks project={project} />
        <CaseStudyContent project={project} />
      </div>
    </dialog>
  );
}
