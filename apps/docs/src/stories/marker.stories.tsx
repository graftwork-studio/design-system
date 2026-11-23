import { Marker } from "@graftwork/ui";
import { showcaseEntries } from "@graftwork/ui/showcase";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Marker",
  component: Marker,
  parameters: { controls: { disable: true } },
} as Meta<typeof Marker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <>{showcaseEntries.find((entry) => entry.name === "Marker")?.render()}</>,
};
