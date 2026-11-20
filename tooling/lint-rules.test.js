// Proves the lint bans fire. Run with `node --test tooling/`.
import { test } from "node:test";
import { RuleTester } from "eslint";
import stylelint from "stylelint";
import tseslint from "typescript-eslint";
import graftwork from "./eslint-plugin-graftwork.js";

const tester = new RuleTester({
  languageOptions: { parser: tseslint.parser, parserOptions: { ecmaFeatures: { jsx: true } } },
});

test("ESLint: outlines can't be removed without a replacement", () => {
  tester.run("no-outline-removal", graftwork.rules["no-outline-removal"], {
    valid: [
      { code: `<button className="focus-ring outline-none" />` },
      { code: `cn("outline-none", "data-focus-visible:outline-2 data-focus-visible:outline-focus-ring")` },
      { code: `<div className="outline-offset-2" />` },
      { code: `<div className="outline-none data-focus-visible:focus-ring-drawn" />` },
      { code: `cn("outline-none", "group-data-focus-visible/selection:focus-ring-drawn")` },
    ],
    invalid: [
      { code: `<button className="outline-none" />`, errors: [{ messageId: "bad" }] },
      { code: `cn("focus:outline-hidden rounded-md")`, errors: [{ messageId: "bad" }] },
      { code: `cva("outline-0", { variants: {} })`, errors: [{ messageId: "bad" }] },
    ],
  });
});

test("ESLint: no justified text, px font sizes or raw colours", () => {
  tester.run("no-justified-text", graftwork.rules["no-justified-text"], {
    valid: [{ code: `<p className="text-left" />` }],
    invalid: [{ code: `<p className="md:text-justify" />`, errors: [{ messageId: "bad" }] }],
  });
  tester.run("no-px-font-size", graftwork.rules["no-px-font-size"], {
    valid: [{ code: `<p className="text-sm" />` }],
    invalid: [{ code: `<p className="text-[14px]" />`, errors: [{ messageId: "bad" }] }],
  });
  tester.run("no-raw-colour", graftwork.rules["no-raw-colour"], {
    valid: [{ code: `<p className="text-text-default bg-surface-raised" />` }],
    invalid: [
      { code: `<p className="bg-[#2883de]" />`, errors: [{ messageId: "bad" }] },
      { code: `cn("hover:text-[rgb(0,0,0)]")`, errors: [{ messageId: "bad" }] },
    ],
  });
});

test("Stylelint: bans removed outlines, justified text and px font sizes", async (t) => {
  const lint = async (code) => (await stylelint.lint({ code, configFile: new URL("../stylelint.config.js", import.meta.url).pathname })).results[0].warnings;
  const cases = [
    "a:focus { outline: none; }",
    "a:focus { outline: 0; }",
    "a:focus { outline-style: none; }",
    "p { text-align: justify; }",
    "p { font-size: 14px; }",
    "p { font: 14px/1.5 sans-serif; }",
  ];
  for (const code of cases) {
    await t.test(code, async () => {
      const warnings = await lint(code);
      if (warnings.length === 0) throw new Error(`Expected a lint error for: ${code}`);
    });
  }
  const ok = await lint("p { font-size: 1rem; text-align: start; }\na:focus-visible { outline: 2px solid red; }");
  if (ok.length > 0) throw new Error(`Unexpected lint errors: ${ok.map((w) => w.text).join("; ")}`);
});
