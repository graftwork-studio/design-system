import { describe, expect, it } from "vitest";
import { reorderIds } from "./data-table.js";

const ids = ["a", "b", "c", "d", "e"];

describe("reorderIds", () => {
  it("moves a row before its target", () => {
    expect(reorderIds(ids, new Set(["d"]), "b", "before")).toEqual(["a", "d", "b", "c", "e"]);
  });

  it("moves a row after its target", () => {
    expect(reorderIds(ids, new Set(["a"]), "c", "after")).toEqual(["b", "c", "a", "d", "e"]);
  });

  it("moves several rows together, keeping their order", () => {
    expect(reorderIds(ids, new Set(["e", "b"]), "a", "before")).toEqual(["b", "e", "a", "c", "d"]);
  });

  it("keeps rows hidden by a filter in place", () => {
    // Only a, c and e are visible; c is dropped after e.
    expect(reorderIds(ids, new Set(["c"]), "e", "after")).toEqual(["a", "b", "d", "e", "c"]);
  });

  it("leaves the order alone when the target is unknown", () => {
    expect(reorderIds(ids, new Set(["a"]), "z", "before")).toEqual(ids);
  });
});
