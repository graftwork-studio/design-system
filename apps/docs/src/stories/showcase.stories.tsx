import { ComponentShowcase, showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

const meta = {
  title: "Showcase/All components",
  component: ComponentShowcase,
} satisfies Meta<typeof ComponentShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The same showcase the example pages in app-template and test-app render. */
export const AllComponents: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 2, name: "All components" })).toBeVisible();
    for (const entry of showcaseEntries) {
      await expect(canvasElement.querySelector(`[data-component="${entry.name}"]`)).not.toBeNull();
    }
  },
};
