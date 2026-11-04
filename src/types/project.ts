export const projectCategories = [
  "AI Agents",
  "n8n Automation",
  "CRM Automation",
  "RAG Systems",
  "AI Voice Agents",
  "Lead Generation",
  "API Integrations",
] as const;
export type ProjectCategory = (typeof projectCategories)[number];
export type ProjectStatus = "Completed" | "In Progress" | "Archived";
export interface ProjectMetric {
  value: string;
  label: string;
  source: "user-supplied";
  independentlyVerified: boolean;
}
export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: ProjectCategory;
  status: ProjectStatus;
  featured: boolean;
  builtVerified: boolean;
  technologies: string[];
  thumbnail?: string;
  screenshots: { src: string; alt: string; caption?: string }[];
  problem?: string;
  solution?: string;
  workflowSteps: { title: string; description: string }[];
  architectureDescription?: string;
  architectureFlow?: string[];
  reliability?: string;
  challenges: { challenge: string; solution: string }[];
  businessValue?: string;
  verifiedResults: string[];
  demoUrl?: string;
  githubUrl?: string;
  hideGithub?: boolean;
  caseStudyPublished: boolean;
  metrics?: ProjectMetric[];
  clientWork?: boolean;
  featuredSize?: "large" | "standard";
  showcaseGroup?: "Lead Gen" | "Voice AI" | "Agents";
  supportingNote?: string;
}
