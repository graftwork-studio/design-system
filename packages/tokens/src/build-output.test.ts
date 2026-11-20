import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Checks the built files, so run `pnpm build` first (turbo does this for you).
const tailwindTheme = readFileSync(new URL("../dist/css/tailwind-theme.css", import.meta.url), "utf8");

describe("the Tailwind theme", () => {
  it("writes breakpoints as literal values, because CSS variables don't work in @media", () => {
    const breakpoints = [...tailwindTheme.matchAll(/^\s*(--breakpoint-[\w-]+):\s*([^;]+);/gm)].filter(
      ([, name]) => name !== "--breakpoint-*",
    );
    expect(breakpoints.length).toBeGreaterThan(0);
    for (const [, name, value] of breakpoints) {
      expect(value, name).toMatch(/^\d+(\.\d+)?rem$/);
    }
  });

  it("points colours at the theme variables, so they switch with the theme", () => {
    expect(tailwindTheme).toMatch(/--color-text-default: var\(--gw-color-text-default\);/);
  });
});
