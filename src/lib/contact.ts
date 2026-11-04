import { isValidExternalUrl } from "./projects";

export const automationTypes = [
  "Voice AI Agent",
  "Lead Generation",
  "RAG Assistant",
  "Custom AI Agent",
  "Not sure yet",
] as const;
export const budgets = [
  "Under $500",
  "$500–$2k",
  "$2k–$5k",
  "$5k+",
  "Not sure",
] as const;
export const timelines = ["ASAP", "1 month", "Flexible"] as const;
export const contactMethods = ["Email", "WhatsApp"] as const;
export interface LeadInput {
  automation: string;
  details: string;
  budget: string;
  timeline: string;
  preferredContact: string;
  name: string;
  email: string;
  company: string;
  whatsapp: string;
  websiteTrap: string;
}
export type LeadErrors = Partial<Record<keyof LeadInput, string>>;
export const emptyLead: LeadInput = {
  automation: "",
  details: "",
  budget: "",
  timeline: "",
  preferredContact: "Email",
  name: "",
  email: "",
  company: "",
  whatsapp: "",
  websiteTrap: "",
};
export const fieldsByStep: (keyof LeadInput)[][] = [
  ["automation", "details"],
  ["budget", "timeline", "preferredContact"],
  ["name", "email", "company", "whatsapp"],
];

export function validateLead(data: LeadInput): LeadErrors {
  const errors: LeadErrors = {};
  if (!automationTypes.some((value) => value === data.automation))
    errors.automation = "Choose what you want to automate.";
  if (data.details.trim().length < 20)
    errors.details = "Describe your process in at least 20 characters.";
  if (data.details.length > 5000)
    errors.details = "Keep project details under 5,000 characters.";
  if (!budgets.some((value) => value === data.budget))
    errors.budget = "Select a budget range.";
  if (!timelines.some((value) => value === data.timeline))
    errors.timeline = "Choose a timeline.";
  if (!contactMethods.some((value) => value === data.preferredContact))
    errors.preferredContact = "Choose a contact method.";
  if (data.name.trim().length < 2 || data.name.length > 100)
    errors.name = "Enter your full name (2–100 characters).";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()) ||
    data.email.length > 254
  )
    errors.email = "Enter a valid work email.";
  if (data.company.length > 300)
    errors.company = "Keep company or website under 300 characters.";
  if (
    data.preferredContact === "WhatsApp" &&
    !/^\+?[\d\s().-]{7,25}$/.test(data.whatsapp.trim())
  )
    errors.whatsapp = "Enter a WhatsApp number, including country code.";
  if (data.websiteTrap) errors.websiteTrap = "Request could not be accepted.";
  return errors;
}

export function configuredWebhook(): string | undefined {
  const value = import.meta.env.VITE_CONTACT_WEBHOOK_URL?.trim();
  return isValidExternalUrl(value) ? value : undefined;
}

// Public endpoint only. Credentials and Turnstile verification belong on the server.
// n8n must validate, deduplicate requestId, deliver/store privately, then acknowledge.
export async function submitLead(
  data: LeadInput,
  requestId: string,
  options?: { endpoint?: string; turnstileToken?: string },
): Promise<void> {
  if (Object.keys(validateLead(data)).length)
    throw new Error("Please correct the highlighted fields.");
  const endpoint = options?.endpoint ?? configuredWebhook();
  if (!endpoint || !isValidExternalUrl(endpoint))
    throw new Error(
      "Submission is not configured. Please email Anupom directly.",
    );
  const { websiteTrap: _honeypot, ...lead } = data;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...lead,
      requestId,
      turnstileToken: options?.turnstileToken,
      source: "portfolio-contact",
    }),
    signal: AbortSignal.timeout(15000),
    credentials: "omit",
    referrerPolicy: "no-referrer",
  });
  if (!response.ok)
    throw new Error(
      "The request could not be confirmed. Please retry or email Anupom directly.",
    );
  let result: unknown;
  try {
    result = await response.json();
  } catch {
    throw new Error(
      "Delivery was not confirmed. Please retry or email Anupom directly.",
    );
  }
  if (
    !result ||
    typeof result !== "object" ||
    !("success" in result) ||
    result.success !== true ||
    !("requestId" in result) ||
    result.requestId !== requestId
  ) {
    throw new Error(
      "Delivery was not confirmed. Please retry or email Anupom directly.",
    );
  }
}
