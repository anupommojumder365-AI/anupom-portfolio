import { useState } from "react";

// Remount with a src key when changing images so loading/error state is isolated.
export function ScreenshotImage({
  src,
  alt,
  enlarged = false,
}: {
  src: string;
  alt: string;
  enlarged?: boolean;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  return (
    <div
      className={`relative flex items-center justify-center ${enlarged ? "h-full min-h-0 w-full" : "aspect-video w-full rounded-lg bg-surface-raised"}`}
    >
      {status !== "error" ? (
        <img
          src={src}
          alt={alt}
          loading={enlarged ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={
            enlarged
              ? "max-h-full max-w-full object-contain"
              : "size-full rounded-lg object-contain"
          }
        />
      ) : null}
      {status !== "loaded" ? (
        <p
          role="status"
          className="absolute inset-0 flex items-center justify-center p-4 text-center text-xs text-muted"
        >
          {status === "error"
            ? "Image unavailable. Please try again later."
            : "Loading screenshot…"}
        </p>
      ) : null}
    </div>
  );
}
