import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import globals from "globals";
import tseslint from "typescript-eslint";
import graftwork from "./tooling/eslint-plugin-graftwork.js";

export default tseslint.config(
  { ignores: ["**/dist/**", "**/storybook-static/**", "**/node_modules/**", "**/test-results/**", "**/playwright-report/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ["**/*.tsx"],
    ...jsxA11y.flatConfigs.strict,
  },
  reactHooks.configs.flat.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { graftwork },
    rules: {
      "graftwork/no-outline-removal": "error",
      "graftwork/no-justified-text": "error",
      "graftwork/no-px-font-size": "error",
      "graftwork/no-raw-colour": "error",
    },
  },
  ...storybook.configs["flat/recommended"],
);
