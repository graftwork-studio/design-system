import { AspectRatio } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/AspectRatio",
  component: AspectRatio,
  parameters: { controls: { disable: true } },
} as Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "AspectRatio")?.render()}</>,
};
