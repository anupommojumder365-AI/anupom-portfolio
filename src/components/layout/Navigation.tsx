import { useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { profile } from "../../data/profile";

export function Navigation() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);
  return (
    <header className="border-b border-line bg-canvas">
      <div className="container-shell flex min-h-22 flex-wrap items-center justify-between gap-4 py-4">
        <Link
          to="/"
          onClick={close}
          aria-label={`${profile.name} home`}
          className="flex items-center gap-3 font-semibold tracking-tight"
        >
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-xl border border-line bg-accent font-mono text-sm text-white"
          >
            AM
          </span>
          <span className="text-sm sm:text-base">
            {profile.name}
            <span className="mt-0.5 block text-[10px] font-normal tracking-normal text-muted">
              AI Automation Engineer
            </span>
          </span>
        </Link>
        <button
          ref={toggleRef}
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen(!open)}
          className="button button-secondary px-3 lg:hidden"
        >
          {open ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
        </button>
        <nav
          id="primary-navigation"
          aria-label="Primary"
          className={`${open ? "flex" : "hidden"} w-full flex-col gap-1 lg:flex lg:w-auto lg:flex-row`}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              close();
              toggleRef.current?.focus();
            }
          }}
        >
          <NavLink to="/" end className="nav-link" onClick={close}>
            Home
          </NavLink>
          <NavLink to="/projects" className="nav-link" onClick={close}>
            Projects
          </NavLink>
          <NavLink to="/skills" className="nav-link" onClick={close}>
            Skills
          </NavLink>
          <a href="/#about" className="nav-link" onClick={close}>
            About
          </a>
          <a href="/#services" className="nav-link" onClick={close}>
            Services
          </a>
          <a
            href="/#contact"
            className="button button-primary lg:ml-3"
            onClick={close}
          >
            Let’s talk <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}
