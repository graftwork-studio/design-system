import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Monthly report</CardTitle>
        <CardDescription>Updated 2 hours ago</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Sign-ups rose by 12% compared with last month, driven mostly by the new onboarding flow.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Open report</Button>
        <Button size="sm" variant="ghost">
          Dismiss
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardContent>
        <p>A card can hold content without a header or footer.</p>
      </CardContent>
    </Card>
  ),
};
