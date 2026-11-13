import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { profile } from "../../data/profile";

export function EmailControls() {
  const [status, setStatus] = useState<"idle" | "copying" | "copied" | "error">(
    "idle",
  );
  const copyEmail = async () => {
    setStatus("copying");
    try {
      await navigator.clipboard.writeText(profile.email);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  };
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <a href={`mailto:${profile.email}`} className="button button-primary">
          <Mail size={18} aria-hidden="true" />
          Email me
        </a>
        <button
          type="button"
          onClick={copyEmail}
          disabled={status === "copying"}
          className="button button-secondary px-3"
          aria-label="Copy email address"
        >
          {status === "copied" ? (
            <Check size={18} aria-hidden="true" />
          ) : (
            <Copy size={18} aria-hidden="true" />
          )}
        </button>
      </div>
      <p role="status" className={status === "idle" ? "sr-only" : "mt-2 text-xs text-muted"}>
        {status === "copied"
          ? "Email copied"
          : status === "error"
            ? "Couldn’t copy. Use Email me to open your email app."
            : status === "copying"
              ? "Copying…"
              : ""}
      </p>
    </div>
  );
}
