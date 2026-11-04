export const profile: {
  name: string;
  email: string;
  linkedinUrl: string;
  githubUrl?: string;
  schedulingUrl?: string;
} = {
  name: "Anupom Mojumder",
  email: "anupommojumdernew@gmail.com",
  linkedinUrl: "https://linkedin.com/in/anupommojumder",
  schedulingUrl: "https://calendly.com/anupom-mojumder/30min",
};

// Owner-supplied broader experience; independent of documented project counts.
export const portfolioStatistics = [
  { label: "Total Projects Built", value: "50+" },
  { label: "Live Projects", value: "30+" },
  { label: "Completed Projects", value: "50+" },
] as const;

export const aboutParagraphs = [
  "I'm Anupom Mojumder, an AI Automation Engineer. I design and ship production-grade AI systems: voice agents, RAG pipelines, and end-to-end workflows that replace manual operations and run reliably without supervision.",
  "I build with Claude Code and Codex to move from idea to deployed system faster, with cleaner code and tighter iteration. My core stack covers n8n, Make, the OpenAI API, LangChain, MCP, Retell AI, Python, and Node.js.",
  "My Economics background shapes how I work. Before building anything, I ask what it costs, what it saves, and how fast it pays back. I deliver systems that are measured against business outcomes, not just technically impressive.",
];
