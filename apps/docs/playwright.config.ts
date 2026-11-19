import { defineConfig, devices } from "@playwright/test";

const PORT = 6007;

/*
 * Runs against the built Storybook (storybook-static). For every story, in every
 * theme: axe, a no-horizontal-scroll check at 320px, and visual snapshots at
 * 320, 768 and 1280px.
 *
 * Snapshots are rendered on Linux in the Playwright container, so baselines come
 * from CI. Run the "Update visual snapshots" workflow to regenerate them.
 */
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  updateSnapshots: process.env.CI ? "none" : "missing",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: "disabled", caret: "hide" } },
  use: { baseURL: `http://127.0.0.1:${PORT}`, ...devices["Desktop Chrome"] },
  webServer: {
    command: `node tests/serve.ts storybook-static ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
});
