import { Button, Popover, PopoverContent, PopoverTitle, Switch } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SlidersHorizontalIcon } from "lucide-react";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

const meta = {
  title: "Components/Popover",
  component: PopoverContent,
  args: { children: null },
  render: (args) => (
    <Popover>
      <Button variant="secondary">
        <SlidersHorizontalIcon aria-hidden />
        Display
      </Button>
      <PopoverContent {...args}>
        <PopoverTitle>Display</PopoverTitle>
        <Switch defaultSelected>Show archived projects</Switch>
        <Switch>Compact rows</Switch>
      </PopoverContent>
    </Popover>
  ),
  parameters: { layout: "centered" },
} satisfies Meta<typeof PopoverContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Display" });
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    const dialog = await screen.findByRole("dialog", { name: "Display" });
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.tab();
    await expect(within(dialog).getByRole("switch", { name: "Show archived projects" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const Open: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="min-h-80">
      <Popover defaultOpen>
        <Button variant="secondary">Display</Button>
        <PopoverContent {...args}>
          <PopoverTitle>Display</PopoverTitle>
          <Switch defaultSelected>Show archived projects</Switch>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
