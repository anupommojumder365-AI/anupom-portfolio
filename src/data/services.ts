export const services = [
  {
    title: "Voice AI Agents",
    tagline: "Voice agents for calls and appointment requests.",
    kind: "voice",
    project: "ai-voice-receptionist",
    description:
      "Inbound and outbound agents that answer calls, qualify callers, book appointments, and log everything to your CRM.",
    proof: "100+ calls per week handled, 60% less tele-calling workload.",
    technologies: ["Retell AI", "Bland AI", "ElevenLabs"],
  },
  {
    title: "Lead Generation & Sales Automation",
    tagline: "Find, qualify, and route sales leads.",
    kind: "leads",
    project: "b2b-lead-automation-engine",
    description:
      "AI pipelines that find, enrich, score, and route leads, then trigger follow-ups automatically.",
    proof: "500+ leads per week, 70% less qualification time.",
    technologies: ["n8n", "OpenAI", "CRM", "Webhooks"],
  },
  {
    title: "RAG & Knowledge Assistants",
    tagline: "Assistants grounded in your business knowledge.",
    kind: "rag",
    project: "rag-customer-support-agent",
    description:
      "Assistants grounded in your own data that answer customers and staff accurately across websites, WhatsApp, Messenger, and Telegram.",
    context: "Support, sales, and internal knowledge.",
    technologies: ["RAG", "Pinecone", "ChromaDB", "LangChain"],
  },
  {
    title: "Custom AI Agents & Workflows",
    tagline: "Purpose-built agents for business processes.",
    kind: "agents",
    project: "ai-networking-intelligence-agent",
    description:
      "Multi-step agents with tool calling, human-in-the-loop approval, and audit trails built around business processes.",
    proof: "Two hours of daily research reduced to minutes.",
    technologies: ["n8n", "Claude", "MCP", "Supabase"],
  },
] as const;
