import { describe, expect, it } from "vitest";
import { BRAND_HEX, checkTheme, contrastRatio, validateAll } from "./contrast.ts";
import { loadTheme } from "./load.ts";

describe("contrastRatio", () => {
  it("matches the WCAG reference values", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBe(21);
    expect(contrastRatio("#ffffff", "#ffffff")).toBe(1);
    expect(contrastRatio("#2883de", "#ffffff")).toBe(3.89);
  });

  it("rounds down, so a pair just under the threshold never passes", () => {
    // #595959 on white is 7.0003:1; #5a5a5a is 6.9:1.
    expect(contrastRatio("#5a5a5a", "#ffffff")).toBeLessThan(7);
  });
});

describe("the shipped tokens", () => {
  it("pass in every theme", async () => {
    const { failures, pairs } = await validateAll();
    expect(failures).toEqual([]);
    expect(pairs.length).toBeGreaterThan(150);
  });
});

describe("the validator", () => {
  it("fails a text pair below 4.5:1", async () => {
    const tokens = await loadTheme("light");
    const secondary = tokens.find((t) => t.path.join(".") === "color.text.secondary");
    if (!secondary) throw new Error("missing color.text.secondary");
    secondary.$value = "#737373"; // shadcn muted-foreground: 4.35:1 on the subtle surface

    const { failures } = checkTheme("light", tokens);
    expect(failures.map((f) => f.token)).toContain("color.text.secondary");
    expect(failures[0]?.message).toMatch(/Needs 4.5:1 for text/);
  });

  it("fails a text token that uses the brand colour", async () => {
    const tokens = await loadTheme("light");
    const link = tokens.find((t) => t.path.join(".") === "color.text.link");
    if (!link) throw new Error("missing color.text.link");
    link.$value = BRAND_HEX;

    const { failures } = checkTheme("light", tokens);
    expect(failures.some((f) => f.message.includes("must never be used for text"))).toBe(true);
  });

  it("fails a focus ring that skips a surface", async () => {
    const tokens = await loadTheme("light");
    const ring = tokens.find((t) => t.path.join(".") === "color.focus.ring");
    if (!ring) throw new Error("missing color.focus.ring");
    ring.original.$extensions = {
      "studio.graftwork": { role: "non-text", on: ["{color.surface.default}"] },
    };

    const { failures } = checkTheme("light", tokens);
    expect(failures.some((f) => f.message.includes("missing color.surface.subtle"))).toBe(true);
  });

  it("fails a text token with no declared background", async () => {
    const tokens = await loadTheme("light");
    const error = tokens.find((t) => t.path.join(".") === "color.text.error");
    if (!error) throw new Error("missing color.text.error");
    error.original.$extensions = { "studio.graftwork": { role: "text" } };

    const { failures } = checkTheme("light", tokens);
    expect(failures.some((f) => f.message.includes("declares no background"))).toBe(true);
  });
});
