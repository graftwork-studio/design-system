import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

type IndexEntry = { id: string; type: "story" | "docs"; title: string; name: string };

const index = JSON.parse(readFileSync(new URL("../storybook-static/index.json", import.meta.url), "utf8")) as {
  entries: Record<string, IndexEntry>;
};
const stories = Object.values(index.entries).filter((e) => e.type === "story");

const THEMES = [
  { name: "light", colorScheme: "light", contrast: "no-preference" },
  { name: "dark", colorScheme: "dark", contrast: "no-preference" },
  { name: "high-contrast", colorScheme: "light", contrast: "more" },
] as const;
const WIDTHS = [320, 768, 1280] as const;

async function openStory(page: Page, id: string, theme: (typeof THEMES)[number]) {
  // Match the OS preferences too, so a story that resets to "system" keeps the theme.
  await page.emulateMedia({ colorScheme: theme.colorScheme, contrast: theme.contrast, reducedMotion: "reduce" });
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme.name}`);
  // Wait for the story to render and its play function to finish.
  await page.waitForFunction(() => {
    const preview = (window as unknown as { __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } } })
      .__STORYBOOK_PREVIEW__;
    return preview?.currentRender?.phase === "completed" || preview?.currentRender?.phase === "finished";
  });
  await page.evaluate(() => document.fonts.ready);
}

for (const story of stories) {
  for (const theme of THEMES) {
    test(`${story.title} › ${story.name} › ${theme.name}`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await openStory(page, story.id, theme);

      // axe, WCAG 2.2 A/AA plus AAA contrast.
      const results = await new AxeBuilder({ page })
        .include("#storybook-root")
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "wcag2aaa"])
        .analyze();
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);

      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 800 });
        // WCAG 1.4.10: no horizontal scrolling of the page at any width, down to 320px.
        // Polled, because charts resize through a ResizeObserver a moment after the viewport changes.
        await expect
          .poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), {
            message: `page scrolls sideways at ${width}px`,
          })
          .toBeLessThanOrEqual(0);
        await expect(page.locator("#storybook-root")).toHaveScreenshot(`${story.id}--${theme.name}--${width}.png`);
      }
    });
  }
}
