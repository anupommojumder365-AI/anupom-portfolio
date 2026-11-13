import { expect, test } from "@playwright/test";
import { projects } from "../src/data/projects";
import { profile } from "../src/data/profile";

test("supplied scheduling link and project-specific links preserve their intended destinations", async ({
  page,
  context,
}) => {
  await page.goto("/");
  const bookingUrl = "https://calendly.com/anupom-mojumder/30min";
  expect(profile.schedulingUrl).toBe(bookingUrl);
  for (const name of ["Book a Strategy Call", "Book a call"]) {
    const link = page.getByRole("link", { name, exact: true });
    await expect(link).toHaveAttribute("href", bookingUrl);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
  await expect(page.getByText("Scheduling link coming soon.")).toHaveCount(0);
  await context.route(bookingUrl, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<title>Booking link test</title>",
    }),
  );
  const opened = page.waitForEvent("popup");
  await page.getByRole("link", { name: "Book a Strategy Call" }).click();
  const popup = await opened;
  await expect(popup).toHaveURL(bookingUrl);
  await popup.close();
  const voiceCard = page.getByRole("article").filter({
    has: page.getByRole("heading", { name: "AI Voice Agent & Call Automation", exact: true }),
  });
  const voiceRepository = "https://github.com/anupommojumder365-AI/lunatic-dental-ai-receptionist";
  await expect(voiceCard.getByRole("link", { name: "GitHub", exact: true })).toHaveCount(0);
  await voiceCard.getByRole("button", { name: "View Case Study" }).click();
  const voiceDrawer = page.getByRole("dialog", { name: "AI Voice Agent & Call Automation" });
  await expect(voiceDrawer.getByRole("link", { name: "GitHub", exact: true })).toHaveAttribute("href", voiceRepository);
  await voiceDrawer.getByRole("button", { name: "Close case study" }).click();
  const sophie = page
    .getByRole("article")
    .filter({
      has: page.getByRole("heading", {
        name: "AI Sophie: AI Call Answering for NCL Marketing Ltd",
      }),
    });
  await expect(sophie.getByText(/GitHub/)).toHaveCount(0);
  for (const project of projects.filter((project) => project.githubUrl)) {
    await page.goto(`/projects/${project.slug}`);
    const link = page.getByRole("link", { name: "GitHub", exact: true });
    await expect(link).toHaveAttribute("href", project.githubUrl!);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
});

for (const width of [320, 1440]) {
  test(`real supplied images and architecture in project galleries at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 700 });
    for (const slug of [
      "b2b-lead-automation-engine",
      "ai-networking-intelligence-agent",
    ]) {
      const project = projects.find((project) => project.slug === slug)!;
      await page.goto(`/projects/${slug}`);
      await expect(
        page
          .getByRole("list", { name: "Workflow architecture and data flow" })
          .getByRole("listitem"),
      ).toHaveCount(project.architectureFlow!.length);
      const thumbnails = page.getByRole("button", {
        name: /Enlarge screenshot/,
      });
      await expect(thumbnails).toHaveCount(project.screenshots.length);
      for (const [index, screenshot] of project.screenshots.entries()) {
        const image = thumbnails.nth(index).getByRole("img");
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            image.evaluate((node) => (node as HTMLImageElement).naturalWidth),
          )
          .toBeGreaterThan(0);
        expect((await page.request.get(screenshot.src)).status()).toBe(200);
      }
      await thumbnails.first().click();
      const lightbox = page.getByRole("dialog", {
        name: "Workflow screenshots",
      });
      await expect(lightbox).toBeVisible();
      await expect(
        lightbox.getByText(project.screenshots[0].caption!),
      ).toBeVisible();
      if (project.screenshots.length > 1) {
        await page.keyboard.press("ArrowRight");
        await expect(
          lightbox.getByText(project.screenshots[1].caption!),
        ).toBeVisible();
      }
      await page.keyboard.press("Escape");
      await expect(lightbox).toHaveCount(0);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });
}

test("voice architecture and supplied screenshots appear in project pages and drawers", async ({ page }) => {
  for (const slug of ["ai-voice-receptionist", "ai-sophie"]) {
    const project = projects.find((entry) => entry.slug === slug)!;
    await page.goto(`/projects/${slug}`);
    const thumbnails = page.getByRole("button", { name: /Enlarge screenshot/ });
    await expect(thumbnails).toHaveCount(project.screenshots.length);
    for (const [index, screenshot] of project.screenshots.entries()) {
      const picture = thumbnails.nth(index).getByRole("img");
      await picture.scrollIntoViewIfNeeded();
      await expect.poll(() => picture.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      await expect(page.getByText(screenshot.caption!)).toBeVisible();
    }
    const thumbnail = page.getByRole("button", { name: /Enlarge screenshot 1:/ });
    const image = thumbnail.getByRole("img");
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(page.getByText(project.screenshots[0].caption!)).toBeVisible();
    await thumbnail.click();
    const lightbox = page.getByRole("dialog", { name: "Workflow screenshots" });
    await expect(lightbox.getByText(project.screenshots[0].caption!)).toBeVisible();
    if (project.screenshots.length > 1) {
      await page.keyboard.press("ArrowRight");
      await expect(lightbox.getByText(project.screenshots[1].caption!)).toBeVisible();
      await page.keyboard.press("ArrowLeft");
      await expect(lightbox.getByText(project.screenshots[0].caption!)).toBeVisible();
    }
    await page.keyboard.press("Escape");
    await expect(thumbnail).toBeFocused();
    if (slug === "ai-voice-receptionist") {
      await expect(page.getByText(/Next.js, TypeScript, and Tailwind CSS/)).toBeVisible();
      for (const step of ["Session Initialization", "Voice Conversation", "Avatar Synchronization", "Session Management"]) await expect(page.getByText(step, { exact: true })).toBeVisible();
      await expect(page.getByText(/48 kHz to 16 kHz PCM/)).toBeVisible();
      await expect(page.getByText(/API keys remain server-side/)).toBeVisible();
      await expect(page.getByRole("list", { name: "Workflow architecture and data flow" }).getByRole("listitem")).toHaveCount(5);
    }
  }
  await page.goto("/projects");
  for (const title of ["AI Voice Agent & Call Automation", "AI Sophie: AI Call Answering for NCL Marketing Ltd"]) {
    const card = page.getByRole("article").filter({ has: page.getByRole("heading", { name: title, exact: true }) });
    await card.getByRole("button", { name: "View Case Study" }).click();
    const drawer = page.getByRole("dialog", { name: title });
    if (title === "AI Voice Agent & Call Automation") await expect(drawer.getByText("Session Initialization", { exact: true })).toBeVisible();
    await expect(drawer.getByRole("button", { name: /Enlarge screenshot 1:/ })).toBeVisible();
    await drawer.getByRole("button", { name: "Close case study" }).click();
  }
});
