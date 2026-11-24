import type { TransformedToken } from "style-dictionary/types";
import { describe, expect, it } from "vitest";
import { loadTheme, THEMES } from "./load.ts";
import { checkSeries, SERIES_MIN_DELTA_E, seriesDifference, simulate, validateSeries, VISIONS } from "./series.ts";

function setSeries(tokens: TransformedToken[], name: string, hex: string) {
  const token = tokens.find((t) => t.path.join(".") === name);
  if (!token) throw new Error(`missing ${name}`);
  token.$value = hex;
}

describe("seriesDifference", () => {
  it("is 0 for the same colour and 100 for black and white", () => {
    expect(seriesDifference("#777777", "#777777")).toBe(0);
    expect(seriesDifference("#000000", "#ffffff")).toBeCloseTo(100, 5);
  });

  it("collapses red and green under deuteranopia but not tritanopia", () => {
    expect(seriesDifference("#d62728", "#2ca02c")).toBeGreaterThan(70);
    expect(seriesDifference("#d62728", "#2ca02c", "deuteranopia")).toBeLessThan(5);
    expect(seriesDifference("#d62728", "#2ca02c", "tritanopia")).toBeGreaterThan(60);
  });
});

describe("simulate", () => {
  it("leaves greys unchanged, since every Machado row sums to 1", () => {
    for (const vision of VISIONS) {
      const { r, g, b } = simulate("#808080", vision);
      expect(r).toBeCloseTo(g, 4);
      expect(g).toBeCloseTo(b, 4);
      expect(seriesDifference("#404040", "#c0c0c0", vision)).toBeCloseTo(seriesDifference("#404040", "#c0c0c0"), 2);
    }
  });

  it("keeps channels between 0 and 1", () => {
    const { r, g, b } = simulate("#0000ff", "tritanopia");
    for (const channel of [r, g, b]) {
      expect(channel).toBeGreaterThanOrEqual(0);
      expect(channel).toBeLessThanOrEqual(1);
    }
  });
});

describe("the shipped series", () => {
  it("are distinguishable in every theme and every kind of vision", async () => {
    const { failures, pairs } = await validateSeries();
    expect(failures).toEqual([]);
    // 4 series make 6 pairs, each checked in 4 kinds of vision, in 3 themes.
    expect(pairs).toHaveLength(6 * VISIONS.length * THEMES.length);
    expect(SERIES_MIN_DELTA_E).toBe(10);
  });
});

describe("the series validator", () => {
  it("fails two series that are too close", async () => {
    const tokens = await loadTheme("light");
    setSeries(tokens, "color.chart.series-1", "#6b6b6b");
    setSeries(tokens, "color.chart.series-2", "#737373");

    const { failures } = checkSeries("light", tokens);
    const typical = failures.find((f) => f.token === "color.chart.series-1" && !f.message.includes("under"));
    expect(typical?.message).toMatch(/too close to color\.chart\.series-2: CIEDE2000 \d+\.\d .* Needs at least 10\./);
  });

  it("fails a pair that only looks alike under colour blindness", async () => {
    const tokens = await loadTheme("high-contrast");
    setSeries(tokens, "color.chart.series-1", "#d62728");
    setSeries(tokens, "color.chart.series-2", "#2ca02c");

    const { failures, pairs } = checkSeries("high-contrast", tokens);
    const between = (p: { a: string; b: string }) => p.a === "color.chart.series-1" && p.b === "color.chart.series-2";
    const visions = pairs.filter((p) => between(p) && !p.pass).map((p) => p.vision);
    expect(visions).toContain("deuteranopia");
    expect(visions).not.toContain("typical");
    expect(failures.some((f) => f.message.includes("series-2 under deuteranopia"))).toBe(true);
  });

  it("checks every series token, whatever its number", async () => {
    const tokens = await loadTheme("dark");
    const extra = tokens.find((t) => t.path.join(".") === "color.chart.series-4");
    if (!extra) throw new Error("missing color.chart.series-4");
    tokens.push({ ...extra, path: ["color", "chart", "series-5"] });

    const { failures } = checkSeries("dark", tokens);
    expect(failures.some((f) => f.message.includes("too close to color.chart.series-5"))).toBe(true);
  });
});
