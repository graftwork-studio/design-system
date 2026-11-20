import { Toggle } from "@graftwork/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";
import { expectFocusRing, expectHitArea } from "./test-helpers.js";

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  args: { children: "Show archived" },
  argTypes: {
    variant: { control: "inline-radio", options: ["ghost", "secondary"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole("button", { name: "Show archived" });
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await expectFocusRing(toggle);
    await expectHitArea(toggle);
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.keyboard(" ");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
  },
};

export const Secondary: Story = { args: { variant: "secondary" } };
export const Selected: Story = { args: { defaultSelected: true } };

export const IconOnly: Story = {
  render: (args) => (
    <div className="flex gap-1">
      <Toggle {...args} size="sm" aria-label="Bold">
        <BoldIcon aria-hidden />
      </Toggle>
      <Toggle {...args} size="sm" aria-label="Italic" defaultSelected>
        <ItalicIcon aria-hidden />
      </Toggle>
      <Toggle {...args} size="sm" aria-label="Underline">
        <UnderlineIcon aria-hidden />
      </Toggle>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const button of within(canvasElement).getAllByRole("button")) await expectHitArea(button);
  },
};

export const Disabled: Story = { args: { isDisabled: true } };
