import { expect, userEvent } from "storybook/test";

/** Asserts the WCAG 2.4.13 focus ring: 2px solid outline with a 2px offset (or inset for grid cells). */
export async function expectFocusRing(element: Element, { inset = false } = {}) {
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

/**
 * userEvent prepares a field when it receives a focus event, but browsers skip that event while
 * the window isn't focused, as in an embedded preview. The text then never reaches React.
 */
function prepareField(element: HTMLElement) {
  element.focus();
  if (!document.hasFocus()) element.dispatchEvent(new FocusEvent("focus"));
}

/** Types into a field, whether or not the browser window has focus. */
export async function typeInto(element: HTMLElement, text: string) {
  prepareField(element);
  await userEvent.type(element, text);
}

/** Clears a field, whether or not the browser window has focus. */
export async function clearField(element: HTMLElement) {
  prepareField(element);
  await userEvent.clear(element);
}
