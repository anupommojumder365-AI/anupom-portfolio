import { Link } from "react-router";
import { profile } from "../../data/profile";
import { isValidExternalUrl } from "../../lib/projects";
const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-8 border-t border-line bg-surface-raised py-8">
      <div className="container-shell">
        <div className="flex flex-wrap justify-between gap-10">
          <div>
            <p className="mb-4 text-lg font-semibold">{profile.name}</p>
            <p className="max-w-xs text-2xl font-medium leading-tight tracking-tight">
              Tools change. Good systems last. Let’s build one.
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-7 gap-y-2 text-sm text-muted"
          >
            <Link
              className="inline-flex min-h-11 items-center hover:text-accent"
              to="/projects"
            >
              Projects
            </Link>
            <Link
              className="inline-flex min-h-11 items-center hover:text-accent"
              to="/skills"
            >
              Skills
            </Link>
            <a
              className="inline-flex min-h-11 items-center hover:text-accent"
              href="/#services"
            >
              Services
            </a>
            <a
              className="inline-flex min-h-11 items-center hover:text-accent"
              href="/#contact"
            >
              Contact
            </a>
          </nav>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-xs text-muted">
          <p>
            © {currentYear} {profile.name}
          </p>
          <div className="flex gap-5">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-11 items-center hover:text-accent"
            >
              Email
            </a>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center hover:text-accent"
            >
              LinkedIn ↗
            </a>
            {isValidExternalUrl(profile.githubUrl) ? (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center hover:text-accent"
              >
                GitHub ↗
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
