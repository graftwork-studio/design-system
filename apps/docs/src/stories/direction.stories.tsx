import { DirectionProvider } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

const meta = {
  title: "Components/Direction",
  component: DirectionProvider,
  parameters: { controls: { disable: true } },
} as Meta<typeof DirectionProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "Direction")?.render()}</>,
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="direction"]')).toHaveAttribute("dir", "rtl");
  },
};
