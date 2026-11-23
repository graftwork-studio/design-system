import { expect } from "storybook/test";

/** Asserts the WCAG 2.4.13 focus ring: 2px solid outline with a 2px offset (or inset for grid cells). */
export async function expectFocusRing(element: Element, { inset = false } = {}) {
  // Browsers don't match :focus-visible in an unfocused window, such as an embedded preview, so
  // there's no ring to measure. Automated runs always measure it, so CI can't skip this check.
  if (!document.hasFocus() && !navigator.webdriver) return;
  const style = getComputedStyle(element);
  await expect(style.outlineStyle).toBe("solid");
  await expect(style.outlineWidth).toBe("2px");
  await expect(style.outlineOffset).toBe(inset ? "-2px" : "2px");
}

/** Asserts the WCAG 2.5.8 hit area: at least 24 × 24px, including any ::before extension. */
export async function expectHitArea(element: Element, min = 24) {
  const box = element.getBoundingClientRect();
  const before = getComputedStyle(element, "::before");
  const width = Math.max(box.width, Number.parseFloat(before.width) || 0);
  const height = Math.max(box.height, Number.parseFloat(before.height) || 0);
  await expect(width).toBeGreaterThanOrEqual(min);
  await expect(height).toBeGreaterThanOrEqual(min);
}
