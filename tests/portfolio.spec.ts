import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { projects } from "../src/data/projects";
import { portfolioStatistics } from "../src/data/profile";
import { getProjectStatistics, isValidExternalUrl } from "../src/lib/projects";
import { emptyLead, validateLead } from "../src/lib/contact";

test("project records preserve supplied claims without inflating verified statistics", () => {
  expect(portfolioStatistics.map((stat) => stat.value)).toEqual([
    "50+",
    "30+",
    "50+",
  ]);
  expect(projects).toHaveLength(6);
  expect(getProjectStatistics(projects)).toEqual({
    total: 6,
    totalBuilt: 0,
    live: 0,
    completed: 0,
    publishedCaseStudies: 0,
  });
  expect(
    projects
      .find((project) => project.slug === "ai-networking-intelligence-agent")
      ?.metrics?.map((metric) => metric.value),
  ).toEqual(["2 hours", "14 hours", "56+ hours"]);
  for (const metric of projects.flatMap((project) => project.metrics ?? [])) {
    expect(metric.source).toBe("user-supplied");
    expect(metric.independentlyVerified).toBe(false);
  }
  for (const url of [
    "javascript:alert(1)",
    "mailto:fake@example.com",
    "https://user:secret@example.com",
    "/made-up",
  ])
    expect(isValidExternalUrl(url)).toBe(false);
});

test("lead validation rejects honeypot and requires the selected contact channel", () => {
  const lead = {
    ...emptyLead,
    automation: "Voice AI Agent",
    details: "Automate reception calls and CRM appointment follow-up.",
    budget: "$5k+",
    timeline: "ASAP",
    name: "Test Visitor",
    email: "visitor@example.test",
  };
  expect(validateLead(lead)).toEqual({});
  expect(
    validateLead({ ...lead, websiteTrap: "spam" }).websiteTrap,
  ).toBeTruthy();
  expect(
    validateLead({ ...lead, preferredContact: "WhatsApp" }).whatsapp,
  ).toBeTruthy();
  expect(
    validateLead({
      ...lead,
      preferredContact: "WhatsApp",
      whatsapp: "+880 1234567890",
    }),
  ).toEqual({});
});

test("homepage, assets, filters, keyboard drawer, and deep links", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Autonomous AI systems for modern operations",
  );
  const portrait = page.getByRole("img", {
    name: /Anupom.*AI Automation Engineer/,
  });
  await expect(portrait).toBeVisible();
  expect(
    await portrait.evaluate(
      (image) => (image as HTMLImageElement).naturalWidth,
    ),
  ).toBeGreaterThan(0);
  const work = page.getByRole("region", {
    name: "Featured projects",
    exact: true,
  });
  await expect(work.locator("article")).toHaveCount(4);
  await work.getByRole("button", { name: "Voice AI", exact: true }).click();
  await expect(work.locator("article")).toHaveCount(2);
  await work.getByRole("button", { name: "Agents", exact: true }).click();
  await expect(work.locator("article")).toHaveCount(1);
  await expect(
    work.getByRole("heading", { name: "AI Networking Intelligence Agent" }),
  ).toBeVisible();
  const opener = work.getByRole("button", { name: "View Case Study" });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Close case study" }),
  ).toBeFocused();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() =>
        Boolean(document.activeElement?.closest("dialog")),
      ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
  await opener.click();
  await page.getByRole("link", { name: "Open dedicated project page" }).click();
  await expect(page).toHaveURL(/\/projects\/ai-networking-intelligence-agent$/);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "AI Networking Intelligence Agent",
  );
  await page.goto("/skills");
  await expect(
    page.getByRole("heading", { name: "Technical Stack", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "AI-Assisted Development" }),
  ).toBeVisible();
  await page.goto("/projects/not-real");
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

async function completeProjectAndScope(page: Page) {
  const form = page.getByRole("form", { name: "Project enquiry" });
  await form.getByText("Voice AI Agent", { exact: true }).click();
  await form
    .getByLabel("Project Details")
    .fill(
      "Automate our reception calls and sync appointment requests to our CRM.",
    );
  await form.getByRole("button", { name: "Continue" }).click();
  await form.getByText("$2k–$5k", { exact: true }).click();
  await form.getByText("1 month", { exact: true }).click();
  await form.getByRole("button", { name: "Continue" }).click();
  return form;
}

test("unconfigured form validates, retains state and never pretends to send", async ({
  page,
}) => {
  await page.goto("/#contact");
  const form = page.getByRole("form", { name: "Project enquiry" });
  await form.getByRole("button", { name: "Continue" }).click();
  await expect(
    form.getByText("Choose what you want to automate."),
  ).toBeVisible();
  await expect(
    form.getByText("Describe your process in at least 20 characters."),
  ).toBeVisible();
  await completeProjectAndScope(page);
  await form.getByLabel("Full Name").fill("Test Visitor");
  await form.getByLabel("Work Email").fill("invalid");
  await form.getByLabel("Work Email").blur();
  await expect(form.getByText("Enter a valid work email.")).toBeVisible();
  await form.getByLabel("Work Email").fill("visitor@example.test");
  await form.getByRole("button", { name: "Back" }).click();
  await expect(
    form.getByRole("radio", { name: "$2k–$5k", exact: true }),
  ).toBeChecked();
  await form.getByRole("button", { name: "Back" }).click();
  await expect(form.getByLabel("Project Details")).toContainText(
    "Automate our reception calls",
  );
  await form.getByRole("button", { name: "Continue" }).click();
  await form.getByRole("button", { name: "Continue" }).click();
  await expect(form.getByLabel("Full Name")).toHaveValue("Test Visitor");
  await expect(
    form.getByRole("button", { name: "Send Request" }),
  ).toBeDisabled();
  await expect(
    form.getByText(/Form delivery is not configured yet/),
  ).toBeVisible();
  await expect(page.getByText(/Your request is in/)).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Book a Strategy Call" }),
  ).toHaveAttribute("href", "https://calendly.com/anupom-mojumder/30min");
});

test("configured form requires an explicit acknowledgement and blocks duplicate submits", async ({
  page,
}) => {
  let requests = 0;
  let release!: () => void;
  const acknowledgement = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/enquiry", async (route) => {
    requests++;
    const payload = route.request().postDataJSON();
    expect(payload.name).toBe("Test Visitor");
    expect(payload.websiteTrap).toBeUndefined();
    await acknowledgement;
    await route.fulfill({
      json: { success: true, requestId: payload.requestId },
    });
  });
  await page.goto("http://127.0.0.1:4174/#contact");
  const form = await completeProjectAndScope(page);
  await form.getByLabel("Full Name").fill("Test Visitor");
  await form.getByLabel("Work Email").fill("visitor@example.test");
  await form.getByRole("button", { name: "Send Request" }).click();
  await expect(form.getByRole("button", { name: "Sending…" })).toBeDisabled();
  await form.evaluate((element) =>
    element.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    ),
  );
  expect(requests).toBe(1);
  release();
  await expect(
    page.getByText("Thanks, Test Visitor. Your request is in."),
  ).toBeVisible();
  expect(requests).toBe(1);
});

test("normal-motion counters finish with correct suffixes and a mobile drawer closes with its button", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const stats = page.getByRole("region", {
    name: "The portfolio, at a glance.",
  });
  await stats.scrollIntoViewIfNeeded();
  await expect(stats.locator('dd [aria-hidden="true"]')).toHaveText([
    "50+",
    "30+",
    "50+",
  ]);
  const work = page.getByRole("region", {
    name: "Featured projects",
    exact: true,
  });
  const first = work.locator("article").first();
  await first.scrollIntoViewIfNeeded();
  await expect(
    first.locator('[aria-hidden="true"]').filter({ hasText: /^500\+$/ }),
  ).toBeVisible();
  await first.getByRole("button", { name: "View Case Study" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect
    .poll(() =>
      dialog.evaluate((element) =>
        Math.round(element.getBoundingClientRect().left),
      ),
    )
    .toBe(0);
  expect(
    await dialog.evaluate(
      (element) => element.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("case-study-mobile.png") });
  await dialog.getByRole("button", { name: "Close case study" }).click();
  await expect(dialog).toHaveCount(0);
});

test("unconfirmed response and network failure retain entries and allow retry", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/api/enquiry", async (route) => {
    requests++;
    if (requests === 1)
      await route.fulfill({
        contentType: "text/html",
        body: "<html>Not an acknowledgement</html>",
      });
    else if (requests === 2) await route.fulfill({ json: { success: false } });
    else await route.abort("failed");
  });
  await page.goto("http://127.0.0.1:4174/#contact");
  const form = await completeProjectAndScope(page);
  await form.getByLabel("Full Name").fill("Test Visitor");
  await form.getByLabel("Work Email").fill("visitor@example.test");
  await form.getByRole("button", { name: "Send Request" }).click();
  await expect(form.getByRole("alert")).toContainText(
    "Delivery was not confirmed",
  );
  await expect(page.getByText(/Your request is in/)).toHaveCount(0);
  await expect(form.getByLabel("Full Name")).toHaveValue("Test Visitor");
  await form.getByRole("button", { name: "Send Request" }).click();
  await expect(form.getByRole("alert")).toContainText(
    "Delivery was not confirmed",
  );
  await form.getByRole("button", { name: "Send Request" }).click();
  await expect(form.getByRole("alert")).toContainText(
    "Unable to confirm delivery",
  );
  expect(requests).toBe(3);
});

for (const width of [320, 390, 768, 1440]) {
  test(`responsive homepage and reduced motion at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    if (width < 1024) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await expect(
        page.getByRole("navigation", { name: "Primary" }),
      ).toBeVisible();
      await page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("link", { name: "Skills" })
        .focus();
      await page.keyboard.press("Escape");
      await expect(
        page.getByRole("button", { name: "Open navigation" }),
      ).toBeFocused();
      await expect(
        page.getByRole("navigation", { name: "Primary" }),
      ).toBeHidden();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .locator(".flow-path")
        .evaluate((element) =>
          parseFloat(getComputedStyle(element).animationDuration),
        ),
    ).toBeLessThan(0.001);
    await page.screenshot({
      path: testInfo.outputPath(`homepage-${width}.png`),
      fullPage: true,
    });
  });
}
