import { useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import {
  automationTypes,
  budgets,
  configuredSupabase,
  contactMethods,
  emptyLead,
  fieldsByStep,
  submitLead,
  timelines,
  validateLead,
} from "../../lib/contact";
import type { LeadInput } from "../../lib/contact";
import { ChoiceField } from "./ChoiceField";
import { profile } from "../../data/profile";

const stepTitles = ["Project", "Budget & timeline", "Contact"];

export function ContactForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<LeadInput>({ ...emptyLead });
  const [touched, setTouched] = useState<
    Partial<Record<keyof LeadInput, boolean>>
  >({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const busy = useRef(false);
  const requestId = useRef("");
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errors = validateLead(data);
  const endpoint = configuredSupabase();
  const update = (key: keyof LeadInput, value: string) => {
    setData((previous) => ({ ...previous, [key]: value }));
    requestId.current = "";
    setStatus("idle");
    setMessage("");
  };
  const touch = (key: keyof LeadInput) =>
    setTouched((previous) => ({ ...previous, [key]: true }));
  const showError = (key: keyof LeadInput) =>
    touched[key] ? errors[key] : undefined;
  const move = (next: number) => {
    setStep(next);
    window.setTimeout(() => headingRef.current?.focus(), 0);
  };
  const next = () => {
    const keys = fieldsByStep[step];
    setTouched((previous) => ({
      ...previous,
      ...Object.fromEntries(keys.map((key) => [key, true])),
    }));
    if (keys.some((key) => errors[key])) {
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>(
            '[aria-invalid="true"] input, input[aria-invalid="true"], textarea[aria-invalid="true"]',
          )
          ?.focus(),
      );
      return;
    }
    move(step + 1);
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy.current) return;
    if (step < 2) {
      next();
      return;
    }
    setTouched(Object.fromEntries(Object.keys(data).map((key) => [key, true])));
    const invalidStep = fieldsByStep.findIndex((keys) =>
      keys.some((key) => errors[key]),
    );
    if (invalidStep >= 0) {
      move(invalidStep);
      return;
    }
    if (!endpoint) {
      setMessage("Submission is not configured. Please email Anupom directly.");
      return;
    }
    busy.current = true;
    if (!requestId.current) requestId.current = crypto.randomUUID();
    setStatus("loading");
    setMessage("");
    try {
      await submitLead(data, requestId.current);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error &&
          !["TypeError", "TimeoutError"].includes(error.name)
          ? error.message
          : "Unable to confirm delivery. Please retry or email Anupom directly.",
      );
    } finally {
      busy.current = false;
    }
  };
  const field = (
    key: "name" | "email" | "company" | "whatsapp",
    label: string,
    type = "text",
    required = false,
  ) => (
    <div className="mb-4" key={key}>
      <label htmlFor={`lead-${key}`} className="text-sm font-semibold">
        {label}
        {required ? (
          <span className="text-accent" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      <input
        id={`lead-${key}`}
        name={key}
        type={type}
        autoComplete={
          key === "name"
            ? "name"
            : key === "email"
              ? "email"
              : key === "whatsapp"
                ? "tel"
                : "organization"
        }
        required={required}
        maxLength={
          key === "name"
            ? 100
            : key === "email"
              ? 254
              : key === "whatsapp"
                ? 25
                : 300
        }
        className="field"
        value={data[key]}
        onChange={(event) => update(key, event.target.value)}
        onBlur={() => touch(key)}
        aria-invalid={Boolean(showError(key))}
        aria-describedby={showError(key) ? `${key}-error` : undefined}
      />
      <div className={showError(key) || (touched[key] && data[key] && !errors[key]) ? "mt-2" : ""} aria-live="polite">
        {showError(key) ? (
          <p id={`${key}-error`} className="text-xs text-red-700">
            {showError(key)}
          </p>
        ) : touched[key] && data[key] && !errors[key] ? (
          <span className="flex items-center gap-1 text-xs text-accent">
            <Check size={12} aria-hidden="true" />
            Looks good
          </span>
        ) : null}
      </div>
    </div>
  );

  if (status === "success")
    return (
      <div
        className="surface form-step flex flex-col items-center justify-center p-10 text-center"
        role="status"
      >
        <ShieldCheck
          size={40}
          className="mb-6 text-accent"
          aria-hidden="true"
        />
        <h3 className="text-2xl font-semibold">
          Thanks, {data.name.trim()}. Your request is in.
        </h3>
        <p className="mt-4 text-muted">Your enquiry has been saved for review.</p>
      </div>
    );

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      noValidate
      className="surface w-full min-w-0 p-5 sm:p-6"
      aria-label="Project enquiry"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold">Project enquiry</p>
        <p className="text-xs text-muted">Step {step + 1} of {stepTitles.length}</p>
      </div>
      <ol className="mb-6 flex gap-2" aria-label="Form progress">
        {stepTitles.map((title, index) => (
          <li
            key={title}
            aria-current={step === index ? "step" : undefined}
            className="flex-1"
          >
            <span
              className={`mb-2 block h-1 rounded-full ${index <= step ? "bg-accent" : "bg-line"}`}
            />
            <span
              className={`text-[10px] sm:text-xs ${index === step ? "font-semibold text-accent" : "text-muted"}`}
            >
              {index + 1}. {title}
            </span>
          </li>
        ))}
      </ol>
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="mb-5 text-lg font-semibold outline-none"
      >
        {step === 0
          ? "What are you working on?"
          : step === 1
            ? "A little about the scope."
            : "Where can I reach you?"}
      </h3>
      <fieldset disabled={status === "loading"} className="min-w-0">
        <div className="form-step" key={step}>
          {step === 0 ? (
            <>
              <ChoiceField
                label="What do you want to automate?"
                name="automation"
                options={automationTypes}
                value={data.automation}
                error={showError("automation")}
                onChange={(value) => {
                  update("automation", value);
                  touch("automation");
                }}
              />
              <label htmlFor="lead-details" className="text-sm font-semibold">
                Project Details{" "}
                <span className="text-accent" aria-hidden="true">
                  *
                </span>
              </label>
              <textarea
                id="lead-details"
                name="details"
                rows={4}
                required
                minLength={20}
                maxLength={5000}
                placeholder="Describe the process, the tools you use, and the problem."
                className="field resize-y"
                value={data.details}
                onChange={(event) => update("details", event.target.value)}
                onBlur={() => touch("details")}
                aria-invalid={Boolean(showError("details"))}
                aria-describedby="details-help details-error"
              />
              <p id="details-help" className="mt-1 text-xs text-muted">
                20–5,000 characters. Please leave out passwords and sensitive
                data.
              </p>
              <p id="details-error" className="mt-2 text-xs text-red-700">
                {showError("details")}
              </p>
            </>
          ) : step === 1 ? (
            <>
              <ChoiceField
                label="Budget Range"
                name="budget"
                options={budgets}
                value={data.budget}
                error={showError("budget")}
                onChange={(value) => {
                  update("budget", value);
                  touch("budget");
                }}
              />
              <ChoiceField
                label="Timeline"
                name="timeline"
                options={timelines}
                value={data.timeline}
                error={showError("timeline")}
                onChange={(value) => {
                  update("timeline", value);
                  touch("timeline");
                }}
              />
              <ChoiceField
                label="Preferred Contact"
                name="preferredContact"
                options={contactMethods}
                value={data.preferredContact}
                error={showError("preferredContact")}
                onChange={(value) => update("preferredContact", value)}
              />
            </>
          ) : (
            <>
              {field("name", "Full Name", "text", true)}
              {field("email", "Work Email", "email", true)}
              {field("company", "Company / Website (optional)")}
              {data.preferredContact === "WhatsApp"
                ? field("whatsapp", "WhatsApp number", "tel", true)
                : null}
            </>
          )}
        </div>
        <div
          className="absolute -left-[10000px] top-auto size-px overflow-hidden"
          aria-hidden="true"
        >
          <label htmlFor="lead-website-trap">Leave this field empty</label>
          <input
            id="lead-website-trap"
            name="websiteTrap"
            tabIndex={-1}
            autoComplete="off"
            value={data.websiteTrap}
            onChange={(event) => update("websiteTrap", event.target.value)}
          />
        </div>
        <div className="mt-5 flex justify-between gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => move(step - 1)}
              className="button button-secondary whitespace-nowrap px-3 text-[1rem]"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Back
            </button>
          ) : (
            <span />
          )}
          {step < 2 ? (
            <button type="submit" className="button button-primary whitespace-nowrap px-3 text-[1rem]">
              Continue
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!endpoint || status === "loading"}
              className="button button-primary whitespace-nowrap px-3 text-[1rem] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? (
                <>
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  Sending…
                </>
              ) : (
                "Send Request"
              )}
            </button>
          )}
        </div>
      </fieldset>
      <p className="mt-4 text-xs text-muted">
        Please share only the information needed to discuss your enquiry.
      </p>
      {!endpoint ? (
        <p className="mt-4 rounded-lg bg-surface-raised p-3 text-xs leading-6 text-muted">
          Form delivery is not configured yet. You can explore the steps; to
          send your enquiry,{" "}
          <a
            className="font-medium text-accent underline"
            href={`mailto:${profile.email}`}
          >
            email Anupom directly
          </a>
          .
        </p>
      ) : null}
      <p role="alert" className="mt-3 text-sm text-red-700">
        {message}
      </p>
    </form>
  );
}
