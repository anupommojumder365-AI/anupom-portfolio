import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Project } from "../../types/project";
import { ScreenshotImage } from "./ScreenshotImage";
import { lockPageScroll } from "../../lib/scrollLock";

export default function ScreenshotLightbox({
  screenshots,
  index,
  onNavigate,
  onClose,
}: {
  screenshots: Project["screenshots"];
  index: number;
  onNavigate: (index: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const screenshot = screenshots[index];
  const move = (offset: number) =>
    onNavigate((index + offset + screenshots.length) % screenshots.length);
  useEffect(() => {
    const dialog = dialogRef.current!;
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
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-canvas p-0 text-ink"
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        // Portal events must not reach the underlying case study drawer.
        event.stopPropagation();
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
        if (event.key === "Tab") {
          const buttons = Array.from(
            event.currentTarget.querySelectorAll<HTMLButtonElement>(
              "button:not([disabled])",
            ),
          );
          const first = buttons[0];
          const last = buttons[buttons.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }
      }}
    >
      <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto]">
        <div className="flex items-center justify-between gap-4 border-b border-line p-4 sm:px-8">
          <h2 id={titleId} className="text-lg font-semibold">
            Workflow screenshots
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close screenshot"
            className="button button-secondary shrink-0 px-3"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 p-4 sm:p-8">
          <ScreenshotImage
            key={screenshot.src}
            src={screenshot.src}
            alt={screenshot.alt}
            enlarged
          />
        </div>
        <div className="border-t border-line bg-surface p-4 sm:px-8">
          <p className="mb-3 max-h-28 overflow-y-auto break-words text-sm text-muted">
            {screenshot.caption || screenshot.alt}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={screenshots.length < 2}
              onClick={() => move(-1)}
              aria-label="Previous screenshot"
              className="button button-secondary px-3 disabled:cursor-default disabled:opacity-50"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <p role="status" aria-atomic="true" className="text-xs text-muted">
              Screenshot {index + 1} of {screenshots.length}
            </p>
            <button
              type="button"
              disabled={screenshots.length < 2}
              onClick={() => move(1)}
              aria-label="Next screenshot"
              className="button button-secondary px-3 disabled:cursor-default disabled:opacity-50"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
