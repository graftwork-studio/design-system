import { Button } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlusIcon, TrashIcon } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { expectFocusRing, expectHitArea } from "./test-helpers.js";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Save changes", onPress: fn() },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary", "ghost", "destructive"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary" },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole("button", { name: "Save changes" });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await expectFocusRing(button);
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    await expect(args.onPress).toHaveBeenCalledTimes(2);
  },
};

export const Secondary: Story = { args: { variant: "secondary" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Destructive: Story = { args: { variant: "destructive", children: "Delete project" } };

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Every size keeps a hit area of at least 24 × 24px (WCAG 2.5.8).
    for (const button of within(canvasElement).getAllByRole("button")) {
      await expectHitArea(button);
    }
    // Matches shadcn: 12.8px at sm, 14px at md and lg.
    const sizes = within(canvasElement)
      .getAllByRole("button")
      .map((button) => getComputedStyle(button).fontSize);
    await expect(sizes).toEqual(["12.8px", "14px", "14px"]);
  },
};

export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <Button {...args}>
        <PlusIcon aria-hidden />
        New project
      </Button>
      <Button {...args} variant="destructive">
        <TrashIcon aria-hidden />
        Delete
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { isDisabled: true },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole("button");
    await expect(button).toBeDisabled();
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onPress).not.toHaveBeenCalled();
  },
};
