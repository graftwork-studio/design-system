/**
 * The chart series validator.
 *
 * The contrast validator checks each `color.chart.series-*` token against the
 * surfaces, but not against the other series. This one checks that every pair of
 * series stays distinguishable in every theme: as the colours are, and as people
 * with protanopia, deuteranopia and tritanopia see them.
 *
 * Distance is CIEDE2000. Colour blindness is simulated with Machado, Oliveira
 * and Fernandes (2009) at severity 1.0, applied in linear RGB.
 */
import { converter, differenceCiede2000, type Lrgb } from "culori";
import type { TransformedToken } from "style-dictionary/types";
import type { Failure } from "./contrast.ts";
import { isSemantic, loadTheme, THEMES, type Theme } from "./load.ts";

/** Smallest CIEDE2000 difference allowed between any two series, in any vision. */
export const SERIES_MIN_DELTA_E = 10;

export const SERIES_PREFIX = "color.chart.series-";

export const VISIONS = ["typical", "protanopia", "deuteranopia", "tritanopia"] as const;
export type Vision = (typeof VISIONS)[number];

type Matrix = readonly [readonly [number, number, number], readonly [number, number, number], readonly [number, number, number]];

/** Machado et al. (2009), severity 1.0. Rows give linear R, G and B. */
const MACHADO: Record<Exclude<Vision, "typical">, Matrix> = {
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritanopia: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
};

const toLrgb = converter("lrgb");
const deltaE = differenceCiede2000();
const clamp = (n: number) => Math.min(1, Math.max(0, n));

/** A hex colour as someone with the given vision sees it, in linear RGB. */
export function simulate(hex: string, vision: Vision): Lrgb {
  const colour = toLrgb(hex);
  if (!colour) throw new Error(`Expected a colour, got ${hex}`);
  if (vision === "typical") return colour;
  const { r, g, b } = colour;
  const [mr, mg, mb] = MACHADO[vision];
  return {
    mode: "lrgb",
    r: clamp(mr[0] * r + mr[1] * g + mr[2] * b),
    g: clamp(mg[0] * r + mg[1] * g + mg[2] * b),
    b: clamp(mb[0] * r + mb[1] * g + mb[2] * b),
  };
}

/** CIEDE2000 difference between two hex colours as someone with the given vision sees them. */
export function seriesDifference(a: string, b: string, vision: Vision = "typical"): number {
  return deltaE(simulate(a, vision), simulate(b, vision));
}

export type SeriesPairResult = {
  theme: Theme;
  a: string;
  b: string;
  vision: Vision;
  deltaE: number;
  required: number;
  pass: boolean;
};

export function checkSeries(theme: Theme, tokens: TransformedToken[]) {
  const failures: Failure[] = [];
  const pairs: SeriesPairResult[] = [];
  const series = tokens.filter((t) => isSemantic(t) && t.path.join(".").startsWith(SERIES_PREFIX));

  for (const [i, first] of series.entries()) {
    for (const second of series.slice(i + 1)) {
      const a = first.path.join(".");
      const b = second.path.join(".");
      for (const vision of VISIONS) {
        const difference = seriesDifference(String(first.$value), String(second.$value), vision);
        const pass = difference >= SERIES_MIN_DELTA_E;
        pairs.push({ theme, a, b, vision, deltaE: difference, required: SERIES_MIN_DELTA_E, pass });
        if (!pass) {
          const seen = vision === "typical" ? "" : ` under ${vision}`;
          failures.push({
            theme,
            token: a,
            message: `is too close to ${b}${seen}: CIEDE2000 ${difference.toFixed(1)} (${first.$value} and ${second.$value}). Needs at least ${SERIES_MIN_DELTA_E}.`,
          });
        }
      }
    }
  }
  return { failures, pairs };
}

export async function validateSeries(extraSources: string[] = []) {
  const failures: Failure[] = [];
  const pairs: SeriesPairResult[] = [];
  for (const theme of THEMES) {
    const result = checkSeries(theme, await loadTheme(theme, extraSources));
    failures.push(...result.failures);
    pairs.push(...result.pairs);
  }
  return { failures, pairs };
}
