import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.tsx"],
  addons: [
    {
      name: "@storybook/addon-docs",
      // MDX needs GitHub Flavored Markdown for pipe tables.
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  framework: { name: "@storybook/react-vite", options: {} },
  core: { disableTelemetry: true },
  async viteFinal(viteConfig) {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];
    // Stories import @graftwork/ui exactly as an app would, but from source.
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias as Record<string, string> | undefined),
      "@graftwork/ui": fileURLToPath(new URL("../../../packages/ui/src/index.ts", import.meta.url)),
    };
    // Storybook is served from /design-system/ on GitHub Pages.
    if (process.env.STORYBOOK_BASE) viteConfig.base = process.env.STORYBOOK_BASE;
    return viteConfig;
  },
};

export default config;
