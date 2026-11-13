import { expect, test } from "@playwright/test";

test("hero opens the existing assistant and its image has a fallback", async ({ page }) => {
  await page.route("**/assistant/jacks.jpg", (route) => route.abort());
  await page.goto("/");
  await page.getByRole("main").getByRole("button", { name: "Ask About Anupom" }).click();
  const panel = page.getByRole("dialog", { name: "Ask About Anupom" });
  await expect(panel).toBeVisible();
  await expect(panel.getByLabel("Voice assistant illustration unavailable")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Ask About Anupom", exact: true }).last()).toBeFocused();
});

for (const width of [390, 768, 1440]) {
  test(`assistant opens in place and returns focus at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const launcher = page.getByRole("button", { name: "Ask About Anupom", exact: true });
    await expect(launcher).toBeVisible();
    await launcher.focus();
    await expect(page.locator("#recruiter-label")).toBeVisible();
    await launcher.click();
    const panel = page.getByRole("dialog", { name: "Ask About Anupom" });
    await expect(panel).toBeVisible();
    await expect(page.getByRole("button", { name: "Close assistant" })).toBeFocused();
    await expect(panel.getByRole("button", { name: "Start conversation" })).toBeVisible();
    expect(new URL(page.url()).pathname).toBe("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
    await expect(launcher).toBeFocused();
    await launcher.click();
    await expect(panel).toBeVisible();
    await page.getByRole("button", { name: "Close assistant" }).click();
    await expect(launcher).toBeFocused();
  });
}

test("microphone denial shows an actionable error and allows retry", async ({ page }) => {
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException("Denied", "NotAllowedError"));
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Ask About Anupom", exact: true }).click();
  await page.getByRole("button", { name: "Start conversation" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Microphone access was denied" })).toBeVisible({ timeout: 20000 });
  await expect(page.getByRole("button", { name: "Start conversation" })).toBeEnabled();
});
