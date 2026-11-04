import { expect, test } from "@playwright/test";
import { projects } from "../src/data/projects";
import { pageSeo, publicRoutes, siteOrigin } from "../src/lib/seo";

test("build serves unique metadata in raw HTML without inventing a domain", async ({
  request,
}) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const path of publicRoutes) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    const seo = pageSeo(path);
    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    expect(html).toContain(`<title>${escapeHtml(seo.title)}</title>`);
    expect(html).toContain(
      `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    );
    expect(html).toContain(
      `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    );
    expect(html).toContain(
      `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    );
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
    if (canonical) {
      const url = new URL(canonical[1]);
      expect(url.protocol).toBe("https:");
      expect(url.pathname).toBe(path);
      expect(html).toContain(
        `<meta property="og:url" content="${canonical[1]}" />`,
      );
    } else {
      expect(html).not.toContain('property="og:url"');
    }
    titles.add(seo.title);
    descriptions.add(seo.description);
  }
  expect(titles.size).toBe(publicRoutes.length);
  expect(descriptions.size).toBe(publicRoutes.length);
  const robots = await request.get("/robots.txt");
  expect(robots.headers()["content-type"]).toContain("text/plain");
  expect(await robots.text()).toContain("User-agent: *");
  const robotsText = await robots.text();
  if (robotsText.includes("Sitemap:"))
    expect(robotsText).toMatch(/Sitemap: https:\/\/[^\s]+\/sitemap\.xml/);
  expect(siteOrigin("https://example.test/path")).toBeUndefined();
  expect(siteOrigin("javascript:alert(1)")).toBeUndefined();
  expect(siteOrigin("https://example.test/")).toBe("https://example.test");
});

test("client navigation updates metadata and preserves logical heading levels", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    pageSeo("/").title,
  );
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Skills" })
    .click();
  await expect(page).toHaveTitle(pageSeo("/skills").title);
  await expect(
    page.locator('meta[name="twitter:description"]'),
  ).toHaveAttribute("content", pageSeo("/skills").description);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Technical Stack",
  );
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Projects" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Selected Work",
  );
  await expect(
    page.getByRole("heading", { level: 2, name: projects[0].title }),
  ).toBeVisible();
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    pageSeo("/projects").description,
  );
  await page.goto(`/projects/${projects[0].slug}`);
  await expect(page).toHaveTitle(
    pageSeo(`/projects/${projects[0].slug}`).title,
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    pageSeo(`/projects/${projects[0].slug}`).title,
  );
  const canonical = page.locator('link[rel="canonical"]');
  if (await canonical.count())
    await expect(canonical).toHaveAttribute(
      "href",
      new RegExp(`/projects/${projects[0].slug}$`),
    );
  await page.goto("/this-page-does-not-exist");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex,follow",
  );
});
