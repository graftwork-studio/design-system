/**
 * Loads and resolves the tokens for one theme with Style Dictionary.
 *
 * The build and the contrast validator both use this, so the validator checks
 * exactly the values that ship.
 */
import { fileURLToPath } from "node:url";
import StyleDictionary from "style-dictionary";
import type { TransformedToken } from "style-dictionary/types";

export const THEMES = ["light", "dark", "high-contrast"] as const;
export type Theme = (typeof THEMES)[number];

export const EXTENSION = "studio.graftwork";
export const CSS_PREFIX = "gw";

export type Role = "background" | "text" | "large-text" | "non-text" | "decorative";

export type GraftworkExtension = {
  role?: Role;
  on?: string[];
};

const tokensDir = fileURLToPath(new URL("../tokens/", import.meta.url));

type DtcgColour = { colorSpace?: string; components?: number[]; hex?: string; alpha?: number };
type UnitValue = { value: number; unit: string };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toHexChannel(n: number): string {
  return Math.round(Math.min(1, Math.max(0, n)) * 255)
    .toString(16)
    .padStart(2, "0");
}

export function formatValue(type: string | undefined, value: unknown): string {
  if (type === "color" && isObject(value)) {
    const colour = value as DtcgColour;
    if (colour.colorSpace && colour.colorSpace !== "srgb") {
      throw new Error(`Only srgb colours are supported, got ${colour.colorSpace}`);
    }
    if (colour.hex) return colour.hex.toLowerCase();
    const [r = 0, g = 0, b = 0] = colour.components ?? [];
    return `#${toHexChannel(r)}${toHexChannel(g)}${toHexChannel(b)}`;
  }
  if ((type === "dimension" || type === "duration") && isObject(value)) {
    const { value: n, unit } = value as UnitValue;
    return `${n}${unit}`;
  }
  if (type === "fontFamily" && Array.isArray(value)) {
    return value.map((name: string) => (/\s/.test(name) ? `"${name}"` : name)).join(", ");
  }
  return String(value);
}

StyleDictionary.registerTransform({
  name: "graftwork/value",
  type: "value",
  transitive: false,
  filter: (token) => typeof token.$value !== "string" || !token.$value.startsWith("{"),
  transform: (token) => formatValue(token.$type, token.$value),
});

export function isSemantic(token: TransformedToken): boolean {
  return token.filePath.includes("/semantic/");
}

/** Reads our extension from the unresolved source, so "on" keeps its token references. */
export function extensionOf(token: TransformedToken): GraftworkExtension {
  const ext = token.original.$extensions as Record<string, GraftworkExtension> | undefined;
  return ext?.[EXTENSION] ?? {};
}

export async function loadTheme(theme: Theme, extraSources: string[] = []): Promise<TransformedToken[]> {
  const sd = new StyleDictionary({
    usesDtcg: true,
    log: { verbosity: "silent", warnings: "error" },
    source: [
      `${tokensDir}primitives/*.tokens.json`,
      `${tokensDir}semantic/base.tokens.json`,
      `${tokensDir}semantic/color.${theme}.tokens.json`,
      ...extraSources,
    ],
    platforms: {
      graftwork: {
        prefix: CSS_PREFIX,
        transforms: ["name/kebab", "graftwork/value"],
      },
    },
  });
  const dictionary = await sd.getPlatformTokens("graftwork");
  return dictionary.allTokens;
}
