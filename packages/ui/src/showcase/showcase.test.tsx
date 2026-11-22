import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as ui from "../index.js";
import { showcaseEntries } from "./component-showcase.js";

const source = readFileSync(new URL("./component-showcase.tsx", import.meta.url), "utf8");
// Components are PascalCase. This leaves out helpers (cn, toast) and constants (THEME_STORAGE_KEY).
const components = Object.keys(ui).filter((name) => /^[A-Z][a-z]/.test(name));

describe("the component showcase", () => {
  it("finds the public components", () => {
    expect(components.length).toBeGreaterThan(80);
  });

  it.each(components)("uses <%s>", (name) => {
    expect(
      new RegExp(`<${name}[\\s/>]`).test(source),
      `<${name}> is exported from src/index.ts but isn't in the showcase. Add it to src/showcase/component-showcase.tsx.`,
    ).toBe(true);
  });

  it("lists each component once, in alphabetical order", () => {
    const names = showcaseEntries.map((entry) => entry.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });
});
