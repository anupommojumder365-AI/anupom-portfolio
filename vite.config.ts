import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pageSeo, publicRoutes, siteOrigin } from "./src/lib/seo.ts";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function seoOutput(origin: string | undefined): Plugin {
  let output = "";
  return {
    name: "portfolio-seo-output",
    apply: "build",
    configResolved(config) {
      output = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const index = resolve(output, "index.html");
      const template = readFileSync(index, "utf8");
      for (const route of publicRoutes) {
        if (!/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(route))
          throw new Error(`Invalid route for SEO output: ${route}`);
        const seo = pageSeo(route);
        const canonical = origin ? `${origin}${route}` : undefined;
        const title = escapeHtml(seo.title);
        const description = escapeHtml(seo.description);
        const tags = [
          `<title>${title}</title>`,
          `<meta name="description" content="${description}" />`,
          '<meta name="robots" content="index,follow" />',
          `<meta property="og:title" content="${title}" />`,
          `<meta property="og:description" content="${description}" />`,
          '<meta property="og:type" content="website" />',
          '<meta property="og:site_name" content="Anupom Mojumder" />',
          '<meta name="twitter:card" content="summary" />',
          `<meta name="twitter:title" content="${title}" />`,
          `<meta name="twitter:description" content="${description}" />`,
        ];
        if (canonical)
          tags.push(
            `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
            `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
            `<meta property="og:image" content="${escapeHtml(origin!)}/social-portrait.jpeg" />`,
            '<meta property="og:image:alt" content="Anupom Mojumder, AI Automation Engineer" />',
            `<meta name="twitter:image" content="${escapeHtml(origin!)}/social-portrait.jpeg" />`,
          );
        const html = template.replace(
          /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/,
          `<!-- seo:start -->\n    ${tags.join("\n    ")}\n    <!-- seo:end -->`,
        );
        const destination =
          route === "/" ? index : resolve(output, `${route.slice(1)}.html`);
        mkdirSync(dirname(destination), { recursive: true });
        writeFileSync(destination, html);
      }
      writeFileSync(
        resolve(output, "robots.txt"),
        `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ""}`,
      );
      if (origin) {
        const entries = publicRoutes
          .map(
            (route) =>
              `  <url><loc>${escapeHtml(`${origin}${route}`)}</loc></url>`,
          )
          .join("\n");
        writeFileSync(
          resolve(output, "sitemap.xml"),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
        );
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const configured = loadEnv(mode, process.cwd(), "VITE_").VITE_SITE_URL;
  const origin = siteOrigin(configured);
  if (configured && !origin)
    throw new Error(
      "VITE_SITE_URL must be an HTTPS origin without credentials, path, query, or fragment.",
    );
  return { plugins: [react(), tailwindcss(), seoOutput(origin)] };
});
