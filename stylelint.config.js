/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["**/dist/**", "**/storybook-static/**", "**/node_modules/**"],
  rules: {
    // Tailwind v4 at-rules.
    "at-rule-no-unknown": [true, { ignoreAtRules: ["theme", "source", "utility", "variant", "custom-variant", "apply", "reference", "config", "plugin"] }],
    "at-rule-no-deprecated": [true, { ignoreAtRules: ["apply"] }],
    "import-notation": "string",
    // Tailwind's @utility blocks scope `&` to the generated class, which this rule can't see.
    "nesting-selector-no-missing-scoping-root": null,
    // Never remove the focus outline. Components draw focus with the focus-ring utility.
    "declaration-property-value-disallowed-list": [
      {
        outline: ["/^none\\b/", "/^0(\\s|$)/"],
        "outline-style": ["none"],
        "outline-width": ["/^0/"],
        "text-align": ["justify"],
        "text-align-last": ["justify"],
      },
      { message: "Outlines can't be removed and text can't be justified (WCAG 2.4.13, 1.4.8)." },
    ],
    // Font sizes in rem only (WCAG 1.4.4, 1.4.8).
    "declaration-property-unit-disallowed-list": [
      { "font-size": ["px", "pt"], "/^font$/": ["px", "pt"] },
      { message: "Font sizes must be in rem." },
    ],
  },
};
