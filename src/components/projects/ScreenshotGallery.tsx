import { lazy, Suspense, useState } from "react";
import { Image as ImageIcon, Expand } from "lucide-react";
import type { Project } from "../../types/project";
import { ScreenshotImage } from "./ScreenshotImage";

const ScreenshotLightbox = lazy(() => import("./ScreenshotLightbox"));

export function ScreenshotGallery({
  screenshots,
}: {
  screenshots: Project["screenshots"];
}) {
  const [selected, setSelected] = useState<number | null>(null);
  if (!screenshots.length)
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {["Workflow overview", "Workflow detail"].map((label) => (
          <div
            key={label}
            className="rounded-xl border border-dashed border-line bg-surface-raised p-7 text-center"
          >
            <ImageIcon className="mx-auto mb-3 text-muted" aria-hidden="true" />
            <p className="font-medium">{label}</p>
            <p className="mt-2 text-xs text-muted">
              Screenshot placeholder — actual workflow image not yet supplied.
            </p>
          </div>
        ))}
      </div>
    );
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {screenshots.map((screenshot, index) => (
          <figure key={screenshot.src} className="min-w-0">
            <button
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Enlarge screenshot ${index + 1}: ${screenshot.alt}`}
              className="group relative block w-full rounded-lg border border-line transition-colors hover:border-accent"
            >
              <ScreenshotImage
                key={screenshot.src}
                src={screenshot.src}
                alt={screenshot.alt}
              />
              <span className="absolute right-2 bottom-2 rounded-lg border border-line bg-surface p-2 text-accent">
                <Expand size={18} aria-hidden="true" />
              </span>
            </button>
            <figcaption className="mt-2 break-words text-xs text-muted">
              {screenshot.caption || screenshot.alt}
            </figcaption>
          </figure>
        ))}
      </div>
      {selected !== null ? (
        <Suspense
          fallback={
            <p role="status" className="mt-3 text-xs text-muted">
              Opening screenshot…
            </p>
          }
        >
          <ScreenshotLightbox
            screenshots={screenshots}
            index={selected}
            onNavigate={setSelected}
            onClose={() => setSelected(null)}
          />
        </Suspense>
      ) : null}
    </>
  );
}
