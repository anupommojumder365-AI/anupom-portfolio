import { expect, test, type Page } from "@playwright/test";
import { projects } from "../src/data/projects";

const headings = [
  "Project Overview",
  "Business Problem",
  "Workflow Architecture",
  "Solution and Approach",
  "Workflow Steps",
  "Technologies",
  "Challenges and Solutions",
  "Reliability and Error Handling",
  "Business Impact",
  "Results",
  "Screenshot Gallery",
];
const fixtureOrigin = "http://127.0.0.1:4174";

// Test-only data is injected into Vite's module response. Production records and assets stay untouched.
async function galleryFixture(
  page: Page,
  options: { single?: boolean; invalidLinks?: boolean; delay?: number } = {},
) {
  const screenshots = [
    {
      src: "/__gallery-test__/overview.svg",
      alt: "Test workflow overview",
      caption: "Test fixture: overview caption",
    },
    {
      src: "/__gallery-test__/detail.svg",
      alt: "Test workflow detail",
      caption: "Test fixture: detail caption",
    },
    {
      src: "/__gallery-test__/missing.svg",
      alt: "Test unavailable screenshot",
      caption: "Test fixture: unavailable image",
    },
  ];
  await page.route("**/src/data/projects.ts*", async (route) => {
    const response = await route.fetch();
    const fixture = {
      screenshots: options.single ? screenshots.slice(0, 1) : screenshots,
      problem: "Test fixture: confirmed challenge.",
      solution: "Test fixture: confirmed solution.",
      architectureDescription: "Test fixture: workflow architecture.",
      workflowSteps: [
        {
          title: "Test fixture step",
          description: "Test fixture step description.",
        },
      ],
      challenges: [
        {
          challenge: "Test fixture implementation challenge",
          solution: "Test fixture resolution.",
        },
      ],
      businessValue: "Test fixture business impact.",
      verifiedResults: ["Test fixture supported result."],
      metrics: [],
      demoUrl: options.invalidLinks
        ? "javascript:alert(1)"
        : "https://demo.example.test/",
      githubUrl: options.invalidLinks
        ? "https://user:secret@example.test/"
        : "https://github.com/example/test-fixture",
    };
    await route.fulfill({
      response,
      body: `${await response.text()}\nObject.assign(projects[0], ${JSON.stringify(fixture)});\n`,
    });
  });
  await page.route("**/__gallery-test__/*.svg", async (route) => {
    if (options.delay)
      await new Promise((resolve) => setTimeout(resolve, options.delay));
    if (route.request().url().endsWith("missing.svg"))
      return route.fulfill({ status: 404, body: "Test image unavailable" });
    const tall = route.request().url().endsWith("detail.svg");
    await route.fulfill({
      contentType: "image/svg+xml",
      headers: { "cache-control": "no-store" },
      body: `<svg xmlns="http://www.w3.org/2000/svg" width="${tall ? 600 : 1600}" height="${tall ? 1600 : 900}"><rect width="100%" height="100%" fill="#f2f1ec"/><text x="30" y="70" fill="#1f6f4a" font-size="24">TEST FIXTURE ONLY</text></svg>`,
    });
  });
}

test("all existing project routes render shared sections without inventing evidence or URLs", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const project of projects) {
    await page.goto(`/projects/${project.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      project.title,
    );
    for (const heading of headings)
      await expect(
        page.getByRole("heading", { name: heading, exact: true, level: 2 }),
      ).toBeVisible();
    await expect(
      page
        .locator("section")
        .filter({
          has: page.getByRole("heading", {
            name: "Project Overview",
            exact: true,
          }),
        })
        .getByText(project.shortDescription, { exact: true }),
    ).toBeVisible();
    for (const metric of project.metrics ?? [])
      await expect(
        page.getByText(`${metric.value} ${metric.label}`, { exact: true }),
      ).toBeVisible();
    await expect(
      page.getByText(
        "Screenshot placeholder — actual workflow image not yet supplied.",
      ),
    ).toHaveCount(project.screenshots.length ? 0 : 2);
    await expect(
      page.getByRole("button", { name: /Enlarge screenshot/ }),
    ).toHaveCount(project.screenshots.length);
    await expect(page.getByRole("link", { name: "Try Live Demo" })).toHaveCount(
      0,
    );
    const github = page.getByRole("link", { name: "GitHub", exact: true });
    if (project.githubUrl && !project.hideGithub) {
      await expect(github).toHaveAttribute("href", project.githubUrl);
      await expect(github).toHaveAttribute("target", "_blank");
      await expect(github).toHaveAttribute("rel", "noopener noreferrer");
    } else {
      await expect(github).toHaveCount(0);
    }
    if (project.clientWork)
      await expect(
        page.getByText("Client Work / Voice AI", { exact: true }),
      ).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      project.title,
    );
  }
  expect(errors).toEqual([]);
});

test("all four selected projects keep their drawers and dedicated-page links", async ({
  page,
}) => {
  await page.goto("/projects");
  for (const [index, project] of projects
    .filter((entry) => entry.featured)
    .entries()) {
    const opener = page
      .getByRole("button", { name: "View Case Study" })
      .nth(index);
    await opener.click();
    const drawer = page.getByRole("dialog", { name: project.title });
    await expect(drawer).toBeVisible();
    for (const heading of headings)
      await expect(
        drawer.getByRole("heading", { name: heading, exact: true }),
      ).toBeVisible();
    await expect(
      drawer.getByRole("link", { name: "Open dedicated project page" }),
    ).toHaveAttribute("href", `/projects/${project.slug}`);
    await drawer.getByRole("button", { name: "Close case study" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(opener).toBeFocused();
  }
});

for (const width of [320, 768, 1440]) {
  test(`populated gallery, keyboard lightbox and secure project links at ${width}px`, async ({
    page,
    context,
  }, testInfo) => {
    const height = width === 320 ? 568 : 900;
    await page.setViewportSize({ width, height });
    await galleryFixture(page);
    await page.goto(`${fixtureOrigin}/projects/b2b-lead-automation-engine`);
    await expect(page.getByText("Test fixture resolution.")).toBeVisible();
    await expect(page.getByText("Test fixture business impact.")).toBeVisible();
    await expect(
      page.getByText("Test fixture supported result."),
    ).toBeVisible();
    await expect(
      page.getByText("No outcome measurements have been supplied."),
    ).toHaveCount(0);
    for (const [label, url] of [
      ["Try Live Demo", "https://demo.example.test/"],
      ["GitHub", "https://github.com/example/test-fixture"],
    ]) {
      const link = page.getByRole("link", { name: label, exact: true });
      await expect(link).toHaveAttribute("href", url);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      await context.route(url, (route) =>
        route.fulfill({ body: "Test destination" }),
      );
      const opened = page.waitForEvent("popup");
      await link.click();
      const popup = await opened;
      await expect(popup).toHaveURL(url);
      await popup.close();
    }
    const thumbnails = page.getByRole("button", { name: /Enlarge screenshot/ });
    await expect(thumbnails).toHaveCount(3);
    await thumbnails.first().focus();
    await page.keyboard.press("Enter");
    const lightbox = page.getByRole("dialog", { name: "Workflow screenshots" });
    await expect(lightbox).toBeVisible();
    await expect(
      lightbox.getByRole("button", { name: "Close screenshot" }),
    ).toBeFocused();
    await expect(lightbox.getByText("Screenshot 1 of 3")).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(
      lightbox.getByText("Test fixture: detail caption"),
    ).toBeVisible();
    const enlarged = lightbox.getByRole("img");
    await expect
      .poll(() =>
        enlarged.evaluate((el) => (el as HTMLImageElement).naturalWidth),
      )
      .toBe(600);
    const imageBox = await enlarged.boundingBox();
    expect(imageBox!.height).toBeLessThan(height);
    expect(imageBox!.width).toBeLessThanOrEqual(width);
    await lightbox.screenshot({
      path: testInfo.outputPath(`lightbox-${width}.png`),
    });
    await lightbox.getByRole("button", { name: "Next screenshot" }).click();
    await expect(
      lightbox.getByText("Image unavailable. Please try again later."),
    ).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(lightbox.getByText("Screenshot 1 of 3")).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await expect(lightbox.getByText("Screenshot 3 of 3")).toBeVisible();
    await lightbox.getByRole("button", { name: "Previous screenshot" }).click();
    await expect(lightbox.getByText("Screenshot 2 of 3")).toBeVisible();
    await lightbox.getByRole("button", { name: "Close screenshot" }).focus();
    await page.keyboard.press("Shift+Tab");
    await expect(
      lightbox.getByRole("button", { name: "Next screenshot" }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      lightbox.getByRole("button", { name: "Close screenshot" }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(lightbox).toHaveCount(0);
    await expect(thumbnails.first()).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`project-${width}.png`),
      fullPage: true,
    });
  });
}

test("nested lightbox closes independently and restores drawer focus and scroll lock", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await galleryFixture(page);
  await page.goto(`${fixtureOrigin}/projects`);
  const opener = page.getByRole("button", { name: "View Case Study" }).first();
  await opener.click();
  const drawer = page.locator("dialog.case-drawer");
  const thumbnail = drawer.getByRole("button", {
    name: /Enlarge screenshot 2:/,
  });
  await thumbnail.click();
  const lightbox = page.getByRole("dialog", { name: "Workflow screenshots" });
  await expect(lightbox).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(lightbox).toHaveCount(0);
  await expect(drawer).toBeVisible();
  await expect(thumbnail).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );
  await thumbnail.click();
  await lightbox.getByRole("button", { name: "Close screenshot" }).click();
  await expect(drawer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(drawer).toHaveCount(0);
  await expect(opener).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  expect(errors).toEqual([]);
});

test("single screenshot handles loading, disables navigation, and invalid URLs stay hidden", async ({
  page,
}) => {
  await galleryFixture(page, { single: true, invalidLinks: true, delay: 1500 });
  await page.goto(`${fixtureOrigin}/projects/b2b-lead-automation-engine`);
  await expect(page.getByRole("link", { name: "Try Live Demo" })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("link", { name: "GitHub", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: /Enlarge screenshot 1:/ }).click();
  const lightbox = page.getByRole("dialog", { name: "Workflow screenshots" });
  await expect(lightbox.getByText("Loading screenshot…")).toBeVisible();
  await expect(
    lightbox.getByRole("button", { name: "Previous screenshot" }),
  ).toBeDisabled();
  await expect(
    lightbox.getByRole("button", { name: "Next screenshot" }),
  ).toBeDisabled();
  await expect
    .poll(() =>
      lightbox
        .getByRole("img")
        .evaluate((el) => (el as HTMLImageElement).naturalWidth),
    )
    .toBe(1600);
  await page.keyboard.press("ArrowRight");
  await expect(lightbox.getByText("Screenshot 1 of 1")).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    lightbox.getByRole("button", { name: "Close screenshot" }),
  ).toBeFocused();
  await lightbox.getByRole("button", { name: "Close screenshot" }).click();
  await expect(lightbox).toHaveCount(0);
});

test("browser navigation while a nested gallery is open restores scrolling", async ({
  page,
}) => {
  await galleryFixture(page);
  await page.goto(`${fixtureOrigin}/skills`);
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Projects" })
    .click();
  await page.getByRole("button", { name: "View Case Study" }).first().click();
  await page
    .locator("dialog.case-drawer")
    .getByRole("button", { name: /Enlarge screenshot 1:/ })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Workflow screenshots" }),
  ).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(`${fixtureOrigin}/skills`);
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("");
});
