import { Alert, Button } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Alert",
  component: Alert,
  args: { title: "Your trial ends in 3 days", children: "Add a payment method to keep your projects.", className: "max-w-xl" },
  argTypes: { variant: { control: "inline-radio", options: ["info", "success", "warning", "error"] } },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { args: { variant: "info" } };
export const Success: Story = { args: { variant: "success", title: "Report published", children: "Everyone in your team can see it." } };
export const Warning: Story = { args: { variant: "warning", title: "Usage at 90%", children: "You're close to your monthly limit." } };
export const Error: Story = { args: { variant: "error", title: "Sync failed", children: "We couldn't reach the server. Try again." } };
export const WithAction: Story = {
  args: {
    action: (
      <Button size="sm" variant="secondary">
        Add payment
      </Button>
    ),
  },
};
export const TitleOnly: Story = { args: { children: undefined, variant: "success", title: "Saved" } };
