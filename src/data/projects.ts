import type { Project, ProjectCategory } from "../types/project.ts";

const drafts: { title: string; slug: string; category: ProjectCategory }[] = [
  {
    title: "B2B Lead Automation Engine",
    slug: "b2b-lead-automation-engine",
    category: "Lead Generation",
  },
  {
    title: "RAG Customer Support Agent",
    slug: "rag-customer-support-agent",
    category: "RAG Systems",
  },
  {
    title: "AI Voice Receptionist",
    slug: "ai-voice-receptionist",
    category: "AI Voice Agents",
  },
  {
    title: "CRM and Lead Management Automation",
    slug: "crm-lead-management-automation",
    category: "CRM Automation",
  },
];

// Editable intended scope inferred from supplied titles, not verified implementations.
const draftSummaries: Record<string, string> = {
  "b2b-lead-automation-engine":
    "Draft scope: a connected workflow for B2B lead operations. Implementation and integrations await verification.",
  "rag-customer-support-agent":
    "Draft scope: a customer support agent with knowledge retrieval. Sources and implementation await verification.",
  "ai-voice-receptionist":
    "Draft scope: an AI voice interface for reception enquiries. Call flows and deployment await verification.",
  "crm-lead-management-automation":
    "Draft scope: connected CRM and lead management workflows. Implementation details await verification.",
};

// Draft records only. Confirm actual status and content before publishing.
export const projects: Project[] = drafts.map((draft) => ({
  ...draft,
  id: draft.slug,
  shortDescription:
    draftSummaries[draft.slug] ??
    "Editable placeholder: details pending verification.",
  status: "In Progress",
  featured: false,
  builtVerified: false,
  technologies: [],
  screenshots: [],
  workflowSteps: [],
  challenges: [],
  verifiedResults: [],
  caseStudyPublished: false,
}));

// Supplied by the owner in the redesign brief. Claims are not independent measurements.
const suppliedMetrics = (entries: [string, string][]) =>
  entries.map(([value, label]) => ({
    value,
    label,
    source: "user-supplied" as const,
    independentlyVerified: false,
  }));

Object.assign(
  projects.find((project) => project.slug === "b2b-lead-automation-engine")!,
  {
    featured: true,
    featuredSize: "large",
    showcaseGroup: "Lead Gen",
    shortDescription:
      "An AI-driven engine that finds, qualifies, and scores B2B leads, then routes them into the CRM with automated follow-ups.",
    technologies: ["n8n", "OpenAI API", "CRM", "Webhooks", "REST APIs"],
    solution:
      "Enrichment, routing, and follow-ups run automatically through CRM, webhook, and third-party API integrations.",
    problem:
      "Manual lead intake, qualification, and CRM updates can slow down follow-up and make lead handling harder to track.",
    architectureDescription:
      "The supplied n8n workflow connects webhook intake, data validation, and a HubSpot lookup. Existing contacts follow an update path; new leads follow company enrichment, OpenAI qualification, and tier-based sales actions. Auxiliary re-engagement, metrics, and summary paths need further connection and production hardening.",
    architectureFlow: [
      "Webhook intake",
      "Clean and validate",
      "HubSpot existing / new check",
      "New lead: enrich and score",
      "New lead: tier routing",
    ],
    workflowSteps: [
      {
        title: "Receive and validate",
        description:
          "A webhook receives a lead, assigns an identifier, normalizes the payload, and filters invalid email data.",
      },
      {
        title: "Match and enrich",
        description:
          "The workflow checks HubSpot for an existing contact and prepares or updates contact information; company information is fetched using the email domain.",
      },
      {
        title: "Qualify with AI",
        description:
          "OpenAI evaluates the lead and returns a score, tier, reason, and recommended action for routing.",
      },
      {
        title: "Route and follow up",
        description:
          "HOT, WARM, and COLD branches lead to the configured CRM actions, sales alerts, or nurture and courtesy messages.",
      },
      {
        title: "Log and monitor",
        description:
          "Configured Google Sheets logging and an error workflow record processing and failures; supplementary reporting paths require further hardening.",
      },
    ],
    challenges: [
      {
        challenge: "Handling invalid or failed workflow runs",
        solution:
          "Validation flags invalid lead data; a separate error trigger formats failure details, alerts the operator, and logs to a dead-letter sheet.",
      },
    ],
    reliability:
      "The supplied workflow includes invalid-data handling and an error-trigger path with a technical alert and dead-letter log. The repository notes that auxiliary metrics, re-engagement and summary paths need production hardening.",
    businessValue:
      "The workflow is designed to reduce manual qualification and help sales teams prioritize inbound leads, with traceable CRM and failure records.",
    githubUrl:
      "https://github.com/anupommojumder365-AI/B2B-Lead-Automation-Engine-with-AI",
    screenshots: [
      {
        src: "/projects/b2b-lead-automation-engine/lead-automation-workflow.jpg",
        alt: "n8n canvas showing the B2B lead intake, qualification, routing and error workflows",
        caption:
          "Supplied n8n workflow canvas: lead processing, routing and error handling.",
      },
    ],
    metrics: suppliedMetrics([
      ["500+", "leads processed per week"],
      ["70%", "less manual qualification time"],
      ["95%", "tracking accuracy"],
    ]),
  },
);
Object.assign(
  projects.find((project) => project.slug === "ai-voice-receptionist")!,
  {
    title: "AI Voice Agent & Call Automation",
    featured: true,
    showcaseGroup: "Voice AI",
    githubUrl:
      "https://github.com/anupommojumder365-AI/lunatic-dental-ai-receptionist",
    shortDescription:
      "Inbound and outbound voice agents that handle calls, book appointments, and trigger follow-ups without a human on the line.",
    technologies: ["Retell AI", "Bland AI", "OpenAI API", "Make", "Webhooks"],
    problem:
      "Manual call handling and follow-up create a need for a more consistent way to handle enquiries and appointment requests.",
    solution:
      "The supplied project description covers inbound and outbound voice agents that handle calls, book appointments, and trigger follow-ups.",
    architectureDescription:
      "Owner-supplied application architecture: Next.js, TypeScript, and Tailwind CSS, with source maintained on GitHub and deployment managed through Vercel. An ElevenLabs voice agent and Simli avatar coordinate audio and video during the conversation.",
    architectureFlow: [
      "Visitor",
      "ElevenLabs Agent",
      "Audio Conversion",
      "Simli Avatar",
      "Synchronized Audio and Video",
    ],
    workflowSteps: [
      {
        title: "Session Initialization",
        description:
          "The visitor starts a conversation and grants microphone access. A server-side API generates a Simli session token.",
      },
      {
        title: "Voice Conversation",
        description:
          "The existing ElevenLabs agent processes speech and generates responses, while the interface displays conversation status and transcripts.",
      },
      {
        title: "Avatar Synchronization",
        description:
          "Generated audio is converted from 48 kHz to 16 kHz PCM and streamed to Simli, which renders the avatar and plays synchronized audio.",
      },
      {
        title: "Session Management",
        description:
          "Microphone controls, interruption handling, and session cleanup coordinate the conversation and avatar connections.",
      },
    ],
    reliability:
      "The supplied architecture states that API keys remain server-side and the browser receives only session credentials.",
    screenshots: [
      {
        src: "/projects/ai-voice-receptionist/voice-agent-dashboard.jpg",
        alt: "AI receptionist dashboard showing conversation and usage summaries",
        caption: "Supplied AI receptionist dashboard; figures are a snapshot, not independently verified outcomes.",
      },
      {
        src: "/projects/ai-voice-receptionist/voice-agent-analytics.jpg",
        alt: "ElevenLabs AI receptionist analytics and conversation topics",
        caption: "Supplied AI receptionist analytics and conversation topics.",
      },
    ],
    businessValue:
      "The supplied metrics describe call volume, CRM transcript logging, and reduced tele-calling workload; independent supporting evidence is pending.",
    metrics: suppliedMetrics([
      ["100+", "calls handled per week"],
      ["100%", "of transcripts logged to the CRM"],
      ["60%", "less tele-calling workload"],
    ]),
  },
);

// Preserve the original four records and their slugs; add only newly supplied projects.
const newSuppliedProjects: Project[] = [
  {
    id: "ai-networking-intelligence-agent",
    slug: "ai-networking-intelligence-agent",
    title: "AI Networking Intelligence Agent",
    category: "AI Agents",
    showcaseGroup: "Agents",
    shortDescription:
      "An on-demand system that discovers relevant professionals and posts, scores them, and drafts personalised connection messages and comments for manual review.",
    technologies: [
      "n8n",
      "Supabase",
      "Claude",
      "OpenAI",
      "Brave Search",
      "Telegram",
    ],
    solution:
      "It maintains a deduplicated database and a complete audit trail.",
    problem:
      "Finding relevant professionals and discussions, assessing their relevance, and preparing individualized outreach requires repeated research and review.",
    architectureDescription:
      "Four n8n workflows route allowlisted Telegram commands, orchestrate research, deliver reviewable results, and handle errors. Supabase stores research and run information; outreach remains manual.",
    architectureFlow: [
      "Telegram allowlist",
      "Brave Search research",
      "Claude / OpenAI analysis",
      "Supabase storage",
      "Telegram review",
    ],
    workflowSteps: [
      {
        title: "Authorize and route",
        description:
          "The Telegram command router checks an allowlist and routes requests to stored data or the research orchestrator.",
      },
      {
        title: "Discover and deduplicate",
        description:
          "The orchestrator builds search queries, uses Brave Search, filters results, and removes duplicates.",
      },
      {
        title: "Analyze and store",
        description:
          "Claude, with an OpenAI fallback, analyzes and scores candidates; results and research history are stored in Supabase.",
      },
      {
        title: "Review and act manually",
        description:
          "Telegram delivers reviewable recommendations and draft notes. The user reviews and carries out outreach manually, then may mark actions as done.",
      },
    ],
    challenges: [
      {
        challenge: "Keeping outreach under human control",
        solution:
          "The system prepares suggestions for review; LinkedIn actions are performed manually by the user.",
      },
    ],
    reliability:
      "The supplied documentation describes Claude-to-OpenAI fallback, stop checkpoints, and a central error workflow that logs redacted failures and alerts the owner through Telegram.",
    businessValue:
      "The project supports repeatable professional research and reviewable outreach preparation while retaining a record of runs and decisions.",
    githubUrl:
      "https://github.com/anupommojumder365-AI/ai-networking-intelligence-agent",
    supportingNote:
      "Human-in-the-loop approval. Nothing is sent without manual approval.",
    metrics: suppliedMetrics([
      ["2 hours", "of daily research reduced to minutes"],
      ["14 hours", "saved per week"],
      ["56+ hours", "saved per month"],
    ]),
    status: "In Progress",
    featured: true,
    builtVerified: false,
    screenshots: [
      {
        src: "/projects/ai-networking-intelligence-agent/research-orchestrator.png",
        alt: "n8n research orchestrator workflow canvas",
        caption: "Supplied research orchestrator workflow in n8n.",
      },
      {
        src: "/projects/ai-networking-intelligence-agent/research-dashboard.png",
        alt: "Networking research dashboard overview",
        caption:
          "Supplied dashboard view; counts represent a captured run, not a verified performance result.",
      },
    ],
    verifiedResults: [],
    caseStudyPublished: false,
  },
  {
    id: "ai-sophie",
    slug: "ai-sophie",
    title: "AI Sophie: AI Call Answering for NCL Marketing Ltd",
    category: "AI Voice Agents",
    showcaseGroup: "Voice AI",
    clientWork: true,
    featuredSize: "large",
    shortDescription:
      "A 24/7 voice agent that answers calls, qualifies callers, logs the details, and syncs leads to the CRM automatically.",
    problem: "Missed calls and slow intake meant lost client enquiries.",
    solution:
      "A 24/7 voice agent that answers calls, qualifies callers, logs the details, and syncs leads to the CRM automatically.",
    businessValue:
      "The client-work brief describes a way to capture enquiries and move qualified caller information into the CRM. The supplied metrics below remain unverified.",
    hideGithub: true,
    technologies: ["ElevenLabs", "n8n", "Supabase", "HubSpot"],
    metrics: suppliedMetrics([
      ["70%", "of calls answered"],
      ["14 hours", "saved per week"],
    ]),
    status: "In Progress",
    featured: true,
    builtVerified: false,
    screenshots: [
      {
        src: "/projects/ai-sophie/sophie-analytics.png",
        alt: "AI Sophie analytics dashboard showing success rate and response time",
        caption: "Supplied AI Sophie analytics dashboard; figures are a snapshot, not independently verified outcomes.",
      },
    ],
    workflowSteps: [],
    challenges: [],
    verifiedResults: [],
    caseStudyPublished: false,
  },
];
projects.push(...newSuppliedProjects);
