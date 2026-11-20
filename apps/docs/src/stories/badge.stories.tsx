import { Badge } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: { children: "Draft" },
  argTypes: { variant: { control: "inline-radio", options: ["neutral", "info", "success", "warning", "error", "outline"] } },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="neutral">Draft</Badge>
      <Badge variant="info">In review</Badge>
      <Badge variant="success">Live</Badge>
      <Badge variant="warning">Expiring</Badge>
      <Badge variant="error">Failed</Badge>
      <Badge variant="outline">Archived</Badge>
    </div>
  ),
};
