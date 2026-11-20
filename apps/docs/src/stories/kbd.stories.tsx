import { Kbd } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Kbd",
  component: Kbd,
  args: { children: "Ctrl" },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InText: Story = {
  render: () => (
    <p>
      Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to search projects.
    </p>
  ),
};
