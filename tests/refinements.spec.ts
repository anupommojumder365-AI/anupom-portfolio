import { test, expect } from "@playwright/test";
import { featuredTechnologies, skillGroups } from "../src/data/skills";
import { services } from "../src/data/services";
import { projects } from "../src/data/projects";

test("compact cards retain project and service details on their related pages", async ({ page }) => {
  await page.goto("/");
  const work = page.getByRole("region", { name: "Featured projects" });
  for (const project of projects.filter((item) => item.featured)) {
    const card = work.getByRole("article").filter({ has: page.getByRole("heading", { name: project.title, exact: true }) });
    await expect(card.locator("p")).toHaveText([project.cardTagline ?? project.shortDescription]);
    await expect(card.getByRole("button", { name: "View Case Study" })).toHaveCount(1);
    await expect(card.locator("a, img, svg, dl")).toHaveCount(0);
  }
  const region = page.getByRole("region", { name: "Services", exact: true });
  for (const service of services) {
    const card = region.getByRole("article").filter({ has: page.getByRole("heading", { name: service.title, exact: true }) });
    await expect(card.locator("p")).toHaveText([service.tagline]);
    const link = card.getByRole("link", { name: `Explore related project for ${service.title}` });
    await expect(link).toHaveAttribute("href", `/projects/${service.project}`);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`/projects/${service.project}$`));
    await expect(page.getByText(service.description, { exact: true })).toBeVisible();
    await expect(page.getByText("proof" in service ? service.proof : service.context, { exact: true })).toBeVisible();
    await expect(page.getByText(`Technologies: ${service.technologies.join(", ")}.`, { exact: true })).toBeVisible();
    await page.goto("/");
  }
});

test("core skills, grouped entries, three portfolio figures, and branding", async ({
  page,
}) => {
  await page.goto("/");
  const brand = page.getByRole("link", { name: "Anupom Mojumder home" });
  await expect(brand).toHaveAttribute("href", "/");
  await expect(brand).toContainText("AM");
  const skills = page.getByRole("region", {
    name: "Technical stack",
    exact: true,
  });
  await expect(
    skills.getByRole("list", { name: "Featured core skills" }).locator("li"),
  ).toHaveText([
    "n8n",
    "Claude Code",
    "Codex",
    "Python",
    "Node.js",
    "SQL",
    "RAG pipelines",
    "Webhooks",
    "LangChain",
    "MCP",
  ]);
  await expect(skills.getByRole("link", { name: "Explore Full Tech Stack" })).toHaveAttribute("href", "/skills");
  const stats = page.getByRole("region", {
    name: "The portfolio, at a glance.",
  });
  await expect(stats.locator("dt")).toHaveText([
    "01Total Projects Built",
    "02Live Projects",
    "03Completed Projects",
  ]);
  await expect(stats.locator('dd [aria-hidden="true"]')).toHaveText([
    "50+",
    "30+",
    "50+",
  ]);
  await expect(stats.getByText("Published Case Studies")).toHaveCount(0);
  await page.goto("/skills");
  for (const group of skillGroups) {
    const section = page.locator("section").filter({
      has: page.getByRole("heading", { name: group.name, exact: true }),
    });
    await expect(section.locator("li")).toHaveText(group.skills);
  }
  await expect(
    page.getByRole("list", { name: "Featured core skills" }).locator("li"),
  ).toHaveText(featuredTechnologies);
  await brand.click();
  await expect(page).toHaveURL("/");
});

test("five filters preserve existing cards and isolate the real avatar demo", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const work = page.getByRole("region", {
    name: "Featured projects",
    exact: true,
  });
  const filters = work.getByRole("group", { name: "Filter featured projects" });
  await expect(filters.getByRole("button")).toHaveText([
    "All",
    "Lead Gen",
    "Voice AI",
    "Agents",
    "Agent Demos",
  ]);
  for (const [filter, count] of [
    ["Lead Gen", 1],
    ["Voice AI", 2],
    ["Agents", 1],
    ["All", 4],
  ] as const) {
    await filters.getByRole("button", { name: filter, exact: true }).click();
    await expect(work.locator("article")).toHaveCount(count);
    await expect(
      work.getByRole("heading", { name: "AI Dental Receptionist" }),
    ).toHaveCount(0);
  }
  await filters
    .getByRole("button", { name: "Agent Demos" })
    .click();
  await expect(work.locator("article")).toHaveCount(1);
  const avatar = work.getByRole("img", {
    name: "AI Dental Receptionist avatar",
  });
  await expect(avatar).toBeVisible();
  await expect
    .poll(() =>
      avatar.evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBe(1300);
  const demo = work.getByRole("link", { name: "Talk with me" });
  await expect(demo).toHaveAttribute(
    "href",
    "https://lunatic-dental-ai-receptionist.vercel.app/",
  );
  await expect(demo).toHaveAttribute("target", "_blank");
  await expect(demo).toHaveAttribute("rel", "noopener noreferrer");
  await context.route(
    "https://lunatic-dental-ai-receptionist.vercel.app/**",
    (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<title>External link test</title>",
      }),
  );
  const popupPromise = page.waitForEvent("popup");
  await demo.focus();
  await page.keyboard.press("Enter");
  const popup = await popupPromise;
  await expect(popup).toHaveURL(
    "https://lunatic-dental-ai-receptionist.vercel.app/",
  );
  await popup.close();
  await expect(page).toHaveURL("/");
  await filters.getByRole("button", { name: "All", exact: true }).click();
  await expect(work.locator("article")).toHaveCount(4);
  for (const button of await work
    .getByRole("button", { name: /GitHub unavailable/ })
    .all())
    await expect(button).toBeDisabled();
  await work.getByRole("button", { name: "View Case Study" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("email is updated everywhere and copies through keyboard activation", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#contact");
  const email = "anupommojumdernew@gmail.com";
  await expect(
    page.getByRole("link", { name: "Email me", exact: true }),
  ).toHaveAttribute("href", `mailto:${email}`);
  for (const link of await page.locator('a[href^="mailto:"]').all())
    await expect(link).toHaveAttribute("href", `mailto:${email}`);
  await expect(page.getByText(email, { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Copy email address" }).focus();
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("status").filter({ hasText: "Email copied" }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(email);
});

test("clipboard refusal has usable feedback and preserves the mail link", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: () => Promise.reject(new Error("Permission denied")),
      },
      configurable: true,
    }),
  );
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(
    page.getByText("Couldn’t copy. Use Email me to open your email app."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Email me", exact: true }),
  ).toBeVisible();
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`refined typography, demo card and natural footer at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(() => getComputedStyle(document.body).fontSize),
    ).toBe("20.4px");
    const heading = page.locator("#hero-title");
    expect(
      await heading.evaluate((element) => getComputedStyle(element).fontSize),
    ).toBe(width < 816 ? "43.2px" : width === 1024 ? "54.272px" : "75.2px");
    const footer = page.getByRole("contentinfo");
    await footer.scrollIntoViewIfNeeded();
    expect(
      await footer.evaluate(
        (element) => getComputedStyle(element).paddingBottom,
      ),
    ).toBe("32px");
    expect(
      await page.evaluate(() => {
        const footer = document.querySelector("footer")!;
        return Math.abs(
          document.documentElement.scrollHeight -
            (footer.getBoundingClientRect().bottom + window.scrollY),
        );
      }),
    ).toBeLessThanOrEqual(2);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const work = page.getByRole("region", {
      name: "Featured projects",
      exact: true,
    });
    await work
      .getByRole("button", { name: "Agent Demos" })
      .click();
    await expect(
      work.getByRole("link", { name: "Talk with me" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await work.screenshot({
      path: testInfo.outputPath(`agent-tab-${width}.png`),
    });
    await work.getByRole("button", { name: "All", exact: true }).click();
    await page.screenshot({
      path: testInfo.outputPath(`homepage-${width}.png`),
      fullPage: true,
    });
  });
}

test("normal-motion hero, reveals and spotlight still animate", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  expect(
    await page
      .locator(".flow-path")
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("flow");
  const visual = page.locator(".agent-visual");
  await visual.hover();
  await expect
    .poll(() =>
      visual.evaluate((element) =>
        (element as HTMLElement).style.getPropertyValue("--pointer-x"),
      ),
    )
    .not.toBe("");
  const services = page.locator("#services");
  await services.scrollIntoViewIfNeeded();
  await expect(page.locator('.service-visual')).toHaveCount(0);
  const card = page.locator(".service-card").first();
  await card.hover();
  await expect
    .poll(() => card.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe("none");
  await expect(
    services.getByRole("heading", { name: "Discover", exact: true }),
  ).toBeVisible();
  await expect(
    services.getByRole("heading", { name: "Build", exact: true }),
  ).toBeVisible();
  await expect(
    services.getByRole("heading", { name: "Support", exact: true }),
  ).toBeVisible();
});
