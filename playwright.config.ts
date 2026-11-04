import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4173",
    ...devices["Desktop Chrome"],
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command:
        "npm.cmd run preview -- --host 127.0.0.1 --port 4173 --strictPort",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: false,
    },
    {
      command: "npm.cmd run dev -- --host 127.0.0.1 --port 4174 --strictPort",
      url: "http://127.0.0.1:4174",
      reuseExistingServer: false,
      env: { VITE_CONTACT_WEBHOOK_URL: "http://127.0.0.1:4174/api/enquiry" },
    },
  ],
});
