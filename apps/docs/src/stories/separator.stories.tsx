import { Separator } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Separator",
  component: Separator,
  argTypes: { orientation: { control: "inline-radio", options: ["horizontal", "vertical"] } },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="flex max-w-sm flex-col gap-3">
      <p>Account</p>
      <Separator {...args} />
      <p>Billing</p>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="flex h-6 items-center gap-3">
      <span>Docs</span>
      <Separator {...args} />
      <span>Support</span>
    </div>
  ),
};
