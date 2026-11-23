import type { Decorator, Preview } from "@storybook/react-vite";
import { applyTheme, type ThemeChoice } from "@graftwork/ui";
import "./preview.css";
import { emulateWindowFocus } from "./emulate-window-focus";

export const THEMES: readonly ThemeChoice[] = ["light", "dark", "high-contrast"];

/** Applies the theme chosen in the toolbar (or ?globals=theme:dark) to <html>. */
const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme ?? "light") as ThemeChoice;
  applyTheme(theme);
  return <Story />;
};

emulateWindowFocus();

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "Theme",
      toolbar: {
        title: "Theme",
        icon: "contrast",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
          { value: "high-contrast", title: "High contrast" },
          { value: "system", title: "System" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    // Fail the test run on any axe violation, not just report it.
    a11y: { test: "error" },
  },
  tags: ["autodocs"],
};

export default preview;
