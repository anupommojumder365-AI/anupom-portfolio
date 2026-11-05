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

export function configuredSupabase(): { url: string; key: string } | undefined {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !isValidExternalUrl(url) || !key?.startsWith("sb_publishable_")) return undefined;
  return { url: url.replace(/\/$/, ""), key };
}

export async function submitLead(
  data: LeadInput,
  requestId: string,
): Promise<void> {
  if (Object.keys(validateLead(data)).length)
    throw new Error("Please correct the highlighted fields.");
  const database = configuredSupabase();
  if (database) {
    const response = await fetch(`${database.url}/rest/v1/portfolio_contact_submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: database.key, Prefer: "return=minimal" },
      body: JSON.stringify({
        request_id: requestId, automation: data.automation, details: data.details.trim(),
        budget: data.budget, timeline: data.timeline, preferred_contact: data.preferredContact,
        name: data.name.trim(), email: data.email.trim(), company: data.company.trim(), whatsapp: data.whatsapp.trim(),
      }),
      signal: AbortSignal.timeout(15000), credentials: "omit", referrerPolicy: "no-referrer",
    });
    if (response.status !== 201 && response.status !== 204)
      throw new Error("The request could not be confirmed. Please email Anupom directly before retrying.");
    return;
  }
  throw new Error("Submission is not configured. Please email Anupom directly.");
}
