/**
 * The contrast validator.
 *
 * Checks every declared text/background and non-text/background pair in every
 * theme against the Graftwork accessibility standard (WCAG 2.2 AA plus AAA
 * 1.4.6 contrast), and enforces the rules about how colour tokens are declared.
 */
import type { TransformedToken } from "style-dictionary/types";
import { extensionOf, isSemantic, loadTheme, THEMES, type Role, type Theme } from "./load.ts";

/** Minimum contrast ratio for each role. */
export const THRESHOLDS: Record<Exclude<Role, "background" | "decorative">, number> = {
  text: 7,
  "large-text": 4.5,
  "non-text": 3,
};

import { BRAND_HEX } from "./brand.ts";

export { BRAND_HEX };

/** Checked against surfaces only. See the focus-ring rule in checkTheme. */
export const FOCUS_RING = "color.focus.ring";

export type Failure = { theme: Theme; token: string; message: string };
export type PairResult = {
  theme: Theme;
  token: string;
  on: string;
  role: Role;
  ratio: number;
  required: number;
  pass: boolean;
};

function luminance(hex: string): number {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match?.[1]) throw new Error(`Expected a 6-digit hex colour, got ${hex}`);
  const value = match[1];
  const channel = (offset: number) => {
    const c = Number.parseInt(value.slice(offset, offset + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

/** WCAG 2.x contrast ratio, rounded down to two decimals so 6.999 never passes as 7. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return Math.floor(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

const tokenName = (token: TransformedToken) => token.path.join(".");

export function checkTheme(theme: Theme, tokens: TransformedToken[]) {
  const failures: Failure[] = [];
  const pairs: PairResult[] = [];
  const byPath = new Map(tokens.map((t) => [tokenName(t), t]));

  for (const token of tokens) {
    if (!isSemantic(token) || token.$type !== "color") continue;
    const name = tokenName(token);
    const { role, on = [] } = extensionOf(token);
    const fail = (message: string) => failures.push({ theme, token: name, message });

    if (!role) {
      fail("has no contrast role. Declare one in $extensions.\"studio.graftwork\".role.");
      continue;
    }

    const isTextToken = name.startsWith("color.text.");
    if (isTextToken && role !== "text" && role !== "large-text") {
      fail(`is a text token but its role is "${role}".`);
    }
    if ((role === "text" || role === "large-text") && String(token.$value).toLowerCase() === BRAND_HEX) {
      fail(`resolves to the brand colour ${BRAND_HEX}, which must never be used for text.`);
    }
    if (role === "background" || role === "decorative") continue;

    // The focus ring is 2px with a 2px offset, so a gap of background always sits
    // between it and the component. It only ever touches surfaces, which is what
    // WCAG 2.4.13 measures, so it must be checked against every one of them.
    if (name === FOCUS_RING) {
      const declared = new Set(on.map((ref) => ref.replace(/^\{|\}$/g, "")));
      for (const surface of tokens) {
        const surfaceName = tokenName(surface);
        if (isSemantic(surface) && surfaceName.startsWith("color.surface.") && !declared.has(surfaceName)) {
          fail(`must declare every surface it can sit on, but is missing ${surfaceName}.`);
        }
      }
    }

    if (on.length === 0) {
      fail(`has role "${role}" but declares no background in "on".`);
      continue;
    }

    const required = THRESHOLDS[role];
    for (const ref of on) {
      const refName = ref.replace(/^\{|\}$/g, "");
      const background = byPath.get(refName);
      if (!background) {
        fail(`declares an unknown background ${ref}.`);
        continue;
      }
      const ratio = contrastRatio(String(token.$value), String(background.$value));
      const pass = ratio >= required;
      pairs.push({ theme, token: name, on: refName, role, ratio, required, pass });
      if (!pass) {
        fail(`is ${ratio}:1 on ${refName} (${token.$value} on ${background.$value}). Needs ${required}:1 for ${role}.`);
      }
    }
  }
  return { failures, pairs };
}

export async function validateAll(extraSources: string[] = []) {
  const failures: Failure[] = [];
  const pairs: PairResult[] = [];
  for (const theme of THEMES) {
    const result = checkTheme(theme, await loadTheme(theme, extraSources));
    failures.push(...result.failures);
    pairs.push(...result.pairs);
  }
  return { failures, pairs };
}
