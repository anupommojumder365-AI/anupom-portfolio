# Anupom Mojumder — AI Automation Portfolio

Existing React + Vite + TypeScript application, redesigned with a warm off-white and deep-green visual system. Includes the homepage, categorized Skills page, selected project collection, case study drawer and dedicated project URLs. No hosting or backend infrastructure has been added or deployed.

## Run locally

Use Node.js 24 and npm. On Windows, use npm.cmd if PowerShell blocks npm.ps1.

    npm.cmd ci
    npm.cmd run dev

Open the Local URL printed by Vite, normally http://localhost:5173. Stop with Ctrl+C.

    npm.cmd run build
    npm.cmd run preview

The build includes strict TypeScript checks and writes production assets to dist. Future hosting must rewrite application routes to index.html for BrowserRouter deep links.

## Deployment readiness

The app is configured for Vercel's Vite preset: use the repository root, `npm ci`, `npm run build`, and output directory `dist` with Node.js 24. `vercel.json` enables clean URLs for the generated route HTML files and a single-page-app fallback. Other static hosts need equivalent clean-URL handling and an SPA fallback. The fallback renders the custom not-found page, but an unknown URL can still receive HTTP 200 from static hosting; configure a host-level 404 response if a true HTTP 404 is required. No deployment has been made.

When the actual HTTPS production origin is known, set `VITE_SITE_URL` in the production build environment to that origin only, such as `https://your-domain.example` (no path, credentials, query, or fragment), and rebuild. The build rejects invalid nonempty values. The example is only a format illustration: do not use it as the site's domain. The build then generates canonical and absolute social-image URLs for each route, a `sitemap.xml` containing the home, projects, skills, and project routes, and a sitemap reference in `robots.txt`. Keep the variable unset for preview builds unless they should point at the production canonical origin. Without it, no canonical or social-image URLs are invented and no sitemap is generated.

Page-specific titles, descriptions, Open Graph, and X metadata are included in the generated HTML files as well as updated on client navigation. The actual page body is client-rendered and requires JavaScript. The social image is `public/social-portrait.jpeg`, a copy of the current portrait; update it if the portrait changes. After deploying in a later phase, verify direct project URLs and reloads, the canonical domain, `robots.txt`, `sitemap.xml`, and social previews on the real host. Test unknown routes too: hosting status behavior is not verified locally.

The contact form uses email fallback until the Supabase public URL and publishable key are configured. `VITE_` values are public build-time configuration, never secret storage. `.gitignore` excludes environment files, build output, test artifacts, and the original project-source folders; only reviewed copies of screenshots in `public/projects` are intended for publishing. Inspect all files staged for GitHub before sharing, including the dashboard screenshots and source images.

## Content and configuration

- src/data/profile.ts: name, supplied email and LinkedIn, optional GitHub and scheduling URL, biography, and editable portfolioStatistics.
- src/data/projects.ts: project summaries, technologies, metrics, URLs, status, and evidence. Original four records and slugs are preserved; two newly supplied projects bring the documented collection to six.
- src/types/project.ts: shared schema. Set featured and showcaseGroup to include new work in the homepage filters. featuredSize controls bento prominence; clientWork enables the client-work treatment.
- src/data/skills.ts: full categorized skill list and ten ordered core-skill text tiles, shared by the homepage and Skills page. Text labels intentionally avoid inaccurate logos.
- src/data/agentDemo.ts: dedicated dental receptionist card content, avatar path, and supplied external demo URL.
- src/data/services.ts: service content and related project slugs.
- src/index.css: palette, typography, focus styles, effects, reduced-motion rules.

The supplied brief spells the name Mojumder; profile configuration is the source for navigation, footer, page titles and portrait caption.

## Metrics integrity

portfolioStatistics contains the owner-supplied portfolio-wide figures: Total Projects Built 50+, Live Projects 30+, and Completed Projects 50+. The three homepage counters use this configuration, animate once on entering view, and respect reduced motion. Published Case Studies is not displayed in this section. These figures remain separate from documented-project calculations; no project records were added to match them.

getProjectStatistics derives counts from records: totalBuilt counts builtVerified, live counts valid demo URLs, completed checks status, and publishedCaseStudies checks caseStudyPublished. These four counts currently remain zero because completion, independent verification, live URLs and publication have not been confirmed. Status defaults remain In Progress pending owner confirmation; this is not a verified lifecycle claim.

Exact supplied project outcomes are stored as structured metrics, marked source: user-supplied and independentlyVerified: false. They are displayed with an evidence-pending label. verifiedResults is reserved for supported measurements. No extra outcomes, clients, testimonials, dates or financial figures have been added.

## Assets and links

The portrait loader discovers selfpic.jpg, selfpic.jpeg, selfpic.png, selfpic.webp or selfpic.avif at the project root. selfpic.jpeg is currently used and bundled by Vite, retaining its real extension. Missing or failed images show a replaceable placeholder.

The supplied replacement avater.jpg (blue robot, 1300 by 860 pixels) was copied unchanged to public/avater.jpg. The root source remains intact. This image appears only in the dedicated Talk with one of my agents filter at its original aspect ratio. Its Talk with me link opens the configured dental receptionist URL securely in a new tab. Missing or failed avatar images show a labeled placeholder. To replace it, update the public copy and the avatar path and dimensions in src/data/agentDemo.ts.

Project images live in `public/projects/<slug>/`, with paths, alt text, and captions in project data. The B2B and networking case studies use supplied workflow images and their public repository READMEs. The voice and Sophie galleries include the owner's supplied dashboard snapshots; snapshot figures have not been independently verified. The voice case study also includes the owner's supplied application architecture; its implementation has not been independently verified here. Project claims and portfolio-wide statistics remain owner supplied; the displayed metrics are not independently verified.

The original `AI Networking Intelligence Agent/command agent.png` remains outside the public directory: it shows internal sub-workflow identifiers. Use a redacted version before adding that screenshot. At the owner's request, the voice project links to the supplied dental receptionist repository, which documents a separate ElevenLabs demonstration; it should not be treated as documentation of the Retell/Bland workflow.

### Updating a project or adding screenshots

1. Find the project by its existing `slug` in `src/data/projects.ts`. The B2B and voice-agent entries are initialized in `drafts` and updated below with `Object.assign`; the networking and Sophie entries are in `newSuppliedProjects`. Edit the existing entry or its matching update rather than adding a duplicate.
2. Put approved workflow images in `public/projects/<slug>/`. For each image, add an entry to that project's `screenshots` array:

   ```ts
   screenshots: [
     {
       src: "/projects/<slug>/<image-file>.webp",
       alt: "Describe the actual workflow shown",
       caption: "Optional explanation of this screenshot",
     },
   ],
   ```

   Replace the bracketed placeholders with the actual folder and filename. Use descriptive alt text. The gallery displays multiple images and captions, with a keyboard-accessible lightbox. Empty arrays show labeled placeholders; failed images show an error message.
3. Add confirmed `problem`, `solution`, `architectureDescription`, `architectureFlow`, `workflowSteps`, `challenges`, `reliability`, and `businessValue` as available. `architectureFlow` is an ordered array of labels for documented data-flow steps. Each workflow step is `{ title, description }`; each challenge is `{ challenge, solution }`. Add evidence-backed outcomes to `verifiedResults`, and preserve the distinction between those results and owner-supplied `metrics`.
4. Set `demoUrl` or `githubUrl` only to supplied HTTP(S) URLs. Valid links appear in the project page and drawer and open in a new tab. `caseStudyPublished` controls the publication label; only mark a case study published when it is ready.

To add a project, append one typed `Project` record to the existing project data in `src/data/projects.ts`, using a unique `id` and `slug` and all required fields described in `src/types/project.ts`. Initialize unknown `screenshots`, `workflowSteps`, `challenges`, and `verifiedResults` as empty arrays and use optional fields only when information is available. Set `featured` and `showcaseGroup` if it should appear in an existing homepage filter. The shared template and `/projects/:slug` route render the new record without component changes.

Add exact HTTP(S) githubUrl and demoUrl values to project data. Demo links appear only with valid URLs and open securely in a new tab. GitHub buttons otherwise show a disabled unavailable state, unless the project sets `hideGithub` (as requested for Sophie). Both scheduling buttons use the supplied Calendly URL in `profile.ts`; removing it restores the unconfigured state. Original project routes continue to work.

## Contact form and Supabase

The three-step form validates fields and saves enquiries to the `portfolio_contact_submissions` table. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local` for development and in the hosting provider for production. These values are public. Never put a Supabase secret or service-role key in a `VITE_` variable.

The table has row-level security and allows anonymous inserts only; anonymous reads, updates and deletes are denied. A request UUID prevents duplicate rows on retry. If a response is lost or a duplicate is rejected, the form asks the visitor to email rather than claiming success. Submissions can be reviewed in the Supabase dashboard. No email notifications are configured.

The endpoint accepts public inserts and therefore can receive spam; a honeypot is only a deterrent. Add server-side anti-abuse protection before relying on the form at scale. When the public configuration is absent, the form directs visitors to email instead.

## Validation

    npx.cmd tsc -b
    npm.cmd run lint
    npm.cmd run build
    npx.cmd playwright install chromium
    npx.cmd playwright test

Playwright starts a production preview on port 4173 and an isolated configured development server on 4174. Configured submissions are intercepted with test fixtures; no real leads are sent. Tests cover filters, dialog focus and Escape, project deep links, Skills navigation, form validation, state persistence, unconfigured delivery, acknowledgement checks, failure/retry paths, and responsive/reduced-motion layouts. Screenshots and failure traces are under ignored test-results.

Tests run in Chromium. Other browsers, actual devices, assistive technology, and live database delivery require separate verification. See the final implementation report for the checks actually completed.

The refinement suite also checks all five filters, the real avatar, secure new-tab demo navigation with an intercepted destination, clipboard success and refusal, exact skill order and statistics, existing animations, and responsive layout at 320, 390, 768, 1024 and 1440px. Footer checks assert 32px padding and no blank document area below it. The external voice service and operating-system email application are not exercised.

## Refinement file inventory

- Updated: src/components/layout/Navigation.tsx, Footer.tsx and SiteLayout.tsx; src/components/home/StackAndStats.tsx and ContactSection.tsx; src/components/projects/ProjectShowcase.tsx; src/pages/SkillsPage.tsx; src/data/profile.ts and skills.ts; src/index.css; tests/portfolio.spec.ts; README.md.
- Added: src/components/ui/TechnicalSkills.tsx; src/components/projects/AgentDemoCard.tsx; src/components/contact/EmailControls.tsx; src/data/agentDemo.ts; public/avater.jpg; tests/refinements.spec.ts.
- Project records, routing, form submission code, dependencies and deployment configuration were not changed by these refinements.

## Redesign file inventory

Created:
- src/components/home/IntroSections.tsx, StackAndStats.tsx, ServicesSection.tsx, ServiceVisual.tsx, ContactSection.tsx
- src/components/contact/ChoiceField.tsx and ContactForm.tsx
- src/components/projects/ProjectShowcase.tsx, CaseStudyContent.tsx and CaseStudyDrawer.tsx
- src/components/ui/Reveal.tsx, AnimatedCounter.tsx and Spotlight.tsx
- src/components/layout/Footer.tsx
- src/pages/SkillsPage.tsx and ProjectPage.tsx
- src/data/skills.ts and services.ts
- src/lib/contact.ts, .env.example, playwright.config.ts and tests/portfolio.spec.ts

Updated:
- src/pages/HomePage.tsx and src/components/projects/FeaturedProjectCard.tsx
- src/components/layout/AutomationVisual.tsx, Navigation.tsx and SiteLayout.tsx
- src/data/profile.ts, projects.ts, src/types/project.ts and src/lib/projects.ts
- src/index.css, src/components/ui/Badge.tsx, src/App.tsx, index.html and public/favicon.svg
- package.json and package-lock.json (Playwright test tooling), .gitignore and this README

Other existing TypeScript/TSX files and vite.config.ts were formatted for readability without recreating the application. The original selfpic.jpeg file remains intact.
